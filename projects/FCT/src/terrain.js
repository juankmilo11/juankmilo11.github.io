// Four concentric terraces: the rim stays low and d4/e4/d5/e5 form the summit.
export function tileElevation(row, file) {
  return 0.115 + Math.min(row, file, 7 - row, 7 - file) * 0.16;
}

export const terrainPalette = { light: 0xc5aa82, dark: 0x8e815e, earth: 0xaa9876 };
