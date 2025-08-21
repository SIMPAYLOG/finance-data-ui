import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface SessionState {
  sessionId: string | null
  setSessionId: (id: string) => void
  clearSessionId: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      setSessionId: (id) => set({ sessionId: id }),
      clearSessionId: () => set({ sessionId: null }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)