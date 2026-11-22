// Isolated browser build: fixtures and inspection hooks never ship in FCT/.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const project=path.resolve(__dirname,'../projects/FCT'),output=process.env.FCT_QA_OUTPUT||path.resolve(__dirname,'../dist/tactics-qa');
const buildRoot=path.resolve(__dirname,'../dist/tactics-qa-build');
(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
 await build({root:project,logLevel:'warn',build:{outDir:buildRoot,emptyOutDir:true},plugins:[{name:'tactics-test-only',transform(code,id){
  if(id.replaceAll('\\','/').endsWith('/src/tactics-ui.js'))return code+`\nwindow.qaTactics={get:()=>structuredClone({match,viewer,draft,planning,secondsLeft,selectedId}),forecast,load(s){phaseToken++;planning=false;resolving=false;roundPrepared=0;match=s;viewer='w';draft=[];selectedId=null;lastEvent=null;$('#result-dialog').close();prepareRound();}};`;
  if(id.replaceAll('\\','/').endsWith('/src/tactics-board3d.js'))return code.replace('const observer=new ResizeObserver(resize);','window.qaTacticsScene={scene,units,terrain,highlights,camera,renderer,THREE};const observer=new ResizeObserver(resize);');
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
    if(index===2){await win.frameLocator('iframe').locator('.tactics-mode-link').click();await win.frameLocator('iframe').locator('#board-3d canvas').waitFor();assert.equal(await win.frameLocator('iframe').locator('#mode-dialog').count(),0);await home.screenshot({path:path.join(output,'jk-fct-window.png')});}
    const popup=home.context().waitForEvent('page');await win.locator('.abrir-pestana').click();const tab=await popup;await tab.waitForLoadState('domcontentloaded');assert.ok(index===2?tab.url().includes('/FCT/tactics.html'):tab.url().includes('/pages/'));await tab.close();await win.locator('.cerrar-ventana').click();
  }console.log('OK JK: four embedded windows and new-tab actions');await home.close();
  for(const [width,height]of [[1440,1000],[390,844],[320,568]].filter(([w])=>!process.env.FCT_QA_WIDTH||w===+process.env.FCT_QA_WIDTH)){
    const page=await browser.newPage({viewport:{width,height},isMobile:width<740,hasTouch:width<740,reducedMotion:width<740?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
    await page.goto(origin+'tactics.html',{waitUntil:'domcontentloaded'});await page.locator('#board-3d canvas').waitFor();assert.equal(await page.locator('#mode-dialog').count(),0);assert.equal(await page.locator('[data-view="3d"]').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#planning-panel button,#queue-panel button,#add-order,#queue-confirm').count(),0);
    const s=battle();s.round=1;const positions={'w-k':'a1','w-p1':'d4','w-r':'b2','w-n':'b1','b-k':'h8'};s.units=s.units.filter(u=>positions[u.id]);for(const u of s.units)Object.assign(u,{square:positions[u.id],facing:u.color==='w'?'N':'S'});await page.evaluate(s=>window.qaTactics.load(s),s);
    async function point(square,piece=false){return page.evaluate(async({square,piece})=>{
      const {THREE,camera,renderer,units,highlights,scene}=window.qaTacticsScene;scene.updateMatrixWorld(true);let p;
      if(piece){const e=[...units.values()].find(v=>v.unit.square===square);await e.visual.userData.ready;p=new THREE.Box3().setFromObject(e.visual).getCenter(new THREE.Vector3());}
      else p=highlights.get(square).position.clone();p.project(camera);const r=renderer.domElement.getBoundingClientRect();return{x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};
    },{square,piece});}
    const p=await point('d4',true);await page.mouse.click(p.x,p.y);await page.locator('[data-field-action="focus"]').waitFor();
    assert.ok(await page.evaluate(()=>[...window.qaTacticsScene.highlights.values()].some(m=>m.visible&&m.material.opacity>=.7&&m.children.length)));
    await page.screenshot({path:path.join(output,`field-actions-${width}.png`)});
    const target=await point('d6');await page.mouse.click(target.x,target.y);await page.locator('[data-field-choice="move"]').click();assert.equal(await page.locator('[data-field-facing]').count(),4);await page.locator('[data-field-facing="W"]').click();
    assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),1);assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='w-p1').square),'d6');
    await page.locator('[data-field-action="focus"]').click();await page.waitForFunction(()=>window.qaTactics.get().match.round===2&&window.qaTactics.get().planning);
    assert.equal(await page.evaluate(()=>window.qaTactics.get().match.units.find(u=>u.id==='w-p1').facing),'W');
    const r=battle();r.units=r.units.filter(u=>['w-k','w-r','b-k'].includes(u.id));for(const u of r.units)u.square=u.id==='w-k'?'a1':u.id==='w-r'?'d4':'h8';await page.evaluate(s=>window.qaTactics.load(s),r);
    const dragFrom=await point('d4',true),dragTo=await point('e4');await page.mouse.move(dragFrom.x,dragFrom.y);await page.mouse.down();await page.mouse.move(dragTo.x,dragTo.y,{steps:12});await page.mouse.up();try{await page.locator('[data-field-choice="move"]').click();}catch(error){await page.screenshot({path:path.join(output,`drag-failure-${width}.png`)});console.log(JSON.stringify({width,dragFrom,dragTo,state:await page.evaluate(()=>window.qaTactics.get())}));throw error;}await page.screenshot({path:path.join(output,`facing-${width}.png`)});await page.locator('[data-field-facing="E"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.forecast().units.find(u=>u.id==='w-r').square),'e4');
    await page.evaluate(s=>window.qaTactics.load(s),r);await page.locator('[data-view="2d"]').click();
    const from=await page.locator('[data-square="d4"]').boundingBox(),to=await page.locator('[data-square="e4"]').boundingBox();await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:8});await page.mouse.up();await page.locator('[data-field-choice="move"]').click();await page.locator('[data-field-facing="N"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),1);
    await page.locator('[data-square="e4"]').click();await page.locator('[data-square="h4"]').click();await page.locator('[data-field-choice="attack"]').click();assert.equal(await page.evaluate(()=>window.qaTactics.get().draft.length),2);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`OK ${width}: default 3D, field commands/facing, pawn double step, 3D/2D drag and automatic orders`);await page.close();
  }
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
