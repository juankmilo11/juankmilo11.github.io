// Real mouse/touch drag checks against an isolated build; no hooks ship in FCT/.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const {pathToFileURL}=require('node:url');
const path=require('node:path'),fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const project=path.resolve(__dirname,'../projects/FCT');
const buildRoot=path.resolve(__dirname,'../dist/fct-drag-build');
const output=process.env.FCT_QA_OUTPUT||path.join(require('node:os').tmpdir(),'fct-drag-qa');
const near=(a,b,label,tolerance=.003)=>assert.ok(Math.abs(a-b)<=tolerance,`${label}: ${a} vs ${b}`);

(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
 const marker='return { update, resize, resetCamera, playIntro, cancelIntro };';
 await build({root:project,logLevel:'warn',build:{outDir:buildRoot,emptyOutDir:true},plugins:[{
  name:'fct-drag-qa-hooks',transform(code,id){
   if(id.replaceAll('\\','/').endsWith('/src/main.js'))return code+`\nwindow.qaLoadDragFen=fen=>{game.load(fen);selectedSquare=null;recentMoveAnimation=null;thinking=false;aiRequestId++;window.fctReview.reset();renderAll();};`;
   if(!id.replaceAll('\\','/').endsWith('/src/board3d.js'))return;
   assert.ok(code.includes(marker));
   code=code.replace('pieceMeshes.splice(0, pieceMeshes.length, ...nextPieces);',`pieceMeshes.splice(0, pieceMeshes.length, ...nextPieces);if(window.qaDrag){const moves=pieceMeshes.filter(m=>m.userData.moveAnimation?.drop).map(m=>({square:m.userData.square,from:m.userData.moveAnimation.from.toArray(),duration:m.userData.moveAnimation.duration}));if(moves.length)window.qaDrag.latestMoves=moves;}`);
   return code.replace(marker,`window.qaDrag={camera,renderer,pieceMeshes,tileHeights,sun,dropShadowMaterial,THREE,hit};
    document.addEventListener('pointerdown',event=>{window.qaDrag.downEvent={x:event.clientX,y:event.clientY,type:event.pointerType,target:event.target.tagName,hit:hit(event)?.object.userData.square};},true);
    document.addEventListener('pointermove',event=>{window.qaDrag.moveEvent={x:event.clientX,y:event.clientY,type:event.pointerType,target:event.target.tagName};},true);
    document.addEventListener('pointerup',event=>{window.qaDrag.upEvent={x:event.clientX,y:event.clientY,type:event.pointerType,target:event.target.tagName,square:squareAtPointer(event)};window.qaDrag.releasePositions=Object.fromEntries(pieceMeshes.map(m=>[m.userData.square,m.position.toArray()]));},true);
    renderer.domElement.addEventListener('pointerup',()=>{window.qaDrag.released=pieceMeshes.map(mesh=>({square:mesh.userData.square,position:mesh.position.toArray(),motion:mesh.userData.moveAnimation?{...mesh.userData.moveAnimation,from:mesh.userData.moveAnimation.from.toArray(),to:mesh.userData.moveAnimation.to.toArray()}:null}));});${marker}`);
  }
 }]});
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
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
 let browser;
 try{
  fs.mkdirSync(output,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
  for(const mobile of process.env.FCT_QA_DRAG_TOUCH_ONLY?[true]:[false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:mobile?'reduce':'no-preference'});
   page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route(/\/assets\/ai-worker-[^/]+\.js$/,route=>route.fulfill({contentType:'text/javascript',body:`self.onmessage=({data})=>{if(data.type==='choose-move')self.postMessage({type:'move',requestId:data.requestId,move:'e7e5'});};`}));
   await page.goto(`http://127.0.0.1:${server.address().port}/FCT/`,{waitUntil:'domcontentloaded'});
   await page.locator('#new-game').click();
   await page.waitForFunction(()=>window.qaDrag&&document.querySelector('.app-shell').classList.contains('is-playing')&&!document.querySelector('#battle-curtain').classList.contains('is-revealing'));
   await page.evaluate(()=>Promise.all(window.qaDrag.pieceMeshes.map(mesh=>mesh.userData.visual.userData.ready)));
   const session=mobile?await page.context().newCDPSession(page):null;
   let lastPoint;
   async function diagnostics(label){fs.writeFileSync(path.join(output,'failed-drag.json'),JSON.stringify({label,requested:lastPoint,...await page.evaluate(()=>({down:window.qaDrag.downEvent,move:window.qaDrag.moveEvent,up:window.qaDrag.upEvent,released:window.qaDrag.released,review:document.querySelector('#review-position').textContent}))},null,2));await page.screenshot({path:path.join(output,'failed-drag.png')});}
   async function point(square,piece=false){return page.evaluate(({square,piece})=>{
    const {THREE,camera,renderer,pieceMeshes,tileHeights}=window.qaDrag;
    let position;
    if(piece){const mesh=pieceMeshes.find(m=>m.userData.square===square);position=new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());}
    else position=new THREE.Vector3('abcdefgh'.indexOf(square[0])-3.5,tileHeights.get(square)+.008,8-Number(square[1])-3.5);
    position.project(camera);const rect=renderer.domElement.getBoundingClientRect();return{x:rect.x+(position.x+1)*rect.width/2,y:rect.y+(1-position.y)*rect.height/2};
   },{square,piece});}
   async function down(p){lastPoint=p;if(mobile)await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});else{await page.mouse.move(p.x,p.y);await page.mouse.down();}}
   async function move(a,b){lastPoint=b;for(let i=1;i<=12;i++){const x=a.x+(b.x-a.x)*i/12,y=a.y+(b.y-a.y)*i/12;if(mobile)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});else await page.mouse.move(x,y);}if(mobile){try{await page.waitForFunction(p=>{const m=window.qaDrag.moveEvent;return m?.type==='touch'&&Math.abs(m.x-p.x)<1&&Math.abs(m.y-p.y)<1;},b,{timeout:5000});}catch(e){await diagnostics('touchMove delivery');throw e;}}}
   async function up(){if(mobile){await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const actual=await page.evaluate(()=>window.qaDrag.upEvent);try{near(actual.x,lastPoint.x,'touchEnd X',1);near(actual.y,lastPoint.y,'touchEnd Y',1);}catch(e){await diagnostics('touchEnd coordinates');throw e;}}else await page.mouse.up();}
   async function settled(square){try{await page.waitForFunction(square=>window.qaDrag.pieceMeshes.some(m=>m.userData.square===square&&!m.userData.moveAnimation),square);}catch(error){await diagnostics('settled '+square);throw error;}}
   const canvas=page.locator('#board-3d canvas');
   if(!mobile){const p=await point('e2',true);await page.mouse.move(p.x,p.y);assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'grab');}
   // An illegal drop and a drop outside the board return to the anchor.
   for(const target of ['e5',null]){
    const a=await point('e2',true),bounds=await canvas.boundingBox(),b=target?await point(target):{x:bounds.x+5,y:bounds.y+5};
    await down(a);await move(a,b);
    assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'grabbing');
    await up();await settled('e2');
    if(!target)assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'default','outside release resets the cursor');
    assert.ok((await page.locator('#review-position').textContent()).includes('0/0'),'invalid/outside drops do not create moves');
    const pose=await page.evaluate(()=>{const m=window.qaDrag.pieceMeshes.find(m=>m.userData.square==='e2');return{position:m.position.toArray(),base:m.userData.basePosition.toArray()};});
    near(pose.position[0],pose.base[0],'invalid drop restores X');near(pose.position[2],pose.base[2],'invalid drop restores Z');
   }
   const a=await point('e2',true),b=await point('e4');await down(a);await move(a,b);
   const release=await page.evaluate(()=>{const {pieceMeshes,tileHeights}=window.qaDrag,m=pieceMeshes.find(m=>m.userData.square==='e2');return{position:m.position.toArray(),ground:tileHeights.get('e4')+.008};});
   near(release.position[1]-release.ground,.14,'drag is only 0.14 units above the destination terrace');
   assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'grabbing');
   await page.screenshot({path:path.join(output,`drag-${mobile?'touch':'mouse'}.png`)});
   await up();
   const {dropped,actualRelease}=await page.evaluate(()=>({dropped:window.qaDrag.released.find(m=>m.square==='e4'),actualRelease:window.qaDrag.releasePositions.e2}));
   assert.ok(dropped?.motion?.drop,'legal drag uses the drop animation');
   dropped.motion.from.forEach((v,i)=>near(v,actualRelease[i],'drop starts from the release point'));
   assert.equal(dropped.motion.duration,mobile?1:190,'reduced motion skips the visible fall');
   await settled('e4');
   await page.waitForFunction(()=>/2 de 2/.test(document.querySelector('#review-position').textContent));
   if(!mobile){await page.mouse.move(5,5);assert.equal(await canvas.evaluate(el=>getComputedStyle(el).cursor),'default');}
   const shadow=await page.evaluate(()=>({intensity:window.qaDrag.sun.shadow.intensity,opacity:window.qaDrag.dropShadowMaterial.opacity,color:window.qaDrag.dropShadowMaterial.color.getHexString()}));
   near(shadow.intensity,.55,'soft sun shadows');near(shadow.opacity,.25,'translucent preview shadow');assert.equal(shadow.color,'797247','warm olive preview shadow');
   await page.locator('[data-view="2d"]').click();
   const clean=await page.locator('#board-2d .square').evaluateAll(cells=>cells.every(cell=>!/radial-gradient/.test(getComputedStyle(cell).backgroundImage)&&!/radial-gradient/.test(getComputedStyle(cell,'::after').backgroundImage)));
   assert.ok(clean,'2D terrain has no decorative circular gradients');
   await page.locator('[data-square="d2"]').click();assert.equal(await page.locator('[data-square="d2"]').getAttribute('aria-selected'),'true');assert.ok(await page.locator('#board-2d .move-target').count()>0,'legal-move indicators are preserved');
   assert.deepEqual(errors,[]);await page.screenshot({path:path.join(output,`clean-2d-${mobile?'touch':'mouse'}.png`)});
   // Delayed promotion must keep the original release point for the new model.
   await page.locator('[data-view="3d"]').click();
   await page.evaluate(()=>window.qaLoadDragFen('7k/P7/8/8/8/8/8/7K w - - 0 1'));
   await page.evaluate(()=>Promise.all(window.qaDrag.pieceMeshes.map(m=>m.userData.visual.userData.ready)));
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const promotionStart=await point('a7',true),promotionEnd=await point('a8');
   const fixtureHit=await page.evaluate(p=>window.qaDrag.hit({clientX:p.x,clientY:p.y})?.object.userData,promotionStart);
   const projectionDistance=Math.hypot(promotionStart.x-promotionEnd.x,promotionStart.y-promotionEnd.y);
   console.log('Promotion fixture',mobile?'touch':'mouse',fixtureHit?.kind,fixtureHit?.square,`projected gesture ${projectionDistance.toFixed(2)}px`);
   assert.equal(fixtureHit?.square,'a7','promotion fixture pawn is visible to the camera raycast');
   await down(promotionStart);
   // A far pawn's raised center can project onto the next rank's floor. Move
   // aside first so this remains a drag rather than a sub-6px click gesture.
   if(projectionDistance<12){const waypoint={x:promotionStart.x+18,y:promotionStart.y+18};await move(promotionStart,waypoint);await move(waypoint,promotionEnd);}
   else await move(promotionStart,promotionEnd);
   await up();
   await page.locator('#promotion-dialog').waitFor({state:'visible'});
   const promotionRelease=await page.evaluate(()=>window.qaDrag.releasePositions.a7);
   await page.locator('#promotion-dialog [value="q"]').click();
   await page.waitForFunction(()=>window.qaDrag.latestMoves?.some(m=>m.square==='a8'));
   const promoted=await page.evaluate(()=>window.qaDrag.latestMoves.find(m=>m.square==='a8'));
   promoted.from.forEach((v,i)=>near(v,promotionRelease[i],'promoted model falls from the saved release point'));
   assert.equal(promoted.duration,mobile?1:190);await settled('a8');
   console.log(`OK ${mobile?'390px real touch/reduced motion':'1440px real mouse'}: hover/drag cursors, 0.14 lift, 190ms drop, invalid/outside restoration, promotion, warm shadows, clean 2D indicators`);
   await page.close();
  }
 }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
