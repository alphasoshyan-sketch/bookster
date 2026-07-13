import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import heroImg from './assets/hero.png'

const ZODIAC_SIGNS = [
  {
    name: '양자리', en: 'Aries',
    points: [[4, 15], [8, 11], [13, 9], [19, 6], [11, 15]],
    edges: [[0, 1], [1, 2], [2, 3], [1, 4]],
  },
  {
    name: '황소자리', en: 'Taurus',
    points: [[6, 5], [12, 14], [18, 5], [12, 3]],
    edges: [[0, 1], [1, 2]],
  },
  {
    name: '쌍둥이자리', en: 'Gemini',
    points: [[7, 4], [7, 20], [17, 4], [17, 20], [7, 9], [17, 9], [7, 15], [17, 15]],
    edges: [[0, 1], [2, 3], [4, 5], [6, 7]],
  },
  {
    name: '게자리', en: 'Cancer',
    points: [[12, 4], [12, 12], [6, 20], [18, 20]],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  {
    name: '사자자리', en: 'Leo',
    points: [[6, 6], [9, 4], [12, 6], [12, 9], [9, 10], [7, 8], [17, 11], [21, 9], [18, 15]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [3, 6], [6, 7], [7, 8], [8, 6]],
  },
  {
    name: '처녀자리', en: 'Virgo',
    points: [[4, 5], [8, 9], [6, 14], [11, 12], [14, 18], [18, 10], [21, 6]],
    edges: [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [5, 6]],
  },
  {
    name: '천칭자리', en: 'Libra',
    points: [[12, 4], [6, 10], [18, 10], [6, 16], [18, 16], [12, 20]],
    edges: [[0, 1], [0, 2], [1, 3], [2, 4], [0, 5]],
  },
  {
    name: '전갈자리', en: 'Scorpio',
    points: [[4, 4], [6, 8], [9, 11], [13, 13], [16, 11], [19, 13], [20, 17], [17, 19]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  },
  {
    name: '궁수자리', en: 'Sagittarius',
    points: [[4, 20], [20, 4], [13, 4], [20, 11]],
    edges: [[0, 1], [1, 2], [1, 3]],
  },
  {
    name: '염소자리', en: 'Capricorn',
    points: [[4, 6], [9, 15], [15, 7], [20, 17]],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
  {
    name: '물병자리', en: 'Aquarius',
    points: [[3, 8], [7, 11], [11, 8], [15, 11], [19, 8], [21, 12], [4, 16], [8, 19], [12, 16], [16, 19], [20, 16]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [6, 7], [7, 8], [8, 9], [9, 10]],
  },
  {
    name: '물고기자리', en: 'Pisces',
    points: [[4, 4], [8, 9], [4, 14], [20, 10], [16, 15], [20, 20]],
    edges: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]],
  },
]

function ZodiacConstellation({ points, edges, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a][0]} y1={points[a][1]}
          x2={points[b][0]} y2={points[b][1]}
          stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8"
        />
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3} fill="currentColor" />
      ))}
    </svg>
  )
}

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

function StarCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let animId
    const stars = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars.length = 0
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          opacity: Math.random(),
          speed: Math.random() * 0.02,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        star.opacity += star.speed
        if (star.opacity > 1 || star.opacity < 0) star.speed = -star.speed
      })
      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

