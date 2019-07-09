class Tile {
  constructor(initColor, initType, arrInd) {
    this.arrInd = arrInd;
    //each tile's current state (color and type-harbor, regular, or path) and previous state starting with an initial value of reg tile
    this.present = {
      color: initColor,
      type: initType
    };
    this.previous = {
      color: initColor,
      type: initType
    };
    this.regularTile = {
      color: initColor,
      type: initType
    };
  }
  //if tile changes, update previous to be current and set current to be new type
  tileChange(color, type) {
    //if the type is different from current type, update both current and previous type
    //if we're switching from a current type = path to incoming type = harbor, we want to set previous type to regular (always)
    if (type === 'harbor') {
      this.previous = {...this.regularTile};
    } else if (this.present.type !== type) {
      this.previous = {...this.present};
      this.present = {color, type};
    } else if (this.present.type === type) {
      //if the type is not different, just update present
      this.present = {color, type};
    }
  }
  playerCleared(killedPlayerHarbor, killedPlayerPath, regularTileColor) {
    // when a player is killed, we want to remove and reference in the tilemap to their harbor and path values

    //if this tile is equal to a player's path and that player is killed, it changes the previous tile value to be a regular tile
    if (this.previous.color === killedPlayerHarbor) {
      this.previous = {
        color: regularTileColor,
        type: 'regular'
      };
    } else if (this.previous.color === killedPlayerPath) {
      this.previous = {
        color: regularTileColor,
        type: 'regular'
      };
    }
    if (this.present.color === killedPlayerPath) {
      // if the killed player had path on a tile when they died, change it back to whatever it was previously
      this.present = this.previous;
    } else if (this.present.color === killedPlayerHarbor) {
      // everywhere their harbor was should go back to a regular tile
      this.present = {
        color: regularTileColor,
        type: 'regular'
      };
    }
  }
}

module.exports = Tile;
