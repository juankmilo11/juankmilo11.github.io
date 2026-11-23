const shellUrl=new URL(location.href);
// Keep the current document's audio alive while switching isolated game views.
export function navigateApp(destination){
 const url=new URL(destination,location.href);if(url.origin!==location.origin||!url.pathname.startsWith(import.meta.env.BASE_URL))return;
 if(window.parent!==window){try{if(window.parent.__fctNavigate){window.parent.__fctNavigate(url.href);return;}}catch{}}
 window.__fctNavigate??=target=>{
  const next=new URL(target,location.href),home=shellUrl;if(next.origin!==home.origin||!next.pathname.startsWith(import.meta.env.BASE_URL))return;
  let frame=document.querySelector('iframe[data-fct-app]');
  if(next.pathname===home.pathname||next.pathname===home.pathname.replace(/index\.html$/,'')){
   history.replaceState(null,'',home.href);frame?.remove();document.body.classList.remove('fct-hosting','is-opening-tactics');document.querySelector('#battle-curtain')?.classList.remove('is-covering','is-revealing');window.dispatchEvent(new Event('fct:app-return'));return;
  }
  if(!frame){frame=document.createElement('iframe');frame.dataset.fctApp='';frame.title='Fantasy Chess Tactics';frame.allow='autoplay; fullscreen';frame.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;border:0;z-index:3000;background:#10192e';document.body.append(frame);}
  document.body.classList.add('fct-hosting');history.replaceState(null,'',next.href);frame.src=next.href;
 };
 window.__fctNavigate(url.href);
}
