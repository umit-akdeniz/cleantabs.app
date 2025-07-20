import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (userId: string) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
    auth: {
      userId
    },
    autoConnect: false
  })

  socket.connect()

  socket.on('connect', () => {
    console.log('Connected to socket server')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Real-time events for CleanTabs
export const socketEvents = {
  // Category events
  CATEGORY_CREATED: 'category:created',
  CATEGORY_UPDATED: 'category:updated',
  CATEGORY_DELETED: 'category:deleted',
  CATEGORY_REORDERED: 'category:reordered',

  // Subcategory events
  SUBCATEGORY_CREATED: 'subcategory:created',
  SUBCATEGORY_UPDATED: 'subcategory:updated',
  SUBCATEGORY_DELETED: 'subcategory:deleted',
  SUBCATEGORY_REORDERED: 'subcategory:reordered',

  // Site events
  SITE_CREATED: 'site:created',
  SITE_UPDATED: 'site:updated',
  SITE_DELETED: 'site:deleted',
  SITE_REORDERED: 'site:reordered',
  SITE_VISITED: 'site:visited',

  // Reminder events
  REMINDER_CREATED: 'reminder:created',
  REMINDER_UPDATED: 'reminder:updated',
  REMINDER_DELETED: 'reminder:deleted',
  REMINDER_TRIGGERED: 'reminder:triggered',

  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  // Collaboration events (future feature)
  BOOKMARK_SHARED: 'bookmark:shared',
  CATEGORY_SHARED: 'category:shared',
} as const

// Socket hooks for React components
export const useSocket = () => {
  return socket
}

// Emit events
export const emitEvent = (event: string, data?: any) => {
  if (socket) {
    socket.emit(event, data)
  }
}

// Listen to events
export const onEvent = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback)
    
    // Return cleanup function
    return () => {
      socket.off(event, callback)
    }
  }
  return () => {}
}

// Remove event listeners
export const offEvent = (event: string, callback?: (data: any) => void) => {
  if (socket) {
    if (callback) {
      socket.off(event, callback)
    } else {
      socket.off(event)
    }
  }
}