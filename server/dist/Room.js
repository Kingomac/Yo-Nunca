"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var RoomState;
(function (RoomState) {
    RoomState[RoomState["LOBBY"] = 0] = "LOBBY";
    RoomState[RoomState["GAME"] = 1] = "GAME";
})(RoomState || (RoomState = {}));
class Room {
    sentences = [];
    state = RoomState.LOBBY;
    constructor() { }
    addSentence(sentence) {
        this.sentences.push(sentence);
    }
    getSentence() {
        const random = Math.floor(Math.random() * this.sentences.length);
        const sent = this.sentences[random];
        this.sentences.splice(random, 1);
        return sent;
    }
    haveSentences() {
        return this.sentences.length != 0;
    }
}
exports.Room = Room;
