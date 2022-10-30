import type { Message } from "~/types/Message"

export const connect = (
  url: string,
  token: string,
  onOpen: (socket: WebSocket, e: Event) => any
) => {
  // console.log("WS: 🔌Initializing connection to", ENV.CORE_ADDR)
  const socket = new WebSocket(url, token) // only the token without "Bearer "
  socket.addEventListener("open", e => onOpen(socket, e))
  socket.addEventListener("message", e => console.log("🔽", JSON.parse(e.data)))
  // socket.addEventListener("message", e => {
  //   // parse the message and convert it to a Message type, then dispatch a new custom event
  //   socket.dispatchEvent(new Event())
  // })
  socket.addEventListener("close", e =>
    console.log("WS: ⭕Connection closed", e.reason, e.wasClean)
  ) // socket.addEventListener("error", e => console.warn("❌WS Error: ", e.type)) // return socket.close()
}

export const sendCommand = (
  socket: WebSocket | undefined,
  newState: object,
  deviceId: string
) => {
  if (!socket) return
  const message: Message = {
    command: newState,
    id: deviceId,
  }
  socket.send(JSON.stringify(message))
}

export const parseMessage = (e: MessageEvent): Message => JSON.parse(e.data)

export const handleMessage = (
  e: MessageEvent,
  handlers: { signal: string; handler: (e: MessageEvent) => any }[]
) => {
  const message = parseMessage(e)
}

export default { connect, sendCommand, parseMessage }
