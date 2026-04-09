'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wall-calendar-notes'

export function useCalendarNotes() {
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setNotes(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  const setNote = useCallback((key: string, value: string) => {
    setNotes(prev => {
      const next = { ...prev }
      if (value.trim()) next[key] = value
      else delete next[key]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const getNote = useCallback((key: string) => notes[key] || '', [notes])

  return { notes, setNote, getNote, loaded }
}
