import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const ZODIAC_SIGNS = [
  { icon: 'bakery_dining', name: '양자리', en: 'Aries' },
  { icon: 'agriculture', name: '황소자리', en: 'Taurus' },
  { icon: 'diversity_3', name: '쌍둥이자리', en: 'Gemini' },
  { icon: 'waves', name: '게자리', en: 'Cancer' },
  { icon: 'pets', name: '사자자리', en: 'Leo' },
  { icon: 'spa', name: '처녀자리', en: 'Virgo' },
  { icon: 'balance', name: '천칭자리', en: 'Libra' },
  { icon: 'bug_report', name: '전갈자리', en: 'Scorpio' },
  { icon: 'architecture', name: '궁수자리', en: 'Sagittarius' },
  { icon: 'foundation', name: '염소자리', en: 'Capricorn' },
  { icon: 'opacity', name: '물병자리', en: 'Aquarius' },
  { icon: 'set_meal', name: '물고기자리', en: 'Pisces' },
]

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
    const ctx = canvas.getContext('2d')
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
      <span className="material-symbols-outlined" style={{ color: '#cbc3d5', fontSize: '24px', cursor: 'pointer' }}>search</span>
    </header>
  )
}

function BottomNav() {
  return (
    <nav style={{
      background: 'rgba(25, 28, 30, 0.6)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      zIndex: 50,
      borderRadius: '16px 16px 0 0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '72px',
      paddingBottom: '8px',
    }}>
      {[
        { icon: 'auto_stories', label: '운명', filled: true, active: true },
        { icon: 'explore', label: '탐색', active: false },
        { icon: 'bookmarks', label: '서재', active: false },
        { icon: 'settings', label: '설정', active: false },
      ].map(({ icon, label, filled, active }) => (
        <a key={label} href="#" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          color: active ? '#cebdff' : '#948e9f', textDecoration: 'none', transition: 'color 0.2s',
        }}>
          <span className={filled ? 'material-symbols-filled' : 'material-symbols-outlined'} style={{ fontSize: '24px' }}>{icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
        </a>
      ))}
    </nav>
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
        <span className="material-symbols-outlined" style={{ color: '#cbc3d5', fontSize: '24px', cursor: 'pointer' }}>search</span>
      </header>

      {/* 메인 */}
      <main style={{
        position: 'relative', zIndex: 10,
        paddingTop: '64px', paddingBottom: '80px',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <section style={{ width: '100%', maxWidth: '448px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* 책 히어로 */}
          <motion.div
            style={{ position: 'relative', width: '100%', aspectRatio: '1', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
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

          {/* 문구 */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-serif" style={{ fontSize: '36px', fontWeight: 700, color: 'white', lineHeight: 1.3, margin: 0, letterSpacing: '-0.02em' }}>
              당신의 별이 들려주는<br />책의 이야기
            </h2>
            <p style={{ fontSize: '18px', color: '#cbc3d5', lineHeight: 1.6, margin: '0 auto', maxWidth: '280px' }}>
              별자리와 성향을 통해<br />운명적인 책을 만나보세요.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            style={{ marginTop: '32px', width: '100%' }}
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

        {/* 뱃지 */}
        <motion.section
          style={{ position: 'relative', zIndex: 10, width: '100%', marginTop: '48px', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '448px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-filled" style={{ color: '#ffe16d', fontSize: '24px' }}>bedtime</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e0e3e5' }}>별자리 분석</span>
          </div>
          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-filled" style={{ color: '#cebdff', fontSize: '24px' }}>psychology</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e0e3e5' }}>성향 기반 추천</span>
          </div>
        </motion.section>
      </main>

      <BottomNav />
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

function BookCover({ title, coverUrl, loading }) {
  return (
    <div style={{
      width: '100px', height: '148px', flexShrink: 0, borderRadius: '8px',
      overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', transform: 'rotate(-2deg)',
      background: 'linear-gradient(135deg, #9d7bff 0%, #390094 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #3d2080, #1a0050)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '32px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px' }}>
          <span className="material-symbols-filled" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '32px' }}>auto_stories</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', textAlign: 'center', fontFamily: 'Noto Serif KR, serif', lineHeight: 1.3 }}>{title}</span>
        </div>
      )}
    </div>
  )
}

function ResultPage({ books, zodiac, mbti, onReset }) {
  const [covers, setCovers] = useState(Array(books.length).fill(undefined))

  useEffect(() => {
    Promise.all(books.map(b => fetchCover(b.title, b.author))).then(setCovers)
  }, [books])

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

      <main style={{ position: 'relative', zIndex: 10, padding: '96px 24px 120px', maxWidth: '512px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(206,189,255,0.1)', borderRadius: '9999px', border: '1px solid rgba(206,189,255,0.2)', marginBottom: '8px' }}>
            <span className="material-symbols-filled" style={{ color: '#cebdff', fontSize: '16px' }}>temp_preferences_custom</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#cebdff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>운명적 추천</span>
          </div>
          <h2 className="font-serif" style={{ fontSize: '28px', fontWeight: 600, color: '#e0e3e5', margin: '0 0 8px', lineHeight: 1.3 }}>
            당신을 위해 선별된<br />세 권의 책
          </h2>
          <p style={{ color: '#cbc3d5', fontSize: '15px', margin: 0 }}>
            {zodiac?.name} × {mbti} — 천체의 흐름과 당신의 성격이 만난 결과입니다.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {books.map((book, i) => (
            <motion.div
              key={i}
              className="glass-card mystical-border"
              style={{ borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <div style={{ display: 'flex', gap: '14px' }}>
                <BookCover title={book.title} coverUrl={covers[i] || null} loading={covers[i] === undefined} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffe16d', display: 'block', marginBottom: '4px' }}>
                    {zodiac?.name} &amp; {mbti}를 위한 선택
                  </span>
                  <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#e0e3e5', margin: '0 0 3px', lineHeight: 1.3 }}>{book.title}</h3>
                  <p style={{ color: '#cbc3d5', fontSize: '13px', margin: '0 0 10px' }}>{book.author}</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="mbti-badge" style={{ background: 'rgba(206,189,255,0.2)', padding: '2px 10px', color: '#cebdff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {mbti}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ffe16d' }}>
                      <span className="material-symbols-filled" style={{ fontSize: '14px' }}>star</span>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{zodiac?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '18px' }}>smart_toy</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#cebdff', letterSpacing: '0.05em' }}>AI의 조언</span>
                </div>
                <p style={{ color: '#cbc3d5', fontSize: '14px', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{book.reason}"</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.button
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

      <BottomNav />
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
      if (!text) throw new Error('API 응답이 비어있습니다. 포트 8788로 접속했는지 확인해주세요.')
      const data = JSON.parse(text)
      if (!res.ok) throw new Error(data.error || '오류가 발생했습니다.')
      setBooks(data)
      setPage('result')
    } catch (e) {
      setError(e.message)
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

      <main style={{ padding: '24px 24px 120px', maxWidth: '512px', margin: '64px auto 0' }}>

        <section style={{ marginTop: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e0e3e5', marginBottom: '16px' }}>
            당신의 별자리를 선택하세요
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {ZODIAC_SIGNS.map((zodiac, i) => (
              <motion.button
                key={zodiac.en}
                onClick={() => handleZodiacSelect(zodiac)}
                className={`glass-card${selectedZodiac?.en === zodiac.en ? ' active' : ''}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  aspectRatio: '1', borderRadius: '12px', padding: '8px', cursor: 'pointer', border: 'none',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '28px', marginBottom: '4px' }}>{zodiac.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#e0e3e5', lineHeight: '16px' }}>{zodiac.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e0e3e5', marginBottom: '16px' }}>
            당신의 MBTI는 무엇인가요?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
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
                    border: isActive ? '1px solid #cebdff' : undefined,
                    color: isActive ? '#390094' : '#e0e3e5',
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

        <AnimatePresence>
          {!canRecommend && !loading && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: 'rgba(203,195,213,0.5)', fontSize: '14px', marginTop: '12px' }}
            >
              {!selectedZodiac && !selectedMbti ? '별자리와 MBTI를 선택해주세요'
                : !selectedZodiac ? '별자리를 선택해주세요'
                : 'MBTI를 선택해주세요'}
            </motion.p>
          )}
        </AnimatePresence>

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

      <BottomNav />
    </motion.div>
  )
}
