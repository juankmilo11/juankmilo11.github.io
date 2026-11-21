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
  if(id.replaceAll('\\','/').endsWith('/src/tactics-board3d.js'))return code.replace('const observer=new ResizeObserver(resize);','window.qaTacticsScene={scene,units,terrain};const observer=new ResizeObserver(resize);');
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
  for(const [width,height]of (process.env.FCT_QA_PHONE_ONLY?[[390,844],[320,568]]:[[1440,1000],[390,844],[320,568]])){
   const page=await browser.newPage({viewport:{width,height},isMobile:width<740,hasTouch:width<740,reducedMotion:width===1440?'no-preference':'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(18000);
   await page.goto(origin,{waitUntil:'domcontentloaded'});await page.locator('.tactics-mode-link').click();await page.locator('#mode-dialog[open]').waitFor();
   await page.screenshot({path:path.join(output,`intro-${width}.png`)});
   await page.locator('#start-match').click();
   assert.equal(await page.locator('.tactical-token.token-black').count(),0,'AI deployment is concealed');
   await page.locator('[data-command="auto-deploy"]').click();assert.equal(await page.locator('#board-2d .tactical-token').count(),8);
   await page.locator('[data-command="confirm-deploy"]').click();assert.equal(await page.locator('.token-black').count(),0,'initiative still conceals enemy positions');
   await page.locator('[data-command="roll"]').click();
   if(await page.evaluate(()=>window.qaTactics.get().match.dice.winner==='w'))await page.locator('[data-command="choose-first"]').click();
   await page.locator('#privacy-curtain:not([hidden])').waitFor();assert.equal(await page.locator('#planning-panel').isVisible(),false);
   await page.locator('#curtain-continue').click();await page.locator('#rules-open').click();
   const paused=await page.evaluate(()=>window.qaTactics.get().secondsLeft);await page.waitForTimeout(220);assert.ok(Math.abs(paused-await page.evaluate(()=>window.qaTactics.get().secondsLeft))<.15,'rules pause active planning clock');
   await page.locator('#rules-close').click();assert.equal(await page.locator('#board-2d .tactical-token').count(),16);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow');
   if(width<740){
    const dock=await page.locator('#planning-panel').boundingBox(),field=await page.locator('#board-2d').boundingBox();
    assert.ok(dock.y+ dock.height<=height+1,'action dock stays within the viewport');
    assert.ok(field.y+field.height<=dock.y+2,'action dock does not cover home squares');
   }
   await page.screenshot({path:path.join(output,`planning-${width}.png`)});
   // Let the real 7-second opening timer seal a partial plan and resolve it.
   const pawn=await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-p1').square);
   await page.locator(`[data-square="${pawn}"]`).click();await page.locator('[data-action="focus"]').click();assert.equal(await page.locator('#order-queue li:not(.queue-empty)').count(),1);
   if(width<740){
    const knight=await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-n').square),state=await page.evaluate(()=>window.qaTactics.get().match);
    const target=engine.getLegalMoves(state,'w-n').find(s=>!engine.unitAt(state,s));
    await page.locator(`[data-square="${knight}"]`).tap();await page.locator('[data-action="move"]').tap();await page.locator(`[data-square="${target}"]`).tap();await page.locator('[data-facing="W"]').tap();
    assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),2);
    assert.equal(await page.locator(`[data-square="${target}"] [data-unit="w-n"] .token-face`).textContent(),'←');
    assert.equal(await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-n').square),knight,'forecast does not move the real unit before resolution');
   }
   await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().privacy,{},{timeout:16000});
   assert.ok(await page.evaluate(()=>window.qaTactics.get().match.log.some(e=>e.side==='w'&&e.kind==='focus')));
   if(width===1440){
    await page.locator('#curtain-continue').click();await page.locator('#queue-confirm').click();await page.waitForFunction(()=>window.qaTactics.get().match.round===3&&window.qaTactics.get().privacy);
    await page.locator('#curtain-continue').click();assert.equal(await page.locator('#queue-count').textContent(),'0 / 3');assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft>9));
    await page.locator('#rules-open').click();
    // Actual attack input, death choreography and king-victory overlay in 3D.
    const s=battle();s.units=s.units.filter(u=>['w-k','w-r','b-k'].includes(u.id));for(const u of s.units){u.square=u.id==='w-k'?'a1':u.id==='w-r'?'d4':'d8';u.facing=u.color==='w'?'N':'S';if(u.id==='b-k')u.hp=2;}
    await page.locator('#rules-close').click();await page.evaluate(s=>window.qaTactics.load(s),s);await page.locator('#curtain-continue').click();await page.locator('[data-view="3d"]').click();await page.locator('#board-3d canvas').waitFor();
    await page.locator('#unit-roster [data-unit="w-r"]').click();await page.locator('[data-action="attack"]').click();await page.locator('[data-direction="N"]').click();await page.locator('#add-order').click();await page.locator('#queue-confirm').click();await page.locator('#result-dialog[open]').waitFor();
    assert.equal(await page.evaluate(()=>window.qaTactics.get().match.winner),'w');assert.equal(await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-r').square),'d4');
    await page.screenshot({path:path.join(output,'victory-3d.png')});
    const terrain=battle();terrain.units=terrain.units.filter(u=>['w-k','w-q','b-k'].includes(u.id));for(const u of terrain.units){u.square=u.id==='w-k'?'a1':u.id==='w-q'?'d4':'h8';if(u.type==='q')u.charged=true;}
    await page.evaluate(s=>window.qaTactics.load(s),terrain);await page.locator('#curtain-continue').click();await page.locator('[data-view="2d"]').click();await page.locator('#unit-roster [data-unit="w-q"]').click();await page.locator('[data-action="ultimate"]').click();await page.locator('[data-ability-mode="fracture"]').click();await page.locator('[data-square="e4"]').click();await page.locator('#add-order').click();await page.locator('[data-view="3d"]').click();await page.locator('#queue-confirm').click();
    await page.waitForFunction(()=>window.qaTactics.get().match.round===4&&window.qaTactics.get().privacy);assert.equal(await page.evaluate(()=>window.qaTactics.get().match.tiles.e4.kind),'void');assert.ok(await page.evaluate(()=>window.qaTacticsScene.terrain.children.length>0));
   }
   assert.deepEqual(errors,[]);console.log(`OK ${width}: secret setup, initiative, timed planning, focus, interleaved resolution, responsive layout${width===1440?', round3, 3D attack/death/victory':''}`);await page.close();
  }
  const page=await browser.newPage({viewport:{width:1300,height:900},reducedMotion:'reduce'});await page.goto(origin+'tactics.html',{waitUntil:'domcontentloaded'});await page.locator('[name="opponent"][value="local"]').check();await page.locator('#start-match').click();await page.locator('[data-command="auto-deploy"]').click();await page.locator('[data-command="confirm-deploy"]').click();
  assert.equal(await page.locator('#privacy-curtain').isVisible(),true);assert.equal(await page.locator('#queue-panel').isVisible(),false);await page.locator('#curtain-continue').click();assert.equal(await page.locator('.token-white').count(),0);await page.locator('[data-command="auto-deploy"]').click();await page.locator('[data-command="confirm-deploy"]').click();await page.locator('[data-command="roll"]').click();
  if(await page.evaluate(()=>window.qaTactics.get().privacy))await page.locator('#curtain-continue').click();await page.locator('[data-command="choose-first"]').click();await page.locator('#curtain-continue').click();await page.locator('#unit-roster [data-unit]').first().click();await page.locator('[data-action="block"]').click();await page.locator('#queue-confirm').click();assert.equal(await page.locator('#privacy-curtain').isVisible(),true);assert.equal(await page.locator('#queue-panel').isVisible(),false);await page.locator('#curtain-continue').click();assert.equal(await page.locator('#order-queue li:not(.queue-empty)').count(),0);await page.locator('#queue-confirm').click();await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().privacy);console.log('OK local: deployment/plan handover, cleared private queue and shared resolution');await page.close();
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
