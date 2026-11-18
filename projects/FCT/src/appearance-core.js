import catalog from '../sprites/characters/catalog.json' with { type: 'json' };
import armyPalettes from '../scripts/army-palettes.json' with { type: 'json' };

export { catalog, armyPalettes };
export const roles = [
  { id: 'p', name: 'Peón', glyph: '♙' }, { id: 'r', name: 'Torre', glyph: '♖' },
  { id: 'n', name: 'Caballo', glyph: '♘' }, { id: 'b', name: 'Alfil', glyph: '♗' },
  { id: 'q', name: 'Reina', glyph: '♕' }, { id: 'k', name: 'Rey', glyph: '♔' },
];
const femaleRoyals = ['agrias', 'teta', 'dancer', 'mime-female', 'ovelia', 'balmafula'];
const maleRoyals = ['ramza', 'delita', 'cloud', 'orlandu', 'mustadio', 'beowulf'];
const families = { p: ['squire','monk','thief'], r: ['knight','samurai','ninja'], n: ['dragoon','archer','geomancer'], b: ['white-mage','black-mage','summoner'] };
const defaults = {
  female: { p:'squire-female', r:'knight-female', n:'dragoon-female', b:'white-mage-female', q:'agrias', k:'teta' },
  male: { p:'squire-male', r:'knight-male', n:'dragoon-male', b:'white-mage-male', q:'delita', k:'ramza' },
};
export function characterGender(character) {
  const id=typeof character==='string'?character:character?.id??character?.character;
  return femaleRoyals.includes(id)||id?.endsWith('-female')?'female':'male';
}
export function characterHeight(role) { return role==='k'?1.14:role==='q'?1.03:role==='p'?.84:.92; }
export function availableCharacters(role, gender='female') {
  const armyGender=gender==='male'?'male':'female';
  const royals=armyGender==='female'?femaleRoyals:maleRoyals;
  return catalog.filter(character => !character.aiOnly && characterGender(character)===armyGender &&
    (role==='q'||role==='k'?royals.includes(character.id):families[role]?.some(family=>character.id===`${family}-${armyGender}`)));
}
export function defaultArmy(gender='female', palette=0) {
  const armyGender=gender==='male'?'male':'female';
  const color=armyPalettes.some(p=>p.id===palette)?palette:0;
  return { gender:armyGender, palette:color, ...Object.fromEntries(roles.map(({id})=>[id,{character:defaults[armyGender][id],palette:color}])) };
}
export const defaultLoadout = defaultArmy();
export function sanitizeLoadout(value) {
  const gender=value?.gender==='male'?'male':'female';
  const palette=armyPalettes.some(p=>p.id===value?.palette)?value.palette:0;
  const result=defaultArmy(gender,palette);
  for(const {id} of roles){
    const entry=value?.[id];
    const available=availableCharacters(id,gender);
    let character=available.find(c=>c.id===entry?.character);
    // Switching gender keeps the selected generic family whenever both sheets exist.
    if(!character&&entry?.character){
      const paired=entry.character.replace(/-(female|male)$/,'-'+gender);
      character=available.find(c=>c.id===paired);
    }
    if(character)result[id]={character:character.id,palette};
  }
  return result;
}
// Preferences live only for this page session; a reload starts from defaults.
let loadout = sanitizeLoadout(null);
export function getLoadout() { return structuredClone(loadout); }
export function setLoadout(value) { loadout = sanitizeLoadout(value); }
export function characterInfo(look) { return catalog.find(c => c.id === look.character); }
export function appearanceKey(look) { return `${look.character}-${look.palette}`; }
export function oppositePalette(palette) {
  const source=armyPalettes.find(p=>p.id===palette)??armyPalettes[0];
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const channels=rgb(source.swatch);
  return armyPalettes.filter(p=>p.id!==source.id).reduce((best,p)=>{
    const distance=rgb(p.swatch).reduce((sum,c,i)=>sum+(c-channels[i])**2,0);
    return !best||distance>best.distance?{id:p.id,distance}:best;
  },null).id;
}
export function contrastingAppearance(look,role) {
  const palette=oppositePalette(look.palette);
  if(role==='k')return {character:['dycedarg','gaff-gafgarion'][(look.palette+[...look.character].reduce((n,c)=>n+c.charCodeAt(0),0))%2],palette};
  if(role==='q')return {character:maleRoyals.includes(look.character)?look.character:defaults.male.q,palette};
  const paired=look.character.replace(/-female$/,'-male');
  const character=catalog.find(c=>c.id===paired&&!c.aiOnly&&characterGender(c)==='male');
  return {character:character?.id??(role?defaults.male[role]:look.character),palette};
}
export function appearanceFor(type, color, source = loadout) {
  const army=sanitizeLoadout(source);
  const look=army[type]??army.p;
  return color==='b'?contrastingAppearance(look,type):look;
}
