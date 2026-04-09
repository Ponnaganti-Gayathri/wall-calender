'use client'
import { useRef, useEffect } from 'react'
import { ThemeName } from './calendarUtils'
import styles from './WallCalendar.module.css'

interface HeroCanvasProps {
  theme: ThemeName
  month: number
  year: number
}

function drawScene(ctx: CanvasRenderingContext2D, W: number, H: number, theme: ThemeName, month: number) {
  ctx.clearRect(0, 0, W, H)

  if (theme === 'coral') {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    const isWinter = month === 11 || month === 0 || month === 1
    g.addColorStop(0, isWinter ? '#4A1942' : '#FF6B35')
    g.addColorStop(0.5, isWinter ? '#C2450A' : '#E8845A')
    g.addColorStop(1, '#1C0F08')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#FFD166'
    ctx.beginPath(); ctx.arc(W * 0.75, H * 0.28, 36, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,200,80,0.2)'
    ctx.beginPath(); ctx.arc(W * 0.75, H * 0.28, 52, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#1C0F08'
    ctx.beginPath()
    ctx.moveTo(0, H * 0.68)
    ctx.lineTo(W * 0.12, H * 0.42)
    ctx.lineTo(W * 0.25, H * 0.62)
    ctx.lineTo(W * 0.38, H * 0.34)
    ctx.lineTo(W * 0.52, H * 0.52)
    ctx.lineTo(W * 0.66, H * 0.38)
    ctx.lineTo(W * 0.80, H * 0.56)
    ctx.lineTo(W, H * 0.48)
    ctx.lineTo(W, H); ctx.lineTo(0, H)
    ctx.closePath(); ctx.fill()
    ctx.fillStyle = 'rgba(255,220,180,0.06)'
    for (let i = 0; i < 60; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H * 0.55, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  else if (theme === 'ocean') {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#042C53')
    g.addColorStop(0.4, '#1251A3')
    g.addColorStop(0.55, '#5585D8')
    g.addColorStop(0.56, '#7EC8C8')
    g.addColorStop(1, '#1D6B6B')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    for (let i = 0; i < 7; i++) {
      const y = H * (0.52 + i * 0.07)
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= W; x += 20) {
        ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 5)
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H)
      ctx.closePath(); ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath(); ctx.arc(W * 0.2, H * 0.2, 22, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H * 0.4, Math.random() * 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  else if (theme === 'forest') {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    const isFall = month >= 8 && month <= 10
    g.addColorStop(0, isFall ? '#87CEEB' : '#B7E4C7')
    g.addColorStop(0.5, isFall ? '#F4A261' : '#52B788')
    g.addColorStop(1, isFall ? '#2D6A4F' : '#1B4332')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    const treeFill = isFall ? '#7B3F00' : '#1B4332'
    const treeLeaf = isFall ? '#E76F51' : '#2D6A4F'
    for (let i = 0; i < 11; i++) {
      const x = W * (i + 0.3) / 11
      const h = H * (0.25 + Math.random() * 0.2)
      ctx.fillStyle = treeFill
      ctx.fillRect(x - 4, H - h * 0.35, 8, h * 0.35)
      ctx.fillStyle = treeLeaf
      ctx.beginPath()
      ctx.moveTo(x, H - h)
      ctx.lineTo(x - 22, H - h * 0.45)
      ctx.lineTo(x + 22, H - h * 0.45)
      ctx.closePath(); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(x, H - h * 1.18)
      ctx.lineTo(x - 16, H - h * 0.72)
      ctx.lineTo(x + 16, H - h * 0.72)
      ctx.closePath(); ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.88)'
    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.18, 26, 0, Math.PI * 2); ctx.fill()
  }

  else if (theme === 'lavender') {
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#2E1065')
    g.addColorStop(0.4, '#6D28D9')
    g.addColorStop(0.7, '#C084FC')
    g.addColorStop(1, '#F9A8D4')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 80; i++) {
      const size = Math.random() * 2.5
      ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.3})`
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H * 0.7, size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath(); ctx.arc(W * 0.22, H * 0.32, 70, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(W * 0.78, H * 0.55, 45, 0, Math.PI * 2); ctx.fill()
  }

  else if (theme === 'amber') {
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#60A5FA')
    g.addColorStop(0.35, '#FCD34D')
    g.addColorStop(0.6, '#F97316')
    g.addColorStop(1, '#7C2D12')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#451A03'
    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, H * 0.72)
    for (let x = 0; x <= W; x += 15) {
      ctx.lineTo(x, H * 0.60 + Math.sin(x * 0.025) * H * 0.1)
    }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#EF9F27'
    ctx.beginPath(); ctx.arc(W * 0.78, H * 0.22, 34, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,200,60,0.15)'
    ctx.beginPath(); ctx.arc(W * 0.78, H * 0.22, 52, 0, Math.PI * 2); ctx.fill()
  }
}

export default function HeroCanvas({ theme, month, year }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    drawScene(ctx, W, H, theme, month)
  }, [theme, month, year])

  return <canvas ref={canvasRef} className={styles.heroCanvas} aria-hidden="true" />
}
