// Render the real sky module in Edge, including a GPU depth/occlusion regression.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
const project = path.resolve(__dirname,'../projects/FCT');
const output = process.env.FCT_QA_OUTPUT || path.join(require('node:os').tmpdir(),'fct-cosmos-qa');
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const { createServer } = await import(pathToFileURL(require.resolve('vite',{paths:[project]})).href);
  const server=await createServer({root:project,logLevel:'warn',server:{host:'127.0.0.1',port:0}});
  let browser;
  try {
    await server.listen();
    browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
    const page=await browser.newPage({viewport:{width:960,height:640}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/__sky-qa',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><style>body{margin:0}canvas{display:block}</style>'}));
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FCT/__sky-qa`);
    await page.evaluate(async()=>{
      const THREE=await import('/FCT/node_modules/three/build/three.module.js');
      const { createCosmos }=await import('/FCT/src/cosmos.js');
      const scene=new THREE.Scene();scene.background=new THREE.Color(0xb98255);
      scene.add(new THREE.HemisphereLight(0xe0e9d2,0x394339,2.1));
      const sun=new THREE.DirectionalLight(0xffefd9,3);sun.position.set(-5,11,6);scene.add(sun);
      const fill=new THREE.DirectionalLight(0x88a7ba,1.35);fill.position.set(8,5,-7);scene.add(fill);
      const cosmos=createCosmos(scene,false),sky=scene.getObjectByName('cosmos');
      const camera=new THREE.PerspectiveCamera(18,1.5,.1,100);
      const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
      renderer.setSize(960,640);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
      document.body.append(renderer.domElement);
      cosmos.update(0,camera);
      window.qaSky={THREE,scene,sky,camera,renderer,cosmos,createCosmos};
    });
    await page.waitForFunction(()=>window.qaSky.scene.getObjectByName('earth').material.map.image?.width===1024);
    const result=await page.evaluate(()=>{
      const {THREE,scene,sky,camera,renderer,cosmos,createCosmos}=window.qaSky;
      const moon=scene.getObjectByName('ringed-planet'),rings=scene.getObjectByName('planet-rings');
      const visibility=sky.children.map(child=>child.visible);
      sky.children.forEach(child=>child.visible=child===moon||child===rings);
      camera.lookAt(moon.position);camera.aspect=1;camera.updateProjectionMatrix();
      const size=256,target=new THREE.WebGLRenderTarget(size,size);
      function pixels(withRings){
        rings.visible=withRings;renderer.setRenderTarget(target);renderer.render(scene,camera);
        const pixels=new Uint8Array(size*size*4);renderer.readRenderTargetPixels(target,0,0,size,size,pixels);return pixels;
      }
      const baseline=pixels(false),ringed=pixels(true),ray=new THREE.Raycaster();
      let behind=0,front=0,badBehind=0,visibleFront=0;
      for(let y=2;y<size-2;y+=2)for(let x=2;x<size-2;x+=2){
        ray.setFromCamera(new THREE.Vector2((x+.5)/size*2-1,1-(y+.5)/size*2),camera);
        const hits=ray.intersectObjects([moon,rings],false);
        if(hits.length<2||hits[0].object===hits[1].object)continue;
        const index=((size-1-y)*size+x)*4;
        const change=Math.max(...[0,1,2].map(c=>Math.abs(baseline[index+c]-ringed[index+c])));
        if(hits[0].object===moon){behind++;if(change>2)badBehind++;}
        else {front++;if(change>3)visibleFront++;}
      }
      renderer.setRenderTarget(null);target.dispose();
      sky.children.forEach((child,i)=>child.visible=visibility[i]);
      camera.aspect=1.5;camera.updateProjectionMatrix();
      const galaxy=scene.getObjectByName('spiral-galaxy');cosmos.update(0,camera);
      const angle0=galaxy.material.map.rotation;cosmos.update(60,camera);
      const angle60=galaxy.material.map.rotation;
      const quietScene=new THREE.Scene(),quiet=createCosmos(quietScene,true);
      quiet.update(0,camera);quiet.update(60,camera);
      const staticAngle=quietScene.getObjectByName('spiral-galaxy').material.map.rotation;
      return {behind,front,badBehind,visibleFront,angle0,angle60,staticAngle};
    });
    assert.ok(result.behind>20&&result.front>20,'both halves cross the globe in projection');
    assert.equal(result.badBehind,0,'the globe must occlude every sampled point of the back ring');
    assert.ok(result.visibleFront>result.front*.9,'the front half of the ring remains visible');
    assert.ok(Math.abs(result.angle60-result.angle0-.72)<.001,'spiral rotates slowly inside the fixed ellipse');
    assert.equal(result.staticAngle,0,'reduced motion keeps the galaxy still');
    console.log('OK: GPU ring occlusion, visible front ring, slow spiral rotation and reduced motion',result);
    for(const [name,filename] of [['ringed-planet','rings'],['earth','earth'],['red-planet','red-planet'],['spiral-galaxy','galaxy']]){
      await page.evaluate(name=>{
        const {scene,camera,renderer,cosmos}=window.qaSky;
        cosmos.update(0,camera);camera.lookAt(scene.getObjectByName(name).position);renderer.render(scene,camera);
      },name);
      await page.screenshot({path:path.join(output,`${filename}.png`)});
    }
    await page.evaluate(()=>{const {scene,camera,renderer,cosmos}=window.qaSky;cosmos.update(60,camera);renderer.render(scene,camera);});
    await page.screenshot({path:path.join(output,'galaxy-after-60s.png')});
    assert.deepEqual(errors,[]);
    console.log(`Sky screenshots: ${output}`);
  } finally {if(browser)await browser.close();await server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
