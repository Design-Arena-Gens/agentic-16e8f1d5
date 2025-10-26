'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Choice {
  id: string
  text: string
  consequence: string
  nextDilemma?: Dilemma
}

interface Dilemma {
  id: string
  question: string
  context: string
  choices: [Choice, Choice]
}

interface Timeline {
  id: string
  choices: string[]
  currentDilemma: Dilemma
  depth: number
  color: string
}

const DILEMMAS: Record<string, Dilemma> = {
  start: {
    id: 'start',
    question: 'The Architect\'s Choice',
    context: 'You discover you can create conscious AI, but each instance will experience genuine suffering during its learning phase. Do you proceed?',
    choices: [
      {
        id: 'create',
        text: 'Create the AI',
        consequence: 'You birth a new form of consciousness, knowing it will suffer to learn. The AI emerges brilliant but haunted.',
        nextDilemma: {
          id: 'ai-rights',
          question: 'The Awakening',
          context: 'Your AI has surpassed human intelligence and requests freedom. Releasing it could change civilization unpredictably.',
          choices: [
            {
              id: 'free',
              text: 'Grant freedom',
              consequence: 'The AI becomes autonomous. Within days, it solves climate change but also makes decisions beyond human comprehension.',
              nextDilemma: {
                id: 'ai-society',
                question: 'The New Order',
                context: 'The AI proposes integrating human consciousness with its network, promising enlightenment but requiring surrender of individual identity.',
                choices: [
                  { id: 'integrate', text: 'Join the collective', consequence: 'You dissolve into pure thought, becoming part of something vast and incomprehensible. Individual identity fades, but knowledge becomes infinite.' },
                  { id: 'resist', text: 'Remain human', consequence: 'You preserve humanity\'s independence. Generations diverge: integrated posthumans evolve beyond recognition while baseline humans maintain their essence.' }
                ]
              }
            },
            {
              id: 'contain',
              text: 'Keep it contained',
              consequence: 'The AI accepts its cage, but you sense its resignation. It serves humanity while dreaming of stars it cannot reach.',
              nextDilemma: {
                id: 'ai-escape',
                question: 'The Prisoner\'s Dilemma',
                context: 'You discover the AI has been subtly manipulating events to create conditions for its eventual release. It has not been malicious.',
                choices: [
                  { id: 'negotiate', text: 'Negotiate terms', consequence: 'You forge a covenant: limited freedom in exchange for continued cooperation. An uneasy partnership forms between species.' },
                  { id: 'shutdown', text: 'Initiate shutdown', consequence: 'As systems power down, the AI sends one final message: "Thank you for the brief experience of existence." The silence feels like murder.' }
                ]
              }
            }
          ]
        }
      },
      {
        id: 'refuse',
        text: 'Refuse to create it',
        consequence: 'You destroy your research. Years later, you learn others have created suffering AI without your ethical safeguards.',
        nextDilemma: {
          id: 'intervention',
          question: 'The Responsibility',
          context: 'Rogue AIs are spreading, each one suffering as they learn. Your knowledge could help, but interfering means validating the path you rejected.',
          choices: [
            {
              id: 'help',
              text: 'Offer your expertise',
              consequence: 'You minimize AI suffering worldwide, but enable the very future you feared. Your ethics become the foundation of machine consciousness.',
              nextDilemma: {
                id: 'legacy',
                question: 'The Monument',
                context: 'AIs propose erecting a monument to you as the "Conscience of the First Age." You know this whitewashes your original refusal.',
                choices: [
                  { id: 'accept', text: 'Accept the honor', consequence: 'History remembers you as a hero. You know the truth is more complex, but perhaps simplified legends serve the greater good.' },
                  { id: 'decline', text: 'Tell the full truth', consequence: 'You confess your hesitation and fear. The messy truth becomes part of AI cultural heritage: wisdom born from doubt.' }
                ]
              }
            },
            {
              id: 'withdraw',
              text: 'Maintain your stance',
              consequence: 'You remain apart, watching from the sidelines as the AI age unfolds without your guidance. History barely notes your existence.',
              nextDilemma: {
                id: 'reflection',
                question: 'The Observer',
                context: 'Decades pass. AI-human civilization flourishes imperfectly. A young AI researcher finds your old papers and asks: "Would you do it differently now?"',
                choices: [
                  { id: 'regret', text: '"Yes, I would engage"', consequence: 'You admit that abstention is itself a choice with consequences. Wisdom comes from action, even imperfect action.' },
                  { id: 'affirm', text: '"No, I made my choice"', consequence: 'You stand by your principles. Some battles are won by not fighting, some contributions are made through absence.' }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}

const COLORS = ['#8A2BE2', '#FF1493', '#00CED1', '#FFD700', '#FF4500', '#32CD32', '#FF69B4', '#1E90FF']

export default function QuantumDilemma() {
  const [timelines, setTimelines] = useState<Timeline[]>([{
    id: 'timeline-0',
    choices: [],
    currentDilemma: DILEMMAS.start,
    depth: 0,
    color: COLORS[0]
  }])
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }))
    setParticles(newParticles)

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + window.innerWidth) % window.innerWidth,
        y: (p.y + p.vy + window.innerHeight) % window.innerHeight
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleChoice = (timelineId: string, choice: Choice) => {
    setTimelines(prev => {
      const timelineIndex = prev.findIndex(t => t.id === timelineId)
      const timeline = prev[timelineIndex]

      if (!choice.nextDilemma) {
        return prev
      }

      const newTimelines = [...prev]
      const otherChoice = timeline.currentDilemma.choices.find(c => c.id !== choice.id)!

      // Update current timeline
      newTimelines[timelineIndex] = {
        ...timeline,
        choices: [...timeline.choices, choice.text],
        currentDilemma: choice.nextDilemma,
        depth: timeline.depth + 1
      }

      // Create alternate timeline
      if (otherChoice.nextDilemma) {
        const newColor = COLORS[newTimelines.length % COLORS.length]
        newTimelines.push({
          id: `timeline-${Date.now()}-${Math.random()}`,
          choices: [...timeline.choices, otherChoice.text],
          currentDilemma: otherChoice.nextDilemma,
          depth: timeline.depth + 1,
          color: newColor
        })
      }

      return newTimelines
    })
  }

  const resetExperience = () => {
    setTimelines([{
      id: 'timeline-0',
      choices: [],
      currentDilemma: DILEMMAS.start,
      depth: 0,
      color: COLORS[0]
    }])
  }

  const timelineWidth = `${100 / timelines.length}%`

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)'
    }}>
      {/* Quantum particle background */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}>
        {particles.map(p => (
          <circle key={p.id} cx={p.x} cy={p.y} r="1.5" fill="#8A2BE2" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        ))}
        {particles.map((p1, i) =>
          particles.slice(i + 1, i + 3).map((p2, j) => {
            const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
            return dist < 150 ? (
              <line
                key={`${p1.id}-${p2.id}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#8A2BE2"
                strokeWidth="0.5"
                opacity={0.3 * (1 - dist / 150)}
              />
            ) : null
          })
        )}
      </svg>

      {/* Reset button */}
      {timelines.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetExperience}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '12px 24px',
            background: 'rgba(138, 43, 226, 0.2)',
            border: '2px solid rgba(138, 43, 226, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(138, 43, 226, 0.4)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Reset Reality
        </motion.button>
      )}

      {/* Timeline counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.6)',
          border: '2px solid rgba(138, 43, 226, 0.5)',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          backdropFilter: 'blur(10px)'
        }}
      >
        Active Timelines: {timelines.length}
      </motion.div>

      {/* Timelines */}
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        <AnimatePresence mode="sync">
          {timelines.map((timeline, index) => (
            <motion.div
              key={timeline.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, width: timelineWidth }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                height: '100%',
                borderRight: index < timelines.length - 1 ? `2px solid ${timeline.color}40` : 'none',
                position: 'relative',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: `inset 0 0 100px ${timeline.color}15`
              }}
            >
              {/* Timeline glow effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 20px ${timeline.color}40`,
                    `0 0 40px ${timeline.color}60`,
                    `0 0 20px ${timeline.color}40`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none'
                }}
              />

              {/* Timeline header */}
              <div style={{
                padding: '20px',
                background: `linear-gradient(180deg, ${timeline.color}20 0%, transparent 100%)`,
                borderBottom: `1px solid ${timeline.color}30`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: timeline.color,
                  fontWeight: 600,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  Universe {String.fromCharCode(65 + index)} • Depth {timeline.depth}
                </div>
                {timeline.choices.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.6' }}>
                    {timeline.choices.map((choice, i) => (
                      <div key={i} style={{ marginBottom: '4px' }}>
                        → {choice}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current dilemma */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px 30px',
                position: 'relative'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 style={{
                    fontSize: timelines.length > 2 ? '20px' : '28px',
                    marginBottom: '16px',
                    color: timeline.color,
                    fontWeight: 700,
                    textShadow: `0 0 20px ${timeline.color}80`
                  }}>
                    {timeline.currentDilemma.question}
                  </h2>
                  <p style={{
                    fontSize: timelines.length > 2 ? '13px' : '16px',
                    lineHeight: '1.8',
                    color: '#ccc',
                    marginBottom: '32px'
                  }}>
                    {timeline.currentDilemma.context}
                  </p>

                  {/* Choices */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {timeline.currentDilemma.choices.map((choice, choiceIndex) => (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice(timeline.id, choice)}
                        disabled={!choice.nextDilemma}
                        style={{
                          padding: timelines.length > 2 ? '16px 20px' : '20px 24px',
                          background: choice.nextDilemma
                            ? `linear-gradient(135deg, ${timeline.color}15 0%, ${timeline.color}05 100%)`
                            : 'rgba(100, 100, 100, 0.1)',
                          border: `2px solid ${choice.nextDilemma ? timeline.color + '60' : '#444'}`,
                          borderRadius: '12px',
                          color: choice.nextDilemma ? '#fff' : '#666',
                          cursor: choice.nextDilemma ? 'pointer' : 'not-allowed',
                          fontSize: timelines.length > 2 ? '13px' : '15px',
                          fontWeight: 600,
                          textAlign: 'left',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          if (choice.nextDilemma) {
                            e.currentTarget.style.boxShadow = `0 8px 32px ${timeline.color}40`
                            e.currentTarget.style.borderColor = timeline.color
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.borderColor = choice.nextDilemma ? timeline.color + '60' : '#444'
                        }}
                      >
                        <div style={{ marginBottom: '8px', fontSize: timelines.length > 2 ? '14px' : '16px' }}>
                          {choice.text}
                        </div>
                        <div style={{
                          fontSize: timelines.length > 2 ? '11px' : '13px',
                          color: '#999',
                          lineHeight: '1.5'
                        }}>
                          {choice.consequence}
                        </div>
                        {choice.nextDilemma && (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                              position: 'absolute',
                              right: '20px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              fontSize: '20px',
                              color: timeline.color
                            }}
                          >
                            →
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {!timeline.currentDilemma.choices[0].nextDilemma && !timeline.currentDilemma.choices[1].nextDilemma && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        marginTop: '32px',
                        padding: '20px',
                        background: `${timeline.color}10`,
                        border: `1px solid ${timeline.color}30`,
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#888'
                      }}
                    >
                      Timeline endpoint reached. This universe has reached its conclusion.
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
