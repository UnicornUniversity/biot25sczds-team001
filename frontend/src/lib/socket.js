// jednoduchý singleton – volá se při loginu (token = JWT uživatele)
import { io } from "socket.io-client";

let socket;
/**
 * @param {string} token – user JWT (stejný, co posíláš v Auth headeru)
 */
export function initSocket(token) {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token },
    });
  }
  return socket;
}

export const getSocket = () => socket;