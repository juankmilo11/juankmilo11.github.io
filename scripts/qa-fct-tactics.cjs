// Isolated browser build: fixtures and inspection hooks never ship in FCT/.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const project=path.resolve(__dirname,'../projects/FCT'),output=process.env.FCT_QA_OUTPUT||path.resolve(__dirname,'../dist/tactics-qa');
const buildRoot=path.resolve(__dirname,'../dist/tactics-qa-build');
(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
 await build({root:project,logLevel:'warn',build:{outDir:buildRoot,emptyOutDir:true},plugins:[{name:'tactics-test-only',transform(code,id){
  if(id.replaceAll('\\','/').endsWith('/src/tactics-ui.js'))return code+`\nwindow.qaTactics={get:()=>structuredClone({match,viewer,draft,privacy,planning,secondsLeft}),load(s){phaseToken++;planning=false;resolving=false;privacy=false;roundPrepared=0;match=s;viewer='w';draft=[];selectedId=null;lastEvent=null;modeDialog.close();$('#result-dialog').close();prepareRound();}};`;
  if(id.replaceAll('\\','/').endsWith('/src/tactics-board3d.js'))return code.replace('const observer=new ResizeObserver(resize);','window.qaTacticsScene={scene,units,terrain,camera,renderer,THREE};const observer=new ResizeObserver(resize);');
 }}]});
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
 const server=http.createServer((req,res)=>{
  let file=path.resolve(buildRoot,'./'+decodeURIComponent(new URL(req.url,'http://local').pathname).replace(/^\/FCT\/?/,''));
  if(file!==buildRoot&&!file.startsWith(buildRoot+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size,range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
  if(range){const start=+range[1],end=range[2]?Math.min(size-1,+range[2]):size-1;if(start>=size){res.writeHead(416).end();return;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
 });
 let browser;try{
  fs.mkdirSync(output,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}/FCT/`;
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
  const engine=await import(pathToFileURL(path.join(project,'src/tactics-engine.js')).href);
  function battle(){const s=engine.createMatch({seed:11});engine.autoDeploy(s,'w');engine.autoDeploy(s,'b');Object.assign(s,{phase:'planning',round:3,firstSide:'w',deployed:{w:true,b:true},ready:{w:false,b:false},activePlanner:'w'});return s;}
  for(const [width,height]of (process.env.FCT_QA_DESKTOP_ONLY?[[1440,1000]]:[[1440,1000],[390,844],[320,568]])){
   const page=await browser.newPage({viewport:{width,height},isMobile:width<740,hasTouch:width<740,reducedMotion:width<740?'reduce':'no-preference'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(20000);
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   assert.equal((await page.locator('.tactics-mode-link').textContent()).trim(),'JUGAR');
   assert.equal((await page.locator('#new-game').textContent()).trim(),'Partida clásica');
   await page.locator('.tactics-mode-link').click();await page.locator('#mode-dialog[open]').waitFor();
   assert.equal(await page.locator('#intro-title').textContent(),'Fantasy Chess Tactics');
   assert.equal(await page.locator('[name="opponent"],.intro-features,.intro-dialog fieldset').count(),0);
   await page.screenshot({path:path.join(output,`intro-${width}.png`)});
   await page.locator('#start-match').click();assert.equal(await page.locator('#board-2d .tactical-token').count(),16,'both armies placed automatically and visible');
   assert.equal(await page.locator('#privacy-curtain,[data-command="auto-deploy"],[data-command="confirm-deploy"]').count(),0);
   await page.locator('[data-command="roll"]').click();
   if(await page.evaluate(()=>window.qaTactics.get().match.dice.winner==='w'))await page.locator('[data-command="choose-first"]').click();
   await page.waitForFunction(()=>window.qaTactics.get().planning);
   assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft>9));
   assert.equal(await page.locator('#board-2d .hp-track,#board-2d .token-face').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.join(output,`planning-${width}.png`)});
   const pawn=await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-p1').square);
   await page.locator(`[data-square="${pawn}"]`).click();await page.waitForTimeout(1200);
   const before=await page.evaluate(()=>window.qaTactics.get().secondsLeft);await page.locator('[data-action="focus"]').click();
   assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft>9.4),'10-second clock restarts for next order');assert.ok(before<9.5);
   if(width===1440){
    await page.locator('[data-remove="0"]').click();await page.waitForTimeout(1000);const editing=await page.evaluate(()=>window.qaTactics.get().secondsLeft);
    await page.locator('[data-action="block"]').click();assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft)<=editing+.1,'editing cannot reset the same slot forever');
    await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().planning,{},{timeout:15000});
    assert.ok(await page.evaluate(()=>window.qaTactics.get().match.log.some(e=>e.side==='w'&&e.kind==='pass')),'timeout consumes only its action slot');
   }else{
    const state=await page.evaluate(()=>window.qaTactics.get().match),knight=state.units.find(u=>u.id==='w-n'),target=engine.getLegalMoves(state,knight).find(s=>!engine.unitAt(state,s));
    await page.locator(`[data-square="${knight.square}"]`).tap();await page.locator('[data-action="move"]').tap();
    assert.ok(await page.locator('.is-target').count()>0);await page.locator(`[data-square="${target}"]`).tap();await page.locator('[data-facing="W"]').tap();
    await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().planning);
   }
   assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft>9),'next round starts immediately with 10 seconds');
   if(width===1440){
    const s=battle();s.units=s.units.filter(u=>['w-k','w-r','b-k'].includes(u.id));for(const u of s.units){u.square=u.id==='w-k'?'a1':u.id==='w-r'?'d4':'d8';u.facing=u.color==='w'?'N':'S';if(u.id==='b-k')u.hp=2;}
    await page.evaluate(s=>window.qaTactics.load(s),s);assert.equal(await page.locator('#queue-count').textContent(),'0 / 3');
    await page.locator('[data-view="3d"]').click();await page.locator('#board-3d canvas').waitFor();
    assert.equal(await page.evaluate(()=>[...window.qaTacticsScene.units.values()].every(e=>!e.badge.visible&&!e.bearing.visible)),true,'3D health and foot arrows remain invisible');
    await page.screenshot({path:path.join(output,'board-3d.png')});
    const hit=await page.evaluate(async()=>{const {THREE,camera,renderer,units}=window.qaTacticsScene,e=units.get('w-r');await e.visual.userData.ready;const p=new THREE.Box3().setFromObject(e.visual).getCenter(new THREE.Vector3()).project(camera),r=renderer.domElement.getBoundingClientRect();return{x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};});
    await page.mouse.click(hit.x,hit.y);assert.equal(await page.locator('#unit-name').textContent(),'Torre','3D figure remains selectable without hidden badge hitboxes');
    await page.locator('[data-action="attack"]').click();await page.locator('[data-direction="N"]').click();await page.locator('#add-order').click();
    await page.locator('#result-dialog[open]').waitFor();assert.equal(await page.evaluate(()=>window.qaTactics.get().match.winner),'w');
   }
   assert.deepEqual(errors,[]);console.log(`OK ${width}: simplified menu, automatic visible armies, per-order timer reset, automatic resolution/next round, hidden health/arrows${width===1440?', timeout slot, edit protection and 3D victory':''}`);await page.close();
  }
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
