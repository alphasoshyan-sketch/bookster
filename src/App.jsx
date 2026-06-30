import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const ZODIAC_SIGNS = [
  { symbol: '♈', name: '양자리', en: 'Aries', date: '3.21–4.19' },
  { symbol: '♉', name: '황소자리', en: 'Taurus', date: '4.20–5.20' },
  { symbol: '♊', name: '쌍둥이자리', en: 'Gemini', date: '5.21–6.21' },
  { symbol: '♋', name: '게자리', en: 'Cancer', date: '6.22–7.22' },
  { symbol: '♌', name: '사자자리', en: 'Leo', date: '7.23–8.22' },
  { symbol: '♍', name: '처녀자리', en: 'Virgo', date: '8.23–9.22' },
  { symbol: '♎', name: '천칭자리', en: 'Libra', date: '9.23–10.23' },
  { symbol: '♏', name: '전갈자리', en: 'Scorpio', date: '10.24–11.22' },
  { symbol: '♐', name: '사수자리', en: 'Sagittarius', date: '11.23–12.21' },
  { symbol: '♑', name: '염소자리', en: 'Capricorn', date: '12.22–1.19' },
  { symbol: '♒', name: '물병자리', en: 'Aquarius', date: '1.20–2.18' },
  { symbol: '♓', name: '물고기자리', en: 'Pisces', date: '2.19–3.20' },
]

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

const MBTI_COLORS = {
  INT: 'from-violet-600 to-purple-800',
  ENT: 'from-blue-600 to-indigo-800',
  INF: 'from-emerald-600 to-teal-800',
  ENF: 'from-rose-600 to-pink-800',
  IST: 'from-amber-600 to-orange-800',
  EST: 'from-cyan-600 to-sky-800',
  ISF: 'from-lime-600 to-green-800',
  ESF: 'from-fuchsia-600 to-pink-800',
}

function getMbtiColor(mbti) {
  const key = mbti.slice(0, 3)
  return MBTI_COLORS[key] || 'from-slate-600 to-slate-800'
}

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [selectedZodiac, setSelectedZodiac] = useState(null)
  const [selectedMbti, setSelectedMbti] = useState(null)

  const canRecommend = selectedZodiac !== null && selectedMbti !== null

  function handleRecommend() {
    if (!canRecommend) return
    alert(`${selectedZodiac.name} + ${selectedMbti} 맞춤 도서를 추천해드릴게요!`)
  }

  return (
    <div className="min-h-screen relative">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-5xl mb-3">✦</div>
          <h1 className="text-4xl font-bold text-gradient mb-2">BookStar</h1>
          <p className="text-slate-400 text-base">
            별자리와 MBTI로 찾는 나만의 책
          </p>
        </motion.div>

        {/* 별자리 선택 */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span className="text-purple-400">★</span> 나의 별자리
            {selectedZodiac && (
              <span className="ml-auto text-sm font-normal text-purple-300">
                {selectedZodiac.symbol} {selectedZodiac.name}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ZODIAC_SIGNS.map((zodiac, i) => (
              <motion.button
                key={zodiac.en}
                onClick={() => setSelectedZodiac(zodiac)}
                className={`card-cosmic rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
                  selectedZodiac?.en === zodiac.en
                    ? 'border-purple-400 glow-purple bg-purple-900/40'
                    : 'hover:border-purple-500/50 hover:bg-purple-900/20'
                }`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-2xl">{zodiac.symbol}</span>
                <span className="text-xs text-slate-300 font-medium">{zodiac.name}</span>
                <span className="text-[10px] text-slate-500">{zodiac.date}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* MBTI 선택 */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span className="text-pink-400">✦</span> 나의 MBTI
            {selectedMbti && (
              <span className="ml-auto text-sm font-normal text-pink-300">
                {selectedMbti}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map((mbti, i) => (
              <motion.button
                key={mbti}
                onClick={() => setSelectedMbti(mbti)}
                className={`relative rounded-xl py-3 px-2 text-sm font-bold cursor-pointer transition-all duration-200 overflow-hidden ${
                  selectedMbti === mbti
                    ? 'text-white glow-pink'
                    : 'text-slate-300 card-cosmic hover:text-white'
                }`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.03 * i }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {selectedMbti === mbti && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${getMbtiColor(mbti)} opacity-80`}
                    layoutId="mbti-bg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{mbti}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* 도서 추천 버튼 */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <motion.button
            onClick={handleRecommend}
            disabled={!canRecommend}
            className={`relative px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-300 overflow-hidden ${
              canRecommend
                ? 'text-white cursor-pointer'
                : 'text-slate-500 cursor-not-allowed card-cosmic'
            }`}
            whileHover={canRecommend ? { scale: 1.05 } : {}}
            whileTap={canRecommend ? { scale: 0.97 } : {}}
          >
            {canRecommend && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span>✦</span>
              <span>도서 추천받기</span>
              <span>✦</span>
            </span>
          </motion.button>
        </motion.div>

        {/* 안내 문구 */}
        <AnimatePresence>
          {!canRecommend && (
            <motion.p
              className="text-center text-slate-600 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!selectedZodiac && !selectedMbti
                ? '별자리와 MBTI를 선택해주세요'
                : !selectedZodiac
                ? '별자리를 선택해주세요'
                : 'MBTI를 선택해주세요'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
