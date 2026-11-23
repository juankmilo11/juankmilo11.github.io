import { ShuffleQueue } from './shuffle-queue.js';
import tracks from './music-tracks.json' with { type: 'json' };
import './audio-system.css';

export function createAudioSystem() {
  const music = document.querySelector('#background-music');
  const musicButton=document.querySelector('#audio-reopen'), effectsButton=document.querySelector('#effects-open');
  try{if(window.parent!==window&&window.parent.__fctAudio){const shared=window.parent.__fctAudio;shared.attachControls(musicButton,effectsButton);return shared;}}catch{}
  const controls=new Set([{musicButton,effectsButton}]);
  const queue=new ShuffleQueue(tracks);
  const cues=Object.fromEntries(['sound1','menu1','menu2','menu3','menu4','user_piece_move','AI_piece_move','check','checkmate'].map(name=>[name,new Audio(`${import.meta.env.BASE_URL}audio/${name}.wav`)]));
  let fxLevel=.35, fxMuted=false, wantsMusic=true, pending=false, lastAttempt=0, failures=0, generation=0;
  let saved=null;try{saved=JSON.parse(sessionStorage.getItem('fct:audio-session'));}catch{}
  const byId=id=>tracks.find(t=>t.id===id);
  if(saved?.track&&byId(saved.track)){queue.history=[byId(saved.track)];queue.cursor=0;queue.bag=(saved.bag??[]).map(byId).filter(Boolean);wantsMusic=saved.wantsMusic!==false;fxMuted=saved.fxMuted===true;}
  let restoreTime=saved?.track&&byId(saved.track)&&Number.isFinite(saved.time)?Math.max(0,saved.time):null;
  function saveSession(){try{sessionStorage.setItem('fct:audio-session',JSON.stringify({track:music.dataset.track,time:music.currentTime,wantsMusic,fxMuted,bag:queue.bag.map(t=>t.id)}));}catch{}}
  music.addEventListener('loadedmetadata',()=>{if(restoreTime!==null){music.currentTime=Math.min(restoreTime,Number.isFinite(music.duration)?Math.max(0,music.duration-.1):restoreTime);restoreTime=null;attempt();}});
  music.volume=.15; music.loop=false;
  let pageActive=true,hostActive=window.parent===window;
  const active=()=>pageActive&&hostActive&&!document.hidden;
  function suspend(){music.pause();for(const cue of Object.values(cues))cue.pause();sync();}
  document.addEventListener('visibilitychange',()=>{if(active())attempt();else suspend();});
  window.addEventListener('pagehide',()=>{saveSession();pageActive=false;suspend();});
  window.addEventListener('pageshow',()=>{pageActive=true;if(active())attempt();});
  window.addEventListener('blur',()=>{setTimeout(()=>{if(document.hasFocus()&&document.activeElement?.matches('iframe[data-fct-app]'))return;pageActive=false;suspend();},0);});
  window.addEventListener('focus',()=>{pageActive=true;if(active())attempt();});
  window.addEventListener('message',event=>{if(event.source!==window.parent||event.origin!==location.origin||event.data?.type!=='fct:visibility')return;hostActive=event.data.active===true;if(active())attempt();else suspend();});
  function sync() {
   for(const entry of controls){
    const {musicButton,effectsButton}=entry;if(musicButton.ownerDocument!==document&&!musicButton.ownerDocument.defaultView?.frameElement?.isConnected){controls.delete(entry);continue;}
    musicButton.setAttribute('aria-label',wantsMusic?'Desactivar música':'Activar música');
    musicButton.setAttribute('aria-pressed',String(wantsMusic));
    musicButton.classList.toggle('is-muted',!wantsMusic);
    musicButton.dataset.state=music.paused?'paused':'playing';
    effectsButton.setAttribute('aria-pressed',String(!fxMuted));
    effectsButton.setAttribute('aria-label',fxMuted?'Activar efectos':'Desactivar efectos');
    effectsButton.classList.toggle('is-muted',fxMuted||fxLevel===0);
   }
  }
  async function attempt() {
    if(restoreTime!==null||!wantsMusic||!active()||pending||!music.paused)return;
    pending=true;lastAttempt=performance.now();
    const request=generation;
    try { await music.play();if(request===generation){if(!wantsMusic||!active())music.pause();failures=0;} }
    catch { /* Autoplay may wait for the next deliberate interaction. */ }
    finally {if(request===generation){pending=false;sync();}}
  }
  function select(track) {
    if(!track)return;
    generation++;
    music.src=`${import.meta.env.BASE_URL}assets/music/${encodeURIComponent(track.file)}`;
    music.dataset.track=track.id;
    music.load();pending=false;sync();if(wantsMusic)attempt();
  }
  function attachControls(musicButton,effectsButton){
    const entry={musicButton,effectsButton};if(![...controls].some(c=>c.musicButton===musicButton))controls.add(entry);
    musicButton.addEventListener('click',()=>{wantsMusic=!wantsMusic;if(wantsMusic)attempt();else music.pause();sync();});
    effectsButton.addEventListener('click',()=>{fxMuted=!fxMuted;sync();});
    const owner=musicButton.ownerDocument.defaultView;if(owner!==window)owner.addEventListener('pagehide',()=>controls.delete(entry),{once:true});sync();
  }
  attachControls(musicButton,effectsButton);
  music.addEventListener('play',sync);music.addEventListener('pause',sync);
  music.addEventListener('ended',()=>select(queue.next()));
  music.addEventListener('error',()=>{
    if(++failures<tracks.length)select(queue.next());
  });
  // Try immediately, then retry only while blocked. Pausing intentionally stays paused.
  const unlock=event=>{if(event?.target?.closest('.audio-dock'))return;if(wantsMusic&&music.paused)attempt();};
  document.addEventListener('pointerdown',unlock,{capture:true});
  document.addEventListener('keydown',unlock,{capture:true});
  document.addEventListener('pointermove',()=>{if(performance.now()-lastAttempt>1600)unlock();},{passive:true});
  select(queue.current??queue.next());sync();
  return window.__fctAudio={
    music,attachControls,
    playSound(name,gain=1) {
      const audio=cues[name];if(!active()||!audio||fxMuted||fxLevel===0)return;
      if(/^menu[1-4]$/.test(name))for(const [key,cue]of Object.entries(cues))if(/^menu[1-4]$/.test(key)&&cue!==audio)cue.pause();
      audio.volume=Math.min(1,fxLevel*gain);audio.currentTime=0;audio.play().catch(()=>{});
    },
  };
}
