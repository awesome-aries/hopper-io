const {expect} = require('chai');
const request = require('supertest');

const {
  createTileMatrix,
  transformPxToCoords,
  setPath,
  getSurroundingSquares,
  floodFillArea
} = require('./matrixResearch');

describe('Matrix Functions', () => {
  describe('Creating a Tile Matrix', () => {
    it('Creates a matrix with the given width', () => {
      const board = createTileMatrix(10, 10);
      expect(board.length).to.equal(10);
    });
    it('Creates a matrix with the given height', () => {
      const board = createTileMatrix(10, 10);
      expect(board[0].length).to.equal(10);
    });
  });

  let board = createTileMatrix(10, 10);

  describe('Cart can set a path on the board', () => {
    let cartPos = {x: 1, y: 1};
    let newCartPos = {x: 1, y: 2};
    setPath(cartPos, newCartPos, board);
    it('Should update the new cart position on the board', () => {
      expect(board[newCartPos.x][newCartPos.y]).to.equal(1);
    });
    xit('Should return entry and exit points', () => {
      const entry = {x: 0, y: 0};
      let cartPos = {x: 1, y: 1};
      let newCartPos = {x: 1, y: 2};
      board[1][2] = 2;
      let {entryP, exitP} = setPath(cartPos, newCartPos, board, entry);
      expect(entryP).to.deep.equal(entry);
      expect(newCartPos).to.deep.equal(exitP);
    });
  });
});
