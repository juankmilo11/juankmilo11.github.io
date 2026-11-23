export function captureRackPose(color,index){const side=color==='w'?1:-1;return {x:side*(4.66+Math.floor(index/8)*.98),y:.12,z:(3.5-index%8)*1.08,yaw:-side*Math.PI/2};}
export function orderedCaptures(units,color){return units.filter(u=>u.captured&&(!color||u.color===color)).sort((a,b)=>(a.captureOrder??Infinity)-(b.captureOrder??Infinity)||a.id.localeCompare(b.id));}
