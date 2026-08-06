require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin }))
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const server = http.createServer(app)
const io = new Server(server, { cors: { origin, methods: ['GET', 'POST'] } })
const allowedTables = new Set(['orders', 'order_items', 'inventory_items', 'offers', 'app_settings', 'admin_users'])

io.on('connection', socket => {
  socket.on('data:changed', change => {
    if (!change || !allowedTables.has(change.table) || !['INSERT', 'UPDATE', 'DELETE'].includes(change.action)) return
    socket.broadcast.emit('data:changed', change)
  })
})

const port = Number(process.env.PORT || 3001)
server.listen(port, () => console.log(`Socket.IO server listening on ${port}`))
