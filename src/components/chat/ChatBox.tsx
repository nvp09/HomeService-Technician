import { useEffect, useState, useRef } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import useChatSocket from "@/hooks/useChatSocket"
import { getSocket, connectSocket } from "@/lib/socket"

// =======================
type Message = {
  id: string | number
  order_id: string | number
  sender_id: string | number
  message?: string
  image?: string
  created_at: string
  is_read?: boolean
}

type ChatUser = {
  id: string | number
  name: string
  avatar?: string
}

type Props = {
  orderId: string
  userId: string
  customer?: ChatUser | null
  technician?: ChatUser | null
  onClose?: () => void
}

// =======================
const API = (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/$/, "")

const BASE = API.endsWith("/api") ? API : `${API}/api`

// =======================
export default function ChatBox({
  orderId,
  userId,
  customer,
  technician,
  onClose,
}: Props) {

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<any>(null)

  // สำหรับฝั่งช่าง
  const otherUser = customer
  const myUser = technician

  const otherOnline =
    otherUser?.id
      ? onlineUsers.includes(String(otherUser.id))
      : false

  // =================
  // CONNECT SOCKET
  // =================
  useEffect(() => {
    connectSocket()
  }, [])

  // =================
  // LOAD MESSAGES
  // =================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadMessages = async () => {
      try {

        const url = `${BASE}/chat/messages/${orderId}?userId=${userId}`

        const res = await fetch(url)

        if (!res.ok) {
          return
        }

        const data: Message[] = await res.json()
        setMessages(data)

        // Mark as read ทันทีที่โหลดแชท
        try {
          await fetch(`${BASE}/chat/messages/read/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: String(userId) }),
          })
        } catch {
          /* ignore */
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("CHAT_MESSAGES_READ", {
              detail: { orderId: String(orderId) },
            }),
          )
        }

      } catch (err) {
        console.error("❌ loadMessages:", err)
      }
    }

    loadMessages()

  }, [orderId, userId])

  // =================
  // SOCKET HANDLER
  // =================
  useChatSocket({
    orderId,
    userId,
    setMessages,
    setTypingUser,
    setOnlineUsers,
    setUnreadCount
  })

  // =================
  // SEND MESSAGE
  // =================
  const sendMessage = () => {

    if (!text.trim()) return

    const socket = getSocket()

    if (!socket || !socket.connected) {
      console.warn("⚠️ socket not connected yet")
      return
    }

    socket.emit("send_message", {
      order_id: String(orderId),
      sender_id: String(userId),
      message: text
    })

    setText("")
  }

  // =================
  const sendImage = (imageUrl: string) => {

    const socket = getSocket()
    if (!socket || !socket.connected) return

    socket.emit("send_message", {
      order_id: String(orderId),
      sender_id: String(userId),
      image: imageUrl
    })
  }

  // =================
  const handleTyping = (value: string) => {

    setText(value)

    const socket = getSocket()
    if (!socket || !socket.connected) return

    socket.emit("typing", {
      orderId: String(orderId),
      userId: String(userId)
    })

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", {
        orderId: String(orderId)
      })
    }, 800)
  }

  // =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })

    // เมื่อมีข้อความใหม่มาและเรากำลังดูอยู่ ให้สั่ง Mark as read ทันที
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (String(lastMsg.sender_id) !== String(userId)) {
        fetch(`${BASE}/chat/messages/read/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: String(userId) }),
        }).then(() => {
          window.dispatchEvent(
            new CustomEvent("CHAT_MESSAGES_READ", {
              detail: { orderId: String(orderId) },
            }),
          )
        })
      }
    }
  }, [messages])

  // =================
  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden">

      <div className="shrink-0">
        <ChatHeader
          otherUser={otherUser ?? null}
          orderId={orderId}
          onClose={onClose}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          userId={String(userId)} //กัน type mismatch
          myUser={myUser ?? null}
          otherUser={otherUser ?? null}
          typingUser={typingUser}
          bottomRef={bottomRef}
        />
      </div>

      <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
        <MessageInput
          text={text}
          setText={setText}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
          sendImage={sendImage}
        />
      </div>

    </div>
  )
}