'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type QuizState = {
  correct: number
  total: number
  recordAnswer: (questionId: string, isCorrect: boolean) => void
}

const QuizContext = createContext<QuizState | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answered, setAnswered] = useState<Record<string, boolean>>({})

  const recordAnswer = useCallback((questionId: string, isCorrect: boolean) => {
    setAnswered((prev) => {
      if (questionId in prev) return prev
      return { ...prev, [questionId]: isCorrect }
    })
  }, [])

  const value = useMemo(() => {
    const values = Object.values(answered)
    return {
      correct: values.filter(Boolean).length,
      total: values.length,
      recordAnswer,
    }
  }, [answered, recordAnswer])

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
