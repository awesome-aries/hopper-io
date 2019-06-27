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
    it('Creates a matrix with the given height and width', () => {
      const board = createTileMatrix(10, 10);
      expect(board.length).to.equal(10);
    });
  });
});
