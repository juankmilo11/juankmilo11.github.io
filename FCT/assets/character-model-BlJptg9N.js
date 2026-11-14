import{$ as e,A as t,B as n,C as r,D as i,E as a,F as o,G as s,H as c,I as l,J as u,K as d,L as f,M as p,N as m,O as h,P as g,Q as _,R as v,S as y,T as b,U as x,V as S,W as C,X as w,Y as T,Z as E,_ as D,_t as O,a as k,at as A,b as j,c as M,ct as N,d as ee,dt as P,et as F,f as te,ft as ne,g as re,gt as ie,h as I,ht as ae,i as oe,it as L,j as R,k as se,l as ce,lt as le,m as ue,mt as de,nt as fe,o as pe,ot as me,p as he,pt as ge,q as _e,r as ve,rt as ye,s as z,st as be,tt as xe,u as Se,ut as B,v as Ce,vt as V,w as H,x as we,y as Te,yt as Ee,z as De}from"./index-CsJszymu.js";var Oe={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ke={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ae=1e3,je=1001,Me=1002,Ne=1003,Pe=1004,Fe=1005,Ie=1006,Le=1007,Re=1008,ze=1009,Be=1010,Ve=1011,He=1012,Ue=1013,We=1014,Ge=1015,Ke=1016,qe=1017,Je=1018,Ye=1020,Xe=35902,Ze=35899,Qe=1021,$e=1022,et=1023,tt=1026,nt=1027,rt=1028,it=1029,at=1030,ot=1031,st=1033,ct=33776,lt=33777,ut=33778,dt=33779,ft=35840,pt=35841,mt=35842,ht=35843,gt=36196,_t=37492,vt=37496,yt=37488,bt=37489,xt=37490,St=37491,Ct=37808,wt=37809,Tt=37810,Et=37811,Dt=37812,Ot=37813,kt=37814,At=37815,jt=37816,Mt=37817,Nt=37818,Pt=37819,Ft=37820,It=37821,Lt=36492,Rt=36494,zt=36495,Bt=36283,Vt=36284,Ht=36285,Ut=36286,Wt=2300,Gt=2301,Kt=2302,qt=2303,Jt=2400,Yt=2401,Xt=2402,Zt=3200,Qt=`srgb`,$t=`srgb-linear`,en=`linear`,tn=`srgb`,nn=7680,rn=35044,an=2e3;function on(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function sn(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function cn(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function ln(){let e=cn(`canvas`);return e.style.display=`block`,e}var un={};function dn(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function fn(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function U(...e){e=fn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function W(...e){e=fn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function pn(...e){let t=e.join(` `);t in un||(un[t]=!0,U(...e))}function mn(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var hn={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},gn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},_n=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),vn=1234567,yn=Math.PI/180,bn=180/Math.PI;function xn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(_n[e&255]+_n[e>>8&255]+_n[e>>16&255]+_n[e>>24&255]+`-`+_n[t&255]+_n[t>>8&255]+`-`+_n[t>>16&15|64]+_n[t>>24&255]+`-`+_n[n&63|128]+_n[n>>8&255]+`-`+_n[n>>16&255]+_n[n>>24&255]+_n[r&255]+_n[r>>8&255]+_n[r>>16&255]+_n[r>>24&255]).toLowerCase()}function G(e,t,n){return Math.max(t,Math.min(n,e))}function Sn(e,t){return(e%t+t)%t}function Cn(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function wn(e,t,n){return e===t?0:(n-e)/(t-e)}function Tn(e,t,n){return(1-n)*e+n*t}function En(e,t,n,r){return Tn(e,t,1-Math.exp(-n*r))}function Dn(e,t=1){return t-Math.abs(Sn(e,t*2)-t)}function On(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function kn(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function An(e,t){return e+Math.floor(Math.random()*(t-e+1))}function jn(e,t){return e+Math.random()*(t-e)}function Mn(e){return e*(.5-Math.random())}function Nn(e){e!==void 0&&(vn=e);let t=vn+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pn(e){return e*yn}function Fn(e){return e*bn}function In(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ln(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Rn(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function zn(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:U(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Bn(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Vn(e,t){if(t.constructor===Float32Array)return e;let n=Bn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function Hn(e,t){if(t.constructor===Float32Array)return e;let n=Bn(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var Un={DEG2RAD:yn,RAD2DEG:bn,generateUUID:xn,clamp:G,euclideanModulo:Sn,mapLinear:Cn,inverseLerp:wn,lerp:Tn,damp:En,pingpong:Dn,smoothstep:On,smootherstep:kn,randInt:An,randFloat:jn,randFloatSpread:Mn,seededRandom:Nn,degToRad:Pn,radToDeg:Fn,isPowerOfTwo:In,ceilPowerOfTwo:Ln,floorPowerOfTwo:Rn,setQuaternionFromProperEuler:zn,normalize:Hn,denormalize:Vn},K=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Wn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:U(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(G(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Kn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Kn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gn.copy(this).projectOnVector(e),this.sub(Gn)}reflect(e){return this.sub(Gn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Gn=new q,Kn=new Wn,J=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return pn(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(qn.makeScale(e,t)),this}rotate(e){return pn(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(qn.makeRotation(-e)),this}translate(e,t){return pn(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(qn.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},qn=new J,Jn=new J().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yn=new J().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xn(){let e={enabled:!0,workingColorSpace:$t,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Zn(e.r),e.g=Zn(e.g),e.b=Zn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Qn(e.r),e.g=Qn(e.g),e.b=Qn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?en:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[$t]:{primaries:t,whitePoint:r,transfer:en,toXYZ:Jn,fromXYZ:Yn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Qt},outputColorSpaceConfig:{drawingBufferColorSpace:Qt}},[Qt]:{primaries:t,whitePoint:r,transfer:tn,toXYZ:Jn,fromXYZ:Yn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Qt}}}),e}var Y=Xn();function Zn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Qn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var $n,er=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{$n===void 0&&($n=cn(`canvas`)),$n.width=e.width,$n.height=e.height;let t=$n.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=$n}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=cn(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Zn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Zn(t[e]/255)*255):t[e]=Zn(t[e]);return{data:t,width:e.width,height:e.height}}return U(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},tr=0,nr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:tr++}),this.uuid=xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(rr(r[t].image)):e.push(rr(r[t]))}else e=rr(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function rr(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?er.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(U(`Texture: Unable to serialize Texture.`),{})}var ir=0,ar=new q,or=class e extends gn{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=je,i=je,a=Ie,o=Re,s=et,c=ze,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ir++}),this.uuid=xn(),this.name=``,this.source=new nr(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new J,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ar).x}get height(){return this.source.getSize(ar).y}get depth(){return this.source.getSize(ar).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){U(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ae:e.x-=Math.floor(e.x);break;case je:e.x=e.x<0?0:1;break;case Me:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Ae:e.y-=Math.floor(e.y);break;case je:e.y=e.y<0?0:1;break;case Me:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};or.DEFAULT_IMAGE=null,or.DEFAULT_MAPPING=300,or.DEFAULT_ANISOTROPY=1;var sr=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this.w=G(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this.w=G(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cr=class extends gn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ie,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new sr(0,0,e,t),this.scissorTest=!1,this.viewport=new sr(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new or({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ie,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new nr(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},lr=class extends cr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ur=class extends or{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=je,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},dr=class extends or{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=je,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},fr=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/pr.setFromMatrixColumn(e,0).length(),i=1/pr.setFromMatrixColumn(e,1).length(),a=1/pr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hr,e,gr)}lookAt(e,t,n){let r=this.elements;return yr.subVectors(e,t),yr.lengthSq()===0&&(yr.z=1),yr.normalize(),_r.crossVectors(n,yr),_r.lengthSq()===0&&(Math.abs(n.z)===1?yr.x+=1e-4:yr.z+=1e-4,yr.normalize(),_r.crossVectors(n,yr)),_r.normalize(),vr.crossVectors(yr,_r),r[0]=_r.x,r[4]=vr.x,r[8]=yr.x,r[1]=_r.y,r[5]=vr.y,r[9]=yr.y,r[2]=_r.z,r[6]=vr.z,r[10]=yr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],ee=r[7],P=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*ee,i[8]=a*C+o*D+s*j+c*P,i[12]=a*w+o*O+s*M+c*F,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*ee,i[9]=l*C+u*D+d*j+f*P,i[13]=l*w+u*O+d*M+f*F,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*ee,i[10]=p*C+m*D+h*j+g*P,i[14]=p*w+m*O+h*M+g*F,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*ee,i[11]=_*C+v*D+y*j+b*P,i[15]=_*w+v*O+y*M+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=pr.set(r[0],r[1],r[2]).length(),o=pr.set(r[4],r[5],r[6]).length(),s=pr.set(r[8],r[9],r[10]).length();i<0&&(a=-a),mr.copy(this);let c=1/a,l=1/o,u=1/s;return mr.elements[0]*=c,mr.elements[1]*=c,mr.elements[2]*=c,mr.elements[4]*=l,mr.elements[5]*=l,mr.elements[6]*=l,mr.elements[8]*=u,mr.elements[9]*=u,mr.elements[10]*=u,t.setFromRotationMatrix(mr),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=an,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=an,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},pr=new q,mr=new fr,hr=new q(0,0,0),gr=new q(1,1,1),_r=new q,vr=new q,yr=new q,br=new fr,xr=new Wn,Sr=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(G(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-G(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(G(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-G(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(G(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-G(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:U(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return br.makeRotationFromQuaternion(e),this.setFromRotationMatrix(br,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xr.setFromEuler(this),this.setFromQuaternion(xr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sr.DEFAULT_ORDER=`XYZ`;var Cr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},wr=0,Tr=new q,Er=new Wn,Dr=new fr,Or=new q,kr=new q,Ar=new q,jr=new Wn,Mr=new q(1,0,0),Nr=new q(0,1,0),Pr=new q(0,0,1),Fr={type:`added`},Ir={type:`removed`},Lr={type:`childadded`,child:null},Rr={type:`childremoved`,child:null},zr=class e extends gn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wr++}),this.uuid=xn(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new q,n=new Sr,r=new Wn,i=new q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fr},normalMatrix:{value:new J}}),this.matrix=new fr,this.matrixWorld=new fr,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Er.setFromAxisAngle(e,t),this.quaternion.multiply(Er),this}rotateOnWorldAxis(e,t){return Er.setFromAxisAngle(e,t),this.quaternion.premultiply(Er),this}rotateX(e){return this.rotateOnAxis(Mr,e)}rotateY(e){return this.rotateOnAxis(Nr,e)}rotateZ(e){return this.rotateOnAxis(Pr,e)}translateOnAxis(e,t){return Tr.copy(e).applyQuaternion(this.quaternion),this.position.add(Tr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mr,e)}translateY(e){return this.translateOnAxis(Nr,e)}translateZ(e){return this.translateOnAxis(Pr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dr.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Or.copy(e):Or.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),kr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dr.lookAt(kr,Or,this.up):Dr.lookAt(Or,kr,this.up),this.quaternion.setFromRotationMatrix(Dr),r&&(Dr.extractRotation(r.matrixWorld),Er.setFromRotationMatrix(Dr),this.quaternion.premultiply(Er.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(W(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fr),Lr.child=e,this.dispatchEvent(Lr),Lr.child=null):W(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ir),Rr.child=e,this.dispatchEvent(Rr),Rr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fr),Lr.child=e,this.dispatchEvent(Lr),Lr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,e,Ar),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kr,jr,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};zr.DEFAULT_UP=new q(0,1,0),zr.DEFAULT_MATRIX_AUTO_UPDATE=!0,zr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Br=class extends zr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Vr={type:`move`},Hr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Br,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Br,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Br,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vr)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Br;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ur={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wr={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function Kr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var X=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Y.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Y.workingColorSpace){return this.r=e,this.g=t,this.b=n,Y.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Y.workingColorSpace){if(e=Sn(e,1),t=G(t,0,1),n=G(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Kr(i,r,e+1/3),this.g=Kr(i,r,e),this.b=Kr(i,r,e-1/3)}return Y.colorSpaceToWorking(this,r),this}setStyle(e,t=Qt){function n(t){t!==void 0&&parseFloat(t)<1&&U(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:U(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);U(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qt){let n=Ur[e.toLowerCase()];return n===void 0?U(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}copyLinearToSRGB(e){return this.r=Qn(e.r),this.g=Qn(e.g),this.b=Qn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qt){return Y.workingToColorSpace(qr.copy(this),e),Math.round(G(qr.r*255,0,255))*65536+Math.round(G(qr.g*255,0,255))*256+Math.round(G(qr.b*255,0,255))}getHexString(e=Qt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Y.workingColorSpace){Y.workingToColorSpace(qr.copy(this),t);let n=qr.r,r=qr.g,i=qr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Y.workingColorSpace){return Y.workingToColorSpace(qr.copy(this),t),e.r=qr.r,e.g=qr.g,e.b=qr.b,e}getStyle(e=Qt){Y.workingToColorSpace(qr.copy(this),e);let t=qr.r,n=qr.g,r=qr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Wr),this.setHSL(Wr.h+e,Wr.s+t,Wr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wr),e.getHSL(Gr);let n=Tn(Wr.h,Gr.h,t),r=Tn(Wr.s,Gr.s,t),i=Tn(Wr.l,Gr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qr=new X;X.NAMES=Ur;var Jr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new X(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Yr=class extends zr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sr,this.environmentIntensity=1,this.environmentRotation=new Sr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Xr=new q,Zr=new q,Qr=new q,$r=new q,ei=new q,ti=new q,ni=new q,ri=new q,ii=new q,ai=new q,oi=new sr,si=new sr,ci=new sr,li=class e{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Xr.subVectors(e,t),r.cross(Xr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Xr.subVectors(r,t),Zr.subVectors(n,t),Qr.subVectors(e,t);let a=Xr.dot(Xr),o=Xr.dot(Zr),s=Xr.dot(Qr),c=Zr.dot(Zr),l=Zr.dot(Qr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,$r)!==null&&$r.x>=0&&$r.y>=0&&$r.x+$r.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,$r)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,$r.x),s.addScaledVector(a,$r.y),s.addScaledVector(o,$r.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return oi.setScalar(0),si.setScalar(0),ci.setScalar(0),oi.fromBufferAttribute(e,t),si.fromBufferAttribute(e,n),ci.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(oi,i.x),a.addScaledVector(si,i.y),a.addScaledVector(ci,i.z),a}static isFrontFacing(e,t,n,r){return Xr.subVectors(n,t),Zr.subVectors(e,t),Xr.cross(Zr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xr.subVectors(this.c,this.b),Zr.subVectors(this.a,this.b),Xr.cross(Zr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;ei.subVectors(r,n),ti.subVectors(i,n),ri.subVectors(e,n);let s=ei.dot(ri),c=ti.dot(ri);if(s<=0&&c<=0)return t.copy(n);ii.subVectors(e,r);let l=ei.dot(ii),u=ti.dot(ii);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(ei,a);ai.subVectors(e,i);let f=ei.dot(ai),p=ti.dot(ai);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ti,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ni.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ni,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(ei,a).addScaledVector(ti,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ui=class{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=fi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,fi):fi.fromBufferAttribute(r,t),fi.applyMatrix4(e.matrixWorld),this.expandByPoint(fi);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),pi.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),pi.copy(e.boundingBox)),pi.applyMatrix4(e.matrixWorld),this.union(pi)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fi),fi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(bi),xi.subVectors(this.max,bi),mi.subVectors(e.a,bi),hi.subVectors(e.b,bi),gi.subVectors(e.c,bi),_i.subVectors(hi,mi),vi.subVectors(gi,hi),yi.subVectors(mi,gi);let t=[0,-_i.z,_i.y,0,-vi.z,vi.y,0,-yi.z,yi.y,_i.z,0,-_i.x,vi.z,0,-vi.x,yi.z,0,-yi.x,-_i.y,_i.x,0,-vi.y,vi.x,0,-yi.y,yi.x,0];return!wi(t,mi,hi,gi,xi)||(t=[1,0,0,0,1,0,0,0,1],!wi(t,mi,hi,gi,xi))?!1:(Si.crossVectors(_i,vi),t=[Si.x,Si.y,Si.z],wi(t,mi,hi,gi,xi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(di)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},di=[new q,new q,new q,new q,new q,new q,new q,new q],fi=new q,pi=new ui,mi=new q,hi=new q,gi=new q,_i=new q,vi=new q,yi=new q,bi=new q,xi=new q,Si=new q,Ci=new q;function wi(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Ci.fromArray(e,a);let o=i.x*Math.abs(Ci.x)+i.y*Math.abs(Ci.y)+i.z*Math.abs(Ci.z),s=t.dot(Ci),c=n.dot(Ci),l=r.dot(Ci);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Ti=new q,Ei=new K,Di=0,Oi=class extends gn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Di++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=rn,this.updateRanges=[],this.gpuType=Ge,this.version=0,this._normalizationScale=e===void 0?void 0:Bn(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ei.fromBufferAttribute(this,t),Ei.applyMatrix3(e),this.setXY(t,Ei.x,Ei.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ti.fromBufferAttribute(this,t),Ti.applyMatrix3(e),this.setXYZ(t,Ti.x,Ti.y,Ti.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ti.fromBufferAttribute(this,t),Ti.applyMatrix4(e),this.setXYZ(t,Ti.x,Ti.y,Ti.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ti.fromBufferAttribute(this,t),Ti.applyNormalMatrix(e),this.setXYZ(t,Ti.x,Ti.y,Ti.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ti.fromBufferAttribute(this,t),Ti.transformDirection(e),this.setXYZ(t,Ti.x,Ti.y,Ti.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?Vn(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?Hn(e,this.array):Math.round(e*t)}},ki=class extends Oi{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Ai=class extends Oi{constructor(e,t,n){super(new Uint32Array(e),t,n)}},ji=class extends Oi{constructor(e,t,n){super(new Float32Array(e),t,n)}},Mi=new ui,Ni=new q,Pi=new q,Fi=class{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Mi.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ni.subVectors(e,this.center);let t=Ni.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Ni,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pi.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ni.copy(e.center).add(Pi)),this.expandByPoint(Ni.copy(e.center).sub(Pi))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ii=0,Li=new fr,Ri=new zr,zi=new q,Bi=new ui,Vi=new ui,Hi=new q,Ui=class e extends gn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ii++}),this.uuid=xn(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(on(e)?Ai:ki)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new J().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Li.makeRotationFromQuaternion(e),this.applyMatrix4(Li),this}rotateX(e){return Li.makeRotationX(e),this.applyMatrix4(Li),this}rotateY(e){return Li.makeRotationY(e),this.applyMatrix4(Li),this}rotateZ(e){return Li.makeRotationZ(e),this.applyMatrix4(Li),this}translate(e,t,n){return Li.makeTranslation(e,t,n),this.applyMatrix4(Li),this}scale(e,t,n){return Li.makeScale(e,t,n),this.applyMatrix4(Li),this}lookAt(e){return Ri.lookAt(e),Ri.updateMatrix(),this.applyMatrix4(Ri.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new ji(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&U(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Bi.setFromBufferAttribute(n),this.morphTargetsRelative?(Hi.addVectors(this.boundingBox.min,Bi.min),this.boundingBox.expandByPoint(Hi),Hi.addVectors(this.boundingBox.max,Bi.max),this.boundingBox.expandByPoint(Hi)):(this.boundingBox.expandByPoint(Bi.min),this.boundingBox.expandByPoint(Bi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&W(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new q,1/0);else if(e){let n=this.boundingSphere.center;if(Bi.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Vi.setFromBufferAttribute(n),this.morphTargetsRelative?(Hi.addVectors(Bi.min,Vi.min),Bi.expandByPoint(Hi),Hi.addVectors(Bi.max,Vi.max),Bi.expandByPoint(Hi)):(Bi.expandByPoint(Vi.min),Bi.expandByPoint(Vi.max))}Bi.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Hi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Hi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Hi.fromBufferAttribute(a,t),o&&(zi.fromBufferAttribute(e,t),Hi.add(zi)),r=Math.max(r,n.distanceToSquared(Hi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&W(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){W(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Oi(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new q,s[e]=new q;let l=new q,u=new q,d=new q,f=new K,p=new K,m=new K,h=new q,g=new q;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new q,b=new q,x=new q,S=new q;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Oi(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new q,i=new q,a=new q,o=new q,s=new q,c=new q,l=new q,u=new q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Hi.fromBufferAttribute(e,t),Hi.normalize(),e.setXYZ(t,Hi.x,Hi.y,Hi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Oi(a,r,i)}if(this.index===null)return U(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Wi=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=rn,this.updateRanges=[],this.version=0,this.uuid=xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Gi(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Gi(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Gi(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=xn()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+`:`+e.byteOffset+`:`+e.byteLength}var Ki=new q,qi=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r,this._normalizationScale=e===void 0?void 0:Bn(e.array)}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ki.fromBufferAttribute(this,t),Ki.applyMatrix4(e),this.setXYZ(t,Ki.x,Ki.y,Ki.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ki.fromBufferAttribute(this,t),Ki.applyNormalMatrix(e),this.setXYZ(t,Ki.x,Ki.y,Ki.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ki.fromBufferAttribute(this,t),Ki.transformDirection(e),this.setXYZ(t,Ki.x,Ki.y,Ki.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){dn(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Oi(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){dn(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t===void 0?Vn(e,this.data.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?Hn(e,this.data.array):Math.round(e*t)}},Ji=new q,Yi=new q,Xi=new J,Zi=class{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ji.subVectors(n,t).cross(Yi.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ji),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Xi.getNormalMatrix(e),r=this.coplanarPoint(Ji).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Qi=0,$i=class extends gn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qi++}),this.uuid=xn(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new X(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=nn,this.stencilZFail=nn,this.stencilZPass=nn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){U(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new X().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Zi().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new K().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new K().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},ea=class extends $i{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new X(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ta,na=new q,ra=new q,ia=new q,aa=new K,oa=new K,sa=new fr,ca=new q,la=new q,ua=new q,da=new K,fa=new K,pa=new K,ma=class extends zr{constructor(e=new ea){if(super(),this.isSprite=!0,this.type=`Sprite`,ta===void 0){ta=new Ui;let e=new Wi(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);ta.setIndex([0,1,2,0,2,3]),ta.setAttribute(`position`,new qi(e,3,0,!1)),ta.setAttribute(`uv`,new qi(e,2,3,!1))}this.geometry=ta,this.material=e,this.center=new K(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&W(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),ra.setFromMatrixScale(this.matrixWorld),sa.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ia.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ra.multiplyScalar(-ia.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;ha(ca.set(-.5,-.5,0),ia,a,ra,r,i),ha(la.set(.5,-.5,0),ia,a,ra,r,i),ha(ua.set(.5,.5,0),ia,a,ra,r,i),da.set(0,0),fa.set(1,0),pa.set(1,1);let o=e.ray.intersectTriangle(ca,la,ua,!1,na);if(o===null&&(ha(la.set(-.5,.5,0),ia,a,ra,r,i),fa.set(0,1),o=e.ray.intersectTriangle(ca,ua,la,!1,na),o===null))return;let s=e.ray.origin.distanceTo(na);s<e.near||s>e.far||t.push({distance:s,point:na.clone(),uv:li.getInterpolation(na,ca,la,ua,da,fa,pa,new K),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function ha(e,t,n,r,i,a){aa.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?oa.copy(aa):(oa.x=a*aa.x-i*aa.y,oa.y=i*aa.x+a*aa.y),e.copy(t),e.x+=oa.x,e.y+=oa.y,e.applyMatrix4(sa)}var ga=new q,_a=new q,va=new q,ya=new q,ba=class{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ga)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ga.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ga.copy(this.origin).addScaledVector(this.direction,t),ga.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){_a.copy(e).add(t).multiplyScalar(.5),va.copy(t).sub(e).normalize(),ya.copy(this.origin).sub(_a);let i=e.distanceTo(t)*.5,a=-this.direction.dot(va),o=ya.dot(this.direction),s=-ya.dot(va),c=ya.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(_a).addScaledVector(va,d),f}intersectSphere(e,t){if(e.radius<0)return null;ga.subVectors(e.center,this.origin);let n=ga.dot(this.direction),r=ga.dot(ga)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ga)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let ee=S/w,P=C/w,F=1/w,te=T-ee*D,ne=E-P*D,re=O-ee*A,ie=k-P*A,I=j-ee*N,ae=M-P*N,oe=I*ie-ae*re,L=te*ae-ne*I,R=re*ne-ie*te;if(r){if(oe<0||L<0||R<0)return null}else if((oe<0||L<0||R<0)&&(oe>0||L>0||R>0))return null;let se=oe+L+R;if(se===0)return null;let ce=F*(oe*D+L*A+R*N);return(se>0?ce<0:ce>0)?null:this.at(ce/se,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xa=class extends $i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sr,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Sa=new fr,Ca=new ba,wa=new Fi,Ta=new q,Ea=new q,Da=new q,Oa=new q,ka=new q,Aa=new q,ja=new q,Ma=new q,Na=class extends zr{constructor(e=new Ui,t=new xa){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Aa.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ka.fromBufferAttribute(s,e),a?Aa.addScaledVector(ka,r):Aa.addScaledVector(ka.sub(t),r))}t.add(Aa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(i),Ca.copy(e.ray).recast(e.near),wa.containsPoint(Ca.origin)===!1&&(Ca.intersectSphere(wa,Ta)===null||Ca.origin.distanceToSquared(Ta)>(e.far-e.near)**2)||(Sa.copy(i).invert(),Ca.copy(e.ray).applyMatrix4(Sa),(n.boundingBox===null||Ca.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Ca)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Fa(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Fa(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Fa(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Fa(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Pa(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Ma.copy(s),Ma.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Ma);return l<n.near||l>n.far?null:{distance:l,point:Ma.clone(),object:e}}function Fa(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ea),e.getVertexPosition(c,Da),e.getVertexPosition(l,Oa);let u=Pa(e,t,n,r,Ea,Da,Oa,ja);if(u){let e=new q;li.getBarycoord(ja,Ea,Da,Oa,e),i&&(u.uv=li.getInterpolatedAttribute(i,s,c,l,e,new K)),a&&(u.uv1=li.getInterpolatedAttribute(a,s,c,l,e,new K)),o&&(u.normal=li.getInterpolatedAttribute(o,s,c,l,e,new q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new q,materialIndex:0};li.getNormal(Ea,Da,Oa,t.normal),u.face=t,u.barycoord=e}return u}var Ia=class extends or{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Ne,l=Ne,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},La=class extends Oi{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ra=new fr,za=new fr,Ba=[],Va=new ui,Ha=new fr,Ua=new Na,Wa=new Fi,Ga=class extends Na{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new La(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Ha)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ra),Va.copy(e.boundingBox).applyMatrix4(Ra),this.boundingBox.union(Va)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ra),Wa.copy(e.boundingSphere).applyMatrix4(Ra),this.boundingSphere.union(Wa)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ua.geometry=this.geometry,Ua.material=this.material,Ua.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wa.copy(this.boundingSphere),Wa.applyMatrix4(n),e.ray.intersectsSphere(Wa)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ra),za.multiplyMatrices(n,Ra),Ua.matrixWorld=za,Ua.raycast(e,Ba);for(let e=0,n=Ba.length;e<n;e++){let n=Ba[e];n.instanceId=i,n.object=this,t.push(n)}Ba.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new La(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ia(new Float32Array(r*this.count),r,this.count,rt,Ge));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ka=new Fi,qa=new K(.5,.5),Ja=new q,Ya=class{constructor(e=new Zi,t=new Zi,n=new Zi,r=new Zi,i=new Zi,a=new Zi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=an,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ka.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ka.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ka)}intersectsSprite(e){return Ka.center.set(0,0,0),Ka.radius=.7071067811865476+qa.distanceTo(e.center),Ka.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ka)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ja.x=r.normal.x>0?e.max.x:e.min.x,Ja.y=r.normal.y>0?e.max.y:e.min.y,Ja.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ja)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Xa=new fr,Za=class e{constructor(){this.coordinateSystem=an,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Xa.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Ya),n[e].setFromProjectionMatrix(Xa,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Ya),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Qa=class extends $i{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new X(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},$a=new fr,eo=new ba,to=new Fi,no=new q,ro=class extends zr{constructor(e=new Ui,t=new Qa){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(r),to.radius+=i,e.ray.intersectsSphere(to)===!1)return;$a.copy(r).invert(),eo.copy(e.ray).applyMatrix4($a);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);no.fromBufferAttribute(l,n),io(no,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)no.fromBufferAttribute(l,a),io(no,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function io(e,t,n,r,i,a,o){let s=eo.distanceSqToPoint(e);if(s<n){let n=new q;eo.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ao=class extends or{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},oo=class extends or{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},so=class extends or{constructor(e,t,n=We,r,i,a,o=Ne,s=Ne,c,l=tt,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},co=class extends so{constructor(e,t=We,n=301,r,i,a=Ne,o=Ne,s,c=tt){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},lo=class extends or{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},uo=class e extends Ui{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new ji(c,3)),this.setAttribute(`normal`,new ji(l,3)),this.setAttribute(`uv`,new ji(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new q;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fo=class e extends Ui{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new ji(u,3)),this.setAttribute(`normal`,new ji(d,3)),this.setAttribute(`uv`,new ji(f,2));function _(){let a=new q,_=new q,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new K,m=new q,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},po=class e extends fo{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},mo=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){U(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new K:new q);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new q,r=[],i=[],a=[],o=new q,s=new fr;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new q)}i[0]=new q,a[0]=new q;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(G(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(G(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},ho=class extends mo{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new K){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},go=class extends ho{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function _o(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var vo=new q,yo=new q,bo=new _o,xo=new _o,So=new _o,Co=class extends mo{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new q){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(yo.subVectors(r[0],r[1]).add(r[0]),c=yo);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(vo.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=vo),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),bo.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),xo.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),So.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(bo.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),xo.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),So.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(bo.calc(s),xo.calc(s),So.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new q().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wo(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function To(e,t){let n=1-e;return n*n*t}function Eo(e,t){return 2*(1-e)*e*t}function Do(e,t){return e*e*t}function Oo(e,t,n,r){return To(e,t)+Eo(e,n)+Do(e,r)}function ko(e,t){let n=1-e;return n*n*n*t}function Ao(e,t){let n=1-e;return 3*n*n*e*t}function jo(e,t){return 3*(1-e)*e*e*t}function Mo(e,t){return e*e*e*t}function No(e,t,n,r,i){return ko(e,t)+Ao(e,n)+jo(e,r)+Mo(e,i)}var Po=class extends mo{constructor(e=new K,t=new K,n=new K,r=new K){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(No(e,r.x,i.x,a.x,o.x),No(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Fo=class extends mo{constructor(e=new q,t=new q,n=new q,r=new q){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new q){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(No(e,r.x,i.x,a.x,o.x),No(e,r.y,i.y,a.y,o.y),No(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Io=class extends mo{constructor(e=new K,t=new K){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new K){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Lo=class extends mo{constructor(e=new q,t=new q){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new q){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new q){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ro=class extends mo{constructor(e=new K,t=new K,n=new K){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Oo(e,r.x,i.x,a.x),Oo(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},zo=class extends mo{constructor(e=new q,t=new q,n=new q){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new q){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Oo(e,r.x,i.x,a.x),Oo(e,r.y,i.y,a.y),Oo(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bo=class extends mo{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new K){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(wo(o,s.x,c.x,l.x,u.x),wo(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new K().fromArray(n))}return this}},Vo=Object.freeze({__proto__:null,ArcCurve:go,CatmullRomCurve3:Co,CubicBezierCurve:Po,CubicBezierCurve3:Fo,EllipseCurve:ho,LineCurve:Io,LineCurve3:Lo,QuadraticBezierCurve:Ro,QuadraticBezierCurve3:zo,SplineCurve:Bo}),Ho=class extends mo{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Vo[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Vo[n.type]().fromJSON(n))}return this.cacheLengths=null,this}},Uo=class extends Ho{constructor(e){super(),this.type=`Path`,this.currentPoint=new K,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Io(this.currentPoint.clone(),new K(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Ro(this.currentPoint.clone(),new K(e,t),new K(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Po(this.currentPoint.clone(),new K(e,t),new K(n,r),new K(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new Bo([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ho(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Wo=class extends Uo{constructor(e){super(e),this.uuid=xn(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Uo().fromJSON(n))}return this}};function Go(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Ko(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=$o(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Jo(a,o,n,s,c,l,0),o}function Ko(e,t,n,r,i){let a;if(i===Cs(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=bs(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=bs(i/r|0,e[i],e[i+1],a);return a&&fs(a,a.next)&&(xs(a),a=a.next),a}function qo(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(fs(n,n.next)||ds(n.prev,n,n.next)===0)){if(xs(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Jo(e,t,n,r,i,a,o){if(!e)return;!o&&a&&is(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Xo(e,r,i,a):Yo(e))t.push(c.i,e.i,l.i),xs(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Zo(qo(e),t),Jo(e,t,n,r,i,a,2)):o===2&&Qo(e,t,n,r,i,a):Jo(qo(e),t,n,r,i,a,1);break}}}function Yo(e){let t=e.prev,n=e,r=e.next;if(ds(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&ls(i,s,a,c,o,l,m.x,m.y)&&ds(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Xo(e,t,n,r){let i=e.prev,a=e,o=e.next;if(ds(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=os(p,m,t,n,r),v=os(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ls(s,u,c,d,l,f,y.x,y.y)&&ds(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ls(s,u,c,d,l,f,b.x,b.y)&&ds(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&ls(s,u,c,d,l,f,y.x,y.y)&&ds(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&ls(s,u,c,d,l,f,b.x,b.y)&&ds(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Zo(e,t){let n=e;do{let r=n.prev,i=n.next.next;!fs(r,i)&&ps(r,n,n.next,i)&&_s(r,i)&&_s(i,r)&&(t.push(r.i,n.i,i.i),xs(n),xs(n.next),n=e=i),n=n.next}while(n!==e);return qo(n)}function Qo(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&us(o,e)){let s=ys(o,e);o=qo(o,o.next),s=qo(s,s.next),Jo(o,t,n,r,i,a,0),Jo(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function $o(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Ko(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(ss(o))}i.sort(es);for(let e=0;e<i.length;e++)n=ts(i[e],n);return n}function es(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function ts(e,t){let n=ns(e,t);if(!n)return t;let r=ys(n,e);return qo(r,r.next),qo(n,n.next)}function ns(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(fs(e,n))return n;do{if(fs(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&cs(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);_s(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&rs(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function rs(e,t){return ds(e.prev,e,t.prev)<0&&ds(t.next,e,e.next)<0}function is(e,t,n,r){let i=e;do i.z===0&&(i.z=os(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,as(i)}function as(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function os(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function ss(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function cs(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function ls(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&cs(e,t,n,r,i,a,o,s)}function us(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!gs(e,t)&&(_s(e,t)&&_s(t,e)&&vs(e,t)&&(ds(e.prev,e,t.prev)||ds(e,t.prev,t))||fs(e,t)&&ds(e.prev,e,e.next)>0&&ds(t.prev,t,t.next)>0)}function ds(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function fs(e,t){return e.x===t.x&&e.y===t.y}function ps(e,t,n,r){let i=hs(ds(e,t,n)),a=hs(ds(e,t,r)),o=hs(ds(n,r,e)),s=hs(ds(n,r,t));return!!(i!==a&&o!==s||i===0&&ms(e,n,t)||a===0&&ms(e,r,t)||o===0&&ms(n,e,r)||s===0&&ms(n,t,r))}function ms(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function hs(e){return e>0?1:e<0?-1:0}function gs(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&ps(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function _s(e,t){return ds(e.prev,e,e.next)<0?ds(e,t,e.next)>=0&&ds(e,e.prev,t)>=0:ds(e,t,e.prev)<0||ds(e,e.next,t)<0}function vs(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function ys(e,t){let n=Ss(e.i,e.x,e.y),r=Ss(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function bs(e,t,n,r){let i=Ss(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function xs(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ss(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Cs(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var ws=class{static triangulate(e,t,n=2){return Go(e,t,n)}},Ts=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Es(e),Ds(n,e);let a=e.length;t.forEach(Es);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Ds(n,t[e]);let o=ws.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Es(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Ds(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Os=class e extends Ui{constructor(e=new Wo([new K(.5,.5),new K(-.5,.5),new K(-.5,-.5),new K(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new ji(r,3)),this.setAttribute(`uv`,new ji(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?ks:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new q,b=new q,x=new q}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Ts.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Ts.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||W(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new K(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new K(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,ee=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),ee=ee.concat(N)}let P;if(p===0)P=Ts.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);I(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);I(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}P=Ts.triangulateShape(e,t)}let F=P.length,te=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],ee[e],te):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),I(x.x,x.y,x.z)):I(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],ee[t],te):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),I(x.x,x.y,x.z)):I(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);I(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?I(i.x,i.y+g[s-1].y,g[s-1].x+n):I(i.x,i.y,c+n)}}}ne(),re();function ne(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<F;e++){let n=P[e];ae(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<F;e++){let n=P[e];ae(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<F;e++){let t=P[e];ae(t[2],t[1],t[0])}for(let e=0;e<F;e++){let t=P[e];ae(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function re(){let e=r.length/3,t=0;ie(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ie(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ie(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);oe(t+r+n,t+i+n,t+i+a,t+r+a)}}}function I(e,t,n){a.push(e),a.push(t),a.push(n)}function ae(e,t,i){L(e),L(t),L(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);R(o[0]),R(o[1]),R(o[2])}function oe(e,t,i,a){L(e),L(t),L(a),L(t),L(i),L(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);R(s[0]),R(s[1]),R(s[3]),R(s[1]),R(s[2]),R(s[3])}function L(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function R(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return As(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Vo[i.type]().fromJSON(i)),new e(r,t.options)}},ks={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new K(a,o),new K(s,c),new K(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new K(o,1-c),new K(l,1-d),new K(f,1-m),new K(h,1-_)]:[new K(s,1-c),new K(u,1-d),new K(p,1-m),new K(g,1-_)]}};function As(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var js=class e extends Ui{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new ji(p,3)),this.setAttribute(`normal`,new ji(m,3)),this.setAttribute(`uv`,new ji(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ms=class e extends Ui{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new q,p=new K;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new ji(s,3)),this.setAttribute(`normal`,new ji(c,3)),this.setAttribute(`uv`,new ji(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ns=class e extends Ui{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new q,d=new q,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new ji(p,3)),this.setAttribute(`normal`,new ji(m,3)),this.setAttribute(`uv`,new ji(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Ps(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Is(i))i.isRenderTargetTexture?(U(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Is(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Fs(e){let t={};for(let n=0;n<e.length;n++){let r=Ps(e[n]);for(let e in r)t[e]=r[e]}return t}function Is(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ls(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Rs(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Y.workingColorSpace}var zs={clone:Ps,merge:Fs},Bs=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vs=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Hs=class extends $i{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bs,this.fragmentShader=Vs,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ps(e.uniforms),this.uniformsGroups=Ls(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new X().setHex(r.value);break;case`v2`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new sr().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new J().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new fr().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Us=class extends Hs{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Ws=class extends $i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new X(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Gs=class extends $i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Zt,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ks=class extends $i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function qs(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Js(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ys=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Xs=class extends Ys{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jt,endingEnd:Jt}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Yt:i=e,o=2*t-n;break;case Xt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Yt:a=e,s=2*n-t;break;case Xt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Zs=class extends Ys{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Qs=class extends Ys{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},$s=class extends Ys{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=nc(n,t,g,y,r);i[p]=ec(x,o,_,b,m)}return i}};function ec(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function tc(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function nc(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=ec(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=tc(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var rc=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=qs(t,this.TimeBufferType),this.values=qs(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:qs(e.times,Array),values:qs(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Js(e.settings)&&(n.settings={inTangents:qs(e.settings.inTangents,Array),outTangents:qs(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Qs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Zs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new $s(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Wt:t=this.InterpolantFactoryMethodDiscrete;break;case Gt:t=this.InterpolantFactoryMethodLinear;break;case Kt:t=this.InterpolantFactoryMethodSmooth;break;case qt:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return U(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wt;case this.InterpolantFactoryMethodLinear:return Gt;case this.InterpolantFactoryMethodSmooth:return Kt;case this.InterpolantFactoryMethodBezier:return qt}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Js(this.settings)&&(ic(this.settings.inTangents,e),ic(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Js(this.settings)&&(ac(this.settings.inTangents,e),ac(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(W(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(W(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){W(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){W(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&sn(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){W(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Kt,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Js(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function ic(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function ac(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}rc.prototype.ValueTypeName=``,rc.prototype.TimeBufferType=Float32Array,rc.prototype.ValueBufferType=Float32Array,rc.prototype.DefaultInterpolation=Gt;var oc=class extends rc{constructor(e,t,n){super(e,t,n)}};oc.prototype.ValueTypeName=`bool`,oc.prototype.ValueBufferType=Array,oc.prototype.DefaultInterpolation=Wt,oc.prototype.InterpolantFactoryMethodLinear=void 0,oc.prototype.InterpolantFactoryMethodSmooth=void 0;var sc=class extends rc{constructor(e,t,n,r){super(e,t,n,r)}};sc.prototype.ValueTypeName=`color`;var cc=class extends rc{constructor(e,t,n,r){super(e,t,n,r)}};cc.prototype.ValueTypeName=`number`;var lc=class extends Ys{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Wn.slerpFlat(i,0,a,c-o,a,c,s);return i}},uc=class extends rc{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new lc(this.times,this.values,this.getValueSize(),e)}};uc.prototype.ValueTypeName=`quaternion`,uc.prototype.InterpolantFactoryMethodSmooth=void 0;var dc=class extends rc{constructor(e,t,n){super(e,t,n)}};dc.prototype.ValueTypeName=`string`,dc.prototype.ValueBufferType=Array,dc.prototype.DefaultInterpolation=Wt,dc.prototype.InterpolantFactoryMethodLinear=void 0,dc.prototype.InterpolantFactoryMethodSmooth=void 0;var fc=class extends rc{constructor(e,t,n,r){super(e,t,n,r)}};fc.prototype.ValueTypeName=`vector`;var pc={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(mc(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!mc(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function mc(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var hc=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},gc=class{constructor(e){this.manager=e===void 0?hc:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},this.priority=`auto`,this.cache=`default`,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};gc.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var _c=new WeakMap,vc=class extends gc{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=pc.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=_c.get(a);e===void 0&&(e=[],_c.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=cn(`img`);function s(){l(),t&&t(this);let n=_c.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}_c.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),pc.remove(`image:${e}`);let n=_c.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}_c.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),pc.add(`image:${e}`,o),i.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}},yc=class extends gc{constructor(e){super(e)}load(e,t,n,r){let i=new or,a=new vc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},bc=class extends zr{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new X(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},xc=class extends bc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(zr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new X(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Sc=new fr,Cc=new q,wc=new q,Tc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.mapType=ze,this.map=null,this.mapPass=null,this.matrix=new fr,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ya,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new sr(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Cc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cc),wc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Sc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Sc,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Sc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ec=new q,Dc=new Wn,Oc=new q,kc=class extends zr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new fr,this.projectionMatrix=new fr,this.projectionMatrixInverse=new fr,this.coordinateSystem=an,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ec,Dc,Oc),Oc.x===1&&Oc.y===1&&Oc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ec,Dc,Oc.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ec,Dc,Oc),Oc.x===1&&Oc.y===1&&Oc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ec,Dc,Oc.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ac=new q,jc=new K,Mc=new K,Nc=class extends kc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=bn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(yn*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bn*2*Math.atan(Math.tan(yn*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ac.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ac.x,Ac.y).multiplyScalar(-e/Ac.z),Ac.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ac.x,Ac.y).multiplyScalar(-e/Ac.z)}getViewSize(e,t){return this.getViewBounds(e,jc,Mc),t.subVectors(Mc,jc)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(yn*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Pc=class extends kc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Fc=class extends Tc{constructor(){super(new Pc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ic=class extends bc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(zr.DEFAULT_UP),this.updateMatrix(),this.target=new zr,this.shadow=new Fc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Lc=-90,Rc=1,zc=class extends zr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Nc(Lc,Rc,e,t);r.layers=this.layers,this.add(r);let i=new Nc(Lc,Rc,e,t);i.layers=this.layers,this.add(i);let a=new Nc(Lc,Rc,e,t);a.layers=this.layers,this.add(a);let o=new Nc(Lc,Rc,e,t);o.layers=this.layers,this.add(o);let s=new Nc(Lc,Rc,e,t);s.layers=this.layers,this.add(s);let c=new Nc(Lc,Rc,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Bc=class extends Nc{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Vc=`\\[\\]\\.:\\/`,Hc=RegExp(`[\\[\\]\\.:\\/]`,`g`),Uc=`[^\\[\\]\\.:\\/]`,Wc=`[^`+Vc.replace(`\\.`,``)+`]`,Gc=`((?:WC+[\\/:])*)`.replace(`WC`,Uc),Kc=`(WCOD+)?`.replace(`WCOD`,Wc),qc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Uc),Jc=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Uc),Yc=RegExp(`^`+Gc+Kc+qc+Jc+`$`),Xc=[`material`,`materials`,`bones`,`map`],Zc=class{constructor(e,t,n){let r=n||Qc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Qc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Hc,``)}static parseTrackName(e){let t=Yc.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Xc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){U(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){W(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){W(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){W(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){W(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){W(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;W(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Qc.Composite=Zc,Qc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Qc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Qc.prototype.GetterByBindingType=[Qc.prototype._getValue_direct,Qc.prototype._getValue_array,Qc.prototype._getValue_arrayElement,Qc.prototype._getValue_toArray],Qc.prototype.SetterByBindingTypeAndVersioning=[[Qc.prototype._setValue_direct,Qc.prototype._setValue_direct_setNeedsUpdate,Qc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Qc.prototype._setValue_array,Qc.prototype._setValue_array_setNeedsUpdate,Qc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Qc.prototype._setValue_arrayElement,Qc.prototype._setValue_arrayElement_setNeedsUpdate,Qc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Qc.prototype._setValue_fromArray,Qc.prototype._setValue_fromArray_setNeedsUpdate,Qc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var $c=new fr,el=class{constructor(e,t,n=0,r=1/0){this.ray=new ba(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Cr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):W(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return $c.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($c),this}intersectObject(e,t=!0,n=[]){return nl(e,this,n,t),n.sort(tl),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)nl(e[r],this,n,t);return n.sort(tl),n}};function tl(e,t){return e.distance-t.distance}function nl(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)nl(r[e],t,n,!0)}}var rl=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=G(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(G(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var il=class extends gn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function al(e,t,n,r){let i=ol(r);switch(n){case Qe:return e*t;case rt:return e*t/i.components*i.byteLength;case it:return e*t/i.components*i.byteLength;case at:return e*t*2/i.components*i.byteLength;case ot:return e*t*2/i.components*i.byteLength;case $e:return e*t*3/i.components*i.byteLength;case et:return e*t*4/i.components*i.byteLength;case st:return e*t*4/i.components*i.byteLength;case ct:case lt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ut:case dt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pt:case ht:return Math.max(e,16)*Math.max(t,8)/4;case ft:case mt:return Math.max(e,8)*Math.max(t,8)/2;case gt:case _t:case yt:case bt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case vt:case xt:case St:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ct:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case wt:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Tt:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Et:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Dt:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ot:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case kt:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case At:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case jt:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Mt:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Nt:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Pt:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ft:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case It:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Lt:case Rt:case zt:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Bt:case Vt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ht:case Ut:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ol(e){switch(e){case ze:case Be:return{byteLength:1,components:1};case He:case Ve:case Ke:return{byteLength:2,components:1};case qe:case Je:return{byteLength:2,components:4};case We:case Ue:case Ge:return{byteLength:4,components:1};case Xe:case Ze:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?U(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function sl(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function cl(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new X(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new J}},envmap:{envMap:{value:null},envMapRotation:{value:new J},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new J}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new J}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new J},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new J},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new J},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new J}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new J}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new J}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new X(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new X(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0},uvTransform:{value:new J}},sprite:{diffuse:{value:new X(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}}},ll={basic:{uniforms:Fs([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:Fs([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new X(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:Fs([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new X(0)},specular:{value:new X(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:Fs([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new X(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:Fs([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new X(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:Fs([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:Fs([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:Fs([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:Fs([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:Fs([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:Fs([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new J},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new J}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:Fs([Q.common,Q.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:Fs([Q.lights,Q.fog,{color:{value:new X(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};ll.physical={uniforms:Fs([ll.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new J},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new J},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new J},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new J},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new J},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new J},sheen:{value:0},sheenColor:{value:new X(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new J},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new J},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new J},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new J},attenuationDistance:{value:0},attenuationColor:{value:new X(0)},specularColor:{value:new X(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new J},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new J},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new J}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var ul={r:0,b:0,g:0},dl=new fr,fl=new J;fl.set(-1,0,0,0,1,0,0,0,1);function pl(e,t,n,r,i,a){let o=new X(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new Na(new uo(1,1,1),new Hs({name:`BackgroundCubeMaterial`,uniforms:Ps(ll.backgroundCube.uniforms),vertexShader:ll.backgroundCube.vertexShader,fragmentShader:ll.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(dl.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(fl),l.material.toneMapped=Y.getTransfer(i.colorSpace)!==tn,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Na(new js(2,2),new Hs({name:`BackgroundMaterial`,uniforms:Ps(ll.background.uniforms),vertexShader:ll.background.vertexShader,fragmentShader:ll.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Y.getTransfer(i.colorSpace)!==tn,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(ul,Rs(e)),n.buffers.color.setClear(ul.r,ul.g,ul.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function ml(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function hl(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function gl(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(U(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&U(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&U(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function _l(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Zi,s=new J,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var vl=class extends lr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ao(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new uo(5,5,5),i=new Hs({name:`CubemapFromEquirect`,uniforms:Ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Na(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Ie),new zc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},yl=256,bl=3,xl=20,Sl=256,Cl=16,wl=3,Tl=new q,El=new X,Dl=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new zc(1,10,null),this._boxMesh=new Na(new uo(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Tl}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(El));let h=new zc(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(yl,Rn(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?yl:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Ol(e,!1,!1),n=Math.log2(e)-bl;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Ol(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pl()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Nl()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Al(),this._integrationMaterial=jl());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Cl);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-wl)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(Sl*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Ml());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function Ol(e,t,n){return new vl(e,{minFilter:Re,generateMipmaps:t,type:Ke,colorSpace:$t,depthBuffer:n})}function kl(e,t,n){return new Hs({name:e,uniforms:t,vertexShader:Z.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function Al(){return kl(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Sl}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function jl(){return kl(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Cl}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Ml(){return kl(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${xl}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Nl(){return kl(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Pl(){return kl(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Fl(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new vl(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Dl(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Dl(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Il(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&pn(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ll(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?Ai:ki)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function Rl(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function zl(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:W(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Bl(e,t,n){let r=new WeakMap,i=new sr;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new ur(h,p,m,u);g.type=Ge,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new K(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Vl(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Hl={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Ul(e,t,n,r,i,a){let o=new lr(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new Ui;u.setAttribute(`position`,new ji([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new ji([0,2,0,0,2,0],2));let d=new Us({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Na(u,d),p=new Pc(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new lr(t,n,{type:Ke,depthBuffer:!1,stencilBuffer:!1}),c=new lr(t,n,{type:Ke,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new so(t,n),a===!0&&(l.format=nt,l.type=Ye)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},Y.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=Hl[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Wl=new or,Gl=new so(1,1),Kl=new co(1),ql=new ur,Jl=new dr,Yl=new ao,Xl=[],Zl=[],Ql=new Float32Array(16),$l=new Float32Array(9),eu=new Float32Array(4);function tu(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Xl[i];if(a===void 0&&(a=new Float32Array(i),Xl[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function nu(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function ru(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function iu(e,t){let n=Zl[t];n===void 0&&(n=new Int32Array(t),Zl[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function au(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ou(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(nu(n,t))return;e.uniform2fv(this.addr,t),ru(n,t)}}function su(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(nu(n,t))return;e.uniform3fv(this.addr,t),ru(n,t)}}function cu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(nu(n,t))return;e.uniform4fv(this.addr,t),ru(n,t)}}function lu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(nu(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),ru(n,t)}else{if(nu(n,r))return;eu.set(r),e.uniformMatrix2fv(this.addr,!1,eu),ru(n,r)}}function uu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(nu(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),ru(n,t)}else{if(nu(n,r))return;$l.set(r),e.uniformMatrix3fv(this.addr,!1,$l),ru(n,r)}}function du(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(nu(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),ru(n,t)}else{if(nu(n,r))return;Ql.set(r),e.uniformMatrix4fv(this.addr,!1,Ql),ru(n,r)}}function fu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function pu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(nu(n,t))return;e.uniform2iv(this.addr,t),ru(n,t)}}function mu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(nu(n,t))return;e.uniform3iv(this.addr,t),ru(n,t)}}function hu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(nu(n,t))return;e.uniform4iv(this.addr,t),ru(n,t)}}function gu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function _u(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(nu(n,t))return;e.uniform2uiv(this.addr,t),ru(n,t)}}function vu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(nu(n,t))return;e.uniform3uiv(this.addr,t),ru(n,t)}}function yu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(nu(n,t))return;e.uniform4uiv(this.addr,t),ru(n,t)}}function bu(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function xu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?bu(Gl):Wl,n.setTexture2D(t||a,i)}function Su(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Jl,i)}function Cu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?bu(Kl):Yl,n.setTextureCube(t||a,i)}function wu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||ql,i)}function Tu(e){switch(e){case 5126:return au;case 35664:return ou;case 35665:return su;case 35666:return cu;case 35674:return lu;case 35675:return uu;case 35676:return du;case 5124:case 35670:return fu;case 35667:case 35671:return pu;case 35668:case 35672:return mu;case 35669:case 35673:return hu;case 5125:return gu;case 36294:return _u;case 36295:return vu;case 36296:return yu;case 35678:case 36198:case 36298:case 36306:case 35682:return xu;case 35679:case 36299:case 36307:return Su;case 35680:case 36300:case 36308:case 36293:return Cu;case 36289:case 36303:case 36311:case 36292:return wu}}function Eu(e,t){e.uniform1fv(this.addr,t)}function Du(e,t){let n=tu(t,this.size,2);e.uniform2fv(this.addr,n)}function Ou(e,t){let n=tu(t,this.size,3);e.uniform3fv(this.addr,n)}function ku(e,t){let n=tu(t,this.size,4);e.uniform4fv(this.addr,n)}function Au(e,t){let n=tu(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function ju(e,t){let n=tu(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Mu(e,t){let n=tu(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Nu(e,t){e.uniform1iv(this.addr,t)}function Pu(e,t){e.uniform2iv(this.addr,t)}function Fu(e,t){e.uniform3iv(this.addr,t)}function Iu(e,t){e.uniform4iv(this.addr,t)}function Lu(e,t){e.uniform1uiv(this.addr,t)}function Ru(e,t){e.uniform2uiv(this.addr,t)}function zu(e,t){e.uniform3uiv(this.addr,t)}function Bu(e,t){e.uniform4uiv(this.addr,t)}function Vu(e,t,n){let r=this.cache,i=t.length,a=iu(n,i);nu(r,a)||(e.uniform1iv(this.addr,a),ru(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?bu(Gl):Wl;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Hu(e,t,n){let r=this.cache,i=t.length,a=iu(n,i);nu(r,a)||(e.uniform1iv(this.addr,a),ru(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Jl,a[e])}function Uu(e,t,n){let r=this.cache,i=t.length,a=iu(n,i);nu(r,a)||(e.uniform1iv(this.addr,a),ru(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?bu(Kl):Yl;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Wu(e,t,n){let r=this.cache,i=t.length,a=iu(n,i);nu(r,a)||(e.uniform1iv(this.addr,a),ru(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||ql,a[e])}function Gu(e){switch(e){case 5126:return Eu;case 35664:return Du;case 35665:return Ou;case 35666:return ku;case 35674:return Au;case 35675:return ju;case 35676:return Mu;case 5124:case 35670:return Nu;case 35667:case 35671:return Pu;case 35668:case 35672:return Fu;case 35669:case 35673:return Iu;case 5125:return Lu;case 36294:return Ru;case 36295:return zu;case 36296:return Bu;case 35678:case 36198:case 36298:case 36306:case 35682:return Vu;case 35679:case 36299:case 36307:return Hu;case 35680:case 36300:case 36308:case 36293:return Uu;case 36289:case 36303:case 36311:case 36292:return Wu}}var Ku=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tu(t.type)}},qu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gu(t.type)}},Ju=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Yu=/(\w+)(\])?(\[|\.)?/g;function Xu(e,t){e.seq.push(t),e.map[t.id]=t}function Zu(e,t,n){let r=e.name,i=r.length;for(Yu.lastIndex=0;;){let a=Yu.exec(r),o=Yu.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Xu(n,l===void 0?new Ku(s,e,t):new qu(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Ju(s),Xu(n,e)),n=e}}}var Qu=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Zu(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function $u(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var ed=37297,td=0;function nd(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var rd=new J;function id(e){Y._getMatrix(rd,Y.workingColorSpace,e);let t=`mat3( ${rd.elements.map(e=>e.toFixed(4))} )`;switch(Y.getTransfer(e)){case en:return[t,`LinearTransferOETF`];case tn:return[t,`sRGBTransferOETF`];default:return U(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function ad(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+nd(e.getShaderSource(t),r)}return i}function od(e,t){let n=id(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var sd={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function cd(e,t){let n=sd[t];return n===void 0?(U(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var ld=new q;function ud(){return Y.getLuminanceCoefficients(ld),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${ld.x.toFixed(4)}, ${ld.y.toFixed(4)}, ${ld.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function dd(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(md).join(`
`)}function fd(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function pd(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function md(e){return e!==``}function hd(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function gd(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var _d=/^[ \t]*#include +<([\w\d./]+)>/gm;function vd(e){return e.replace(_d,yd)}function yd(e,t){let n=Z[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return vd(n)}var bd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xd(e){return e.replace(bd,Sd)}function Sd(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Cd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var wd={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Td(e){return wd[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ed={302:`ENVMAP_MODE_REFRACTION`};function Dd(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ed[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Od={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function kd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Od[e.combine]||`ENVMAP_BLENDING_NONE`}function Ad(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Td(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=Dd(n),d=kd(n),f=dd(n),p=fd(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(md).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(md).join(`
`),g.length>0&&(g+=`
`)):(h=[Cd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(md).join(`
`),g=[Cd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:cd(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,od(`linearToOutputTexel`,n.outputColorSpace),ud(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(md).join(`
`)),o=vd(o),o=hd(o,n),o=gd(o,n),s=vd(s),s=hd(s,n),s=gd(s,n),o=xd(o),s=xd(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=$u(i,i.VERTEX_SHADER,v),x=$u(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=ad(i,b,`vertex`),n=ad(i,x,`fragment`);W(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):U(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Qu(i,m),w=pd(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,ed)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=td++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var jd=0,Md=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Nd(e),t.set(e,n)),n}},Nd=class{constructor(e){this.id=jd++,this.code=e,this.usedTimes=0}};function Pd(e){return e===1030||e===37490||e===36285}function Fd(e,t,n,r,i,a){let o=new Cr,s=new Md,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&U(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=ll[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,ee=!!i.map,P=!!i.matcap,F=!!b,te=F&&b.isPMREMTexture===!0,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,I=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,L=!!i.metalnessMap,R=!!i.roughnessMap,se=i.anisotropy>0,ce=i.clearcoat>0,le=i.diffuseRoughness>0,ue=i.dispersion>0,de=i.retroreflectivity>0,fe=i.iridescence>0,pe=i.sheen>0,me=i.transmission>0,he=se&&!!i.anisotropyMap,ge=ce&&!!i.clearcoatMap,_e=ce&&!!i.clearcoatNormalMap,ve=ce&&!!i.clearcoatRoughnessMap,ye=le&&!!i.diffuseRoughnessMap,z=fe&&!!i.iridescenceMap,be=fe&&!!i.iridescenceThicknessMap,xe=pe&&!!i.sheenColorMap,Se=pe&&!!i.sheenRoughnessMap,B=!!i.specularMap,Ce=!!i.specularColorMap,V=!!i.specularIntensityMap,H=me&&!!i.transmissionMap,we=me&&!!i.thicknessMap,Te=!!i.gradientMap,Ee=!!i.alphaMap,De=i.alphaTest>0,Oe=!!i.alphaHash,ke=!!i.extensions,Ae=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je=te?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Me={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Y.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ee,matcap:P,envMap:F,envMapMode:F&&b.mapping,envMapPMREM:te,envMapMaxLod:te?je.length-1:null,envMapSize:te?je[0].width:null,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:I,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:I&&i.normalMapType===1,normalMapTangentSpace:I&&i.normalMapType===0,packedNormalMap:I&&i.normalMapType===0&&Pd(i.normalMap.format),metalnessMap:L,roughnessMap:R,anisotropy:se,anisotropyMap:he,clearcoat:ce,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:ve,diffuseRoughness:le,diffuseRoughnessMap:ye,dispersion:ue,retroreflection:de,iridescence:fe,iridescenceMap:z,iridescenceThicknessMap:be,sheen:pe,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:B,specularColorMap:Ce,specularIntensityMap:V,transmission:me,transmissionMap:H,thicknessMap:we,gradientMap:Te,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ee,alphaTest:De,alphaHash:Oe,combine:i.combine,mapUv:ee&&p(i.map.channel),aoMapUv:ne&&p(i.aoMap.channel),lightMapUv:re&&p(i.lightMap.channel),bumpMapUv:ie&&p(i.bumpMap.channel),normalMapUv:I&&p(i.normalMap.channel),displacementMapUv:ae&&p(i.displacementMap.channel),emissiveMapUv:oe&&p(i.emissiveMap.channel),metalnessMapUv:L&&p(i.metalnessMap.channel),roughnessMapUv:R&&p(i.roughnessMap.channel),anisotropyMapUv:he&&p(i.anisotropyMap.channel),clearcoatMapUv:ge&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:_e&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ye&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:z&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&p(i.sheenRoughnessMap.channel),specularMapUv:B&&p(i.specularMap.channel),specularColorMapUv:Ce&&p(i.specularColorMap.channel),specularIntensityMapUv:V&&p(i.specularIntensityMap.channel),transmissionMapUv:H&&p(i.transmissionMap.channel),thicknessMapUv:we&&p(i.thicknessMap.channel),alphaMapUv:Ee&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(I||se),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(ee||Ee),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&I===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:ee&&i.map.isVideoTexture===!0&&Y.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&Y.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:ke&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ke&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=ll[t];n=zs.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new Ad(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function Id(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Ld(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Rd(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function zd(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Ld),r.length>1&&r.sort(t||Rd),i.length>1&&i.sort(t||Rd)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Bd(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new zd,e.set(t,[i])):n>=r.length?(i=new zd,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Vd(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new q,color:new X};break;case`SpotLight`:n={position:new q,direction:new q,color:new X,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new q,color:new X,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new q,skyColor:new X,groundColor:new X};break;case`RectAreaLight`:n={color:new X,position:new q,halfWidth:new q,halfHeight:new q}}return e[t.id]=n,n}}}function Hd(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ud=0;function Wd(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Gd(e){let t=new Vd,n=Hd(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new q);let i=new q,a=new fr,o=new fr;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Wd);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Ud++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Kd(e){let t=new Gd(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function qd(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Kd(e),t.set(n,[a])):r>=i.length?(a=new Kd(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Jd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Xd=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],Zd=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],Qd=new fr,$d=new q,ef=new q;function tf(e,t,n){let r=new Ya,i=new K,a=new K,o=new sr,s=new Gs,c=new Ks,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Hs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:Jd,fragmentShader:Yd}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Ui;m.setAttribute(`position`,new Oi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Na(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(U(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){U(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){U(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new lr(i.x,i.y,{format:at,type:Ke,minFilter:Ie,magFilter:Ie,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new so(i.x,i.y,Ge),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=tt,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ne,d.map.depthTexture.magFilter=Ne}else l.isPointLight?(d.map=new vl(i.x),d.map.depthTexture=new co(i.x,We)):(d.map=new lr(i.x,i.y),d.map.depthTexture=new so(i.x,i.y,We)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=tt,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Ie,d.map.depthTexture.magFilter=Ie):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ne,d.map.depthTexture.magFilter=Ne);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),$d.setFromMatrixPosition(l.matrixWorld),e.position.copy($d),ef.copy(e.position),ef.add(Xd[t]),e.up.copy(Zd[t]),e.lookAt(ef),e.updateMatrixWorld(),n.makeTranslation(-$d.x,-$d.y,-$d.z),Qd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Qd,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new lr(i.x,i.y,{format:at,type:Ke}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function nf(e,t){function n(){let t=!1,n=new sr,r=null,i=new sr(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?L(e.DEPTH_TEST):R(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=hn[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?L(e.STENCIL_TEST):R(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,ee=0,P=e.getParameter(e.VERSION);P.indexOf(`WebGL`)===-1?P.indexOf(`OpenGL ES`)!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),N=ee>=2):(ee=parseFloat(/^WebGL (\d)/.exec(P)[1]),N=ee>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new sr().fromArray(ne),I=new sr().fromArray(re);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),L(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),L(e.CULL_FACE),fe(0);function L(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function R(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function se(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ce(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function le(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ue={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ue[103]=e.MIN,ue[104]=e.MAX;let de={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function fe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(R(e.BLEND),g=!1);else if(g===!1&&(L(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:W(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:W(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:W(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:W(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ue[n],ue[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(de[r],de[i],de[o],de[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function pe(t,n){t.side===2?R(e.CULL_FACE):L(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?fe(0):fe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),_e(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?L(e.SAMPLE_ALPHA_TO_COVERAGE):R(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function he(t){t===0?R(e.CULL_FACE):(L(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ge(t){t!==k&&(N&&e.lineWidth(t),k=t)}function _e(t,n,r){t?(L(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):R(e.POLYGON_OFFSET_FILL)}function ve(t){t?L(e.SCISSOR_TEST):R(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+M-1),F!==t&&(e.activeTexture(t),F=t)}function z(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+M-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function be(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function xe(){try{e.compressedTexImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Se(){try{e.compressedTexImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function B(){try{e.texSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ce(){try{e.texSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function V(){try{e.compressedTexSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function H(){try{e.compressedTexSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function we(){try{e.texStorage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Te(){try{e.texStorage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ee(){try{e.texImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function De(){try{e.texImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Oe(t){return d[t]===void 0?e.getParameter(t):d[t]}function ke(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Ae(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function je(t){I.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),I.copy(t))}function Me(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Ne(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),I.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:L,disable:R,bindFramebuffer:se,drawBuffers:ce,useProgram:le,setBlending:fe,setMaterial:pe,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:_e,setScissorTest:ve,activeTexture:ye,bindTexture:z,unbindTexture:be,compressedTexImage2D:xe,compressedTexImage3D:Se,texImage2D:Ee,texImage3D:De,pixelStorei:ke,getParameter:Oe,updateUBOMapping:Me,uniformBlockBinding:Ne,texStorage2D:we,texStorage3D:Te,texSubImage2D:B,texSubImage3D:Ce,compressedTexSubImage2D:V,compressedTexSubImage3D:H,scissor:Ae,viewport:je,reset:Pe}}function rf(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new K,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):cn(`canvas`)}function v(e,t,n){let r=1,i=we(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),U(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&U(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];U(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||U(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?en:Y.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,U(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),ee(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function ee(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let P=0;function F(){P=0}function te(){return P}function ne(e){P=e}function re(){let e=P;return e>=i.maxTextures&&U(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),P+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function I(t,i){let a=r.get(t);if(t.isVideoTexture&&V(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)U(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)U(`WebGLRenderer: Texture marked for update but image is incomplete`);else{pe(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ae(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?pe(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?pe(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function L(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let R={[Ae]:e.REPEAT,[je]:e.CLAMP_TO_EDGE,[Me]:e.MIRRORED_REPEAT},se={[Ne]:e.NEAREST,[Pe]:e.NEAREST_MIPMAP_NEAREST,[Fe]:e.NEAREST_MIPMAP_LINEAR,[Ie]:e.LINEAR,[Le]:e.LINEAR_MIPMAP_NEAREST,[Re]:e.LINEAR_MIPMAP_LINEAR},ce={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function le(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&U(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,R[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,R[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,R[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,se[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,se[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ce[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ue(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function de(e,t,n){return Math.floor(Math.floor(e/n)/t)}function fe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=de(n.start,r.width,4),c=de(t.start,r.width,4);n.start<=i+1&&a===c&&de(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function pe(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ue(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=H(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);le(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===nt,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&fe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=al(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=al(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=we(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=we(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function me(t,o,s){if(o.image.length!==6)return;let c=ue(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=H(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);le(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===nt,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=we(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ce(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,B(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ge(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ce(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,B(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,B(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);Ce(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,B(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,B(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function _e(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?L(i.depthTexture,0):I(i.depthTexture,0);let u=c.__webglTexture,d=B(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Ce(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Ce(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ve(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)_e(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?_e(i.__webglFramebuffer[0],t,0):_e(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ge(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ge(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,i){let a=r.get(t);n!==void 0&&he(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ve(t)}function z(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Ce(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=B(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ge(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),le(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)he(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else he(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),le(c,a),he(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),le(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)he(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else he(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&ve(t)}function be(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let xe=[];function Se(t){if(t.samples>0){if(Ce(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(xe.length=0,xe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&xe.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,xe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function B(e){return Math.min(i.maxSamples,e.samples)}function Ce(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function V(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function H(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Y.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&U(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):W(`WebGLTextures: Unsupported texture color space:`,n)),t}function we(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=re,this.resetTextureUnits=F,this.getTextureUnits=te,this.setTextureUnits=ne,this.setTexture2D=I,this.setTexture2DArray=ae,this.setTexture3D=oe,this.setTextureCube=L,this.rebindTextures=ye,this.setupRenderTarget=z,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=he,this.useMultisampledRTT=Ce,this.dispose=j}function af(e,t){function n(n,r=``){let i,a=Y.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var of=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sf=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,cf=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new lo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Hs({vertexShader:of,fragmentShader:sf,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Na(new js(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lf=class extends gn{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new cf,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new K,C=null,w=null,T=new Nc;T.viewport=new sr;let E=new Nc;E.viewport=new sr;let D=[T,E],O=new Bc,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Hr,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Hr,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Hr,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?nt:tt,a=_.stencil?Ye:We);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new lr(d.textureWidth,d.textureHeight,{format:et,type:ze,depthTexture:new so(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new lr(f.framebufferWidth,f.framebufferHeight,{format:et,type:ze,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ne.setContext(r),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function ee(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ee(O,i);for(let e=0;e<a.length;e++)ee(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),P(e,O,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=bn*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let F=null;function te(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Nc,o.layers.enable(n),o.viewport=new sr,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new lo,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ne=new sl;ne.setAnimationLoop(te),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},uf=new fr,df=new J;df.set(-1,0,0,0,1,0,0,0,1);function ff(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Rs(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(uf.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(df),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function pf(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?U(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):U(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var mf=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),hf=null;function gf(){return hf===null&&(hf=new Ia(mf,16,16,at,Ke),hf.name=`DFG_LUT`,hf.minFilter=Ie,hf.magFilter=Ie,hf.wrapS=je,hf.wrapT=je,hf.generateMipmaps=!1,hf.needsUpdate=!0),hf}var _f=class{constructor(e={}){let{canvas:t=ln(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ze}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([st,ot,it]),g=new Set([ze,We,He,Ye,qe,Je]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Qt;let j=0,M=0,N=null,ee=-1,P=null,F=new sr,te=new sr,ne=null,re=new X(0),ie=0,I=t.width,ae=t.height,oe=1,L=null,R=null,se=new sr(0,0,I,ae),ce=new sr(0,0,I,ae),le=!1,ue=new Ya,de=new Za,fe=!1,pe=!1,me=new fr,he=new q,ge=new sr,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ve=!1;function ye(){return N===null?oe:1}let z=n;function be(e,n){return t.getContext(e,n)}let xe,Se,B,Ce,V,H,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Be,Ve,Ue;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,Ze,!1),t.addEventListener(`webglcontextrestored`,Qe,!1),t.addEventListener(`webglcontextcreationerror`,$e,!1),z===null){let t=`webgl2`;if(z=be(t,e),z===null)throw be(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ge()}catch(e){throw t.removeEventListener(`webglcontextlost`,Ze,!1),t.removeEventListener(`webglcontextrestored`,Qe,!1),t.removeEventListener(`webglcontextcreationerror`,$e,!1),W(`WebGLRenderer: `+e.message),e}function Ge(){xe=new Il(z),xe.init(),Be=new af(z,xe),Se=new gl(z,xe,e,Be),B=new nf(z,xe),Se.reversedDepthBuffer&&d&&B.buffers.depth.setReversed(!0),O=z.createFramebuffer(),k=z.createFramebuffer(),A=z.createFramebuffer(),Ce=new zl(z),V=new Id,H=new rf(z,xe,B,V,Se,Be,Ce),we=new Fl(T),Te=new cl(z),Ve=new ml(z,Te),Ee=new Ll(z,Te,Ce,Ve),De=new Vl(z,Ee,Te,Ve,Ce),Fe=new Bl(z,Se,H),Me=new _l(V),Oe=new Fd(T,we,xe,Se,Ve,Me),ke=new ff(T,V),Ae=new Bd,je=new qd(xe),Pe=new pl(T,we,B,De,p,s),Ne=new tf(T,De,Se),Ue=new pf(z,Ce,Se,B),Ie=new hl(z,xe,Ce),Le=new Rl(z,xe,Ce),Ce.programs=Oe.programs,T.capabilities=Se,T.extensions=xe,T.properties=V,T.renderLists=Ae,T.shadowMap=Ne,T.state=B,T.info=Ce}m!==1009&&(w=new Ul(m,t.width,t.height,o,r,i));let Xe=new lf(T,z);this.xr=Xe,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=xe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=xe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(e){e!==void 0&&(oe=e,this.setSize(I,ae,!1))},this.getSize=function(e){return e.set(I,ae)},this.setSize=function(e,n,r=!0){Xe.isPresenting?U(`WebGLRenderer: Can't change size while VR device is presenting.`):(I=e,ae=n,t.width=Math.floor(e*oe),t.height=Math.floor(n*oe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(I*oe,ae*oe).floor()},this.setDrawingBufferSize=function(e,n,r){I=e,ae=n,oe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)W(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){U(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(se)},this.setViewport=function(e,t,n,r){e.isVector4?se.set(e.x,e.y,e.z,e.w):se.set(e,t,n,r),B.viewport(F.copy(se).multiplyScalar(ye()).round())},this.getScissor=function(e){return e.copy(ce)},this.setScissor=function(e,t,n,r){e.isVector4?ce.set(e.x,e.y,e.z,e.w):ce.set(e,t,n,r),B.scissor(te.copy(ce).multiplyScalar(ye()).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(e){B.setScissorTest(le=e)},this.setOpaqueSort=function(e){L=e},this.setTransparentSort=function(e){R=e},this.getClearColor=function(e){return e.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Pe.getClearColor(),r=Pe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,z.clearBufferuiv(z.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,z.clearBufferiv(z.COLOR,0,v))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ze,!1),t.removeEventListener(`webglcontextrestored`,Qe,!1),t.removeEventListener(`webglcontextcreationerror`,$e,!1),Pe.dispose(),Ae.dispose(),je.dispose(),H.dispose(),V.dispose(),we.dispose(),De.dispose(),Ee.dispose(),Ve.dispose(),Ue.dispose(),Oe.dispose(),Xe.dispose(),Xe.removeEventListener(`sessionstart`,lt),Xe.removeEventListener(`sessionend`,ut),dt.stop()};function Ze(e){e.preventDefault(),dn(`WebGLRenderer: Context Lost.`),E=!0}function Qe(){dn(`WebGLRenderer: Context Restored.`),E=!1;let e=Ce.autoReset,t=Ne.enabled,n=Ne.autoUpdate,r=Ne.needsUpdate,i=Ne.type;Ge(),Ce.autoReset=e,Ne.enabled=t,Ne.autoUpdate=n,Ne.needsUpdate=r,Ne.type=i}function $e(e){W(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function et(e){let t=e.target;t.removeEventListener(`dispose`,et),tt(t)}function tt(e){nt(e),V.remove(e)}function nt(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){Oe.releaseProgram(e)}),e.isShaderMaterial&&Oe.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=_e);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=St(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ee.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ve.setup(i,r,s,n,c);let h,g=Ie;if(c!==null&&(h=Te.get(c),g=Le,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*ye()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*ye()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(xe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Te.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function rt(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),fe===!0&&Me.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,vt(e,t,r),e.side=0,e.needsUpdate=!0,vt(e,t,r),e.side=2):vt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=je.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),pe=this.localClippingEnabled,fe=Me.init(this.clippingPlanes,pe),fe===!0&&Me.setGlobalState(this.clippingPlanes,t),D!==null&&Ne.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];rt(o,n,t,e),r.add(o)}else rt(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=V.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}xe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let at=null;function ct(e){at&&at(e)}function lt(){dt.stop()}function ut(){dt.start()}let dt=new sl;dt.setAnimationLoop(ct),typeof self<`u`&&dt.setContext(self),this.setAnimationLoop=function(e){at=e,Xe.setAnimationLoop(e),e===null?dt.stop():dt.start()},Xe.addEventListener(`sessionstart`,lt),Xe.addEventListener(`sessionend`,ut),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){W(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Xe.enabled===!0&&Xe.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Xe.enabled===!0&&Xe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Xe.cameraAutoUpdate===!0&&Xe.updateCamera(t),t=Xe.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=je.get(e,C.length),x.init(t),x.state.textureUnits=H.getTextureUnits(),C.push(x),me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?de.setFromArrayCamera(t):ue.setFromProjectionMatrix(me,an,t.reversedDepth),pe=this.localClippingEnabled,fe=Me.init(this.clippingPlanes,pe),b=Ae.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Xe.enabled===!0&&Xe.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ft(e,t,-1/0,T.sortObjects)}ft(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(L,R),ve=Xe.enabled===!1||Xe.isPresenting===!1||Xe.hasDepthSensing()===!1,ve&&Pe.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),fe===!0&&Me.beginShadows();let i=x.state.shadowsArray;if(Ne.render(i,e,t),fe===!0&&Me.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];mt(n,r,e,a)}ve&&Pe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];pt(b,e,n,n.viewport)}}else r.length>0&&mt(n,r,e,t),ve&&Pe.render(e),pt(b,e,t)}N!==null&&M===0&&(H.updateMultisampleRenderTarget(N),H.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ve.resetDefaultState(),ee=-1,P=null,C.pop(),C.length>0?(x=C[C.length-1],H.setTextureUnits(x.state.textureUnits),fe===!0&&Me.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ft(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?de:ue;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&ge.setFromMatrixPosition(e.matrixWorld).applyMatrix4(me);let i=De.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ge.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?de:ue;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=De.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ge.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ge.copy(e.boundingSphere.center)),ge.applyMatrix4(e.matrixWorld).applyMatrix4(me)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ge.z,s,t)}}else a.visible&&b.push(e,i,a,n,ge.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ft(i[e],t,n,r)}function pt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),fe===!0&&Me.setGlobalState(T.clippingPlanes,n),r&&B.viewport(F.copy(r)),i.length>0&&ht(i,t,n),a.length>0&&ht(a,t,n),o.length>0&&ht(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function mt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=xe.has(`EXT_color_buffer_half_float`)||xe.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new lr(1,1,{generateMipmaps:!0,type:e?Ke:ze,minFilter:Re,samples:Math.max(4,Se.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Y.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(re),ie=T.getClearAlpha(),ie<1&&T.setClearColor(16777215,.5),T.clear(),ve&&Pe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),fe===!0&&Me.setGlobalState(T.clippingPlanes,r),ht(e,n,r),H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a),xe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,gt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(re,ie),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ht(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&gt(o,t,n,s,l,c)}}function gt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function _t(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function vt(e,t,n){t.isScene!==!0&&(t=_e);let r=V.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Oe.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Oe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=we.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,et),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return xt(e,s),d}else s.uniforms=Oe.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Oe.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Me.uniform),xt(e,s),r.needsLights=wt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=_t(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function yt(e,t,n,r,i){let a=V.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=vt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function bt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Qu.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function xt(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function St(e,t,n,r,i){t.isScene!==!0&&(t=_e),H.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Y.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=we.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),b=x.state.lights;if(fe===!0&&(pe===!0||e!==P)){let t=e===P&&r.id===ee;Me.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Me.numPlanes||v.numIntersection!==Me.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===_t(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?yt(r,t,i,s,h):vt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(B.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==ee&&(ee=r.id,O=!0),E||P!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(z,`projectionMatrix`,e.projectionMatrix),A.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(z,he.setFromMatrixPosition(e.matrixWorld)),Se.logarithmicDepthBuffer&&A.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),P!==e&&(P=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(z,`sunShadowMap`,b.state.sunShadowMap,H),b.state.directionalShadowMap.length>0&&A.setValue(z,`directionalShadowMap`,b.state.directionalShadowMap,H),b.state.spotShadowMap.length>0&&A.setValue(z,`spotShadowMap`,b.state.spotShadowMap,H),b.state.pointShadowMap.length>0&&A.setValue(z,`pointShadowMap`,b.state.pointShadowMap,H)),i.isSkinnedMesh){A.setOptional(z,i,`bindMatrix`),A.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(z,`boneTexture`,e.boneTexture,H))}i.isBatchedMesh&&(A.setOptional(z,i,`batchingTexture`),A.setValue(z,`batchingTexture`,i._matricesTexture,H),A.setOptional(z,i,`batchingIdTexture`),A.setValue(z,`batchingIdTexture`,i._indirectTexture,H),A.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(z,`batchingColorTexture`,i._colorsTexture,H));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&Fe.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=gf()),O){if(A.setValue(z,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&Ct(j,k),a&&r.fog===!0&&ke.refreshFogUniforms(j,a),ke.refreshMaterialUniforms(j,r,oe,ae,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Qu.upload(z,bt(v),j,H)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Qu.upload(z,bt(v),j,H),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(z,`center`,i.center),A.setValue(z,`modelViewMatrix`,i.modelViewMatrix),A.setValue(z,`normalMatrix`,i.normalMatrix),A.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ue.update(n,w),Ue.bind(n,w)}}return w}function Ct(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function wt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest,B.viewport(F),B.scissor(te),B.setScissorTest(ne),ee=-1;return}if(o.__webglFramebuffer===void 0)H.setupRenderTarget(e);else if(o.__hasExternalTextures)H.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);H.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&H.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest}else F.copy(se).multiplyScalar(oe).floor(),te.copy(ce).multiplyScalar(oe).floor(),ne=le;if(n!==0&&(r=O),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(F),B.scissor(te),B.setScissorTest(ne),i){let r=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}ee=-1};function Tt(e){let t=V.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Se.textureFormatReadable(e.format),t.__typeReadable=Se.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let u=Tt(o);if(u.__formatReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,Be.convert(c),Be.convert(l),a)}finally{let e=N===null?null:V.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let d=Tt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,Be.convert(l),Be.convert(u),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let p=N===null?null:V.get(N).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,p);let m=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await mn(z,m,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(f),z.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;H.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Be.convert(t.format),_=Be.convert(t.type),v;t.isData3DTexture?(H.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(H.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(H.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,k),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&H.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?H.setTextureCube(e,0):e.isData3DTexture?H.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?H.setTexture2DArray(e,0):H.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,B.reset(),Ve.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return an}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Y._getDrawingBufferColorSpace(e),t.unpackColorSpace=Y._getUnpackColorSpace()}},vf={type:`change`},yf={type:`start`},bf={type:`end`},xf=new ba,Sf=new Zi,Cf=Math.cos(70*Un.DEG2RAD),wf=new q,Tf=2*Math.PI,$={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ef=1e-6,Df=class extends il{constructor(e,t=null){super(e,t),this.state=$.NONE,this.target=new q,this.cursor=new q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:Oe.ROTATE,MIDDLE:Oe.DOLLY,RIGHT:Oe.PAN},this.touches={ONE:ke.ROTATE,TWO:ke.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new q,this._lastQuaternion=new Wn,this._lastTargetPosition=new q,this._quat=new Wn().setFromUnitVectors(e.up,new q(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rl,this._sphericalDelta=new rl,this._scale=1,this._panOffset=new q,this._rotateStart=new K,this._rotateEnd=new K,this._rotateDelta=new K,this._panStart=new K,this._panEnd=new K,this._panDelta=new K,this._dollyStart=new K,this._dollyEnd=new K,this._dollyDelta=new K,this._dollyDirection=new q,this._mouse=new K,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=kf.bind(this),this._onPointerDown=Of.bind(this),this._onPointerUp=Af.bind(this),this._onContextMenu=Lf.bind(this),this._onMouseWheel=Nf.bind(this),this._onKeyDown=Pf.bind(this),this._onTouchStart=Ff.bind(this),this._onTouchMove=If.bind(this),this._onMouseDown=jf.bind(this),this._onMouseMove=Mf.bind(this),this._interceptControlDown=Rf.bind(this),this._interceptControlUp=zf.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.state=$.NONE,this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener(`keyup`,this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction=``,this.domElement.style.cursor=`auto`}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(vf),this.update(),this.state=$.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;wf.copy(t).sub(this.target),wf.applyQuaternion(this._quat),this._spherical.setFromVector3(wf),this.autoRotate&&this.state===$.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Tf:n>Math.PI&&(n-=Tf),r<-Math.PI?r+=Tf:r>Math.PI&&(r-=Tf),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(wf.setFromSpherical(this._spherical),wf.applyQuaternion(this._quatInverse),t.copy(this.target).add(wf),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=wf.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new q(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new q(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=wf.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(xf.origin.copy(this.object.position),xf.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(xf.direction))<Cf?this.object.lookAt(this.target):(Sf.setFromNormalAndCoplanarPoint(this.object.up,this.target),xf.intersectPlane(Sf,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>Ef||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ef||this._lastTargetPosition.distanceToSquared(this.target)>Ef?(this.dispatchEvent(vf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?Tf/60/60*this.autoRotateSpeed:Tf/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){wf.setFromMatrixColumn(t,0),wf.multiplyScalar(-e),this._panOffset.add(wf)}_panUp(e,t){this.screenSpacePanning===!0?wf.setFromMatrixColumn(t,1):(wf.setFromMatrixColumn(t,0),wf.crossVectors(this.object.up,wf)),wf.multiplyScalar(e),this._panOffset.add(wf)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;wf.copy(r).sub(this.target);let i=wf.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Tf*this._rotateDelta.x/t.clientHeight),this._rotateUp(Tf*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Tf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Tf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Tf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Tf*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Tf*this._rotateDelta.x/t.clientHeight),this._rotateUp(Tf*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new K,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Of(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),this._isTrackingPointer(e)||(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function kf(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Af(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(bf),this.state=$.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function jf(e){let t;switch(e.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Oe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(e),this.state=$.DOLLY;break;case Oe.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=$.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=$.ROTATE}break;case Oe.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(e),this.state=$.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(e),this.state=$.PAN}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(yf)}function Mf(e){switch(this.state){case $.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case $.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case $.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Nf(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===$.NONE&&(e.preventDefault(),this.dispatchEvent(yf),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(bf))}function Pf(e){this.enabled!==!1&&this._handleKeyDown(e)}function Ff(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case ke.ROTATE:if(this.enableRotate===!1){this.state=$.NONE;break}this._handleTouchStartRotate(e),this.state=$.TOUCH_ROTATE;break;case ke.PAN:if(this.enablePan===!1){this.state=$.NONE;break}this._handleTouchStartPan(e),this.state=$.TOUCH_PAN;break;default:this.state=$.NONE}break;case 2:switch(this.touches.TWO){case ke.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=$.TOUCH_DOLLY_PAN;break;case ke.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=$.TOUCH_DOLLY_ROTATE;break;default:this.state=$.NONE}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(yf)}function If(e){switch(this._trackPointer(e),this.state){case $.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case $.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case $.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case $.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=$.NONE}}function Lf(e){this.enabled!==!1&&e.preventDefault()}function Rf(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function zf(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var Bf=`data:image/png;base64,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`,Vf=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAHO0lEQVR42u1aLZSzOhC9vLMCGYmMjIxEIiuRlZUrVyJXIleurEQikcjIyMhIZCQuT9DQ8Fd+2vc+8XXO6elZCM3kzp07k7DA2972tre97W1ve9vbdlr5ze0bhTsWukisLpJdmHwcnTC/MMsZQX5hNruq4G8GnjMCAJDKQOkW/0sAGA0H338z8D74e8n48Qz7AeBPZYGf6vRc/7G5ffD3sh8A/tn7wCWhdsx6RkNcEmr/FAB7dfdZnR9fd+Bfa72bCB97gHdg+6nnskDpth9zxJGtmeeCL5UZzF9+c3tEAo5Kjs/+ZyzYs2il29kA+Gnoj30VGM6HpWI3d+9Vcy8B76yomoEfe+cO9izasW3JxmOeBWPsw6NOY2nc0bnXgF/yZS8Bg62THwmAfz39lsGzAPgLdtnmZ91cdh6Ze2tNedR2Op/W5p4twnMgr7HhFc+usW8sOz744/vj+rBn/md13fdlbe5/9jiwBuTS/b0L2hqwrXuQvQTYmjGckVUf1ggwG4CyNi9hgQO/rA1ewcC1xS7dP7KWrXuLpSAsNSub2tCujaT2UdezVR+P9Mdd+pqFdrfZxfQjxwN+ELYUY84IOJu2xlsIGGzp/V1E14IxtyM8uifIL8yeT9FmQJd8K6rmJS3plkDMZV1Zm4cYbHbslMRWN3f2ieqM+FT03z1roghVLf6T/n8pCI/GvGo/wBi1ojrj97tc3Qtdxa1TU+vk+9gKPucMkIALghFi8O3A55wBgH1FELKrCi7JVApdyr9a+tasJ5roJJJGXYY6TOJbwl7icHPgVwedPgvLw2qYjlU97RxOyRCI9oTq9/w0AKfPwkYqw1gKl85jnDUsf8n8bl9wLmIYVfgk69YpFSIM61KakM2dVLC2eEIotCqR0FuUOQUA/F4r6KYBjSJ8Xk4dMaQGANQ6AmUpjNFPgXD6LCwAaFmAhk3PtnhaGiAa3BnZRqD8DAAvCQKLU5t/8vtct3X2wZb1hCBb5W/xNDROM0sIHV7j978NSVB9UxiSzN4HAEIo4jR76qSSENqDGaHBJZ5vNS9x2DOR8jPGvj9TfEnEJji4tUqp0CA6/J5kNgDZ18WS6B5xEnHUOhowgLIU5yIGZemAEbWOMH42+7rYI+x3IBLSBdqxa+443H0MSeA/57LocB2qhoEUUuP3WiEvW9Q6giEJdBuB0RBpQgZtaH5hdncAsq+LjTmFaSSMuQNLWYq8bHuQjdEozgLG6D44edmCsvSeJUbDNBIxp7uCcEpiaxo5+J0xu9KE9J8x63y/TSNxSuLDQSARA4k48rJF9itRCgOwL1CWgrIUJOIgEVtsjXd3QS61sjREXsouEI0C5edbEMqe4eciBolwc1D2uq9lAZe2WRrOytMjczXFzeV8cMya29m6626cA7+b/4SqFoe0n0QchNAuCyPdZ5YvkV0NUkihB764dySPurFJBvhykqUhsjTsC6CTlD7Fb4EghA5kh4ZN/+xS4VpMeS9TsjQEDyuYRsHX4bkdss9Y0yjwsBrMf0QGx9q/NlbpdgD+oRqQ/1wDHywhNcC+JhEHAF1ns9fBvjD+jfznGrzihNE/8nafZ48clkHlEzmdSNztumkUlG5RVM0uP4I1JkqpAPY1ANgYPQCfJvnkPtRP3y/vBd9nq5QKhiQwjcKFqUVtdYu+KtbptqkH/fpeH1icWtd9+XImpB40JAltuhr32wUnDuXgpczaZjBY10A2KaxaFjibe5EsCJ+0flqVHStEeYj5pyS2uo0GMsBM8bCwKd1CER80BRo2h45G4jSzrqYN68nCsUnZgkQcWhaIQ3nbMPPV9T/8rwjKz4M0dI5URA6uVUTC71pc+voM2mtVLQIHftdpcChyXkxvB74b63T56JHIeN2P6piQuq+NlJ8hWg7R8k01JHi4EfMKrmO1Y4HvjOtwltpQUeaHGDgu+n5mOZY5ps1lqiPF0fnd7/Waf5NVv6MTUk9k2o3XsljNgM3/lmKMHoAfeudBAkmng2mIX6Fftgsdg+/2IybSUA3ruyM6M64HY5SZW02UeUCz1PYbQaNhSIJSKJRCDvcJ7DRpTbUqN8nvYgC6xfE+mnGdgd+IIDUgoqg/C4qrGvzWfscaEEk++J0jZho1YPQYXEIoNMrFMT0QsjhMAGP0YFe9lSTG6M1Zt6kIjzsK151UtQj6o+rRPde5HC3CYxmYA0fL4uG5j1blIflZOhIZt6Bzgdk750MJUqIMWJxaYxpAog+ClKo/A9fNwr32OfB77U5hZ1nWSChRBiRido6BR2vPpBn4PQd+PZojgvPnCOFWa4D7wfSUWClVD7p723P7trjJIucM1Y8IAP2SOmBUAaMKgPD+XIYQ2kubaRTAhhsiGIlXmguky3b/SP7ZTN/8RswdwQqpAQkopSdvwpxjpyS2r3otqZQOGKOWhg1gGsDUkD4BRBnASEujCAQACbvQb3kdeMQcCR3Zyqp4aq5/AbgAIHJkTxsYAAAAAElFTkSuQmCC`,Hf=`data:image/png;base64,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`,Uf=`data:image/png;base64,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`,Wf=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAHAElEQVR42u1aLbCjPBQ97DwRGRmJjIxEVj6JRD6JXLmycuWTyMpKZGUlMjISGRkZxwoIDRRK+Pm+FdvMdDoDKbk599xz7w0F3uM93uM93uM93uM93mPl+J2fmjcKDyzKc9aU52wVJh9bF8xT0XDGkKeiKUoZ/cvAc8YAAEpr1Nrgf3FAzOjg+18G3gd/LRk/9rAfAP5WFPihnp6vf21tH3y9kv0A8GPtD9IkbsasjxlFmsTN3wJgre7u1fnxdQd+WdWrifCxBngAYIzCDz0XBTUz/ZwthoRGnnO+0nqw/u/81GyRgK2S47N/z4jWbLrWBvGEA/ww9OceBYazYS7ZTd07au054N24STWwY+3a0ZpNO7bNjfGcvWCMbXhVaczN27r2EvBztqwlYBS6+BYH+Nd/FfdoLwD+hrU2YIz231NO2Lp2aE55VXY6RyytPZmEp0BeYsMRv11in7/ZMfjj++P8sGb9vbru27K09o81BiwBOXd/7YZCHcYCe5C1BAiNGM7YYh+0RIBJB1SyPoQFDvxK1jiCgUubnbu/ZS+hvcWcE+aKlaAytCsjm5qZ4AfN6eOW+tiF72S5+6LZeVWdbRnp+RqFJGPOGDhjT6VxCAGjkNrfhfuSM6Y6wq09QZ6K5lPwYEDnbLtJdUhJGuKIqairZP0Sgyi8EaONMo9Qq24Zks9r/917nhqUlflP6v85J7yac1Q/wHncVLcMv37eFnuhu2ptU2qZfB+h4GeC4So1nBPul3rw7cDPBAOA5ggnFKWM0iR+kkIX8kdL39LoiaYMgBqcdkB3mPCOnydOgx2/OCnLeZOOrp3v9mne+USGeQTAtVC7Achy3lhpMZbCufMYN4ggh6zv+oJCVqjVgGQAgKvUAIb2JCIOrqSipc0zRqCkwRdrAU6SVpd/FncoQ8GpwXd+amWpatvyi7bggkJruwuELOcNANTKgtkH2/hEsaMMekZqQhHz1t4jnJCc4ub6JR7yW6nB/esEQULlb/Y09DONG8aGrHbgA4BlFL+zBNZjo3+/NYbgM913SsoY6cEEKE58utRsr3cdMScY274n+dLRkknC+722EWA2vyeZdMA15w31NkAZwUXbAQO4oChkBS7ogBEXbTH+7bVj8lr2OxAZI7CM9uwaN2D+9Xbe43fZhrUH8qOGJWRVKfws7shLiYu2sIxCk3btRMSDMjRPRbPaAdecN0nCYbSF9kDngiIvZQ+y1ha5SKC17Z2TlxJcPMDR2sJoiyThq5yQJrQx3trODp9diYj7z5h1vt1GW6QJ3ewESlsS5aVEdpH4VhZEMHBBwQUFZQSUYvJlTEgUPGlUfUl7Yx3gxjzCWknTM9x4bDee7tfKwoVtkT60M/4qg/TY2ZCXEpQRGG1hDJDy+Knh8RmntEap6h40o22/fujaY+335cw5dixvbs8pjwe2hFRjTxHgy0mRChSp6BOgkxRnAPVC3ZcdZk3/27nENTf8SClSgbQjgK/DUx2yz1hjgHTk/C0ySOm6ubU2A/A35YCsUJEPVlUpEK/s8r0v73byOhEM42dkB1QjtTaDI2+/H9hz5DALqrcnJ6djiXPXjWll6CbVKjuiJSZepQYRbACw1nYAvjiRp/tW6r5eXgu+z9ar1LCMwhhA0PkKw21aGgNKAaKH9fpaG5z8+LmkSAWqSg0Kki9GkCQc2UV20f84pQ1pBqMlIyjFU2JtNf70MM7cn0o/JQ2MAar7tm40TWijCR3IANGvj6C1NrCeOhnTyuGWrvwzjRuX03wHzB6bdPmq7Vk6e8jy/l/+KyLmQ213hiTJ16gu/oJftbjw9Rm0uvyrTOTAp12OsQyzf/1w4FMvH1GKzedSdKKPmMtjVaX63BhzAk1a8ENySPSKAX7Cdax2LPCNcU3JXBl6K+tNDBwnfT+ymOdvt9mptQFsXt89z0WBk1W/4awq9STTbn6t7GIEBP8tRXsh2Opg4lMAScJRpAK/KnVYFzoG3/UjfuKjFIgn5jGvPN4ybmUdcSEa9yzdNV3fygJKDvuEUY505XqI/M46wBiAMngamOBbxV3FQUF02Z8FXZCi6u4ZTQFUg+dsGcYAXJDZ4wm3SZ/1U/NqZTcTQGs76Kq7Q5hFkugVUR+UhMcVhatOyspE7qh6fM9VLluT8FgGpsCplX157qOk2SQ/c0ci4xJ0qilbu2YUUo4ZPTyGde8FlKojzuNm6h5l+8B/lYv8jU45aU/uWcpHsxHbSeLaPS/mAPfAc86b9uQPPfj9Wx8e9/cywdqaWx2SBlArAMqCMtsfMTBGemlz335eMMf8n2CQD/wXU/6R/N5ID34j5o5gXdb38XUR4AxLpW6Oei3pooxZA2jAauDmEaC615HRbRQSAAyAAQ16HbhlOKI5sp3vdtdafwCYcgASJfKVtQAAAABJRU5ErkJggg==`,Gf=`data:image/png;base64,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`,Kf=`data:image/png;base64,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`,qf=`data:image/png;base64,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`,Jf=`data:image/png;base64,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`,Yf=`data:image/png;base64,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`,Xf=`data:image/png;base64,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`,Zf=`data:image/png;base64,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`,Qf=`data:image/png;base64,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`,$f=`data:image/png;base64,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`,ep=`data:image/png;base64,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`,tp=`data:image/png;base64,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`,np=`data:image/png;base64,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`,rp=`data:image/png;base64,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`,ip=`data:image/png;base64,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`,ap=`data:image/png;base64,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`,op=`data:image/png;base64,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`,sp=`data:image/png;base64,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`,cp=`data:image/png;base64,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`,lp=`data:image/png;base64,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`,up=`data:image/png;base64,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`,dp=`data:image/png;base64,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`,fp=`data:image/png;base64,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`,pp=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAGgElEQVR42u1bIZS7PAz/be8EsrKyEomcnESe/MtJ5OTkyU8iJyeRk0gkEllZWRmJ4xMsXGFsA1buzOU93sEopEl+SZOUA/7oj/7oj/7oj/7oV2iz5CGT7hoAyKsacRQAANSx3PzUpH+b//kQNQA63nlVI7lUi/hvlwoPANrS6O8/ofypv6/Fn5XP50v5b5dYful9X8j7Lf4m3TWu1/ngP8sAcRQgiD6761CK7jyIPh9OzBcN+bv8foK/q3x3HmPXq4WguroiiD47hnxeV9cfibvMfyg881/TC9yQ6+rB5X+M1Sz+H0vcv66uyKsan4d/uF6yHvLOh6hZuiC9Qj8jcGgEFv5ZePBBoRRIc4tjLHt836HtUlcMVdROSkXIq/pHso8hAvkYu7+KAVTUGWFMJ0v4b+cKz8oP92E7qX3YM8JaSuD3PzL2q/u+KC0JuUFnhDS3i5U/2QBuXNOWkGQF9skZALBPzkiyojeBuXFwLvqHSnav1wJA8XVoGHTFOUFu4IXndi4Kc9NOoDe524TWRh9nXdpSO5fbwQpws7LVMjEF1Go8E1wCwEkGqBxL8wRi1Z9QrL6RUHkWej8ikLbUHVPGv0vXsoAuNE6nBObyH2L1veiHUnSGcM+9tCL2sWrE7X1EQATgc7fv1gAA0IXGtSxQAXDHFrnZ+FC+EICivgc88w4j/PF/hOySgJ249wDO1qZmgi89QAhAyNshWnQzGsaU7471QfzOWc945O8CwQiAj0C0RnDBwClwHAWT65HNFNd3lUD2G+GuklhwHsP330HhPlaNujma0C3aGGGu4MPf6faM0f68wI0EQzlrAg6huKvOpzQIt3MR6CI8OyU91PtGoPuOkvpuzrGWlT82zqcXZKekBzqWU4WtN1w0dcnBnHR4+6zyvdwqPrL9w2jgnCSoqyvOSQKj78cAwCWWi1sD50PUuEYNBO76Pny4VbE7Tkh/rYnrJeuMQPYeKMxXW0Ka28mp6fZV3p3uJOJAQBGgq3YxzE5JV4HW1RXZKendjwOBdCffypG1pZ6gQvTf5fZh3Gdc1JP1WxdcLxn+SdEzghuGygWsPqZ0/4ZCDPs/10t2p7wY8q26IJQCpqbxOeH6sBJ+lB35KARDKaAtwRoAqh+S2RAV2kwxnbj2fDxTgLYEVK0AXPm1f1sFu5Nz73OOzJP2kg1JoLzx5jkNFVQSEIYrtSBysznGqhFSQREhBOF48/IvY3uGqMiTB3DXD5VAbtq3KiGgCUiyGp8hcNUAIKAEYIh6Wcm7XjCkLvUjIBTfUmoSoEH8902XU9wAgLH1nWd9KYkvYxct/i+zoPhsu3CzU61BdreUq7RB75rvx1GA+GzfE1jfw4gzDikCaBLdIUWAQLT3p7znHWIDPAp/c2uWh3Fqt1MN57baEggSlupO2cbW2EcCRUVQsjVEqQlSBBCwHUIumlCW83NxzrvHBFKkeopQMoAR5m4cx+V3awEX/WRNFxncesSI+/pgCt/tM3fPLCEtv5UvRdAKa+tO6e61FAEs1SBIpCUhs7RKWFAywD4SQGixj0Q3l7XI2HoU+RwZNIm7OshLCBKiDSus/H30XJv7SHRG2Cn5ViH0qgVR1Br7IERR69VbEqUmlLdQpkn0N2FI+N8Rc8tuF/luDHQ9YPg7G4EVObc7yePJPlc+gKdG4Off7Y7mZdtYYxnT3CLNLa66XY9W3ZI0RLBU3yn60eKkZKt8Q+tuD7LSn3mAT8rLatOBSioIqbr1cPU94VAQqkojK2yH7CFZqpEVFlWleyniu0T2tRHmPreUzv8CGCJIULcuPNKHlzrABfExlr3NaGO/F2QB28VadxyR/7bwb9H5EDVuuvkVd+kK0tyC1jDAWGHGqVdWmt423bAr6av6dZt7U7KLXv9I+vGEY6watx3DrZZnLZCpwHtqAG7F5AYIJ1S0XSvWOM8LP0ZwlTtmiLsOpYTXNkSv7dFGvuYYy7ebfdupG9HuPmw+qHlyg97+LI9fvMAOBB4qc6jsV8r3vTX5CHCrrAEcXnoNuhdfLbR/W0MtBSKvP6zMZ4h+dM/dmfvJj4SH6+dsDxgihjc++m5oNny8GrsEgUVuNmObH3OypzU25k26a8ZkXJqBbeZ8j5/mtg03+l6oMFRNrJwOqqd/mnjWE/oN5Q8/RWR9HI7fxeMc3h/TF6LHymePAFQD5+NVLwXXTZCxTfEx1K2h+GHMd9dB1sdS/v8Dhm1ji8buNd0AAAAASUVORK5CYII=`,mp=`data:image/png;base64,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`,hp=`data:image/png;base64,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`,gp=`data:image/png;base64,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`,_p=`data:image/png;base64,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`,vp=`data:image/png;base64,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`,yp=`data:image/png;base64,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`,bp=`data:image/png;base64,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`,xp=`data:image/png;base64,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`,Sp=`data:image/png;base64,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`,Cp=`data:image/png;base64,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`,wp=`data:image/png;base64,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`,Tp=`data:image/png;base64,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`,Ep=`data:image/png;base64,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`,Dp=`data:image/png;base64,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`,Op=`data:image/png;base64,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`,kp=`data:image/png;base64,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`,Ap=`data:image/png;base64,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`,jp=`data:image/png;base64,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`,Mp=`data:image/png;base64,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`,Np=`data:image/png;base64,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`,Pp=`data:image/png;base64,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`,Fp=`data:image/png;base64,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`,Ip=`data:image/png;base64,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`,Lp=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAGQ0lEQVR42u1bK5SjPBT+6FmBRCIjIyORkZUjkchKZOXKkZUjkZUjkcjIyMjIyEpcV9BkAoUplNA9+/9zz8mhvEJyH999JAV+6Id+6Id+6Bl64+X1X5/D7l8ePCEM/zsBfOb7q3k/XP3j39T+f90KoiUPm/fDtaUUsVLumj1Pjx/RqwZt3g93TN/i+2+8vBLCcKqKaKiEGSPuXEiNt3MdbWoB75z2Jn2o42/vv4L5QupvhbKWPptTpLVEWVTXsqiub7y8WuYLqd33M0ae/v5sAdC0k3isFA51DEIYDnXsrMHe35J8uLOT94WwBRxaIVifUxmKllKwfA/fCp5Vgt0S7RdSO+bbAR3q2DFhayvIGEFLqfvtH1tK7xgSUggAoLUEIQynzwSxUmgp7bXNLMBqd2UoCGGwGmEHVBn6MiuwzB4yf2uqxW8MIThWyiGAPS61wtkQpIzuhX+W+WP3tyIhtZvoUPNipXpwFJqU0lGGGlpLp4BV3fSY/8z3fy1xvhlqZMmlO2EA0A1AQPSePzYq2lII2cT1rSljGXJOcD59BPv+bg78KKORl4eb6TU43CTv/87LA5TRL4EhG4H47VW0P55QmTaY4HdztV83ndnV72UHQ5z1zu39rZzx3D63CgSasrj6c65M65TyJZmwkAIZywDGQSnvrINygHFkLIOQ4gUQQFbdX2d1ojfnIo2hG+l8n//tJY54N8f5GpZDJBkuxkCfTjgVnSacCgZ9OuFiDESSwbB8c2c8xeQtmQ8Ax0ZFupHd3GXTU7o1MPRQACLJQAgBIQRdBiigG+laZxnEPSOSbBMG+L5lyGz/fCsf9Jnvrx/117wvxtxFgMPcJIgACCGghGDPuQv5hBSu2ZBwzznoTQjBazJvxXUsB7BtmAv4z4eiszRgaevBMUGx507gflkimAVY7bcUKwWYtAvHykPnE0zaK85tYQWccyijXR4wzEBtQVBIDWU0OOebWEFeHnAxBsWeQ0iNc5xBZx082/EthaTHYehNAEp3nVIW46OWOB4rfNQSlMX9+4EtoCx/X4d9+gIfO6eEoCx/B7WCw57heKxgC3E6y0Fv6MA57wlhiR/89Qh+nPRb4To/FV8aVtUNIIGcARLk7j2sXnQhzhphBCA7Mx8y3Y5NJBlY4DF0viUGS1u0lKIxKfZe/5QQaEIgNAAjsCQR3c3BXYuxymhUpgWvalR10x1NC2X0XT0mBA77fVhY8U19yHz/udC+oKobFHuOWKlR4fYUJZQPGH7IZoBFGoOmBEUa965PvbeGtAdthuVOCFXduGaZb1juINC+F0wAptN+IfUozD4bgDy1JixNDCVbSBNj2zXfvv8hNyEMtczmIGPPB8+I0+zb8RJCFlnebg78KK17mCtxcc13hGqgdWsgYOxdq2U20rLNXhvTzC1CUhXQun7N0T7rgLsiaNJjvj0XUiNnwFl/vb8GBnzt1frL7OkE/tLB8yHhkFJy/au7IqwDflSyGFsY2aI45lvClOaHHgNDchd5fecH5lrebqkDtoPxj2OOeGuyMXjovGMyCWPpU9Yb1An7DJ9zfU1tZg2MkAk4ehZ+GBKXgCFwCX33iAF64ICHzPbPY6XuJpyk6VMQUMRmFN+XQJTfDwKsQ38XAQX1ASX5EsIxNbMlL2T3vBVCSdCrGv4X6JE1Ls0HdlNpd8mTngNmSHraPvzNkPQccckT0PT5PEGZL2GqW5sbIiqtnfKsWZ/wo59YKbxhfl9WiR9Z/2QYGiuFklPnYBniHsMlLndwVJkW+Y35jyKG2RbFgJYkkOcaCvldkXAYlxNxBsv3iFsTZK3Yn+PFGLDbRoSWFONCgwQlgBQmzK6Iv012FwTL92C33GMoDMv07mQffIvKqchcfxZSGeSk4gZJxITUYIONuHPI1uuF1G5xIsQ2lV4g4AnDZzq+WU5cnf0OdnzM5cujbz8MQ3lV3+H/VDTEkIBX9eSGLixcg5161+5I89ukH1nBfKV0FGIuiwUwZr5+3We0QDeoDTkMX8EAK4SlcGLL0yE0/9G812j/dDHuttc9VgpK6eisZDRWgBsW5pTSkVI6shr57J754STeznW0JBQOxXxrBUv/e7Dk/wLRs5mhL4ChqW5J75xex7LrkEzHzF0SIf6k8Qdh/AcOkP5eMAAAAABJRU5ErkJggg==`,Rp=`data:image/png;base64,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`,zp=`data:image/png;base64,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`,Bp=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAFfklEQVR42u1aLZCrPBQ93VkRiURGRlYikSuRTyKfXFm5ErmyEolErkQiKyMjI5FxfCJcCCntFgr7Zr/hzjAtf7m595z7k7TALrvssssuu+yyyy677LLLL5Io4e1vt+HlN09eCIYdgH/M/i2iIEp4m57Ej0TXYclL5V87OakMBLcsTM7y8FPOJ/2urK0/SnhLESalQV2qfvzsjbeCM0QxBwDUlVqsf/ZLunhrEUaArpEUEuUfAToP/3wdfsL5ZLgrzzjhERAIiMQAvfM7u5/R/zLb+QDqokBSSAjBkBQSdVHcZOYmzg+j3mgAQBghivnq+utSHaQ0o5pTMiDT3TVd93NZqn8WAHWlkOcSp8qMrp8qg6SQ/8tOyweBgIg/pCWArnsiTEXmagBkb7yVyqBkQJSwvgMRgiFKulypDLK3bVrD0bgO89w0cPXciiDUpYGUprebbCa7l+qfFQElG1o/YgV9Unj+mJDTHedvKVKqq/xeBk4axPj75m1oI63zmx/MPFKZ3sipT5eJ2wFhrkAo2XL9DwNw+hozIBAWhEDcf24tOX2pQ8nGIJDBZHzJttMPAJ/HY0+8KXIsyQAvcycgpeknQM6na5/H4/ZrgA4Ecj593zr9ZW+85bG1r3xPQTWBfFEyS8i5BHgYgFTY4tJIO4FGDoygc/e5tSUVvCUdvrPpvJHb6XfF8AQpH+ymY6pOrAJAKngbAkiLC1JuJwAAxAiaUFpcEG4AAumPOieT0+kg50fAJvopBeZZjuqcgqkScXREnuXDom2h3tdHHgoBCAacAGgAOv9AdU4BANU5hco/7CSJmSvXQtIvurHricIfAYg30j/keSD+m1/pJYkZAMHbfEYkfPvgSfBWd4OLAEg1kHIgjo7g8RGquqCqL8gVkIeAbIDKWKdl8vmC6Oun8X3x76+l343CGkBCZAgcYBrnu7EkfRSE17kTyUMgVUCuLkBxGV3ftP0zNgJEAMADIXYcIjdi/y3nA955My8C7wKQH7ucZjqDG6vsxKyhpTMpYgKxTzD7fnpZzkJXv+7GF0F3TIHU2OfW0u8K2SkNUOmJ9BgsG/fbCCDG+SCggd0ZnAh999qzQrq0GaLgXpRgZf39wht2DuR0/7rUAxH1Gl1QfuQtoSoCO3gI6+SzBoKIoYT9POtr59N7PYsXsN9nlcZtpxL7ffCW6r+KgK7Ck41JaI+wu6Y731Tm8fw/fzvarf7dzp+7A6g3zP9kfGWss/2DCLBVHbi105mEt9dMiwHw2SebsROm9mJc412WLmHhSVyzn5gXOkxzD/e+HwWnJ9cF382f9IZb/yZMfXbt7MNIZVB791dlfzMY6RvrHu59YN387+90+hFGKXqKAIuKsFvsiP19YdN2DyjvFkO56vaE5FAwpVusV0gJV11Gc6NY37n/9B5UMHaubG60o13Dkj64IHu9xzxS4Oa5EkDg/yAhzdCSdi0iMXC1TujO+dTza0UApR8pDZAwhKW5Iqk7JxeERSko7VaefUs3seIzmvc7gVIaGM2vnO2yX88oTP5zS/tr/71n94fIZko1S2yZvQ7o829nTGYAFnCEoVdyQuvkrFHIsU0O/ldC6ZdAANSQaptpgsyJgpfvEOuZ3DnUOh/QWveHe90HbQ4jtt5KXjo+ZQPTqHHhDZ7X+fJIGMtmYH8fko3qDxIWcGTmPgi/TTKpDu765pPxh6LbXbwuAsBt59wuxmX9rWvuWkCw59rPtdrYpwqxVIePowYL+Ihw2Oq/oT5qJYDMafL9SbjnWWy3KO6N9+uioPtLDgvVImDvpaEXH2m/lSP2R7FF/+udjcAgp3+9M5hG9Ut2igI3DX3XF9N9PbGiXsp+6sKAeXs09/5oIIJhfvf2ph5Z//wHJSpSQKGru/QAAAAASUVORK5CYII=`,Vp=`data:image/png;base64,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`,Hp=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAGkElEQVR42u1bK5CzPBQ97axArqyMjEQikcjKlUgkcmXlSmQl8pNIZCQSGXklcmVdf9HeNKS05RH2n53ZzGQ6UMq9OffcRx4F/tpf+2u/tO3j/Pzbx7D9zcoLEeLPAP8z+9fwgn2cn/O0/BHv2vxG8Os0uQMnKeuNbyOwhxG1qFRh3v8Vy3MoBMJQAADalmbL3ywBoCVCKMQqADyTzQO32xIQxhiBDRGhBoN/EhIB6UXyJ4egrsjOcp8gDAUaXD7lPkFXZOefAv8kpBk0AJyERBiKQc9Y0ipVbIjaXs5pkOBIF/kBaaPLXPnbqeADgK5qZFUAIUJkVQBd1Q9Dw29vrhHYEPGxRtsSAtKGCEOe6dUAbUsoK4W80b37eaORVcGqQHzF0hjXZp4dBtznfBqhbg4gak3llUSHGy5Es+VvpwDQEqFBgiQ6GEWECI0yLdEqAAw1Bt0Gf82mNd3F9xofhv12SFzNAxoksCsD+5Pj45qtJTKDHPq0mbhWc8NRjQ80SGbLnz0P0F0Foha6q36EgZ9KbxokfSNQH/wGCT6VXq0ay8NvM+4hcswh4HYKAPa13O2huwpyt3/6nO9mjEA3I8wd/NQcJOKL9xe5AOcENkaDBLqrJo9/O5UBtlAGn+/l4fd6M999emZvc8Hma91V2O/T9XNQGCPdBShyAd1Vtz6QJ7wZgAemu8oIZpfka/s53+ALISBlDNsI3FkvKWMIIVbR4VPpzb/iiPorB1qFKIzwrzjeIoKMZ8l9mwJAVpdIdwEQxgAKiDgEanVlxBFZrZAkKfb79FxV5cbfopsw/VKR3OcdKWPEcbwq8Zv3COVncSeX21X+pLGPejDPD2ce/Kn6QhRG4HgIAKRaNG2DYP95DUmEojh4MUCeH85EhDiOIYWAJoJS6u4593shhDcdTAjUF4IJISDFbdKlreqHiEBEGGuE7VgAAEAKgbI7oWkbkGp74JfdyShFRMjzg9cwYOvgMp3Bt5/zPw8YBp914m57qrcQZLfiq0T+maKs1SX8WPd9t6K4LQkTETTRbbBpeg/SlX0MQlGU5zxPvXgBg0+OB7IsOQH00QawAVBKAVemZdkBRIS6Lo1iDAC7vy8AbGbT1QCvvIQB0R69geXz+937ZDF/ihe+jQXANYLNCjf2+gCgKMqzC7btBY/Y7+ruywuy9w7H790d4+urN9gGmpKE38YA4BpBsUKNRhFJHNVu0B19AWAzj0ngNjb+GE+ZVfqHAlCn+9AUx8YIdsIea4S3OUAYhRrdU4zjr4/KxwXQTm5DVdCj5CeFQJ4fzksqoksobp6WyUMYza6CXPfXA/HPXQyz458detgLZlcfjlx7TuB2+zntuRqyVzqHQp2YUQFN9oA4ji8Aa4V2F5i1GN1pCJGa7+H99MPrKsN3yMHA0rMQ1CPGUDk6NQy9PQo10mIShxZ5jbFyt0d5XRIou5NZE3JrcV+1+bOBPnrelwew95rNmHe6w8jWaSoRtq9cnxONyfp1aXaEuNv3pRBIrCQ5FQh3PWUus93fLV0feu+aqxHGh5kxMrdDP7JLqqEpNyvD/b1r7sB26/cfWaXEGhsw1DOCHfMfkWvKjHj7KgHaQo7HAyLsEAcB9t+t6XEQIMIOx+Ph4W99MWbpes4SIzTo7pYflsrcvnpYOlVFHFySrzqdTLfv6wHP+SmA12hFcdjYXtAej6OINdYLtmPiqCYy7L9tgnSmc2MveGaEqeXn4kU0D++pqnLzEb0jwq43Xqx5NlQ4VZCZcVqsf3TPnguIlcvDn2h8IuR7F80y7DPP376a2XGFU0Syx370tgRv10UkTUX06H3PmGYn7qXsZfLMWaPBs/3wazn+LM8NrU29NICtINfS/JLLUcQOX1nYMwaD/pWFaNCZ02FDC2djALCN4LOKWbpD96n0plLFJssOhlQ2UdzOcl+N4+2V8szmslJQ2fD5F75WWYKyUsZrkiRdlAdoQS4Zy8DJ84v2HzQ+jBc8Atm+98z420cM1Bb46S4wp6BbIpRdPweU3ckYIRTism98NYKewUDXC6aGIu0A43N/2iafcOY65IS8RUmYX8Lgh6HoLUhpTRvu9oJVGIqeEeaycMgIr+YW9vdrgA8A6T6elJ9eyX97VPvae7o2+GV3ujv/ojVtSohzIW5GsJkydymYlXf3l8cY1eeGPJzT4a58YYWjKfkOGHkqgo+d541+evhISnHmBL3WHzaelXS+2f7sjykNElSq2Lj6TNXhP28aD2pI+emyAAAAAElFTkSuQmCC`,Up=`data:image/png;base64,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`,Wp=`data:image/png;base64,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`,Gp=`data:image/png;base64,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`,Kp=`data:image/png;base64,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`,qp=`data:image/png;base64,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`,Jp=`data:image/png;base64,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`,Yp=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAGjklEQVR42u1aK7CDOhA97VxxZSUSiYyMRFYikchKJLISiaxEIpGVyMjIyEgkEscTNLmBUkqAvjdvpjvTmbYk2eyes5+kBb7yla985Stf+cpXvvKV/4fkxa0TgutXXty6f1N/GtJO7SEvbl0a0u6/sn+r7QfbCULwlwo9jxw+bTzLgu50vj5939yvoHH5cf1T9jPOEIWXVbqPtshveb4H84VznnaMc8YnIyENaceyYHJ9SugsMXcBIE6ijhI6O4YSijiJuk85wAkivNoDJRROEH0EhDSknU8dZAUH42xVdtgMAHnjfNtxtjLn/DEIe4tPHVSsRhwScM5mQbDNAsel7B/nvPFrbvweQhcCSz9AgIrV4LLuiSAF+AwAtlngaMNqxhnK6wVefUdd5rhnKeoyh1ffUV4vGoi9o8AW0L0JkPNGA+FTB0LIAenG723sP9rk/nuWwqeODsvw7A0+37P0I7XAFtC9CSCEOIRnTwNxquVTFNzyDLc8A+fMKgrfAnCJYgAA5wzEdQZhSSlBxeo/w11Hb0zN24P91IjA2Rb18fwTzQClBAAQ3cTAD0qfAt0W/LcAKKPqqtKOj25CsyHnDaKb0ECoce+ctZbNtzx7WptxhluefSwKyutZg3kvc1Tt75ONlFBcoti6Bv28G2CGGpc1ePOLKgvgx+VfNDw+k1OrN8Z3AoAbrFbG8Yn1ifF8T/2PFNRHexaAFVecagkxU/jHZNgEgBBykGIIarRuANfrDXQ9B60bICIFAKcHibPBvG3GywGbTRCmnD+1781dUOsCeQHP8yBEgzgkyAo+AMEkTJbmh90A8DxXO1/1w7y4Ir/0BucXClZcdSEGgPox777nFYRR3OiEw6c6kr3E81zkZQ0iBeKQaH9U7XOWsAX+uCQHm4v6lEAIAca4fgkh4D+K1BRrtxqvjFxShJUz1Lw9moBLFCO5xroGqnQchuFT1I2/2xwBAJClGa5RoCOgdn1UXBpO8lExAZ/2KSjLy12L8Dj3T4HLjTPIX3Tku6RAxhnuWdp3eY8DWeO4OhLZSHecRN3SNPSztAV0/N7JXNY4B9GgzWSc4f7ofhzfH7SCNvlwTv8YBDMqdZo0nL+H/r7rqQ4AumtIBs1IGCcvi3BPkHx7BJAX/Td/81nla5uN2FwzcM6eUgyZqQtbU1DfWpO/e6H2dzddP0sNdqTQRdaZMLZ+PK+YAH9TKG3PAGzUipphP2agOXYPAhBCwQEd/Y3jztYXpX9p9B2XHsLMK4epCDCf73EYUyfZ8T3LFBjjZ2NHbD2HEELBZQ3H9xGG4ctT/hp7f2wcoG4FHd9/UpYVXLeqa5hg25L+W6I6Osf3Jx3/ai9Lo++45ArgHCfICo7a9dA47lMXQghF47ioXQ9ZwXE2CtTadnSvNnbrOp7ngnOmnT93DT8WP3S7VQAEideVPBvk2HOcvL1gu0QxznEyyMklzxAkXre2+9mjcK9NQ0HideY5yDbyTu6vfQQoZwUkHhS4ceFbclo117EBYe/r5LXrmQ60db6y/10UTEcA+WN6WkWDgqQ6gHERVKE6Nc9cb6mkVbS5i6KEDvZhy/5GtqCEDrqekmf69daGqIDrn+yKcCNbgPSKxgxQR+2xY9TnoigGUVA1NzSyRUDift2l17+G7iWR9+6nySXOmmK/f7roCBqv8Y5US4F/AqAq5AFIu7Hzi6KA57mz/0rgj3Fjycv0se4yaWQ7AH/pDzKvfhO2Ad+cQ6M+ghI/R162AzZPnT0GKRvLom8yBVWFPDSyhawaNLLVzn+XS8kjXIuigDnfxvnvUtIcAbaknLk03N9++hrIxM8n91U1N+z2txTFQBd0kfPHILigizuBVwR4Fc6mwVOgmOPXEqDk2WAdQiga2aKRrWb8FNjmdyZQ1gexRraIguQpL1O8BsLM+WrTeZmuYqAydA2rlCP802VV+jGJo5zYg5wgL1OUyFDy1+RSaSvJQ5SpOKyKgKqQB9XVjAvyXKE5ub+6YHHOVqcfNU+x7pXuqT2Yc9bql1UzSbAoSNAKZ6Bjag9LnP/2LihL88M758+BsPUKIgovB2XoUiab49f+YdZMg+N0UzU3hGEI4vpohYOTJGhki8s10Hpl1Sxy/qIfZNRCQeJ1S/J5I9vFym0iwQ/dTrW4Y9BVyDPOdiv6yvYSlyfbzRvZkmeaHGt0H9b8N34qL/unyybG2VxTcFnpSFPGE9fH3pd+U3c7J/dXnxEooUjycBPo/wCKsLJywD8BUwAAAABJRU5ErkJggg==`,Xp=`data:image/png;base64,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`,Zp=`data:image/png;base64,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`,Qp=`data:image/png;base64,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`,$p=`data:image/png;base64,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`,em=`data:image/png;base64,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`,tm=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAYAAAABk/85AAAGWUlEQVR42u1aIZCrSBB92VuBOIH4AolsOeIEYkXEiUjECSRiRcSJlUi+i0SuRCIRJyK+iEScGLGixReIFYgVyIhfxYlkWCCQBDLsmXQVVcvsQHe/ft3TMwS4y13ucpe73OUud7nLXb5cFlMe2vhOJcgGAEjOEcTZ4qsN/z9taOq+Vf/oh7Ybr+qOSc4B4EtA2PhOBQBNAJSsgmR2/X3+3xKEhynOd0WQDUH24P/nYt619ukEX5A4AV4RcIr+h7HOdw1oZsCcQbgEviAxu/6Dr/LEZ3VNkasD8FlvZW8QuvN0i3qvAroLvmQJyfns+hX4fTZMIcDjWEM+Iy/QZMSQYbpEvVvpa5Kga8OcIjkHc4FuNWjaMEsAuuA2U1EZxFzM5ngQZ4uNj3oB7nOYuUCc5Ys5CdAekze/92EMAEmagbnoZdncnVDkisoo92f1e0tnVgJwxoizsh5L0uzmTuhxDABEhGSX9TKduYC3dCAss3pJ5SxB8HwPcvN6ol/d+66LyOVZ9Cv/wRKbYI1g83oShMJ0AGTztaF1RxCsEWclhGUjzkpsgvWXbIBkJiEsswZdXQAgLBMyk7PpJiIIR8C2Bfa0rHE42YusvGqWAOSWi2R3iO6elrBtcWJQssuQW+4sALykchHJgx0HpqHFvNxyEcnDvDn0MzNkJhGvBQzenQRc2eSuxvn/21XOr8PKdV0YlsD72w9Y5TvW7qEDcP+w8PZPirf8HY63wdPTE8zfrTD7d/ddawDWYfXsP4OZ8c38BrH08Odff8OwBPDrMOfZf55FNwBsufj+x7fH8Nf+F4r3Ah8fH/jx9hOm8JHvjUOW2ISnpycUH2X48+fbd21HEa9RUqk0ZGbsdxs07wHAWAat+/WLt9AJPhGBiGo2Kj3Kju7/otdwoZsASldTb1fSNB2l+3FMDWTmg1KKwczIARgWWs43g6BDXqOkIiKkadoCu895Bb7ruiCiSicJAMB13YtlSnsbqgDoC8gQEERUZ42OxQ8AOOeLDjIzOOdBdt7UBb2GC0WCQd0N/VoC0AW/m/p9BugMgkp7VV85Z6RpemID83E8Z5BNvc/rKEHnMkCBv90mevYBqu62lJxhV1/0iQgv67DSUY+bmTCkm2zSzvxryo8ixFjwz2aA67qww6i3vvUxsO9vO4wu1s1LBGja0JvyAxlph1FNAF1t6LkSODXwvQFIhVuVQdgas+KkVYtPriMz1TwlZRAiFW41pfRYcQK5L0+c72ZB817NlfuytuXWIGw3XpUlgdbmYtRGrMvCUsYoZYQsCVDKCKWMz86fIsueXW2zxnPO9dVcI655z1QpZYxNtDnxcZVsJwenPwMMCRYF5L5EGYQHFqKoHW2fz9utcUbnOVEgNcaBYGXbwRJHRIda3706zcK59009gu/uwG89hhgMQJzlC+YChmfUAO4s++wip4DZWXYdQMMzJh0RBzJbpIYEozhceXuBP/b59dVcZ+rMOD6bGhKBvO2EVp1wKpIp9jezYJlJBC8BtH0POIJW9W7IhI8kjeF4GyRJAFP4JxswdVA29Xw+zvKF7yj9n1mmCNAlAhGB+LMMsVE0/bhZCtOBQ3Qst4ezL7kvsUtTLPfl5Pc+XgLhc2H0q6bzDL8ORheU6FXPrxM+9edYrbzqUqdBRJN68ava4Mb+QpVWQTZWYCRSwt2L+RZhVduaQA/9PbUWXgvAuY1gFyjdx9FEhMJ0avD7PoGO3Xw+Xut8X8oPlQIA2Gp0vsv+S/34auVVurOg9tcmsGx/lCpMB8XKhTnnJ8lVstU6b1RLWuQn+4vBDipOsCxyrfqbrHZdF6bwD6Afr0vZeVMGbIRTUSYBwxzVw1vCqW7tPmr2F/txbIWlNQu6Wd7sutI0ven44+EaZyYZPfG5rqyP4Be+d123cpy3Hhm0a9jft8Hsgn9tpl4dAHFk/tZbDe50m/dqnjBMbSVg7Lt06lYAD+3u+wAfc/Ry1RpgbsKLxwzN8eZ8HZKHLy2mdZ1u3hMR8vBFm247jEYdrQjDhDBM5I5faQlAJGwwM0p52RA7jFDK6PBJUNhaAGiWHiIaTHErTlpBurZkXQxAFi+G2l51YKl0Twn+YuwPYyk1WsxsHVm7+1l+r68+DDV1NR3tjjOz1m/SvmNXRFbd++eG28o8VfKUTXYYDQauK/8B8jccBfeMyjUAAAAASUVORK5CYII=`,nm=.026,rm=e=>(e/=255,e<=.04045?e/12.92:((e+.055)/1.055)**2.4);function im(e,t,n){return t>=0&&t<32&&n>=0&&n<40&&e.data[(n*32+t)*4+3]>96}function am(e,t){let n=[];for(let r=0;r<32;r++)im(e,r,t)&&n.push(r);return n.length?[n[0],n.at(-1)]:null}function om(e,t,n){if(!am(e,n))for(let t=1;t<40;t++){if(n+t<40&&am(e,n+t)){n+=t;break}if(n-t>=0&&am(e,n-t)){n-=t;break}}if(!im(e,t,n))for(let r=1;r<32;r++){if(im(e,t-r,n)){t-=r;break}if(im(e,t+r,n)){t+=r;break}}let r=(n*32+Math.max(0,Math.min(31,t)))*4;return[rm(e.data[r]),rm(e.data[r+1]),rm(e.data[r+2])]}function sm(e,t,n){let r=39;for(let n=0;n<40;n++)if(am(e,n)||am(t,n)){r=n;break}let i=(40-r)*nm,a={body:[0,i*.32,0],head:[0,i*.69,0],leftArm:[-.14,i*.54,0],rightArm:[.14,i*.54,0],leftLeg:[-.07,i*.23,0],rightLeg:[.07,i*.23,0]},o=new Map;for(let a=r;a<40;a++){let s=am(e,a),c=am(t,a);if(!s&&!c)continue;let l=s??c,u=am(n,a);for(let e=1;!u&&e<4;e++)u=am(n,Math.min(39,a+e))??am(n,Math.max(r,a-e));if(!u)continue;let d=(l[0]+l[1])/2,f=(l[1]-l[0]+1)/2,p=(u[0]+u[1])/2,m=(u[1]-u[0]+1)/2;for(let n=0;n<32;n++){if(!im(e,n,a)&&!im(t,31-n,a))continue;let r=(n-d)/Math.max(1,f),s=m*Math.sqrt(Math.max(.12,1-r*r*.72));for(let e=Math.ceil(p-s);e<=Math.floor(p+s);e++){if(e<0||e>31)continue;let t=(39-a)*nm,s=t>i*.69?`head`:t<i*.23?n<d?`leftLeg`:`rightLeg`:t>i*.3&&Math.abs(r)>.62?n<d?`leftArm`:`rightArm`:`body`;o.set(`${n},${a},${e}`,{x:n,y:a,z:e,part:s})}}}let s=Object.fromEntries(Object.keys(a).map(e=>[e,{positions:[],normals:[],colors:[]}])),c=[{d:[1,0,0],n:[1,0,0],corners:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]},{d:[-1,0,0],n:[-1,0,0],corners:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]},{d:[0,-1,0],n:[0,1,0],corners:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]},{d:[0,1,0],n:[0,-1,0],corners:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},{d:[0,0,1],n:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{d:[0,0,-1],n:[0,0,-1],corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]}];for(let{x:r,y:i,z:l,part:u}of o.values()){let d=s[u],f=a[u];for(let a of c){if(o.get(`${r+a.d[0]},${i+a.d[1]},${l+a.d[2]}`)?.part===u)continue;let s=a.n[2]<0?om(t,31-r,i):a.n[0]?om(n,a.n[0]>0?l:31-l,i):om(e,r,i);for(let e of[0,1,2,0,2,3]){let t=a.corners[e];d.positions.push((r-16+t[0])*nm-f[0],(39-i+t[1])*nm-f[1],(l-16+t[2])*nm-f[2]),d.normals.push(...a.n),d.colors.push(...s)}}}return{height:i,parts:Object.entries(s).filter(([,e])=>e.positions.length).map(([e,t])=>{let n=new Ui;return n.setAttribute(`position`,new ji(t.positions,3)),n.setAttribute(`normal`,new ji(t.normals,3)),n.setAttribute(`color`,new ji(t.colors,3)),n.computeBoundingSphere(),{name:e,geometry:n,pivot:a[e]}}),voxelCount:o.size}}function cm(e,t,{moving:n=!1,selected:r=!1,reducedMotion:i=!1,phase:a=0}={}){let o=e?.userData.rig;if(!o)return;let s=Math.sin(t*1.8+a),c=Math.sin(t*1.1+a),l=Math.sin(t*13+a);for(let[e,{mesh:t,pivot:a}]of Object.entries(o))t.position.fromArray(a),t.rotation.set(0,0,0),t.scale.set(1,1,1),i||(e===`body`&&(t.scale.y=1+s*.008,t.rotation.z=c*.009),e===`head`&&(t.position.y+=s*.003,t.rotation.y=c*(r?.065:.025)),e.includes(`Arm`)&&(t.rotation.x=(n?l*.28:s*.026)*(e===`leftArm`?1:-1)),e.includes(`Leg`)&&n&&(t.rotation.x=l*.32*(e===`leftLeg`?-1:1)))}var lm=Object.assign({"../sprites/characters/agrias-0-thumb.png":Ee,"../sprites/characters/agrias-0.png":Bf,"../sprites/characters/black-mage-female-0-thumb.png":V,"../sprites/characters/black-mage-female-0.png":Vf,"../sprites/characters/black-mage-female-1-thumb.png":O,"../sprites/characters/black-mage-female-1.png":Hf,"../sprites/characters/black-mage-female-2-thumb.png":ie,"../sprites/characters/black-mage-female-2.png":Uf,"../sprites/characters/black-mage-female-3-thumb.png":ae,"../sprites/characters/black-mage-female-3.png":Wf,"../sprites/characters/black-mage-female-4-thumb.png":de,"../sprites/characters/black-mage-female-4.png":Gf,"../sprites/characters/black-mage-male-0-thumb.png":ge,"../sprites/characters/black-mage-male-0.png":Kf,"../sprites/characters/black-mage-male-1-thumb.png":ne,"../sprites/characters/black-mage-male-1.png":qf,"../sprites/characters/black-mage-male-2-thumb.png":P,"../sprites/characters/black-mage-male-2.png":Jf,"../sprites/characters/black-mage-male-3-thumb.png":B,"../sprites/characters/black-mage-male-3.png":Yf,"../sprites/characters/black-mage-male-4-thumb.png":le,"../sprites/characters/black-mage-male-4.png":Xf,"../sprites/characters/delita-0-thumb.png":N,"../sprites/characters/delita-0.png":Zf,"../sprites/characters/delita-1-thumb.png":be,"../sprites/characters/delita-1.png":Qf,"../sprites/characters/delita-2-thumb.png":me,"../sprites/characters/delita-2.png":$f,"../sprites/characters/dragoon-female-0-thumb.png":A,"../sprites/characters/dragoon-female-0.png":ep,"../sprites/characters/dragoon-female-1-thumb.png":L,"../sprites/characters/dragoon-female-1.png":tp,"../sprites/characters/dragoon-female-2-thumb.png":ye,"../sprites/characters/dragoon-female-2.png":np,"../sprites/characters/dragoon-female-3-thumb.png":fe,"../sprites/characters/dragoon-female-3.png":rp,"../sprites/characters/dragoon-female-4-thumb.png":xe,"../sprites/characters/dragoon-female-4.png":ip,"../sprites/characters/dragoon-male-0-thumb.png":F,"../sprites/characters/dragoon-male-0.png":ap,"../sprites/characters/dragoon-male-1-thumb.png":e,"../sprites/characters/dragoon-male-1.png":op,"../sprites/characters/dragoon-male-2-thumb.png":_,"../sprites/characters/dragoon-male-2.png":sp,"../sprites/characters/dragoon-male-3-thumb.png":E,"../sprites/characters/dragoon-male-3.png":cp,"../sprites/characters/dragoon-male-4-thumb.png":w,"../sprites/characters/dragoon-male-4.png":lp,"../sprites/characters/knight-female-0-thumb.png":T,"../sprites/characters/knight-female-0.png":up,"../sprites/characters/knight-female-1-thumb.png":u,"../sprites/characters/knight-female-1.png":dp,"../sprites/characters/knight-female-2-thumb.png":_e,"../sprites/characters/knight-female-2.png":fp,"../sprites/characters/knight-female-3-thumb.png":d,"../sprites/characters/knight-female-3.png":pp,"../sprites/characters/knight-female-4-thumb.png":s,"../sprites/characters/knight-female-4.png":mp,"../sprites/characters/knight-male-0-thumb.png":C,"../sprites/characters/knight-male-0.png":hp,"../sprites/characters/knight-male-1-thumb.png":x,"../sprites/characters/knight-male-1.png":gp,"../sprites/characters/knight-male-2-thumb.png":c,"../sprites/characters/knight-male-2.png":_p,"../sprites/characters/knight-male-3-thumb.png":S,"../sprites/characters/knight-male-3.png":vp,"../sprites/characters/knight-male-4-thumb.png":n,"../sprites/characters/knight-male-4.png":yp,"../sprites/characters/ramza-0-thumb.png":De,"../sprites/characters/ramza-0.png":bp,"../sprites/characters/ramza-1-thumb.png":v,"../sprites/characters/ramza-1.png":xp,"../sprites/characters/ramza-2-thumb.png":f,"../sprites/characters/ramza-2.png":Sp,"../sprites/characters/squire-female-0-thumb.png":l,"../sprites/characters/squire-female-0.png":Cp,"../sprites/characters/squire-female-1-thumb.png":o,"../sprites/characters/squire-female-1.png":wp,"../sprites/characters/squire-female-2-thumb.png":g,"../sprites/characters/squire-female-2.png":Tp,"../sprites/characters/squire-female-3-thumb.png":m,"../sprites/characters/squire-female-3.png":Ep,"../sprites/characters/squire-female-4-thumb.png":p,"../sprites/characters/squire-female-4.png":Dp,"../sprites/characters/squire-male-0-thumb.png":R,"../sprites/characters/squire-male-0.png":Op,"../sprites/characters/squire-male-1-thumb.png":t,"../sprites/characters/squire-male-1.png":kp,"../sprites/characters/squire-male-2-thumb.png":se,"../sprites/characters/squire-male-2.png":Ap,"../sprites/characters/squire-male-3-thumb.png":h,"../sprites/characters/squire-male-3.png":jp,"../sprites/characters/squire-male-4-thumb.png":i,"../sprites/characters/squire-male-4.png":Mp,"../sprites/characters/summoner-female-0-thumb.png":a,"../sprites/characters/summoner-female-0.png":Np,"../sprites/characters/summoner-female-1-thumb.png":b,"../sprites/characters/summoner-female-1.png":Pp,"../sprites/characters/summoner-female-2-thumb.png":H,"../sprites/characters/summoner-female-2.png":Fp,"../sprites/characters/summoner-female-3-thumb.png":r,"../sprites/characters/summoner-female-3.png":Ip,"../sprites/characters/summoner-female-4-thumb.png":y,"../sprites/characters/summoner-female-4.png":Lp,"../sprites/characters/summoner-male-0-thumb.png":we,"../sprites/characters/summoner-male-0.png":Rp,"../sprites/characters/summoner-male-1-thumb.png":j,"../sprites/characters/summoner-male-1.png":zp,"../sprites/characters/summoner-male-2-thumb.png":Te,"../sprites/characters/summoner-male-2.png":Bp,"../sprites/characters/summoner-male-3-thumb.png":Ce,"../sprites/characters/summoner-male-3.png":Vp,"../sprites/characters/summoner-male-4-thumb.png":D,"../sprites/characters/summoner-male-4.png":Hp,"../sprites/characters/teta-0-thumb.png":re,"../sprites/characters/teta-0.png":Up,"../sprites/characters/teta-1-thumb.png":I,"../sprites/characters/teta-1.png":Wp,"../sprites/characters/teta-2-thumb.png":ue,"../sprites/characters/teta-2.png":Gp,"../sprites/characters/white-mage-female-0-thumb.png":he,"../sprites/characters/white-mage-female-0.png":Kp,"../sprites/characters/white-mage-female-1-thumb.png":te,"../sprites/characters/white-mage-female-1.png":qp,"../sprites/characters/white-mage-female-2-thumb.png":ee,"../sprites/characters/white-mage-female-2.png":Jp,"../sprites/characters/white-mage-female-3-thumb.png":Se,"../sprites/characters/white-mage-female-3.png":Yp,"../sprites/characters/white-mage-female-4-thumb.png":ce,"../sprites/characters/white-mage-female-4.png":Xp,"../sprites/characters/white-mage-male-0-thumb.png":M,"../sprites/characters/white-mage-male-0.png":Zp,"../sprites/characters/white-mage-male-1-thumb.png":z,"../sprites/characters/white-mage-male-1.png":Qp,"../sprites/characters/white-mage-male-2-thumb.png":pe,"../sprites/characters/white-mage-male-2.png":$p,"../sprites/characters/white-mage-male-3-thumb.png":k,"../sprites/characters/white-mage-male-3.png":em,"../sprites/characters/white-mage-male-4-thumb.png":oe,"../sprites/characters/white-mage-male-4.png":tm}),um=new Map,dm=0,fm=new Ws({vertexColors:!0,roughness:.9,metalness:0});function pm(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{let e=document.createElement(`canvas`);e.width=96,e.height=40;let n=e.getContext(`2d`,{willReadFrequently:!0});n.drawImage(r,0,0),t([0,32,64].map(e=>n.getImageData(e,0,32,40)))},r.onerror=()=>n(Error(`No se pudo cargar el personaje: ${e}`)),r.src=e})}function mm(e){let t=ve(e);if(!um.has(t)){let e={references:0,usedAt:++dm};e.promise=pm(lm[`../sprites/characters/${t}.png`]).then(t=>(e.data=sm(...t),e.data)),um.set(t,e)}return um.get(t).usedAt=++dm,um.get(t).promise}function hm(){let e=[...um.entries()].filter(([,e])=>e.references===0&&e.data).sort((e,t)=>e[1].usedAt-t[1].usedAt);for(;e.length>6;){let[t,n]=e.shift();n.data.parts.forEach(e=>e.geometry.dispose()),um.delete(t)}}function gm(e){if(!e||e.userData.released)return;e.userData.released=!0;let t=um.get(e.userData.appearanceKey);t&&(t.references=Math.max(0,t.references-1)),e.userData.ready.finally(hm).catch(()=>{}),e.clear()}function _m(e,t=0){let n=new Br;n.rotation.y=t,n.userData.rig={},n.userData.appearanceKey=ve(e);let r=mm(e);return um.get(ve(e)).references++,n.userData.ready=r.then(e=>{if(n.userData.released)return n;for(let t of e.parts){let e=new Na(t.geometry,fm);e.position.fromArray(t.pivot),e.castShadow=e.receiveShadow=!0,n.add(e),n.userData.rig[t.name]={mesh:e,pivot:t.pivot}}return n.userData.height=e.height,n.userData.voxelCount=e.voxelCount,n}),n}export{Qa as A,yc as B,Ws as C,Zi as D,Nc as E,Yr as F,q as H,Wo as I,Ns as L,Ae as M,Ms as N,js as O,Qt as P,ma as R,xa as S,zr as T,K as V,Br as _,_f as a,Un as b,Ui as c,po as d,fo as f,Jr as g,ji as h,Df as i,el as j,ro as k,oo as l,Os as m,gm as n,uo as o,Ic as p,cm as r,Oi as s,_m as t,X as u,xc as v,Ne as w,Na as x,Ga as y,ea as z};