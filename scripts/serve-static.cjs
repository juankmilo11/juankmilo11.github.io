const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.gif':'image/gif','.mp4':'video/mp4','.woff2':'font/woff2','.ttf':'font/ttf','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server = http.createServer((req,res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); }
  catch { res.writeHead(400).end(); return; }
  if(file!==root&&!file.startsWith(root + path.sep)){res.writeHead(403).end();return;}
  // Only serve published content; the raw PACA archive stays outside the preview.
  const relative=path.relative(root,file);
  if(relative.split(path.sep).some(part=>part.startsWith('.')) || relative.startsWith('projects'+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size;
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-cache');res.setHeader('Accept-Ranges','bytes');
  const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  if(range){
    const start=Number(range[1]),end=range[2]?Math.min(size-1,Number(range[2])):size-1;
    if(start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
  }else{res.setHeader('Content-Length',size);if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}
});
const port=Number(process.env.PORT||4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/pages/paula/`));
