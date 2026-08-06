import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')
let socket

export const getSocket = () => {
  if (!socketUrl) return null
  if (!socket) {
    socket = io(socketUrl, { autoConnect: true, transports: ['websocket', 'polling'] })
  }
  return socket
}

export const publishChange = change => {
  const client = getSocket()
  if (!client) return
  client.emit('data:changed', change)
}

export const subscribeToChanges = (tables, onChange) => {
  const client = getSocket()
  if (!client) return () => {}

  const listener = change => {
    if (tables.includes(change.table)) onChange(change)
  }
  client.on('data:changed', listener)
  return () => client.off('data:changed', listener)
}
