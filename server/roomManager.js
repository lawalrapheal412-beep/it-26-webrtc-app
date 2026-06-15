const rooms = {};

function addUserToRoom(roomId, socketId) {

    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    rooms[roomId].push(socketId);
}

function removeUserFromRoom(roomId, socketId) {

    if (!rooms[roomId]) return;

    rooms[roomId] =
        rooms[roomId].filter(id => id !== socketId);

    if (rooms[roomId].length === 0) {
        delete rooms[roomId];
    }
}

function getRoomUsers(roomId) {

    return rooms[roomId] || [];
}

module.exports = {
    addUserToRoom,
    removeUserFromRoom,
    getRoomUsers
};