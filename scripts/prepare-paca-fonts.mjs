// Preserve the site's existing public OFL fonts, served locally without Google CSS.
import {mkdir,writeFile} from 'node:fs/promises';
const dir=new URL('../pages/paula/assets/fonts/',import.meta.url);await mkdir(dir,{recursive:true});
const response=await fetch('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap',{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
if(!response.ok)throw new Error('Font CSS: '+response.status);
let css=await response.text();const urls=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
let index=0;
for(const url of urls){const result=await fetch(url);if(!result.ok)throw new Error('Font asset: '+url);const name=`paca-font-${++index}.woff2`;await writeFile(new URL(name,dir),Buffer.from(await result.arrayBuffer()));css=css.replaceAll(url,'../assets/fonts/'+name);}
for(const [family,folder]of [['BarlowCondensed','barlowcondensed'],['DMSans','dmsans']]){
 const result=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${folder}/OFL.txt`);if(!result.ok)throw new Error('OFL: '+family);const license=await result.text();if(!license.includes('SIL OPEN FONT LICENSE'))throw new Error('Unexpected license');await writeFile(new URL(family+'-OFL.txt',dir),license);
}
await writeFile(new URL('../pages/paula/css/fonts.css',import.meta.url),css);
console.log('Self-hosted existing fonts:',urls.length,'files, verified OFL licenses.');
