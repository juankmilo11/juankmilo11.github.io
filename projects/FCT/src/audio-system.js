import { ShuffleQueue } from './shuffle-queue.js';
import tracks from './music-tracks.json' with { type: 'json' };
import './audio-system.css';

export function createAudioSystem() {
  const music = document.querySelector('#background-music');
  const musicButton=document.querySelector('#audio-reopen'), effectsButton=document.querySelector('#effects-open');
  const musicPanel=document.querySelector('#audio-control'), effectsPanel=document.querySelector('#effects-control');
  const playButton=document.querySelector('#audio-toggle'), previousButton=document.querySelector('#music-previous');
  const musicVolume=document.querySelector('#music-volume'), effectsVolume=document.querySelector('#effects-volume');
  const musicStatus=document.querySelector('#music-status'), effectsToggle=document.querySelector('#effects-toggle');
  const queue=new ShuffleQueue(tracks);
  const cues=Object.fromEntries(['sound1','menu1','menu2','menu3','menu4','user_piece_move','AI_piece_move','check','checkmate'].map(name=>[name,new Audio(`${import.meta.env.BASE_URL}audio/${name}.wav`)]));
  let fxLevel=.35, fxMuted=false, wantsMusic=true, pending=false, lastAttempt=0, failures=0, generation=0;
  music.volume=.15; music.loop=false;
  function sync() {
    playButton.textContent=music.paused?'▶':'Ⅱ';
    playButton.setAttribute('aria-label',music.paused?'Reproducir música':'Pausar música');
    musicButton.setAttribute('aria-label',`Música · ${Math.round(music.volume*100)} %`);
    musicButton.dataset.state=music.paused?'paused':'playing';
    previousButton.disabled=!queue.canPrevious;
    effectsToggle.setAttribute('aria-pressed',String(fxMuted));
    effectsToggle.textContent=fxMuted?'Activar efectos':'Silenciar efectos';
    effectsButton.setAttribute('aria-label',`Efectos de sonido · ${fxMuted?'silenciados':`${Math.round(fxLevel*100)} %`}`);
    effectsButton.classList.toggle('is-muted',fxMuted||fxLevel===0);
  }
  async function attempt() {
    if(!wantsMusic||pending||!music.paused)return;
    pending=true;lastAttempt=performance.now();
    const request=generation;
    try { await music.play();if(request===generation){musicStatus.textContent='';failures=0;} }
    catch(error) { if(request===generation&&error.name!=='AbortError')musicStatus.textContent='Pulsa reproducir para escuchar.'; }
    finally {if(request===generation){pending=false;sync();}}
  }
  function select(track) {
    if(!track)return;
    generation++;
    music.src=`${import.meta.env.BASE_URL}assets/music/${encodeURIComponent(track.file)}`;
    music.dataset.track=track.id;
    music.load();pending=false;sync();if(wantsMusic)attempt();
  }
  function panel(which) {
    const opening=which.hidden;
    musicPanel.hidden=true;effectsPanel.hidden=true;
    if(opening)which.hidden=false;
    musicButton.setAttribute('aria-expanded',String(!musicPanel.hidden));
    effectsButton.setAttribute('aria-expanded',String(!effectsPanel.hidden));
  }
  musicButton.addEventListener('click',()=>panel(musicPanel));
  effectsButton.addEventListener('click',()=>panel(effectsPanel));
  document.querySelector('#audio-hide').addEventListener('click',()=>panel(musicPanel));
  document.querySelector('#effects-hide').addEventListener('click',()=>panel(effectsPanel));
  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('.audio-dock')){musicPanel.hidden=effectsPanel.hidden=true;musicButton.setAttribute('aria-expanded','false');effectsButton.setAttribute('aria-expanded','false');}
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){
    const trigger=!musicPanel.hidden?musicButton:!effectsPanel.hidden?effectsButton:null;
    musicPanel.hidden=effectsPanel.hidden=true;musicButton.setAttribute('aria-expanded','false');effectsButton.setAttribute('aria-expanded','false');trigger?.focus();
  }});
  playButton.addEventListener('click',()=>{wantsMusic=music.paused;if(wantsMusic)attempt();else music.pause();sync();});
  document.querySelector('#music-next').addEventListener('click',()=>select(queue.next()));
  previousButton.addEventListener('click',()=>select(queue.previous()));
  musicVolume.addEventListener('input',()=>{music.volume=Number(musicVolume.value)/100;document.querySelector('#music-value').value=`${musicVolume.value} %`;sync();});
  effectsVolume.addEventListener('input',()=>{fxLevel=Number(effectsVolume.value)/100;document.querySelector('#effects-value').value=`${effectsVolume.value} %`;sync();});
  effectsToggle.addEventListener('click',()=>{fxMuted=!fxMuted;sync();});
  music.addEventListener('play',sync);music.addEventListener('pause',sync);
  music.addEventListener('ended',()=>select(queue.next()));
  music.addEventListener('error',()=>{
    if(++failures<tracks.length){musicStatus.textContent='Cambiando de tema…';select(queue.next());}
    else musicStatus.textContent='No se pudo cargar la música.';
  });
  // Try immediately, then retry only while blocked. Pausing intentionally stays paused.
  const unlock=event=>{if(event?.target?.closest('.audio-dock'))return;if(wantsMusic&&music.paused)attempt();};
  document.addEventListener('pointerdown',unlock,{capture:true});
  document.addEventListener('keydown',unlock,{capture:true});
  document.addEventListener('pointermove',()=>{if(performance.now()-lastAttempt>1600)unlock();},{passive:true});
  select(queue.next());sync();
  return {
    playSound(name,gain=1) {
      const audio=cues[name];if(!audio||fxMuted||fxLevel===0)return;
      if(/^menu[1-4]$/.test(name))for(const [key,cue]of Object.entries(cues))if(/^menu[1-4]$/.test(key)&&cue!==audio)cue.pause();
      audio.volume=Math.min(1,fxLevel*gain);audio.currentTime=0;audio.play().catch(()=>{});
    },
  };
}
