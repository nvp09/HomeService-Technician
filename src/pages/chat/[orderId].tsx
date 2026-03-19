import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ChatBox from "@/components/chat/ChatBox"
import { useAuth } from "@/contexts/AuthContext"

type Role = "user" | "technician"

type User = {
  id: string | number
  role: Role
}

export default function ChatPage() {

  const router = useRouter()
  const { state } = useAuth()

  const user = state.user as User | null

  const [orderId, setOrderId] = useState<string | null>(null)

  // =========================
  // GET ORDER ID
  // =========================
  useEffect(() => {

    if (!router.isReady) return

    const queryId = router.query.orderId

    if (typeof queryId === "string") {
      setOrderId(queryId)
    }

  }, [router.isReady, router.query])

  // =========================
  // LOADING
  // =========================
  if (!orderId || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading chat...
      </div>
    )
  }

  // =========================
  // ROLE
  // =========================
  const role: Role =
    user.role === "technician" ? "technician" : "user"

  // =========================
  // RENDER CHAT
  // =========================
  return (
    <div className="h-screen overflow-hidden">

      <ChatBox
        orderId={orderId}
        userId={String(user.id)}
        role={role}
      />

    </div>
  )
}