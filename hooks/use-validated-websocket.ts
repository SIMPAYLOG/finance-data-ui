import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export function useValidatedWebSocket(
  sessionId: string | null,
  durationStart: string | null,
  durationEnd: string | null
) {
  const [socketStatus, setSocketStatus] = useState("대기 중")
  const [progressMessages, setProgressMessages] = useState<string[]>([])
  const router = useRouter()

  const socketRef = useRef<WebSocket | null>(null)
  const messageSet = useRef<Set<string>>(new Set()) // ✅ 중복 메시지 방지

  useEffect(() => {
    if (!sessionId || !durationStart || !durationEnd) {
      alert("세션 ID 또는 기간 정보가 없습니다.")
      router.replace("/generate")
      return
    }

    const connectWebSocket = async () => {
      try {
        const query = new URLSearchParams({ sessionId, durationStart, durationEnd })
        const res = await fetch(`http://localhost:8080/api/validate/websocket-params?${query}`)

        if (!res.ok) {
          const error = await res.json()
          alert(`WebSocket 연결 실패: ${error.message}`)
          router.replace("/generate")
          return
        }

        const ws = new WebSocket(`ws://localhost:8080/start-simulation?${query}`)
        socketRef.current = ws
        setSocketStatus("연결 중...")

        ws.onopen = () => {
          setSocketStatus("연결 성공")
        }

        ws.onmessage = (event) => {
          const msg = event.data

          // ✅ 동일한 메시지가 이전에 있었는지 체크
          if (!messageSet.current.has(msg)) {
            messageSet.current.add(msg)
            setProgressMessages((prev) => [...prev, msg])
          }
        }

        ws.onclose = (event) => {
          setSocketStatus(event.wasClean ? "연결 종료" : "연결 끊김")
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          setSocketStatus("에러 발생")
        }
      } catch (e) {
        console.error("WebSocket 연결 실패", e)
        alert("서버와 연결 중 문제가 발생했습니다.")
        router.replace("/generate")
      }
    }

    connectWebSocket()

    return () => {
      console.log("🧹 WebSocket 정리 중")
      socketRef.current?.close()
      socketRef.current = null
      messageSet.current.clear()
    }
  }, [sessionId]) // ✅ sessionId만으로 충분 (StrictMode 대응)

  return {
    socket: socketRef.current,
    socketStatus,
    progressMessages
  }
}