import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, armyPalettes, defaultLoadout, defaultArmy, sanitizeLoadout, oppositePalette, availableCharacters, characterGender, characterInfo, setLoadout, getLoadout, appearanceFor, characterHeight } from '../src/appearance-core.js';

const roles=['p','r','n','b','q','k'];

test('every character shares the same five team colors and gender-neutral display names',()=>{
  assert.equal(catalog.length,38);
  for(const character of catalog){
    assert.equal(character.variants.length,5);
    assert.deepEqual(character.variants,armyPalettes);
    assert.doesNotMatch(character.name,/\b(?:female|male)\b| · [FM]$/i);
    assert.ok(['female','male'].includes(character.gender));
  }
});

test('ordinary pieces follow formation gender; kings stay male and queens female',()=>{
  for(const gender of ['female','male']){
    assert.deepEqual(roles.map(role=>availableCharacters(role,gender).length),[3,3,3,3,6,6]);
    for(const role of roles)for(const character of availableCharacters(role,gender)){
      assert.equal(characterGender(character),role==='k'?'male':role==='q'?'female':gender);
      assert.equal(character.aiOnly,false);
    }
  }
  assert.ok(availableCharacters('p','female').some(c=>c.id==='monk-female'));
  assert.ok(availableCharacters('r','male').some(c=>c.id==='ninja-male'));
  assert.ok(availableCharacters('q','male').some(c=>c.id==='ovelia'));
  assert.ok(availableCharacters('k','female').some(c=>c.id==='cloud'));
  assert.deepEqual(availableCharacters('q','male'),availableCharacters('q','female'));
  assert.deepEqual(availableCharacters('k','male'),availableCharacters('k','female'));
  assert.equal(availableCharacters('missing').length,0);
});

test('one palette setting overrides contradictory individual piece colors',()=>{
  for(const palette of armyPalettes){
    const mixed={...defaultLoadout,palette:palette.id};
    for(const [i,role]of roles.entries())mixed[role]={...mixed[role],palette:(palette.id+i)%5};
    const normalized=sanitizeLoadout(mixed);
    assert.ok(roles.every(role=>normalized[role].palette===palette.id));
    assert.deepEqual(sanitizeLoadout(normalized),normalized);
  }
  assert.equal(sanitizeLoadout({...defaultLoadout,palette:99}).palette,0);
});

test('switching formation pairs ordinary classes and preserves royal choices',()=>{
  const female=sanitizeLoadout({...defaultLoadout,p:{character:'thief-female',palette:3},k:{character:'cloud',palette:4},q:{character:'ovelia',palette:4},palette:2});
  const male=sanitizeLoadout({...female,gender:'male'});
  assert.equal(male.p.character,'thief-male');
  assert.ok(['p','r','n','b','k'].every(role=>characterGender(characterInfo(male[role]))==='male'));
  assert.equal(male.k.character,'cloud');
  assert.equal(male.q.character,'ovelia');
  assert.equal(characterGender(characterInfo(male.q)),'female');
  assert.ok(roles.every(role=>male[role].palette===2));
  const feminine=sanitizeLoadout({...male,gender:'female'});
  assert.equal(feminine.p.character,'thief-female');
  assert.ok(['p','r','n','b','q'].every(role=>characterGender(characterInfo(feminine[role]))==='female'));
  assert.equal(feminine.k.character,'cloud');
  assert.equal(feminine.q.character,'ovelia');
  assert.equal(sanitizeLoadout({...female,k:{character:'ovelia'}}).k.character,'ramza');
  assert.equal(sanitizeLoadout({...female,q:{character:'cloud'}}).q.character,'agrias');
  assert.deepEqual(sanitizeLoadout({b:{character:'knight-male',palette:-1}}),defaultLoadout);
});

test('each side has a uniform color with male kings and female queens',()=>{
  const enemyKings=new Set();
  for(const gender of ['female','male'])for(const palette of armyPalettes){
    const army=defaultArmy(gender,palette.id);
    for(const role of roles){
      const ally=appearanceFor(role,'w',army),enemy=appearanceFor(role,'b',army);
      assert.equal(ally.palette,palette.id);
      assert.equal(enemy.palette,oppositePalette(palette.id));
      assert.notEqual(enemy.palette,ally.palette);
      assert.equal(characterGender(characterInfo(ally)),role==='k'?'male':role==='q'?'female':gender);
      assert.equal(characterGender(characterInfo(enemy)),role==='q'?'female':'male');
      if(role==='k'){
        assert.ok(['dycedarg','gaff-gafgarion'].includes(enemy.character));
        enemyKings.add(enemy.character);
      }
    }
  }
  assert.equal(enemyKings.size,2);
});

test('AI kings never appear in player choices or pass loadout validation',()=>{
  for(const gender of ['female','male'])for(const character of ['dycedarg','gaff-gafgarion']){
    for(const role of roles)assert.ok(!availableCharacters(role,gender).some(c=>c.id===character));
    const input={...defaultArmy(gender),k:{character,palette:0}};
    assert.deepEqual(sanitizeLoadout(input).k,defaultArmy(gender).k);
  }
});

test('king and queen models retain readable relative sizes',()=>{
  assert.ok(characterHeight('k')>characterHeight('q'));
  for(const role of ['p','r','n','b'])assert.ok(characterHeight('q')>characterHeight(role));
});

test('saved formation and team color last for the page and reload restores defaults',async()=>{
  setLoadout({...defaultArmy('male',3),r:{character:'ninja-male',palette:1}});
  assert.equal(getLoadout().r.character,'ninja-male');
  assert.equal(getLoadout().r.palette,3);
  assert.equal(getLoadout().gender,'male');
  const copy=getLoadout();copy.palette=0;
  assert.equal(getLoadout().palette,3);
  const fresh=await import('../src/appearance-core.js?new-page');
  assert.deepEqual(fresh.getLoadout(),defaultLoadout);
  setLoadout(defaultLoadout);
});
