// Compare the variant's classical mate condition with independent legal chess.
// node projects/FCT/scripts/check-mate-oracle.mjs
import assert from 'node:assert/strict';
import {Chess} from 'chess.js';
import {isCheckmate} from '../src/tactics-engine.js';

let seed=17311,positions=0,checks=0,mates=0;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(let game=0;game<80;game++){
 const chess=new Chess();
 for(let ply=0;ply<180;ply++){
  const units=chess.board().flat().filter(Boolean).map((u,i)=>({id:u.color+u.type+i,color:u.color,type:u.type,square:u.square,homeSquare:u.square,captured:false,hasMoved:u.type!=='p'||!['2','7'].includes(u.square[1])}));
  const state={units,tiles:{},enPassant:null},ep=chess.fen().split(' ')[3],side=chess.turn();
  // Castling rights cannot save a king already in check. Pawn double rights
  // follow their legal initial rank; en passant must retain its actual victim.
  if(ep!=='-'){
   const victim=units.find(u=>u.type==='p'&&u.color!==side&&u.square===ep[0]+(Number(ep[1])+(side==='w'?-1:1)));
   if(victim)state.enPassant={square:ep,availableTo:side,victimId:victim.id};
  }
  const expected=chess.isCheckmate();
  assert.equal(isCheckmate(state,side),expected,`Mate mismatch: ${chess.fen()}`);
  positions++;if(chess.isCheck())checks++;if(expected)mates++;
  const moves=chess.moves();if(!moves.length)break;chess.move(moves[random()%moves.length]);
 }
}
console.log(JSON.stringify({positions,checks,mates,mismatches:0}));
