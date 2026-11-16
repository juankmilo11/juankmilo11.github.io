import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
const estimates=await readFile('worker/initial-estimates.json','utf8');
const source = (await readFile('worker/index.js', 'utf8')).replace(/import INITIAL_ESTIMATES[^;]+;/, 'const INITIAL_ESTIMATES = '+estimates.trim()+';');
await writeFile('dist/server/index.js', source);
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
console.log('Built Cloudflare Worker; D1 migrations are packaged from drizzle/.');