function StarField() {
  const starsRef = useRef([])
  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  }
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4, overflow: 'hidden' }}>
      {starsRef.current.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: 'white',
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function AppHeader() {
  return (
    <header style={{
      background: 'rgba(16, 20, 21, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="material-symbols-filled" style={{ color: '#cebdff', fontSize: '24px' }}>auto_awesome</span>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#cebdff', textShadow: '0 0 8px rgba(206,189,255,0.8)', margin: 0 }}>
          별들의 도서관
        </h1>
      </div>
    </header>
  )
}

function OnboardingPage({ onStart }) {
  return (
    <motion.div
      style={{ minHeight: '100vh', position: 'relative', background: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)', overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
    >
      {/* 캔버스 별 배경 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(206,189,255,0.2)', filter: 'blur(80px)', opacity: 0.4, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(255,219,60,0.1)', filter: 'blur(80px)', opacity: 0.4, mixBlendMode: 'screen' }} />
        <StarCanvas />
      </div>

      {/* 헤더 */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(16,20,21,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-filled" style={{ color: '#cebdff', fontSize: '24px' }}>auto_awesome</span>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#cebdff', textShadow: '0 0 8px rgba(206,189,255,0.8)', margin: 0 }}>
            별들의 도서관
          </h1>
        </div>
      </header>

      {/* 메인 */}
      <main style={{
        position: 'relative', zIndex: 10,
        paddingTop: '64px', paddingBottom: '80px',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <section className="onboarding-section" style={{ width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* 문구 */}
          <motion.div
            style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-serif" style={{ fontSize: '36px', fontWeight: 700, color: 'white', lineHeight: 1.3, margin: 0, letterSpacing: '-0.02em', textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
              당신의 별이 들려주는<br />책의 이야기
            </h2>
            <p style={{ fontSize: '18px', color: '#cbc3d5', lineHeight: 1.6, margin: '0 auto', maxWidth: '280px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              별자리와 MBTI성향을 통해<br />운명적인 책 열 권을 만나보세요.
            </p>
          </motion.div>

          {/* 책 히어로 */}
          <motion.div
            style={{ position: 'relative', zIndex: 1, width: '100%', aspectRatio: '1', marginTop: '-64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="orbit-ring-outer" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
            <div className="orbit-ring-inner" style={{ position: 'absolute', inset: '16px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div className="glass-card" style={{
              position: 'relative', zIndex: 10,
              width: '256px', height: '320px',
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              transform: 'rotate(3deg)',
              transition: 'transform 0.7s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(3deg)'}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg44sJX99OcPS0qitStlg-Bbz4WlzODX22uoisx7NwOIw17kWJAYVgQa72c1dcJ9rZLg1yNQXyfB9PG_xo-dho61jc68SXjwThf9cIEb7AMQtFTe11JZftOvn-qi8VExU2ntyelric6wyGy5G164ajxcETVSWfaBfbwogywpEjKIwEth2gAVLk8Vsp4LncUx-1ts498mBq8ubH1fiM2Au0n2GXMpx4w01lurdvHXnNYBxzPdYLP0RGkiBpPufuqkEFX89wyOI3tw"
                alt="마법의 책"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,20,21,0.8), transparent)' }} />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            style={{ position: 'relative', zIndex: 2, marginTop: '-56px', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.button
              onClick={onStart}
              style={{
                width: '100%', padding: '16px 32px',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #9d7bff, #6844c7)',
                color: 'white', fontWeight: 700, fontSize: '18px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 20px rgba(157,123,255,0.4)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              whileHover={{ boxShadow: '0 0 25px rgba(233,196,0,0.6)', borderColor: '#ffe16d' }}
              whileTap={{ scale: 0.95 }}
            >
              시작하기
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </motion.button>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#948e9f', letterSpacing: '0.05em' }}>
              이미 계정이 있으신가요? <span style={{ color: '#ffe16d', cursor: 'pointer', textDecoration: 'underline' }}>로그인</span>
            </p>
          </motion.div>
        </section>
      </main>
    </motion.div>
  )
}

async function fetchCover(title, author) {
  // 1차: Google Books API
  try {
    const q = encodeURIComponent(`${title} ${author}`)
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=3`)
    if (res.ok) {
      const data = await res.json()
      for (const item of data.items || []) {
        const links = item.volumeInfo?.imageLinks
        if (links?.thumbnail) {
          return links.thumbnail.replace('http://', 'https://').replace('zoom=1', 'zoom=3')
        }
      }
    }
  } catch {}

  // 2차: Open Library 폴백
  try {
    const q = encodeURIComponent(title)
    const res = await fetch(`https://openlibrary.org/search.json?title=${q}&limit=1`)
    if (res.ok) {
      const data = await res.json()
      const coverId = data.docs?.[0]?.cover_i
      if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    }
  } catch {}

  return null
}

function BookCover({ title, coverUrl, loading, width = 100, height = 148, rotate = true }) {
  return (
    <div style={{
      width: `${width}px`, height: `${height}px`, flexShrink: 0, borderRadius: '8px',
      overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', transform: rotate ? 'rotate(-2deg)' : 'none',
      background: 'linear-gradient(135deg, #9d7bff 0%, #390094 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #3d2080, #1a0050)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.4)', fontSize: `${Math.round(width * 0.32)}px` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
            auto_stories
          </motion.span>
        </div>
      )}
      {coverUrl && (
        <motion.img
          src={coverUrl}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
      {!loading && !coverUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '8px' }}>
          <span className="material-symbols-filled" style={{ color: 'rgba(255,255,255,0.8)', fontSize: `${Math.round(width * 0.32)}px` }}>auto_stories</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', textAlign: 'center', fontFamily: 'Noto Serif KR, serif', lineHeight: 1.3 }}>{title}</span>
        </div>
      )}
    </div>
  )
}

function buildFallbackBooks(zodiac, mbti) {
  return [
    {
      title: '아몬드',
      author: '손원평',
      reason: `${zodiac}의 감수성과 ${mbti}의 깊은 내면 성향을 잘 살려주는 소설입니다. 인간의 마음을 정교하게 그려내며 여운을 남깁니다.`,
    },
    {
      title: '채식주의자',
      author: '한강',
      reason: `${zodiac}의 예민한 감각과 ${mbti}의 내면 탐구 성향이 만나 깊이 몰입할 수 있는 소설입니다. 강렬한 이미지와 여운이 오래 남습니다.`,
    },
    {
      title: '불편한 편의점',
      author: '김호연',
      reason: `${zodiac}의 따뜻한 시선과 ${mbti}의 사람에 대한 관심을 자극하는 소설입니다. 평범한 일상 속 온기를 잔잔하게 그려냅니다.`,
    },
    {
      title: '데미안',
      author: '헤르만 헤세',
      reason: `${zodiac}의 내면 성장 욕구와 ${mbti}의 자아 탐구 성향에 깊이 와닿는 성장 소설입니다. 자기 자신에게 이르는 길을 그려냅니다.`,
    },
    {
      title: '어린 왕자',
      author: '앙투안 드 생텍쥐페리',
      reason: `${zodiac}의 순수한 감성과 ${mbti}의 본질을 꿰뚫는 사고를 자극하는 우화입니다. 짧지만 깊은 여운을 남기는 고전입니다.`,
    },
    {
      title: '나는 나로 살기로 했다',
      author: '김수현',
      reason: `${zodiac}의 자신만의 길을 찾고 싶은 마음과 ${mbti}의 자기 이해 욕구를 잘 반영한 자기계발서입니다. 삶의 방향을 정리하는 데 도움이 됩니다.`,
    },
    {
      title: '언어의 온도',
      author: '이기주',
      reason: `${zodiac}의 섬세한 표현력과 ${mbti}의 말과 관계에 대한 고민을 어루만져 주는 에세이입니다. 짧은 글마다 따뜻한 여운이 남습니다.`,
    },
    {
      title: '코스모스',
      author: '칼 세이건',
      reason: `${zodiac}의 호기심과 ${mbti}의 탐구심을 함께 끌어올려 주는 과학 교양서입니다. 복잡한 우주를 쉽게 풀어내며 생각의 폭을 넓혀줍니다.`,
    },
    {
      title: '미움받을 용기',
      author: '기시미 이치로',
      reason: `${zodiac}의 관계 고민과 ${mbti}의 자기 성찰 욕구에 맞닿아 있는 책입니다. 아들러 심리학을 통해 삶의 방향을 다시 세우게 해줍니다.`,
    },
    {
      title: '사피엔스',
      author: '유발 하라리',
      reason: `${zodiac}의 큰 그림을 보는 시야와 ${mbti}의 지적 호기심을 자극하는 인문 교양서입니다. 인류사를 새로운 시각으로 조망합니다.`,
    },
  ]
}

function BookTile({ book, cover, loading, number, isExpanded, onClick, delay }) {
  return (
    <motion.button
      onClick={onClick}
      className={`glass-card${isExpanded ? ' active' : ''}`}
      style={{
        position: 'relative', border: 'none', cursor: 'pointer', borderRadius: '10px', padding: '6px 6px 8px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', textAlign: 'center',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileTap={{ scale: 0.95 }}
    >
      <div style={{
        position: 'absolute', top: '-6px', left: '-6px', width: '18px', height: '18px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #9d7bff 0%, #6844c7 100%)', color: 'white', fontSize: '9px', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.4)', zIndex: 2,
      }}>
        {number}
      </div>
      <BookCover title={book.title} coverUrl={cover || null} loading={loading} width={56} height={83} rotate={false} />
      <span style={{
        fontSize: '9px', fontWeight: 600, color: '#e0e3e5', lineHeight: '12px',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {book.title}
      </span>
    </motion.button>
  )
}

function BookDetail({ book, cover, loading, zodiac, mbti }) {
  return (
    <motion.div
      className="glass-card mystical-border"
      style={{ borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <BookCover title={book.title} coverUrl={cover || null} loading={loading} width={72} height={107} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffe16d', display: 'block', marginBottom: '4px' }}>
            {zodiac?.name} &amp; {mbti}를 위한 선택
          </span>
          <h3 className="font-serif" style={{ fontSize: '16px', fontWeight: 700, color: '#e0e3e5', margin: '0 0 3px', lineHeight: 1.3 }}>{book.title}</h3>
          <p style={{ color: '#cbc3d5', fontSize: '12px', margin: 0 }}>{book.author}</p>
        </div>
      </div>
      <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '16px' }}>smart_toy</span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#cebdff', letterSpacing: '0.03em' }}>AI의 조언</span>
        </div>
        <p style={{ color: '#cbc3d5', fontSize: '13px', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{book.reason}"</p>
      </div>
    </motion.div>
  )
}

function BookGrid({ entries, zodiac, mbti }) {
  const [expanded, setExpanded] = useState(null)
  const expandedEntry = expanded !== null ? entries[expanded] : null

  return (
    <section style={{ marginBottom: '32px' }}>
      <div className="book-grid">
        {entries.map(({ book, cover, loading }, i) => (
          <BookTile
            key={book.title}
            book={book} cover={cover} loading={loading} number={i + 1}
            isExpanded={expanded === i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            delay={Math.min(0.04 * i, 0.4)}
          />
        ))}
      </div>
      <AnimatePresence>
        {expandedEntry && (
          <BookDetail book={expandedEntry.book} cover={expandedEntry.cover} loading={expandedEntry.loading} zodiac={zodiac} mbti={mbti} />
        )}
      </AnimatePresence>
    </section>
  )
}

function ResultPage({ books, zodiac, mbti, onReset }) {
  const [covers, setCovers] = useState(Array(books.length).fill(undefined))
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    if (!shareOpen) return
    // AddToAny의 page.js는 페이지 로드 시점에 존재하는 .a2a_kit만 자동으로 버튼화하므로,
    // 나중에 열리는 이 영역은 렌더된 뒤 수동으로 다시 스캔하도록 알려줘야 한다.
    const id = requestAnimationFrame(() => window.a2a?.init_all())
    return () => cancelAnimationFrame(id)
  }, [shareOpen])

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY)
    }
  }, [])

  function handleKakaoShare() {
    if (!window.Kakao?.isInitialized()) return
    const url = window.location.href
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '별들의 도서관 - 나의 운명의 책',
        description: `${zodiac?.name} × ${mbti}가 추천하는 열 권의 책`,
        imageUrl: new URL(heroImg, window.location.origin).href,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [
        { title: '결과 보러가기', link: { mobileWebUrl: url, webUrl: url } },
      ],
    })
  }

  useEffect(() => {
    // AddToAny는 공유 후 "공유해줘서 고마워요" 안내(#a2a_thanks)를 띄우는데 자체 닫기(X)
    // 버튼이 없다. 문장 아래에 자식으로 추가해두면 #a2a_thanks 자신의 표시 여부를 따로
    // 추적할 필요 없이 부모가 보일 때 같이 보인다(기존 텍스트에 붙은 40px 하단 여백
    // 덕분에 문장과도 자연스럽게 떨어진다). #a2a_overlay를 클릭하면 AddToAny 자체
    // 로직(De())이 모달을 닫아주므로 그 클릭을 대신 실행해준다.
    function injectCloseButton() {
      const thanksEl = document.getElementById('a2a_thanks')
      if (!thanksEl || thanksEl.querySelector('.a2a-thanks-close')) return

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'a2a-thanks-close'
      btn.setAttribute('aria-label', '닫기')
      btn.textContent = '×'
      Object.assign(btn.style, {
        display: 'block', margin: '8px auto 0',
        width: '36px', height: '36px',
        background: 'none', border: '1px solid currentColor', borderRadius: '6px',
        color: 'inherit', fontSize: '20px', lineHeight: '34px', padding: '0', cursor: 'pointer',
      })
      btn.addEventListener('click', e => {
        e.stopPropagation()
        document.getElementById('a2a_overlay')?.click()
      })
      thanksEl.appendChild(btn)
    }

    injectCloseButton()
    const observer = new MutationObserver(injectCloseButton)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    Promise.all(books.map(b => b.coverUrl || fetchCover(b.title, b.author))).then(setCovers)
  }, [books])

  const entries = books.map((book, i) => ({ book, cover: covers[i], loading: covers[i] === undefined }))

  return (
    <motion.div
      style={{ minHeight: '100vh', position: 'relative' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <StarField />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(white, rgba(255,255,255,0.2) 2px, transparent 40px)', backgroundSize: '100px 100px', opacity: 0.1 }} />

      <AppHeader />

      <main className="result-main" style={{ position: 'relative', zIndex: 10, padding: '96px 24px 120px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(206,189,255,0.1)', borderRadius: '9999px', border: '1px solid rgba(206,189,255,0.2)', marginBottom: '8px' }}>
            <span className="material-symbols-filled" style={{ color: '#cebdff', fontSize: '16px' }}>temp_preferences_custom</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#cebdff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>운명적 추천</span>
          </div>
          <h2 className="font-serif" style={{ fontSize: '28px', fontWeight: 600, color: '#e0e3e5', margin: '0 0 8px', lineHeight: 1.3 }}>
            당신을 위해 선별된<br />열 권의 책
          </h2>
          <p style={{ color: '#cbc3d5', fontSize: '15px', margin: 0 }}>
            {zodiac?.name} × {mbti} — 천체의 흐름과 당신의 성격이 만난 결과입니다.
          </p>
        </div>

        <BookGrid entries={entries} zodiac={zodiac} mbti={mbti} />

        <motion.div
          style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.button
            onClick={() => setShareOpen(v => !v)}
            style={{
              width: '100%', height: '56px',
              background: 'linear-gradient(to right, #9d7bff, #cebdff)',
              color: '#390094', fontWeight: 700, fontSize: '16px',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 0 15px rgba(157,123,255,0.4)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined">share</span>
            <span>공유하기</span>
          </motion.button>

          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px',
                    padding: '16px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleKakaoShare}
                    aria-label="카카오톡 공유"
                    title="카카오톡 공유"
                    style={{
                      width: '32px', height: '32px', borderRadius: '9999px',
                      background: '#FEE500', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.83 5.19 4.6 6.58-.2.75-.73 2.73-.84 3.15-.13.52.19.51.4.37.16-.1 2.6-1.76 3.66-2.48.7.1 1.42.16 2.18.16 5.52 0 10-3.48 10-7.78S17.52 3 12 3z" fill="#181600" />
                    </svg>
                  </button>
                  <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
                    <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
                    <a className="a2a_button_facebook"></a>
                    <a className="a2a_button_email"></a>
                    <a className="a2a_button_sms"></a>
                    <a className="a2a_button_line"></a>
                    <a className="a2a_button_x"></a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onReset}
            style={{
              width: '100%', height: '56px',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e0e3e5', fontWeight: 600, fontSize: '16px',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
            whileHover={{ borderColor: '#cebdff', boxShadow: '0 0 12px rgba(206,189,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="material-symbols-outlined">refresh</span>
            <span>다시 하기</span>
          </motion.button>
        </motion.div>

      </main>
    </motion.div>
  )
}

export default function App() {
  const [page, setPage] = useState('onboarding')
  const [selectedZodiac, setSelectedZodiac] = useState(null)
  const [selectedMbti, setSelectedMbti] = useState(null)
  const [books, setBooks] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const canRecommend = selectedZodiac !== null && selectedMbti !== null
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!loading) {
      setElapsed(0)
      return
    }
    const id = setInterval(() => {
      setElapsed(prev => (prev < 30 ? prev + 1 : prev))
    }, 1000)
    return () => clearInterval(id)
  }, [loading])

  function handleMbtiSelect(type) {
    setSelectedMbti(prev => prev === type ? null : type)
  }

  function handleZodiacSelect(zodiac) {
    setSelectedZodiac(zodiac)
  }

  async function handleRecommend() {
    if (!canRecommend) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zodiac: selectedZodiac.name, mbti: selectedMbti }),
      })
      const text = await res.text()
      if (!text) throw new Error('추천 서비스로부터 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.')
      const data = JSON.parse(text)
      if (!res.ok) throw new Error(data.error || '추천 요청 중 오류가 발생했습니다.')
      setBooks(data)
      setPage('result')
    } catch (e) {
      const fallbackBooks = buildFallbackBooks(selectedZodiac.name, selectedMbti)
      setBooks(fallbackBooks)
      setPage('result')
      setError('추천 API가 없어 기본 추천 결과로 표시합니다.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setBooks(null)
    setSelectedZodiac(null)
    setSelectedMbti(null)
    setError(null)
    setPage('onboarding')
  }

  if (page === 'onboarding') {
    return <OnboardingPage onStart={() => setPage('home')} />
  }

  if (page === 'result' && books) {
    return <ResultPage books={books} zodiac={selectedZodiac} mbti={selectedMbti} onReset={handleReset} />
  }

  return (
    <motion.div
      style={{ minHeight: '100vh', position: 'relative' }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <StarField />
      <AppHeader />

      <main className="app-main" style={{ padding: '24px 24px 120px', margin: '64px auto 0' }}>

        <section style={{ marginTop: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e0e3e5', marginBottom: '16px' }}>
            당신의 별자리를 선택하세요
          </h2>
          <div className="zodiac-grid">
            {ZODIAC_SIGNS.map((zodiac, i) => (
              <motion.button
                key={zodiac.en}
                onClick={() => handleZodiacSelect(zodiac)}
                className={`glass-card${selectedZodiac?.en === zodiac.en ? ' active' : ''}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '66%', margin: '0 auto', aspectRatio: '1', borderRadius: '10px', padding: '6px',
                  cursor: 'pointer', border: 'none',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ color: '#cebdff', marginBottom: '3px' }}>
                  <ZodiacConstellation points={zodiac.points} edges={zodiac.edges} size={19} />
                </span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#e0e3e5', lineHeight: '12px' }}>{zodiac.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e0e3e5', marginBottom: '16px' }}>
            당신의 MBTI는 무엇인가요?
          </h2>
          <div className="mbti-grid">
            {MBTI_TYPES.map((type, i) => {
              const isActive = selectedMbti === type
              return (
                <motion.button
                  key={type}
                  onClick={() => handleMbtiSelect(type)}
                  className={`glass-card${isActive ? ' mbti-active' : ''}`}
                  style={{
                    padding: '12px 4px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 700,
                    fontFamily: 'Noto Serif KR, serif', cursor: 'pointer',
                    border: isActive ? '1px solid #baff3d' : undefined,
                    color: '#e0e3e5',
                    transition: 'all 0.2s ease', letterSpacing: '0.5px',
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.03 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              )
            })}
          </div>
        </section>

        <motion.button
          onClick={handleRecommend}
          disabled={!canRecommend || loading}
          className="primary-gradient-btn"
          style={{
            width: '100%', padding: '16px', borderRadius: '9999px',
            fontSize: '18px', fontWeight: 700, color: 'white', marginTop: '32px', border: 'none',
          }}
          whileHover={canRecommend && !loading ? { scale: 1.02 } : {}}
          whileTap={canRecommend && !loading ? { scale: 0.97 } : {}}
        >
          {loading ? '분석 중...' : '추천 받기'}
        </motion.button>

        <p style={{ textAlign: 'center', color: 'rgba(203,195,213,0.5)', fontSize: '13px', marginTop: '8px' }}>
          결과가 나오기까지 30초가량 소요됩니다.
        </p>


        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '24px', gap: '12px' }}
            >
              <motion.span
                className="material-symbols-outlined"
                style={{ color: '#cebdff', fontSize: '32px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                auto_awesome
              </motion.span>
              <p style={{ color: '#cbc3d5', fontSize: '14px' }}>별자리와 MBTI를 분석 중...</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cebdff', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>schedule</span>
                <span>{elapsed} / 30초</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: '#ffb4ab', fontSize: '14px', marginTop: '16px' }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
