import { useEffect, useState } from "react"
import { getSocket, connectSocket } from "@/lib/socket"

/** Same as customer side: use fetch for consistency */
const API = (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/$/, "")
const BASE = API.endsWith("/api") ? API : `${API}/api`

type ChatMessagesReadDetail = {
  orderId: string
}

type Props = {
  orderId: string
  userId: string
}

export default function ChatBadge({ orderId, userId }: Props) {

  const [count, setCount] = useState(0)

  // =========================
  // LOAD INITIAL
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    const loadUnread = async () => {
      try {
        const url = `${BASE}/chat/messages/unread/${orderId}/${userId}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setCount(Number(data.count) || 0)
        }
      } catch (err) {
        console.error("❌ loadUnread error:", err)
      }
    }

    loadUnread()

  }, [orderId, userId])


  // =========================
  // CLEAR WHEN USER OPENS CHAT (mark-read runs in ChatBox)
  // =========================
  useEffect(() => {
    if (!orderId) return

    const onRead = (ev: Event) => {
      const detail = (ev as CustomEvent<ChatMessagesReadDetail>).detail
      if (String(detail?.orderId) === String(orderId)) {
        setCount(0)
      }
    }

    window.addEventListener("CHAT_MESSAGES_READ", onRead)
    return () => window.removeEventListener("CHAT_MESSAGES_READ", onRead)
  }, [orderId])


  // =========================
  // SOCKET REALTIME
  // =========================
  useEffect(() => {

    if (!orderId || !userId) return

    // 🔥 สั่งเชื่อมต่อเพื่อให้ฟัง event ได้แม้ยังไม่ได้เปิดแชท
    connectSocket()

    const socket = getSocket()

    if (!socket) {
      return
    }

    // 🔥 Join Chat เพื่อให้ได้รับสัญญาณของ Order นี้
    socket.emit("join_chat", {
      order_id: String(orderId),
      user_id: String(userId)
    })

    const handleNewMessage = (msg: any) => {
      if (!msg) return

      // ถ้าเป็น Order เดียวกัน และคนส่ง "ไม่ใช่ช่าง" ให้เพิ่มเลข
      if (
        String(msg.order_id) === String(orderId) &&
        msg.sender_role !== "technician"
      ) {
        setCount(prev => prev + 1)
      }
    }

    socket.on("receive_message", handleNewMessage)

    return () => {
      socket.off("receive_message", handleNewMessage)
    }

  }, [orderId, userId])


  // =========================
  // UI
  // =========================
  if (!count || count <= 0) return null

  return (
    <span className="ml-1 px-2 py-[2px] text-xs bg-red-500 text-white rounded-full">
      {count}
    </span>
  )
}