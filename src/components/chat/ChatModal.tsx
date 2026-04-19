import { useEffect } from "react"
import ChatBox from "./ChatBox"

type Props = {
  orderId: string
  userId: string
  role: "user" | "technician"
  onClose: () => void
}

/**
 * Chat Modal - Same style as customer side
 */
export default function ChatModal({ orderId, userId, role, onClose }: Props) {

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4 font-prompt"
      role="dialog"
      aria-modal="true"
    >
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div
        className="relative z-10 flex flex-col w-full h-dvh sm:h-[min(90vh,720px)] sm:max-w-lg sm:rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatBox 
          orderId={orderId} 
          userId={userId} 
          onClose={onClose}
        />
      </div>
    </div>
  )
}
