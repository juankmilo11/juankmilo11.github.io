const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
const project=path.resolve(__dirname,'../projects/FCT');
const output=process.env.FCT_QA_OUTPUT||path.join(require('node:os').tmpdir(),'fct-motion-qa');
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const {createServer}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
  const server=await createServer({root:project,logLevel:'warn',server:{host:'127.0.0.1',port:0}});
  let browser;
  try {
    await server.listen();
    browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
    for(const reduced of [false,true]){
      const page=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:reduced?'reduce':'no-preference'}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('**/__motion-qa',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0}#board{width:1100px;height:800px}</style><div id="board"></div>'}));
      // Observe the real renderer's objects only in this test response, without
      // adding debug globals or alternate animation code to the published game.
      await page.route('**/src/board3d.js*',async route=>{
        const response=await route.fetch(),body=await response.text();
        const marker='return { update, resize, resetCamera, playIntro, cancelIntro };';
        assert.ok(body.includes(marker));
        await route.fulfill({response,body:body.replace(marker,`window.qaMotion={pieceMeshes,capturedMeshes,capturedPieces,scene,camera};${marker}`)});
      });
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FCT/__motion-qa`);
      await page.evaluate(async()=>{
        const {create3DBoard}=await import('/FCT/src/board3d.js');
        const {Chess}=await import('/FCT/node_modules/chess.js/dist/esm/chess.js');
        const game=new Chess(),board=create3DBoard(document.querySelector('#board'),()=>{},()=>{});
        window.qaMotion.game=game;window.qaMotion.board=board;
        board.update(game.board(),{targets:new Set()});
      });
      await page.evaluate(()=>Promise.all(window.qaMotion.pieceMeshes.map(mesh=>mesh.userData.visual.userData.ready)));
      for(const san of ['e4','d5','exd5','Qxd5']){
        await page.evaluate(san=>{
          const {game,board}=window.qaMotion,move=game.move(san);
          board.update(game.board(),{targets:new Set(),lastMove:move,lastMoveIndex:game.history().length-1,animationMove:move});
        },san);
        await page.waitForTimeout(650);
      }
      const result=await page.evaluate(async()=>{
        const {pieceMeshes,capturedMeshes}=window.qaMotion;
        const active=pieceMeshes.map(mesh=>({min:Infinity,max:-Infinity,drift:0}));
        const captured=capturedMeshes.map(mesh=>({min:Infinity,max:-Infinity,arms:0,drift:0}));
        const start=performance.now();
        await new Promise(resolve=>{
          function sample(){
            pieceMeshes.forEach((mesh,i)=>{
              const anchor=mesh.userData.basePosition,lift=mesh.position.y-anchor.y,stat=active[i];
              stat.min=Math.min(stat.min,lift);stat.max=Math.max(stat.max,lift);
              stat.drift=Math.max(stat.drift,Math.hypot(mesh.position.x-anchor.x,mesh.position.z-anchor.z));
            });
            capturedMeshes.forEach((mesh,i)=>{
              const anchor=mesh.userData.capturedPosition,lift=mesh.position.y-anchor.y,stat=captured[i];
              stat.min=Math.min(stat.min,lift);stat.max=Math.max(stat.max,lift);
              stat.arms=Math.max(stat.arms,Math.abs(mesh.userData.visual.userData.rig.leftArm.mesh.rotation.z));
              stat.drift=Math.max(stat.drift,Math.hypot(mesh.position.x-anchor.x,mesh.position.z-anchor.z));
            });
            if(performance.now()-start>=7500)resolve();else requestAnimationFrame(sample);
          }requestAnimationFrame(sample);
        });
        const {scene,camera}=window.qaMotion;
        let visibleBirds=0;
        for(const flock of scene.getObjectByName('bird-flocks')?.children||[]){
          if(!flock.visible)continue;
          const bodies=flock.children[1],matrix=bodies.matrixWorld.clone();
          for(let i=0;i<bodies.count;i++){
            bodies.getMatrixAt(i,matrix);
            const point=bodies.position.clone().setFromMatrixPosition(matrix).applyMatrix4(bodies.matrixWorld).project(camera);
            if(Math.abs(point.x)<.95&&Math.abs(point.y)<.95&&point.z<1)visibleBirds++;
          }
        }
        return {active,captured,phases:pieceMeshes.map(mesh=>mesh.userData.idleAnimation.phase),visibleBirds};
      });
      assert.equal(result.active.length,30);assert.equal(result.captured.length,2);
      assert.equal(new Set(result.phases).size,30,'each piece has an independent phase');
      if(!reduced)assert.ok(result.visibleBirds>=8,'many birds must actually enter the default camera view');
      for(const stat of result.active){
        assert.equal(stat.drift,0,'floating cannot move the piece out of its square');
        if(reduced)assert.equal(stat.max,0);else assert.ok(stat.min>=.0079&&stat.max<=.0481&&stat.max-stat.min>.015);
      }
      for(const stat of result.captured){
        assert.equal(stat.drift,0);assert.ok(stat.min>=0);
        if(reduced){assert.equal(stat.max,0);assert.equal(stat.arms,0);}
        else{assert.ok(stat.max>.08&&stat.max<=.181);assert.ok(stat.arms>.45,'captured piece cheers with both arms');}
      }
      await page.screenshot({path:path.join(output,reduced?'motion-reduced.png':'motion-active.png')});
      await page.evaluate(()=>{
        const {game,board}=window.qaMotion,move=game.undo();
        const reverse={...move,from:move.to,to:move.from,reversed:true,returnCapturedTo:move.to,plyIndex:3};
        board.update(game.board(),{targets:new Set(),lastMove:game.history({verbose:true}).at(-1),lastMoveIndex:2,animationMove:reverse});
      });
      await page.waitForTimeout(700);
      assert.deepEqual(await page.evaluate(()=>[window.qaMotion.pieceMeshes.length,window.qaMotion.capturedMeshes.length]),[31,1],'review restores a cheering piece to the board');
      assert.deepEqual(errors,[]);
      console.log(`OK: 30 independent floats, two cheering captures, review restoration; reduced motion ${reduced}`);
      await page.close();
    }
    console.log(`Motion screenshots: ${output}`);
  } finally {if(browser)await browser.close();await server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
