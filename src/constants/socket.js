import { io } from 'socket.io-client';
import { hostWS } from './const';

console.log(hostWS)

const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"]
}

const socket = io(`${hostWS}`, options);

export default socket;