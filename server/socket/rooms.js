const {getTileIndices, initTileMap} = require('../game/utils');
const {serverStore, serverActionCreators} = require('../store/index');

class Rooms {
  constructor() {
    // the key is the room id
    // the value is the numbe
    this.rooms = {};
    // how many players can play together in one room
    this.maxCapacity = 2;
    // tracks how many current rooms there are
    this.numRooms = 0;
    // also manage available tiles
    const {path, harbor, regular} = getTileIndices();
    this.path = path;
    this.harbor = harbor;
    this.regular = regular;
  }

  assignRoom() {
    // returns a roomid (just a number) for the player to join and path and harbor index
    for (let roomId in this.rooms) {
      // if there is space in the room asign player to that room
      if (
        this.rooms.hasOwnProperty(roomId) &&
        this.rooms[roomId].numPlayers < this.maxCapacity
      ) {
        // increment the number of players in the room
        this.rooms[roomId].numPlayers += 1;
        // and assign the new path and harbor indices
        let harbor = this.rooms[roomId].harbor.shift();
        let path = this.rooms[roomId].path.shift();
        console.log(
          `assigning new player to room ${roomId}, with harbor ${harbor} and path ${path} which now has ${
            this.rooms[roomId].numPlayers
          } players

          max capacity is ${this.maxCapacity}`
        );
        console.log(`this room:`);
        console.log(this.rooms[roomId]);
        return {
          roomId,
          path,
          harbor
        };
      }
    }
    // *************** Create a room *****************
    // if we went through all the rooms and did not find a room with a space then create a new room and init the player count to 1
    // and set the path and harbor tile lists
    let newRoomId = `${++this.numRooms}`;
    this.rooms[newRoomId] = {
      numPlayers: 1,
      harbor: this.harbor,
      path: this.path
    };

    // set up the tilemap in our store
    initTileMap(newRoomId, this.regular, serverStore, serverActionCreators);

    let playerHarbor = this.rooms[newRoomId].harbor.shift();
    let playerPath = this.rooms[newRoomId].path.shift();
    console.log(
      `assigning new player to room ${newRoomId}, with harbor ${playerHarbor} and path ${playerPath} which now has ${
        this.rooms[newRoomId].numPlayers
      } players
      max capacity is ${this.maxCapacity}`
    );
    console.log(`this room:`);
    console.log(this.rooms[newRoomId]);
    return {
      roomId: newRoomId,
      path: playerPath,
      harbor: playerHarbor
    };
  }

  leaveRoom(roomId, path, harbor) {
    // decrease the number of players in the room by 1

    this.rooms[roomId].numPlayers -= 1;
    // put their tile values back to be reused
    this.rooms[roomId].path.push(path);
    this.rooms[roomId].harbor.push(harbor);
    console.log(
      `leaving room ${roomId} which now has ${this.rooms[roomId].numPlayers}`
    );
    console.log(`this room:`);
    console.log(this.rooms[roomId]);
  }
}
// export an instance of the rooms class
module.exports = new Rooms();
