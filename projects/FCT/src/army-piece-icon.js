// Pawns use a monochrome vector so mobile platforms cannot substitute an emoji.
export function armyPieceIcon(type,color){
 if(type==='p')return '<svg class="army-pawn" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="currentColor"><circle cx="12" cy="5" r="3"/><path d="M9.5 9h5v2h-1l1.3 6H16v2H8v-2h1.2l1.3-6h-1zM6 20h12v2H6z"/></svg>';
 return {w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞'}}[color]?.[type]??'';
}
