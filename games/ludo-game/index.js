// Constants
const COORDINATES_MAP = {
    0: [6, 13], 1: [6, 12], 2: [6, 11], 3: [6, 10], 4: [6, 9],
    5: [5, 8], 6: [4, 8], 7: [3, 8], 8: [2, 8], 9: [1, 8],
    10: [0, 8], 11: [0, 7], 12: [0, 6], 13: [1, 6], 14: [2, 6],
    15: [3, 6], 16: [4, 6], 17: [5, 6], 18: [6, 5], 19: [6, 4],
    20: [6, 3], 21: [6, 2], 22: [6, 1], 23: [6, 0], 24: [7, 0],
    25: [8, 0], 26: [8, 1], 27: [8, 2], 28: [8, 3], 29: [8, 4],
    30: [8, 5], 31: [9, 6], 32: [10, 6], 33: [11, 6], 34: [12, 6],
    35: [13, 6], 36: [14, 6], 37: [14, 7], 38: [14, 8], 39: [13, 8],
    40: [12, 8], 41: [11, 8], 42: [10, 8], 43: [9, 8], 44: [8, 9],
    45: [8, 10], 46: [8, 11], 47: [8, 12], 48: [8, 13], 49: [8, 14],
    50: [7, 14], 51: [6, 14],
    // Home entrance
    100: [7, 13], 101: [7, 12], 102: [7, 11], 103: [7, 10],
    104: [7, 9], 105: [7, 8],
    200: [7, 1], 201: [7, 2], 202: [7, 3], 203: [7, 4],
    204: [7, 5], 205: [7, 6],
    // Base positions
    500: [1.5, 10.58], 501: [3.57, 10.58], 502: [1.5, 12.43], 503: [3.57, 12.43],
    600: [10.5, 1.58], 601: [12.54, 1.58], 602: [10.5, 3.45], 603: [12.54, 3.45],
};
const STEP_LENGTH = 6.66;
const PLAYERS = ['P1', 'P2'];
const BASE_POSITIONS = { P1: [500, 501, 502, 503], P2: [600, 601, 602, 603] };
const START_POSITIONS = { P1: 0, P2: 26 };
const HOME_ENTRANCE = { P1: [100,101,102,103,104], P2: [200,201,202,203,204] };
const HOME_POSITIONS  = { P1: 105, P2: 205 };
const TURNING_POINTS  = { P1: 50,  P2: 24 };
const SAFE_POSITIONS  = [0,8,13,21,26,34,39,47];
const STATE = { DICE_NOT_ROLLED: 'DICE_NOT_ROLLED', DICE_ROLLED: 'DICE_ROLLED' };

const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = {
  P1: document.querySelectorAll('[player-id="P1"].player-piece'),
  P2: document.querySelectorAll('[player-id="P2"].player-piece')
};

class UI {
  static listenDiceClick(cb) { diceButtonElement.addEventListener('click', cb); }
  static listenResetClick(cb) { document.querySelector('#reset-btn').addEventListener('click', cb); }
  static listenPieceClick(cb) { document.querySelector('.player-pieces').addEventListener('click', cb); }
  static setPiecePosition(player, piece, pos) {
    const [x,y] = COORDINATES_MAP[pos];
    const el = playerPiecesElements[player][piece];
    if (!el) return console.error(`No element for ${player} piece ${piece}`);
    el.style.top  =  y * STEP_LENGTH + '%';
    el.style.left =  x * STEP_LENGTH + '%';
  }
  static setTurn(idx) {
    const player = PLAYERS[idx];
    document.querySelector('.active-player span').innerText = player;
    document.querySelectorAll('.player-base.highlight').forEach(el=>el.classList.remove('highlight'));
    document.querySelector(`.player-base[player-id="${player}"]`).classList.add('highlight');
  }
  static enableDice(){ diceButtonElement.removeAttribute('disabled'); }
  static disableDice(){ diceButtonElement.setAttribute('disabled',''); }
  static highlightPieces(player,pieces){
    pieces.forEach(i=> playerPiecesElements[player][i].classList.add('highlight') );
  }
  static unhighlightPieces(){
    document.querySelectorAll('.player-piece.highlight')
            .forEach(e=>e.classList.remove('highlight'));
  }
  static setDiceValue(v){ document.querySelector('.dice-value').innerText = v; }
}

