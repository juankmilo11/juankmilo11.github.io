export class ShuffleQueue {
  constructor(tracks, random = Math.random) {
    if (!tracks.length) throw new Error('La lista de música está vacía');
    this.tracks = [...tracks]; this.random = random;
    this.bag = []; this.history = []; this.cursor = -1;
  }
  get current() { return this.history[this.cursor] ?? null; }
  get canPrevious() { return this.cursor > 0; }
  next() {
    if (this.cursor < this.history.length - 1) return this.history[++this.cursor];
    if (!this.bag.length) {
      this.bag = [...this.tracks];
      for (let i = this.bag.length-1; i > 0; i--) {
        const j = Math.floor(this.random()*(i+1));
        [this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];
      }
      if(this.bag.length>1 && this.bag[0]===this.current) [this.bag[0],this.bag[1]]=[this.bag[1],this.bag[0]];
    }
    const next = this.bag.shift(); this.history.push(next); this.cursor++;
    return next;
  }
  previous() { if(this.canPrevious)this.cursor--;return this.current; }
}
