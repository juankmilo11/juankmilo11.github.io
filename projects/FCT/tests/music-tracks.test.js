import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import tracks from '../src/music-tracks.json' with { type: 'json' };
test('the playlist includes every provided MP3 and each source exists',()=>{
  const directory=new URL('../public/assets/music/',import.meta.url);
  assert.equal(new Set(tracks.map(track=>track.id)).size,tracks.length);
  assert.deepEqual(tracks.map(track=>track.file).sort(),readdirSync(directory).filter(file=>file.endsWith('.mp3')).sort());
  for(const track of tracks){assert.ok(track.title);assert.ok(existsSync(new URL(encodeURIComponent(track.file),directory)));}
});
