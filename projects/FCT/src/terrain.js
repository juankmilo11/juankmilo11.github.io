// A rounded rise with irregular intermediate heights; four central summits.
export function tileElevation(row, file) {
  const ring = Math.min(row, file, 7 - row, 7 - file);
  if (ring === 0) return 0.115;
  if (ring === 3) return 0.595;
  const distance = Math.hypot(row - 3.5, file - 3.5);
  return 0.115 + 0.48 * (1 - (distance - Math.SQRT1_2) / 3.6)
    + Math.sin(row * 4.1 + file * 7.3) * 0.018;
}

export const terrainPalette = { light: 0x819d68, dark: 0x728e5a, earth: 0x7d9964 };

export function tileDetail(row,file) {
  if ((row+file)%2 === 0) return 'grass';
  return ['stones','mud','grass','grass','moss'][((row+1)*73+(file+3)*29)%5];
}

export function islandRadius(angle) {
  return 8.3 + Math.sin(angle * 3 + 0.4) * 0.36 + Math.sin(angle * 7) * 0.16;
}

export function groundHeight(x,z){
  const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
  const radius=Math.hypot(x,z),edge=smooth(6.2,8.7,radius);
  const field=-.055-edge*.9+edge*Math.sin(x*2.2+z*1.6)*.09;
  // Rounded capture banks belong to the same height field as the grass.
  const dx=Math.max(0,Math.abs(Math.abs(x)-5.15)-.65),dz=Math.max(0,Math.abs(z)-3.85);
  const bank=1-smooth(.08,.55,Math.hypot(dx,dz));
  return Math.max(field,field+(.105-field)*bank);
}

// The slope collar, outer field and cliff use identical boundary vertices.
export const shoulderAngles=Array.from({length:64},(_,i)=>{
  const edge=Math.floor(i/16),v=-4+(i%16)*.5;
  const [x,z]=edge===0?[-4,v]:edge===1?[v,4]:edge===2?[4,-v]:[-v,-4];
  return Math.atan2(z,x);
}).sort((a,b)=>a-b);
