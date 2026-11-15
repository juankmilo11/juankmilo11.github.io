const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('PACA defaults to day, toggles both ways and preserves contrast when switching language',()=>{
  const events={},attrs={},messages=[],root={dataset:{}},button={setAttribute:(key,value)=>attrs[key]=value,replaceChildren:icon=>button.icon=icon,addEventListener:(name,fn)=>events[name]=fn};
  let spanish=false;
  const context={document:{documentElement:root,querySelector:()=>button,addEventListener:(name,fn)=>events[name]=fn},location:{origin:'http://localhost'},window:{parent:{postMessage:(data,origin)=>messages.push({data,origin})},PacaIcons:{create:name=>name},PacaI18n:{t:key=>`${spanish?'es':'en'}:${key}`}}};
  vm.runInNewContext(fs.readFileSync('pages/paula/js/theme.js','utf8'),context);
  assert.equal(root.dataset.theme,'light');assert.equal(attrs['aria-pressed'],'false');assert.equal(button.icon,'moon');
  events.click();assert.equal(root.dataset.theme,'dark');assert.equal(button.icon,'sun');
  spanish=true;events['paca:language']();assert.equal(root.dataset.theme,'dark');assert.equal(attrs['aria-label'],'es:themeDay');
  assert.equal(messages.at(-1).data.theme,'dark');assert.equal(messages.at(-1).origin,'http://localhost');
  events.click();assert.equal(root.dataset.theme,'light');assert.equal(button.icon,'moon');
});
