enum RoomState {
  LOBBY,
  GAME,
}

export class Room {
  private sentences: string[] = [];
  private state: RoomState = RoomState.LOBBY;

  constructor() {}

  addSentence(sentence: string) {
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
