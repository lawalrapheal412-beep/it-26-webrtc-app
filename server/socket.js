const {
    addUserToRoom,
    removeUserFromRoom
} = require("./roomManager");

module.exports = function (io) {

    io.on("connection", (socket) => {

        handleConnection(socket);

        handleJoinRoom(socket);

        handleOffer(socket);

        handleAnswer(socket);

        handleIceCandidate(socket);

        handleDisconnecting(socket);

        handleDisconnect(socket);
    });

    // ----------------------------
    // CONNECTION
    // ----------------------------
    function handleConnection(socket) {
        console.log("User connected:", socket.id);
    }

    // ----------------------------
    // JOIN ROOM
    // ----------------------------
    function handleJoinRoom(socket) {
        socket.on("join-room", (roomId) => {

            socket.join(roomId);
            addUserToRoom(roomId, socket.id);

            console.log(`${socket.id} joined room ${roomId}`);

            socket.to(roomId).emit("user-joined", socket.id);
        });
    }

    // ----------------------------
    // OFFER
    // ----------------------------
    function handleOffer(socket) {
        socket.on("offer", ({ roomId, offer }) => {

            socket.to(roomId).emit("offer", {
                offer,
                sender: socket.id
            });
        });
    }

    // ----------------------------
    // ANSWER
    // ----------------------------
    function handleAnswer(socket) {
        socket.on("answer", ({ roomId, answer }) => {

            socket.to(roomId).emit("answer", {
                answer,
                sender: socket.id
            });
        });
    }

    // ----------------------------
    // ICE CANDIDATE
    // ----------------------------
    function handleIceCandidate(socket) {
        socket.on("ice-candidate", ({ roomId, candidate }) => {

            socket.to(roomId).emit("ice-candidate", {
                candidate,
                sender: socket.id
            });
        });
    }

    // ----------------------------
    // DISCONNECTING (cleanup)
    // ----------------------------
    function handleDisconnecting(socket) {

        socket.on("disconnecting", () => {

            socket.rooms.forEach((roomId) => {

                if (roomId !== socket.id) {

                    removeUserFromRoom(roomId, socket.id);

                    socket.to(roomId).emit("user-left", socket.id);
                }
            });
        });
    }

    // ----------------------------
    // DISCONNECT (log only)
    // ----------------------------
    function handleDisconnect(socket) {

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    }
};