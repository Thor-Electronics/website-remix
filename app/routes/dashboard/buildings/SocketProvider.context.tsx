import { createContext, ReactNode, useContext } from "react"
import { WebSocket } from "ws"

type ProviderProps = {
  socket?: WebSocket
  children: ReactNode
}

const context = createContext<WebSocket | undefined>(undefined)

export const useSocket = () => useContext(context)

export const SocketProvider = ({ socket, children }: ProviderProps) => (
  <context.Provider value={socket}>{children}</context.Provider>
)
