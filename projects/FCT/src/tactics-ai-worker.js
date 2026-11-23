import { planAI } from './tactics-ai.js';

self.onmessage=({data})=>{
  try{self.postMessage({id:data.id,orders:planAI(data.state,data.side,{seed:crypto.getRandomValues(new Uint32Array(1))[0]})});}
  catch(error){self.postMessage({id:data.id,error:String(error.message??error)});}
};
