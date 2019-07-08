class Tile {
  constructor(initColor, initType, arrInd) {
    this.arrInd = arrInd;
    //each tile's current state (color and type-harbor, regular, or path) and previous state starting with an initial value of reg tile
    this.current = {
      color: initColor,
      type: initType
    };
    this.previous = {
      color: initColor,
      type: initType
    };
  }
  //if tile changes, update previous to be current and set current to be new type
  tileChange(color, type) {
    //if the type is different from current type, update both current and previous type
    if (this.current.type !== type) {
      this.previous = {...this.current};
      this.current = {color, type};
    } else if (this.current.type === type) {
      //if the type is not different, just update current
      this.current = {color, type};
    }
  }
}
