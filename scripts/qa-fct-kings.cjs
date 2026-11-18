// Real-client king-pose/review QA. Fixture FENs and observation hooks exist only
// in this isolated test build; production does not expose the game.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const http=require('node:http');
const project=path.resolve(__dirname,'../projects/FCT');
const output=process.env.FCT_QA_OUTPUT||path.join(require('node:os').tmpdir(),'fct-kings-qa');
const CHECK_FEN='4k3/8/8/8/8/8/4r3/4K3 w - - 0 1';
const PRE_MATE_FEN='7k/8/5KQ1/8/8/8/8/8 w - - 0 1';

(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
 const buildRoot=path.resolve(__dirname,'../dist/fct-kings-build');
 const hook=`\nwindow.qaKings={game,renderAll,setView,load(fen,san){game.load(fen);recentMoveAnimation=null;thinking=false;aiRequestId++;selectedSquare=null;window.fctReview.reset();if(san)game.move(san);renderAll();}};`;
 const marker='return { update, resize, resetCamera, playIntro, cancelIntro };';
 await build({root:project,logLevel:'warn',build:{outDir:buildRoot,emptyOutDir:true},plugins:[{
  name:'fct-king-pose-qa-hooks',enforce:'post',transform(code,id){
   if(id.split('?')[0].replaceAll('\\','/').endsWith('/src/main.js'))return code+hook;
   if(id.split('?')[0].replaceAll('\\','/').endsWith('/src/board3d.js')){
    assert.ok(code.includes(marker));return code.replace(marker,`window.qaKings3D={pieceMeshes,THREE,createCharacter,animateCharacter,releaseCharacter};${marker}`);
   }
  }
 }]});
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
 const server=http.createServer((req,res)=>{
  let file=path.resolve(buildRoot,'./'+decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/FCT\/?/,''));
  if(file!==buildRoot&&!file.startsWith(buildRoot+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size,range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
  if(range){const start=Number(range[1]),end=range[2]?Math.min(size-1,Number(range[2])):size-1;
   if(start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
   res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);
  }else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
 });
 const expectedSprites=Object.fromEntries(['thumb','check','defeated'].map(pose=>[pose,new Set(fs.readdirSync(path.join(project,'sprites/characters')).filter(file=>file.endsWith(`-${pose}.png`)).map(file=>fs.readFileSync(path.join(project,'sprites/characters',file)).toString('base64')))]));
 let browser;
 try{
  fs.mkdirSync(output,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
  for(const reduced of [false,true]){
   const page=await browser.newPage({viewport:{width:1200,height:820},reducedMotion:reduced?'reduce':'no-preference'}),errors=[];
   page.setDefaultTimeout(20000);
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.qaKings);
   await page.locator('#new-game').click();
   await page.locator('#board-3d canvas').waitFor();
   await page.waitForFunction(()=>window.qaKings3D?.pieceMeshes?.length>0);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.waitForFunction(()=>document.querySelector('.app-shell').classList.contains('is-playing')&&!document.querySelector('#battle-curtain').classList.contains('is-revealing'));

   async function verify(square,pose){
    const token=page.locator(`[data-square="${square}"] .piece-token`);
    assert.equal(await token.getAttribute('data-king-pose'),pose);
    const src=await token.locator('.piece-art').getAttribute('src');
    assert.ok(expectedSprites[pose==='standing'?'thumb':pose].has(src.split(',')[1]),`2D ${pose} uses a generated PNG for that posture`);
    if(pose!=='standing')assert.equal(await token.evaluate(el=>getComputedStyle(el).animationName),'none');
    await page.waitForFunction(({square,pose})=>window.qaKings3D?.pieceMeshes?.some(mesh=>mesh.userData.square===square&&mesh.userData.visual.userData.kingPose===pose&&!mesh.userData.moveAnimation),{square,pose});
    const actual=await page.evaluate(async square=>{
     const {THREE}=window.qaKings3D;
     const mesh=window.qaKings3D.pieceMeshes.find(item=>item.userData.square===square),visual=mesh.userData.visual;
     const bounds=new THREE.Box3().setFromObject(visual);
     return {pose:visual.userData.kingPose,minY:bounds.min.y-mesh.userData.basePosition.y,x:visual.rotation.x,z:visual.rotation.z};
    },square);
    if(pose==='standing'){assert.equal(actual.x,0);assert.equal(actual.z,0);}
    else{assert.ok(actual.minY>=-.001&&actual.minY<.05,`${pose} is grounded: ${actual.minY}`);if(pose==='defeated')assert.ok(Math.abs(actual.z)>1.4);}
   }

   await page.evaluate(fen=>window.qaKings.load(fen),CHECK_FEN);
   await verify('e1','check');
   console.log(`OK: checked king crouches in 2D/3D; reduced motion ${reduced}.`);
   await page.screenshot({path:path.join(output,`check-${reduced}.png`)});
   // The real review controls undo a king's escape and then replay it.
   await page.evaluate(fen=>window.qaKings.load(fen,'Kxe2'),CHECK_FEN);
   await verify('e2','standing');
   // This fixture becomes king vs king, so enter its result-review UI first.
   await page.locator('#checkmate-overlay').waitFor({state:'visible'});
   await page.locator('#review-match').click();
   await page.locator('#review-previous').click();await verify('e1','check');
   await page.locator('#review-next').click();await verify('e2','standing');
   await page.locator('#review-return').click();

   await page.evaluate(fen=>window.qaKings.load(fen,'Qg7#'),PRE_MATE_FEN);
   await verify('h8','defeated');
   await page.locator('#checkmate-overlay').waitFor({state:'visible'});
   await page.locator('#review-match').click();
   await page.locator('#checkmate-overlay').waitFor({state:'hidden'});
   await verify('h8','defeated');
   await page.waitForFunction(()=>!document.querySelector('.app-shell').classList.contains('is-review-transitioning'));
   await page.screenshot({path:path.join(output,`defeated-${reduced}.png`)});
   await page.locator('#review-previous').click();await verify('h8','standing');
   await page.locator('#review-last').click();await verify('h8','defeated');
   assert.deepEqual(errors,[]);

   if(reduced){
    const royalFits=await page.evaluate(async()=>{
     const {THREE,createCharacter,animateCharacter,releaseCharacter}=window.qaKings3D;
     const ids=['agrias','teta','dancer','mime-female','ovelia','balmafula','ramza','delita','cloud','orlandu','mustadio','beowulf','dycedarg','gaff-gafgarion'];
     const results=[];
     for(const id of ids)for(const facing of [0,Math.PI]){
      const model=createCharacter({character:id,palette:0},facing,'k');await model.userData.ready;
      for(const pose of ['check','defeated','standing']){
       animateCharacter(model,20,{kingPose:pose,reducedMotion:true});
       const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3());
       results.push({id,facing,pose,minY:bounds.min.y,centerX:center.x,centerZ:center.z,rotationZ:model.rotation.z});
      }releaseCharacter(model);
     }return results;
    });
    for(const fit of royalFits){
     if(fit.pose!=='standing')assert.ok(fit.minY>=-.001&&fit.minY<.05,`${fit.id} ${fit.pose} stays on floor`);
     if(fit.pose==='defeated')assert.ok(Math.abs(fit.centerX)<.03&&Math.abs(fit.centerZ)<.03,`${fit.id} stays centered`);
     if(fit.pose==='standing')assert.equal(fit.rotationZ,0);
    }
    console.log(`OK: all 14 royal rigs, both facings and posture restoration (${royalFits.length} checks).`);
   }
   console.log(`OK: check/mate 2D sprites, grounded 3D poses and real undo/replay; reduced motion ${reduced}.`);
   await page.close();
  }
  console.log('King pose screenshots: '+output);
 }finally{await browser?.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
