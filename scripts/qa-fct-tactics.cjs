// Isolated browser build: fixtures and inspection hooks never ship in FCT/.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const project=path.resolve(__dirname,'../projects/FCT'),output=process.env.FCT_QA_OUTPUT||path.resolve(__dirname,'../dist/tactics-qa');
const buildRoot=path.resolve(__dirname,'../dist/tactics-qa-build');
(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
 await build({root:project,logLevel:'warn',build:{outDir:buildRoot,emptyOutDir:true},plugins:[{name:'tactics-test-only',transform(code,id){
  if(id.replaceAll('\\','/').endsWith('/src/tactics-ui.js'))return code+`\nwindow.qaTactics={get:()=>structuredClone({match,viewer,draft,planning,secondsLeft,selectedId,history,reviewIndex,workerActive:Boolean(aiWorker)}),forecast,load(s){phaseToken++;planning=false;resolving=false;roundPrepared=0;reviewIndex=null;history=[];clearIntent();forecastMemo=null;aiWorker?.terminate();aiWorker=null;match=s;viewer='w';draft=[];selectedId=null;lastEvent=null;$('#result-dialog').close();prepareRound();}};`;
  if(id.replaceAll('\\','/').endsWith('/src/tactics-board3d.js'))return code.replace('const observer=new ResizeObserver(resize);','window.qaTacticsScene={scene,units,terrain,highlights,camera,renderer,THREE,getQuality:()=>quality};const observer=new ResizeObserver(resize);');
 }}]});
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),siteRoot=path.resolve(project,'../..'),base=pathname.startsWith('/FCT/')?buildRoot:siteRoot;
  let file=path.resolve(base,'.'+(base===buildRoot?pathname.replace(/^\/FCT/,''):pathname));
  if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size,range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Accept-Ranges','bytes');
  if(range){const start=+range[1],end=range[2]?Math.min(size-1,+range[2]):size-1;if(start>=size){res.writeHead(416).end();return;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
 });
 let browser;try{
  fs.mkdirSync(output,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}/FCT/`;
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
  const engine=await import(pathToFileURL(path.join(project,'src/tactics-engine.js')).href);
  function battle(){const s=engine.createMatch({seed:11});engine.autoDeploy(s,'w');engine.autoDeploy(s,'b');Object.assign(s,{phase:'planning',round:3,firstSide:'w',deployed:{w:true,b:true},ready:{w:false,b:false},activePlanner:'w'});return s;}
  const home=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await home.route('**/pages/**',r=>r.fulfill({contentType:'text/html',body:'<h1>App</h1>'}));
  await home.goto(origin.replace(/FCT\/$/,''),{waitUntil:'domcontentloaded'});await home.waitForFunction(()=>!document.querySelector('.enlaces').hasAttribute('inert'));
  for(const index of [0,1,2,3]){
    const initial=home.context().pages().length;await home.locator('.enlace').nth(index).click();const win=home.locator('.ventana').last();await win.locator('iframe').waitFor();assert.equal(home.context().pages().length,initial);
    if(index===2){assert.ok((await win.locator('.barra-ventana').evaluate(n=>getComputedStyle(n).backgroundImage)).includes('196, 99, 29'));await win.frameLocator('iframe').locator('.tactics-mode-link').click();await win.frameLocator('iframe').locator('#board-3d canvas').waitFor();assert.equal(await win.frameLocator('iframe').locator('#mode-dialog').count(),0);await home.screenshot({path:path.join(output,'jk-fct-window.png')});}
    const popup=home.context().waitForEvent('page');await win.locator('.abrir-pestana').click();const tab=await popup;await tab.waitForLoadState('domcontentloaded');assert.ok(index===2?tab.url().includes('/FCT/tactics.html'):tab.url().includes('/pages/'));await tab.close();await win.locator('.cerrar-ventana').click();
  }console.log('OK JK: four embedded windows and new-tab actions');await home.close();
  for(const [width,height]of [[1440,1000],[390,844],[320,568]].filter(([w])=>!process.env.FCT_QA_WIDTH||w===+process.env.FCT_QA_WIDTH)){
    const page=await browser.newPage({viewport:{width,height},isMobile:width<740,hasTouch:width<740,reducedMotion:width<740?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
    if(width===390)await page.addInitScript(()=>{Object.defineProperty(navigator,'deviceMemory',{get:()=>2});Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});});
    await page.goto(origin+'tactics.html',{waitUntil:'domcontentloaded'});await page.locator('#board-3d canvas').waitFor();assert.equal(await page.locator('#mode-dialog').count(),0);assert.equal(await page.locator('[data-view="3d"]').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#planning-panel button,#queue-panel button,#add-order,#queue-confirm').count(),0);
    assert.equal(await page.locator('.unit-roster,.board-legend').count(),0);assert.equal(await page.locator('.tactical-token').count(),32);if(width===390)assert.equal(await page.evaluate(()=>window.qaTacticsScene.renderer.shadowMap.enabled),false);
    await page.screenshot({path:path.join(output,`full-armies-${width}.png`)});
    const s=battle();s.round=1;const positions={'w-k':'a1','w-p1':'d4','w-r':'b2','w-n':'b1','b-k':'h8'};s.units=s.units.filter(u=>positions[u.id]);for(const u of s.units)Object.assign(u,{square:positions[u.id],facing:u.color==='w'?'N':'S'});await page.evaluate(s=>window.qaTactics.load(s),s);
    async function point(square,piece=false){return page.evaluate(async({square,piece})=>{
      const {THREE,camera,renderer,units,highlights,scene}=window.qaTacticsScene;scene.updateMatrixWorld(true);let p;
      if(piece){const e=[...units.values()].find(v=>v.unit.square===square);await e.visual.userData.ready;scene.updateMatrixWorld(true);p=new THREE.Box3().setFromObject(e.visual).getCenter(new THREE.Vector3());}
      else p=highlights.get(square).position.clone();p.project(camera);const r=renderer.domElement.getBoundingClientRect();return{x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};
    },{square,piece});}
    assert.equal(await page.evaluate(()=>window.qaTactics.get().workerActive),true);
    const pawn=await point('d4',true);await page.mouse.click(pawn.x,pawn.y);assert.equal(await page.locator('[data-field-action]').count(),0,'opening allows movement only');
    assert.ok(await page.evaluate(()=>[...window.qaTacticsScene.highlights.values()].some(m=>m.visible&&m.material.opacity>=.7&&m.children.length)));
    const target=await point('d6');await page.mouse.click(target.x,target.y);await page.locator('[data-field-choice="move"]').click();assert.equal(await page.locator('[data-field-facing]').count(),4);
    assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),1,'move is confirmed before choosing a facing');
    await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().planning);
    assert.equal(await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-p1').square),'d6');assert.equal(await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-p1').facing),'N');
    const r=battle();r.units=r.units.filter(u=>['w-k','w-r','b-k'].includes(u.id));for(const u of r.units)u.square=u.id==='w-k'?'a1':u.id==='w-r'?'d4':'h8';await page.evaluate(s=>window.qaTactics.load(s),r);
    const rook=await point('d4',true);await page.mouse.click(rook.x,rook.y);await page.locator('[data-field-action="focus"]').waitFor();
    const style=await page.locator('#unit-actions').evaluate(n=>({bg:getComputedStyle(n).backgroundColor,border:getComputedStyle(n).borderTopWidth,shadow:getComputedStyle(n).boxShadow,button:getComputedStyle(n.querySelector('button')).backgroundColor}));assert.equal(style.bg,'rgba(0, 0, 0, 0)');assert.equal(style.border,'0px');assert.equal(style.shadow,'none');assert.ok(style.button.startsWith('rgba('));assert.equal(await page.locator('.field-label').count(),0);
    await page.screenshot({path:path.join(output,`field-actions-${width}.png`)});
    // Deselect to start a physical drag with no overlay under the pointer.
    await page.mouse.click((await point('h4')).x,(await point('h4')).y);
    const dragFrom=await point('d4',true),dragTo=await point('e4');await page.mouse.move(dragFrom.x,dragFrom.y);await page.mouse.down();await page.mouse.move(dragTo.x,dragTo.y,{steps:12});await page.mouse.up();await page.locator('[data-field-choice="move"]').click();await page.screenshot({path:path.join(output,`facing-${width}.png`)});assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),1);await page.locator('[data-field-facing="E"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='w-r').facing),'E');
    await page.locator('[data-field-action="focus"]').click();assert.ok(await page.evaluate(()=>window.qaTactics.get().secondsLeft)>14);await page.locator('[data-field-action="ultimate"]').click();await page.waitForFunction(()=>window.qaTactics.get().match.round===4&&window.qaTactics.get().planning);
    await page.locator('#review-open').click();const live=await page.evaluate(()=>JSON.stringify(window.qaTactics.get().match));assert.equal(await page.locator('#battle-status').textContent(),'Partida pausada');await page.locator('[data-review="first"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='w-r').square),'d4');await page.locator('[data-review="next"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='w-r').square),'e4');await page.screenshot({path:path.join(output,`review-${width}.png`)});assert.equal(await page.evaluate(()=>JSON.stringify(window.qaTactics.get().match)),live);await page.locator('#review-return').click();
    await page.evaluate(s=>window.qaTactics.load(s),r);await page.locator('[data-view="2d"]').click();
    const from=await page.locator('[data-square="d4"]').boundingBox(),to=await page.locator('[data-square="e4"]').boundingBox();await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:8});await page.mouse.up();await page.locator('[data-field-choice="move"]').click();await page.locator('[data-field-facing="N"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),1);
    await page.locator('[data-square="e4"]').click();await page.locator('[data-square="h4"]').click();await page.locator('[data-field-choice="attack"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),2);
    const end=structuredClone(r);end.units.find(u=>u.id==='b-k').square='d8';end.units.find(u=>u.id==='b-k').hp=2;await page.evaluate(s=>window.qaTactics.load(s),end);await page.locator('[data-square="d4"]').click();await page.locator('[data-square="d8"]').click();await page.locator('[data-field-choice="attack"]').click();await page.locator('#result-dialog[open]').waitFor();await page.locator('#result-review').click();await page.locator('[data-review="first"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='b-k').hp),2);await page.locator('[data-review="last"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='b-k').hp),0);await page.locator('#review-return').click();await page.locator('#result-dialog[open]').waitFor();
    // Demand-rendering budget: no repeated draw calls while a low-power board is idle.
    await page.evaluate(s=>window.qaTactics.load(s),r);await page.locator('[data-view="3d"]').click();await page.locator('#graphics-mode').click();await page.waitForTimeout(300);const before=await page.evaluate(()=>({frame:window.qaTacticsScene.renderer.info.render.frame,quality:window.qaTacticsScene.getQuality(),shadows:window.qaTacticsScene.renderer.shadowMap.enabled,ratio:window.qaTacticsScene.renderer.getPixelRatio()}));await page.waitForTimeout(350);const after=await page.evaluate(()=>window.qaTacticsScene.renderer.info.render.frame);assert.equal(before.shadows,false);assert.ok(before.ratio<=1);assert.ok(after-before.frame<=1,'idle low-power scene is not continuously rendered');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`OK ${width}: 32 pieces, movement-only opening, optional facing, transparent field HUD, 15s orders, both drags, live/result review and idle render budget`);await page.close();

  }
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