class Ludo {
  constructor() {
    this.listenDiceClick();
    this.listenResetClick();
    this.listenPieceClick();
    this.resetGame();
  }
  get diceValue(){ return this._diceValue; }
  set diceValue(v){ this._diceValue = v; UI.setDiceValue(v); }
  get turn(){ return this._turn; }
  set turn(v){ this._turn = v; UI.setTurn(v); }
  get state(){ return this._state; }
  set state(v){
    this._state = v;
    if(v === STATE.DICE_NOT_ROLLED){
      UI.enableDice();
      UI.unhighlightPieces();
    } else {
      UI.disableDice();
    }
  }
  listenDiceClick(){ UI.listenDiceClick(this.onDiceClick.bind(this)); }
  listenResetClick(){ UI.listenResetClick(this.resetGame.bind(this)); }
  listenPieceClick(){ UI.listenPieceClick(this.onPieceClick.bind(this)); }

  onDiceClick(){
    this.diceValue = 1 + Math.floor(Math.random() * 6);
    this.state = STATE.DICE_ROLLED;
    this.checkForEligiblePieces();
  }

  resetGame(){
    // fresh clone so players go “home”
    this.currentPositions = structuredClone(BASE_POSITIONS);
    // position all 8 pieces
    PLAYERS.forEach(p =>
      [0,1,2,3].forEach(i =>
        this.setPiecePosition(p, i, this.currentPositions[p][i])
      )
    );
    this.turn  = 0;
    this.state = STATE.DICE_NOT_ROLLED;
  }

  checkForEligiblePieces(){
    const p   = PLAYERS[this.turn];
    const eps = this.getEligiblePieces(p);
    if(eps.length) UI.highlightPieces(p, eps);
    else             this.incrementTurn();
  }

  getEligiblePieces(player){
    return [0,1,2,3].filter(i => {
      const pos = this.currentPositions[player][i];
      // already home?
      if(pos === HOME_POSITIONS[player]) return false;
      // still in base and didn’t roll a 6
      if(BASE_POSITIONS[player].includes(pos) && this.diceValue !== 6)
        return false;
      // in home run but roll too big
      if(HOME_ENTRANCE[player].includes(pos) &&
         this.diceValue > HOME_POSITIONS[player] - pos)
        return false;
      return true;
    });
  }

  incrementTurn(){
    this.turn  = this.turn === 0 ? 1 : 0;
    this.state = STATE.DICE_NOT_ROLLED;
  }

  onPieceClick(e){
    const t = e.target;
    if(!t.classList.contains('player-piece') ||
       !t.classList.contains('highlight')) return;
    this.handlePieceClick(t.getAttribute('player-id'),
                          +t.getAttribute('piece'));
  }

  handlePieceClick(player, piece){
    const curr = this.currentPositions[player][piece];
    // from base to start
    if(BASE_POSITIONS[player].includes(curr)){
      this.setPiecePosition(player, piece, START_POSITIONS[player]);
      this.state = STATE.DICE_NOT_ROLLED;
      return;
    }
    // normal move
    UI.unhighlightPieces();
    this.movePiece(player, piece, this.diceValue);
  }

  setPiecePosition(p, i, pos){
    this.currentPositions[p][i] = pos;
    UI.setPiecePosition(p, i, pos);
  }

  movePiece(p, i, moveBy){
    const interval = setInterval(() => {
      this.incrementPiecePosition(p, i);
      if(--moveBy === 0){
        clearInterval(interval);
        // check win
        if(this.hasPlayerWon(p)){
          alert(`Player ${p} has won!`);
          this.resetGame();
          return;
        }
        // kill or extra turn on 6
        if(this.checkForKill(p, i) || this.diceValue === 6){
          this.state = STATE.DICE_NOT_ROLLED;
          return;
        }
        this.incrementTurn();
      }
    }, 200);
  }

  incrementPiecePosition(p, i){
    this.setPiecePosition(p, i, this.getIncrementedPosition(p, i));
  }

  getIncrementedPosition(p, i){
    const curr = this.currentPositions[p][i];
    if(curr === TURNING_POINTS[p]) return HOME_ENTRANCE[p][0];
    if(curr === 51)                return 0;
    return curr + 1;
  }

  checkForKill(p, i){
    const curr = this.currentPositions[p][i];
    const opp  = p === 'P1' ? 'P2' : 'P1';
    let killed = false;
    [0,1,2,3].forEach(j => {
      if(curr === this.currentPositions[opp][j] &&
         !SAFE_POSITIONS.includes(curr)){
        // knock them back to base
        this.setPiecePosition(opp, j, BASE_POSITIONS[opp][j]);
        killed = true;
      }
    });
    return killed;
  }

  hasPlayerWon(player){
    return [0,1,2,3]
      .every(i => this.currentPositions[player][i] === HOME_POSITIONS[player]);
  }
}
window.addEventListener('DOMContentLoaded', () => new Ludo());