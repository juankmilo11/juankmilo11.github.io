const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../../shared/api.js'),'utf8');

function client(responseType){
  const timers=new Map();let timerId=0,bodyStarted,transportSignal;
  const started=new Promise(resolve=>bodyStarted=resolve);
  const window={ProjectAPIConfig:{baseURL:'https://isolated-api.invalid'}};
  vm.runInNewContext(source,{window,AbortController,Headers,FormData,DOMException,
    setTimeout:callback=>{timers.set(++timerId,callback);return timerId;},
    clearTimeout:id=>timers.delete(id),
    fetch:async(_url,{signal})=>{
      transportSignal=signal;
      const read=()=>new Promise((resolve,reject)=>{
        signal.addEventListener('abort',()=>reject(new DOMException('Response body interrupted','AbortError')),{once:true});
        bodyStarted();
      });
      return {ok:true,status:200,[responseType]:read};
    }
  });
  return {request:window.ProjectAPI.request,started,timers,signal:()=>transportSignal};
}

for(const type of ['json','blob']){
  test(`caller cancellation remains active while reading a ${type} response body`,async()=>{
    const api=client(type),cancel=new AbortController();
    const pending=api.request('/api/fixture',{responseType:type,signal:cancel.signal});
    await api.started;
    assert.equal(api.timers.size,1,'Response headers must not end the timeout');
    cancel.abort();
    await assert.rejects(pending,error=>error.name==='AbortError');
    assert.equal(api.signal().aborted,true);assert.equal(api.timers.size,0);
  });
}

test('the timeout can interrupt a stalled response body after its headers arrive',async()=>{
  const api=client('json'),pending=api.request('/api/fixture');
  await api.started;
  assert.equal(api.timers.size,1);
  [...api.timers.values()][0]();
  await assert.rejects(pending,error=>error.name==='AbortError');
  assert.equal(api.timers.size,0);
});
