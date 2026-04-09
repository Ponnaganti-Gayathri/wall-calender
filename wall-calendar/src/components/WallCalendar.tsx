'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import styles from './WallCalendar.module.css'
import HeroCanvas from './HeroCanvas'
import { useCalendarNotes } from '@/hooks/useCalendarNotes'
import {
  ThemeName, CalendarDate, THEMES, MONTHS, DAYS_SHORT, HOLIDAYS,
  formatDateKey, compareDates, isInRange, getDaysInMonth, getFirstDayOfMonth,
} from './calendarUtils'

const TODAY = new Date()

export default function WallCalendar() {
  const [curYear, setCurYear] = useState(TODAY.getFullYear())
  const [curMonth, setCurMonth] = useState(TODAY.getMonth())
  const [theme, setTheme] = useState<ThemeName>('coral')
  const [rangeStart, setRangeStart] = useState<CalendarDate | null>(null)
  const [rangeEnd, setRangeEnd] = useState<CalendarDate | null>(null)
  const [hoverDate, setHoverDate] = useState<CalendarDate | null>(null)
  const [selecting, setSelecting] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const { notes, setNote, getNote } = useCalendarNotes()
  const t = THEMES[theme]

  // CSS variables for current theme
  const themeVars = {
    '--accent': t.accent,
    '--accent-light': t.accentLight,
    '--accent-mid': t.accentMid,
    '--range-accent': t.rangeAccent,
    '--range-bg': t.rangeBg,
  } as React.CSSProperties

  const prevMonth = () => {
    if (curMonth === 0) { setCurYear(y => y - 1); setCurMonth(11) }
    else setCurMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (curMonth === 11) { setCurYear(y => y + 1); setCurMonth(0) }
    else setCurMonth(m => m + 1)
  }

  const getEffectiveEnd = (): CalendarDate | null => {
    if (rangeEnd) return rangeEnd
    if (selecting && hoverDate && rangeStart) {
      return compareDates(hoverDate, rangeStart) >= 0 ? hoverDate : rangeStart
    }
    return null
  }
  const getEffectiveStart = (): CalendarDate | null => {
    if (selecting && hoverDate && rangeStart) {
      return compareDates(hoverDate, rangeStart) < 0 ? hoverDate : rangeStart
    }
    return rangeStart
  }

  const handleDayClick = (d: number) => {
    const clicked: CalendarDate = { year: curYear, month: curMonth, day: d }
    if (!selecting || !rangeStart) {
      setRangeStart(clicked)
      setRangeEnd(null)
      setSelecting(true)
    } else {
      const ordered = compareDates(clicked, rangeStart) < 0
        ? { start: clicked, end: rangeStart }
        : { start: rangeStart, end: clicked }
      setRangeStart(ordered.start)
      setRangeEnd(ordered.end)
      setSelecting(false)
      setHoverDate(null)
    }
  }

  const clearSelection = () => {
    setRangeStart(null); setRangeEnd(null)
    setSelecting(false); setHoverDate(null)
  }

  // Notes key for current selection
  const notesKey = (() => {
    const effStart = getEffectiveStart()
    const effEnd = getEffectiveEnd()
    if (effStart && effEnd) {
      const sk = formatDateKey(effStart.year, effStart.month, effStart.day)
      const ek = formatDateKey(effEnd.year, effEnd.month, effEnd.day)
      return sk === ek ? sk : `${sk}_${ek}`
    }
    if (effStart) return formatDateKey(effStart.year, effStart.month, effStart.day)
    return `month_${curYear}_${curMonth}`
  })()

  const notesValue = getNote(notesKey)

  const handleNotesChange = (val: string) => {
    setNote(notesKey, val)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    setSavedMsg('saving…')
    savedTimerRef.current = setTimeout(() => {
      setSavedMsg('saved')
      setTimeout(() => setSavedMsg(''), 2000)
    }, 700)
  }

  const rangeLabel = (() => {
    const s = getEffectiveStart(), e = getEffectiveEnd()
    if (!s) return null
    if (!e || (s.year === e.year && s.month === e.month && s.day === e.day)) {
      return `${MONTHS[s.month].slice(0, 3)} ${s.day}`
    }
    if (s.year === e.year && s.month === e.month) {
      return `${MONTHS[s.month].slice(0, 3)} ${s.day}–${e.day}`
    }
    return `${MONTHS[s.month].slice(0, 3)} ${s.day} – ${MONTHS[e.month].slice(0, 3)} ${e.day}`
  })()

  const notesPlaceholder = rangeLabel
    ? `Notes for ${rangeLabel}…`
    : `Notes for ${MONTHS[curMonth]}…`

  // Build calendar grid
  const firstDay = getFirstDayOfMonth(curYear, curMonth)
  const daysInMonth = getDaysInMonth(curYear, curMonth)
  const prevDays = getDaysInMonth(curYear, curMonth === 0 ? 11 : curMonth - 1)
  const effStart = getEffectiveStart()
  const effEnd = getEffectiveEnd()

  const cells: React.ReactNode[] = []

  // Previous month overflow
  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`prev-${i}`} className={styles.dayCell + ' ' + styles.otherMonth}>
        <span className={styles.dayNum}>{prevDays - firstDay + 1 + i}</span>
      </div>
    )
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date: CalendarDate = { year: curYear, month: curMonth, day: d }
    const dow = (firstDay + d - 1) % 7
    const isToday = curYear === TODAY.getFullYear() && curMonth === TODAY.getMonth() && d === TODAY.getDate()
    const isStart = effStart && effStart.year === curYear && effStart.month === curMonth && effStart.day === d
    const isEnd = effEnd && effEnd.year === curYear && effEnd.month === curMonth && effEnd.day === d
    const inRange = isInRange(date, effStart, effEnd) && !isStart && !isEnd
    const isWeekend = dow === 0 || dow === 6
    const hk = formatDateKey(curYear, curMonth, d)
    const holiday = HOLIDAYS[hk]
    const hasNote = !!notes[hk]

    let cls = styles.dayCell
    if (isToday) cls += ' ' + styles.today
    if (isStart) cls += ' ' + styles.rangeStart
    if (isEnd) cls += ' ' + styles.rangeEnd
    if (inRange) cls += ' ' + styles.inRange
    if (isWeekend) cls += ' ' + styles.weekend
    if (hasNote) cls += ' ' + styles.hasNote
    if (selecting) cls += ' ' + styles.selectable

    cells.push(
      <div
        key={`day-${d}`}
        className={cls}
        onClick={() => handleDayClick(d)}
        onMouseEnter={() => selecting && setHoverDate(date)}
        onMouseLeave={() => selecting && setHoverDate(null)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleDayClick(d)}
        aria-label={`${MONTHS[curMonth]} ${d}, ${curYear}${isToday ? ', today' : ''}${holiday ? `, ${holiday}` : ''}`}
        aria-pressed={!!(isStart || isEnd)}
      >
        <span className={styles.dayNum}>{d}</span>
        {holiday && <span className={styles.holidayLabel}>{holiday.split(' ')[0]}</span>}
        {hasNote && <span className={styles.noteDot} aria-hidden="true" />}
      </div>
    )
  }

  // Next month overflow
  const totalCells = firstDay + daysInMonth
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  for (let i = 1; i <= remaining; i++) {
    cells.push(
      <div key={`next-${i}`} className={styles.dayCell + ' ' + styles.otherMonth}>
        <span className={styles.dayNum}>{i}</span>
      </div>
    )
  }

  return (
    <div className={styles.calendarWrap} style={themeVars}>
      {/* Binding strip */}
      <div className={styles.bindingStrip}>
        <span className={styles.bindingYear}>{curYear}</span>
        <div className={styles.bindingHoles} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className={styles.hole} />)}
        </div>
        {rangeLabel && <span className={styles.bindingRange}>{rangeLabel}</span>}
      </div>

      <div className={styles.calBody}>
        {/* LEFT: Hero + theme + notes */}
        <aside className={styles.leftPanel}>
          <div className={styles.heroWrap}>
            <HeroCanvas theme={theme} month={curMonth} year={curYear} />
            <div className={styles.monthBadge}>
              <span className={styles.monthName}>{MONTHS[curMonth]}</span>
              <span className={styles.yearLabel}>{curYear}</span>
            </div>
          </div>

          <div className={styles.themeBar}>
            <span className={styles.themeLabel}>Theme</span>
            <div className={styles.themeDots}>
              {(Object.keys(THEMES) as ThemeName[]).map(name => (
                <button
                  key={name}
                  className={styles.themeDot + (theme === name ? ' ' + styles.themeDotActive : '')}
                  style={{ background: THEMES[name].accent }}
                  onClick={() => setTheme(name)}
                  title={THEMES[name].label}
                  aria-label={`Switch to ${THEMES[name].label} theme`}
                  aria-pressed={theme === name}
                />
              ))}
            </div>
          </div>

          <section className={styles.notesSection} aria-label="Notes">
            <div className={styles.notesHeader}>
              <h2 className={styles.notesTitle}>Notes</h2>
              {rangeLabel && (
                <span className={styles.rangeChip}>{rangeLabel}</span>
              )}
            </div>
            <textarea
              className={styles.notesTextarea}
              value={notesValue}
              onChange={e => handleNotesChange(e.target.value)}
              placeholder={notesPlaceholder}
              rows={4}
              aria-label={notesPlaceholder}
            />
            <div className={styles.notesSaved} aria-live="polite">{savedMsg}</div>
          </section>
        </aside>

        {/* RIGHT: Calendar grid */}
        <section className={styles.rightPanel} aria-label={`Calendar for ${MONTHS[curMonth]} ${curYear}`}>
          <div className={styles.calNav}>
            <button className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">&#8249;</button>
            <h1 className={styles.navTitle}>{MONTHS[curMonth]} {curYear}</h1>
            <button className={styles.navBtn} onClick={nextMonth} aria-label="Next month">&#8250;</button>
          </div>

          <div className={styles.calGrid}>
            {/* Day headers */}
            {DAYS_SHORT.map((d, i) => (
              <div
                key={d}
                className={styles.dayHeader + (i === 0 || i === 6 ? ' ' + styles.weekendHeader : '')}
              >
                {d}
              </div>
            ))}
            {/* Day cells */}
            {cells}
          </div>

          <div className={styles.calFooter}>
            {(rangeStart || rangeEnd) && (
              <button className={styles.clearBtn} onClick={clearSelection} aria-label="Clear date selection">
                <ClearIcon /> Clear selection
              </button>
            )}
            <div className={styles.legend} aria-label="Calendar legend">
              <LegendItem color="var(--color-text-primary, #1C1917)" label="Today" />
              <LegendItem color="var(--accent)" label="Start/end" />
              <LegendItem range label="In range" accent={t.rangeAccent} bg={t.rangeBg} />
              <LegendItem dot accent={t.accent} label="Has note" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function LegendItem({ color, label, range, accent, bg, dot }: {
  color?: string; label: string; range?: boolean; accent?: string; bg?: string; dot?: boolean
}) {
  return (
    <div className={styles.legendItem}>
      {range ? (
        <span className={styles.legendRange} style={{ background: bg, border: `1px solid ${accent}` }} />
      ) : dot ? (
        <span className={styles.legendDotSmall} style={{ background: accent, opacity: 0.6 }} />
      ) : (
        <span className={styles.legendDotSmall} style={{ background: color }} />
      )}
      <span>{label}</span>
    </div>
  )
}

function ClearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
    </svg>
  )
}
