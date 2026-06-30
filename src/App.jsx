import { useState, useEffect, useRef } from 'react'
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

const MBTI_PAIRS = [
  { key: 'ei', options: ['E', 'I'] },
  { key: 'sn', options: ['S', 'N'] },
  { key: 'tf', options: ['T', 'F'] },
  { key: 'jp', options: ['J', 'P'] },
]

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

export default function App() {
  const [selectedZodiac, setSelectedZodiac] = useState(null)
  const [mbti, setMbti] = useState({ ei: null, sn: null, tf: null, jp: null })
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const selectedMbti = ['ei', 'sn', 'tf', 'jp'].every(k => mbti[k])
    ? `${mbti.ei}${mbti.sn}${mbti.tf}${mbti.jp}`
    : null
  const canRecommend = selectedZodiac !== null && selectedMbti !== null

  function toggleMbti(key, value) {
    setMbti(prev => ({ ...prev, [key]: value }))
    setBook(null)
  }

  function handleZodiacSelect(zodiac) {
    setSelectedZodiac(zodiac)
    setBook(null)
  }

  async function handleRecommend() {
    if (!canRecommend) return
    setLoading(true)
    setBook(null)
    setError(null)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zodiac: selectedZodiac.name, mbti: selectedMbti }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '오류가 발생했습니다.')
      setBook(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <StarField />

      {/* 상단 앱바 */}
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
          <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '24px' }}>auto_awesome</span>
          <h1 className="font-serif" style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#cebdff',
            textShadow: '0 0 8px rgba(206,189,255,0.8)',
            margin: 0,
          }}>별들의 도서관</h1>
        </div>
        <span className="material-symbols-outlined" style={{ color: '#cbc3d5', fontSize: '24px', cursor: 'pointer' }}>notifications</span>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ marginTop: '64px', padding: '24px 24px 120px', maxWidth: '512px', margin: '64px auto 0' }}>

        {/* 별자리 섹션 */}
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  border: 'none',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '28px', marginBottom: '4px' }}>
                  {zodiac.icon}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#e0e3e5', lineHeight: '16px' }}>
                  {zodiac.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* MBTI 섹션 */}
        <section style={{ marginTop: '32px' }}>
          <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e0e3e5', marginBottom: '16px' }}>
            당신의 MBTI는 무엇인가요?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MBTI_PAIRS.map(({ key, options }) => (
              <div key={key} style={{ display: 'flex', gap: '12px' }}>
                {options.map(option => {
                  const isActive = mbti[key] === option
                  return (
                    <motion.button
                      key={option}
                      onClick={() => toggleMbti(key, option)}
                      className={`glass-card${isActive ? ' mbti-active' : ''}`}
                      style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '24px',
                        fontWeight: 600,
                        fontFamily: 'Noto Serif KR, serif',
                        cursor: 'pointer',
                        border: isActive ? '1px solid #cebdff' : undefined,
                        color: isActive ? '#390094' : '#e0e3e5',
                        transition: 'all 0.2s ease',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {option}
                    </motion.button>
                  )
                })}
              </div>
            ))}
          </div>
          {selectedMbti && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', color: '#cebdff', fontSize: '14px', marginTop: '12px', fontWeight: 600 }}
            >
              {selectedMbti}
            </motion.p>
          )}
        </section>

        {/* 추천 버튼 */}
        <motion.button
          onClick={handleRecommend}
          disabled={!canRecommend || loading}
          className="primary-gradient-btn"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '9999px',
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            marginTop: '32px',
            border: 'none',
          }}
          whileHover={canRecommend && !loading ? { scale: 1.02 } : {}}
          whileTap={canRecommend && !loading ? { scale: 0.97 } : {}}
        >
          {loading ? '분석 중...' : '추천 받기'}
        </motion.button>

        {/* 안내 문구 */}
        <AnimatePresence>
          {!canRecommend && !loading && !book && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: 'rgba(203,195,213,0.5)', fontSize: '14px', marginTop: '12px' }}
            >
              {!selectedZodiac && !selectedMbti
                ? '별자리와 MBTI를 선택해주세요'
                : !selectedZodiac
                ? '별자리를 선택해주세요'
                : 'MBTI를 모두 선택해주세요'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 로딩 */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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

        {/* 에러 */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: '#ffb4ab', fontSize: '14px', marginTop: '16px' }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 도서 추천 결과 */}
        <AnimatePresence>
          {book && (
            <motion.div
              className="glass-card"
              style={{ borderRadius: '16px', padding: '24px', marginTop: '24px', borderColor: 'rgba(206,189,255,0.3)' }}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ color: '#cebdff', fontSize: '20px' }}>auto_stories</span>
                <span style={{ color: '#cbc3d5', fontSize: '13px' }}>
                  {selectedZodiac?.name} × {selectedMbti} 맞춤 추천
                </span>
              </div>
              <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, color: '#e0e3e5', margin: '0 0 6px' }}>
                {book.title}
              </h3>
              <p style={{ color: '#cbc3d5', fontSize: '14px', margin: '0 0 16px' }}>{book.author}</p>
              <p style={{ color: '#e0e3e5', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{book.reason}</p>
              <button
                onClick={() => { setBook(null); setError(null) }}
                style={{
                  marginTop: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(203,195,213,0.5)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                다시 추천받기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 하단 네비게이션 */}
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: active ? '#cebdff' : '#948e9f',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            <span className={filled ? 'material-symbols-filled' : 'material-symbols-outlined'} style={{ fontSize: '24px' }}>
              {icon}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
