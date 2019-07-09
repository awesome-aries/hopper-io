class Rooms {
  constructor() {
    // the key is the room id
    // the value is the numbe
    this.rooms = {};
    this.maxCapacity = 2;
    this.numRooms = 0;
  }

  assignRoom() {
    // returns a roomid (just a number) for the player to join
    for (let roomId in this.rooms) {
      // if there is space in the room asiign player to that room
      if (
        this.rooms.hasOwnProperty(roomId) &&
        this.rooms[roomId] < this.maxCapacity
      ) {
        this.rooms[roomId] += 1;
        console.log(
          `assigning new player to room ${roomId}, which now has ${
            this.rooms[roomId]
          } players
          
          max capacity is ${this.maxCapacity}`
        );
        return roomId;
      }
    }
    // if we went through all the rooms and did not find a room with a space then create a new room and init the player count to 1
    let newRoomId = `${++this.numRooms}`;
    this.rooms[newRoomId] = 1;
    console.log(
      `assigning new player to room ${newRoomId}, which now has ${
        this.rooms[newRoomId]
      } players
      max capacity is ${this.maxCapacity}`
    );
    return newRoomId;
  }

  leaveRoom(roomId) {
    // decrease the number of players in the room by 1

    this.rooms[roomId] -= 1;
    console.log(`leaving room ${1} which now has ${this.rooms[roomId]}`);
  }
}
// export an instance of the rooms class
module.exports = new Rooms();
