import test from 'node:test';
import assert from 'node:assert/strict';
import { sculptCharacter } from '../src/character-volume.js';

function projection(color,width) {
  const data = new Uint8ClampedArray(32*40*4);
  for (let y = 5; y < 39; y++) for (let x=16-width; x<16+width; x++) data.set([...color,255],(y*32+x)*4);
  return {data,width:32,height:40};
}
test('three projections produce a solid body with distinct front, back and side colors', () => {
  const result = sculptCharacter(projection([230,20,20],8),projection([20,20,230],8),projection([20,230,20],5));
  assert.ok(result.voxelCount > 1000);
  assert.equal(result.parts.length,6);
  const colors = new Set();
  let minZ=Infinity,maxZ=-Infinity;
  for (const part of result.parts) {
    const p=part.geometry.attributes.position,n=part.geometry.attributes.normal,c=part.geometry.attributes.color;
    for(let i=0;i<p.count;i++) {
      minZ=Math.min(minZ,p.getZ(i)+part.pivot[2]);maxZ=Math.max(maxZ,p.getZ(i)+part.pivot[2]);
      assert.ok(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));
      assert.ok(Math.hypot(n.getX(i),n.getY(i),n.getZ(i))>0.99);
      colors.add([c.getX(i),c.getY(i),c.getZ(i)].map(v=>v.toFixed(3)).join(','));
    }
    part.geometry.dispose();
  }
  assert.ok(maxZ-minZ > 0.2,'the figure has actual body depth');
  assert.equal(colors.size,3,'back and profile retain their own colors');
});

test('front facial colors never leak onto rear head surfaces',()=>{
  const result=sculptCharacter(projection([230,20,20],8),projection([20,20,230],8),projection([20,230,20],5));
  const head=result.parts.find(part=>part.name==='head');
  const p=head.geometry.attributes.position,c=head.geometry.attributes.color;
  let checked=0;
  for(let i=0;i<p.count;i++)if(p.getZ(i)+head.pivot[2]<-0.04){
    assert.ok(c.getZ(i)>c.getX(i),'rear head must use back colors, never a frontal eye/face');checked++;
  }
  assert.ok(checked>20);
  result.parts.forEach(part=>part.geometry.dispose());
});
test('a protruding hand in the side sprite cannot extrude a long facial snout',()=>{
  const side=projection([20,230,20],6);
  for(let y=9;y<16;y++)for(let x=0;x<32;x++)side.data.set([20,230,20,255],(y*32+x)*4);
  const result=sculptCharacter(projection([230,20,20],8),projection([20,20,230],8),side);
  const head=result.parts.find(part=>part.name==='head');
  const p=head.geometry.attributes.position;
  for(let i=0;i<p.count;i++)assert.ok(Math.abs(p.getZ(i)+head.pivot[2])<.16,'skull depth must remain anatomically bounded');
  result.parts.forEach(part=>part.geometry.dispose());
});
