"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Room_1 = require("./Room");
const SENTENCE_SHOW_TIME = 5000;
const rooms = new Map();
const io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:8080",
    },
});
io.on("connection", (socket) => {
    console.log("New connection!: ", socket.id);
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
    socket.on("joinRoom", (args) => {
        const roomId = args.roomId;
        const isAdmin = rooms.get(roomId) === undefined;
        console.log("user joined room ", roomId);
        socket.join(roomId);
        if (isAdmin) {
            rooms.set(roomId, new Room_1.Room());
            socket.emit("callAdmin");
            socket.on("sentenceShowUp", () => {
                console.log("sentenceShowUp");
                const room = rooms.get(roomId);
                let i = 0;
                while (room.haveSentences()) {
                    const sentence = room.getSentence();
                    setTimeout(() => {
                        io.to(roomId).emit("showSentence", {
                            sentence,
                        });
                    }, SENTENCE_SHOW_TIME * i);
                    i++;
                }
                setTimeout(() => {
                    io.to(roomId).emit("sentenceShowUpEnd");
                }, SENTENCE_SHOW_TIME * i);
            });
        }
        socket.on("addSentence", (addSentenceArgs) => {
            console.log(`${addSentenceArgs.sentence} added to room ${roomId}`);
            rooms.get(roomId)?.addSentence(addSentenceArgs.sentence);
        });
    });
});
io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});
console.log("Server listening on ws://localhost:3000");
io.listen(3000);
