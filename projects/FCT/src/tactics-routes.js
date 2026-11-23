import {tileElevation} from './terrain.js';

const valid=s=>typeof s==='string'&&/^[a-h][1-8]$/.test(s);
const center=s=>({x:s.charCodeAt(0)-100.5,z:4.5-Number(s[1])});
// Clip a flat arrow to each tile's landing surface. Every patch has one height:
// no billboard, raised shaft or sloping bridge between different tile levels.
function clip(polygon,axis,edge,sign){
 const out=[];if(!polygon.length)return out;
 for(let i=0;i<polygon.length;i++){
  const a=polygon[i],b=polygon[(i+1)%polygon.length],insideA=(a[axis]-edge)*sign>=-1e-9,insideB=(b[axis]-edge)*sign>=-1e-9;
  if(insideA)out.push(a);
  if(insideA!==insideB){const t=(edge-a[axis])/(b[axis]-a[axis]);out.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});}
 }return out;
}
export function groundArrowPatches(from,to){
 if(!valid(from)||!valid(to)||from===to)return [];
 const a=center(from),b=center(to),length=Math.hypot(b.x-a.x,b.z-a.z),dx=(b.x-a.x)/length,dz=(b.z-a.z)/length;
 const point=(along,across)=>({x:a.x+dx*along-dz*across,z:a.z+dz*along+dx*across});
 const neck=length-Math.min(.38,length*.4),shape=[point(.12,-.055),point(neck,-.055),point(neck,-.23),point(length,0),point(neck,.23),point(neck,.055),point(.12,.055)],patches=[];
 for(let row=0;row<8;row++)for(let file=0;file<8;file++){
  const x=file-3.5,z=row-3.5;let polygon=shape;
  for(const [axis,edge,sign]of [['x',x-.462,1],['x',x+.462,-1],['z',z-.462,1],['z',z+.462,-1]])polygon=clip(polygon,axis,edge,sign);
  if(polygon.length>=3)patches.push({square:String.fromCharCode(97+file)+(8-row),height:tileElevation(row,file)+.024,polygon});
 }return patches;
}
