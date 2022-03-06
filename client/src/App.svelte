<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { ClientState } from "./ClientState";
  import { bind } from "svelte/internal";

  export let state = ClientState.DISCONNECTED;

  export let connectBtnEnabled = true;
  export let roomBtnEnabled = true;

  export let roomId = "";
  export let serverIp = "";

  export let admin = false;

  export let sentence = "";

  let conn: Socket;

  export function connect() {
    connectBtnEnabled = false;
    conn = io(`http://${serverIp || "localhost:3000"}`, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });
    conn.on("connect", () => {
      state = ClientState.ROOM_SELECT;
      console.log("connection event");
    });
    conn.on("disonnect", () => (state = ClientState.DISCONNECTED));
    conn.on("callAdmin", () => (admin = true));
    conn.on(
      "startSentenceColl",
      () => (state = ClientState.SENTENCE_COLLECTION)
    );
    conn.on("showSentence", (showUp) => {
      console.log("SHOW SENTENCE PLEASE");
      state = ClientState.SENTENCE_SHOWUP;
      sentence = showUp.sentence;
    });
    conn.on("sentenceShowUpEnd", () => {
      state = ClientState.SENTENCE_COLLECTION;
      sentence = "";
    });
  }

  export function joinRoom() {
    conn.emit("joinRoom", { roomId });
    state = ClientState.SENTENCE_COLLECTION;
  }

  export function sentenceColl() {
    conn.emit("sentenceColl", { roomId });
  }

  export function sendSentence() {
    conn.emit("addSentence", { sentence });
    sentence = "";
  }

  export function sentenceShowUp() {
    conn.emit("sentenceShowUp");
  }
</script>

<main>
  <div class="horizontal-input">
    <input type="text" placeholder="localhost:3000" bind:value={serverIp} />
    <button disabled={!connectBtnEnabled} on:click={connect}>Conectar</button>
  </div>
  {#if state === ClientState.ROOM_SELECT}
    <span>Estás conectado 😉😉</span>
    <div class="horizontal-input">
      <input type="text" bind:value={roomId} />
      <button on:click={joinRoom} disabled={!roomBtnEnabled}
        >Conectarse a sala</button
      >
    </div>
  {/if}
  {#if state === ClientState.WAIT_ADMIN}
    <span>Estás en la sala {roomId}</span>
    <p>Espera mientras el admin no decide empezar esta vaina loca</p>
    {#if admin}
      <button on:click={sentenceColl}>Empezar</button>
    {/if}
  {/if}
  {#if state === ClientState.SENTENCE_COLLECTION}
    <span>Escribe frases 😈😈</span>
    <div class="horizontal-input">
      <input type="text" bind:value={sentence} />
      <button on:click={sendSentence}>Enviar</button>
      {#if admin === true}
        <button on:click={sentenceShowUp}>Terminar de escribir</button>
      {/if}
    </div>
  {/if}
  {#if state === ClientState.SENTENCE_SHOWUP}
    <span>{sentence}</span>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .horizontal-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
