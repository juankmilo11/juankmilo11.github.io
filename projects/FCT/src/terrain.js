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
