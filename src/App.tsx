import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CuteMonkey } from './components/CuteMonkey';
import { FlowerBucket } from './components/FlowerBucket';
import { WaxSeal } from './components/WaxSeal';
import {
  FloatingHearts,
  FloatingPastelFlowers,
  FallingPetals,
  SparkleParticles,
  BurstEffect,
  PaperAirplane,
  QuillPen,
  FlowerSticker,
  PostageStamp,
} from './components/Decorations';
import { ClickHeartCanvas } from './components/ClickHeartCanvas';
import { bgMusic } from './utils/audio';
import { Heart, Sparkles, ArrowRight, RotateCcw, Music } from 'lucide-react';

type Step =
  | 'opening'
  | 'password'
  | 'success'
  | 'transition'
  | 'letter'
  | 'secret-prompt'
  | 'secret-letter'
  | 'choice'
  | 'choice-result'
  | 'final';

export default function App() {
  const [step, setStep] = useState<Step>('opening');

  // Password state
  const [pin, setPin] = useState<string>('');
  const [isWrongPassword, setIsWrongPassword] = useState<boolean>(false);
  const [isSuccessPassword, setIsSuccessPassword] = useState<boolean>(false);
  const [shakeKeypad, setShakeKeypad] = useState<boolean>(false);

  // Transition & burst state
  const [transitionPhase, setTransitionPhase] = useState<number>(0);
  const [showBurst, setShowBurst] = useState<boolean>(false);

  // Choice state ('yes' | 'maybe')
  const [userChoice, setUserChoice] = useState<'yes' | 'maybe' | null>(null);

  // Letter paragraph reveal index for emotional typewriter feel
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(0);

  // Playful "TIDAK" escaping button states
  const [tidakCount, setTidakCount] = useState<number>(0);
  const [tidakPos, setTidakPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [monkeyCarryingButton, setMonkeyCarryingButton] = useState<boolean>(false);
  const [monkeySurrendered, setMonkeySurrendered] = useState<boolean>(false);
  const [playfulTaunt, setPlayfulTaunt] = useState<string>('');

  // Celebration step progressive text reveals
  const [celebrationStage, setCelebrationStage] = useState<number>(0);

  // Music unlocked ONLY after envelope opens
  useEffect(() => {
    if (step === 'transition' || step === 'letter') {
      bgMusic.unlockAndPlay().catch(() => {});
    } else if (step === 'final' || step === 'choice-result') {
      bgMusic.ensurePlaying();
    }
  }, [step]);

  const handleInteractionTrigger = () => {
    bgMusic.tryAutoPlayOnInteraction();
  };

  // Trigger typewriter paragraph appearance when entering letter step
  useEffect(() => {
    if (step === 'letter') {
      setRevealedParagraphs(1);
      const timers: NodeJS.Timeout[] = [];
      for (let i = 2; i <= 10; i++) {
        timers.push(
          setTimeout(() => {
            setRevealedParagraphs(i);
          }, (i - 1) * 700)
        );
      }
      return () => {
        timers.forEach(clearTimeout);
      };
    } else {
      setRevealedParagraphs(0);
    }
  }, [step]);

  // Handle celebration stage transitions after pressing "IYA ♡"
  useEffect(() => {
    if (step === 'choice-result' && userChoice === 'yes') {
      setCelebrationStage(1);
      const t1 = setTimeout(() => setCelebrationStage(2), 1200);
      const t2 = setTimeout(() => setCelebrationStage(3), 2400);
      const t3 = setTimeout(() => setCelebrationStage(4), 3800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setCelebrationStage(0);
    }
  }, [step, userChoice]);

  // Handle Keypad presses
  const handleKeypadPress = (val: string) => {
    handleInteractionTrigger();
    if (isSuccessPassword) return;

    if (val === '*') {
      setPin('');
      return;
    }

    if (val === '#') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }

    if (pin.length < 4) {
      const nextPin = pin + val;
      setPin(nextPin);

      if (nextPin.length === 4) {
        if (nextPin === '0000') {
          setIsSuccessPassword(true);
          setIsWrongPassword(false);
          setShowBurst(true);
          setTimeout(() => setShowBurst(false), 1200);

          // Advance to success page after celebration burst
          setTimeout(() => {
            setStep('success');
            setIsSuccessPassword(false);
            setPin('');
          }, 1000);
        } else {
          // Wrong PIN
          setShakeKeypad(true);
          setTimeout(() => {
            setShakeKeypad(false);
            setIsWrongPassword(true);
          }, 400);
        }
      }
    }
  };

  const handleTryAgain = () => {
    handleInteractionTrigger();
    setPin('');
    setIsWrongPassword(false);
  };

  // Trigger Envelope Transition animation sequence
  const startEnvelopeTransition = () => {
    handleInteractionTrigger();
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1200);

    setStep('transition');
    setTransitionPhase(1); // 1. Envelope appears

    // Audio is strictly unlocked when envelope opens!
    bgMusic.unlockAndPlay().catch(() => {});

    setTimeout(() => {
      setTransitionPhase(2); // 2. Wax seal pulses with soft glow
    }, 600);

    setTimeout(() => {
      setTransitionPhase(3); // 3. Flap unfolds open
    }, 1300);

    setTimeout(() => {
      setTransitionPhase(4); // 4. Paper slides out with slight rotation
    }, 2000);

    setTimeout(() => {
      // 5. Seamlessly enter the letter reading page
      setStep('letter');
    }, 3100);
  };

  // Playful interaction for "TIDAK" button
  const handleTidakAttempt = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleInteractionTrigger();

    const nextCount = tidakCount + 1;
    setTidakCount(nextCount);

    if (nextCount <= 3) {
      // Monyet langsung membawa tombol TIDAK dan bergerak ke posisi baru
      setMonkeyCarryingButton(true);
      if (nextCount === 1) {
        setPlayfulTaunt('ehh monyetnya bawa lari tombolnya! jangan dipencet yaa');
        setTidakPos({ x: 50, y: -25 });
      } else if (nextCount === 2) {
        setPlayfulTaunt('monyetnya masih bawa kabur tombol tidaknya... pencet IYA aja');
        setTidakPos({ x: -60, y: 25 });
      } else if (nextCount === 3) {
        setPlayfulTaunt('monyetnya mulai capek bawa tombolnya...');
        setTidakPos({ x: 40, y: 35 });
      }
    } else {
      // Lebih dari 3x: monyet menyerah dan tombol berubah menjadi "IYA"
      setMonkeyCarryingButton(false);
      setMonkeySurrendered(true);
      setPlayfulTaunt('monyetnya menyerah... tombolnya sekarang jadi IYA juga ♡');
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1200);
    }
  };

  // Restart back to beginning
  const handleRestart = () => {
    handleInteractionTrigger();
    setStep('opening');
    setPin('');
    setIsWrongPassword(false);
    setUserChoice(null);
    setRevealedParagraphs(0);
    setTransitionPhase(0);
    setTidakCount(0);
    setTidakPos({ x: 0, y: 0 });
    setMonkeyCarryingButton(false);
    setMonkeySurrendered(false);
    setPlayfulTaunt('');
    setCelebrationStage(0);
    bgMusic.resetEnvelopeLock();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main
      className="min-h-screen bg-[#0d1527] text-slate-100 flex flex-col items-center justify-between p-4 relative overflow-x-hidden select-none font-sans-clean"
      onClick={handleInteractionTrigger}
    >
      {/* Tap-to-spawn romantic floating hearts canvas */}
      <ClickHeartCanvas />

      {/* Subtle Warm Vignette / Romantic Navy Gradient */}
      <div className="fixed inset-0 bg-radial from-transparent via-[#0b1220]/60 to-[#070b14] pointer-events-none z-0" />

      {/* Gentle Floating Hearts & Falling Petals in background */}
      <FloatingHearts count={step === 'choice-result' ? 24 : 14} />
      <FloatingPastelFlowers count={step === 'choice-result' ? 12 : 7} />
      <FallingPetals count={step === 'choice-result' || step === 'final' ? 16 : 8} />
      <SparkleParticles count={step === 'choice-result' ? 18 : 10} />

      {/* Interactive Center Burst for Celebrations */}
      <BurstEffect active={showBurst} />

      <div className="w-full max-w-[430px] mx-auto relative z-10 flex flex-col items-center justify-center min-h-[85vh]">
        <AnimatePresence mode="wait">
          {/* ====================================================
              HALAMAN 1 — OPENING
              ==================================================== */}
          {step === 'opening' && (
            <motion.section
              key="page-opening"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -15 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center text-center my-auto"
            >
              {/* Cute White Monkey with Flower Mascot & Side Bucket */}
              <div className="relative mb-1 flex items-end justify-center">
                {/* Floating Flower Bucket on the side */}
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-12 -bottom-2 z-0 hidden sm:block"
                >
                  <FlowerBucket variant="small" size={75} />
                </motion.div>

                {/* Cute 2D White Monkey holding single flower */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="z-10"
                >
                  <CuteMonkey pose="smiling-flower" size={135} />
                </motion.div>

                {/* Small Flower Bucket right beside monkey */}
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [0, 4, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute -right-8 bottom-0 z-0"
                >
                  <FlowerBucket variant="small" size={70} />
                </motion.div>
              </div>

              {/* Header Title */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-5 px-2"
              >
                <h1 className="text-3xl md:text-4xl font-display font-medium text-slate-100 tracking-wide mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                  <span>hi, this is for you</span>
                </h1>
                <p className="text-sm md:text-base font-serif-body italic text-pink-200/90 max-w-[310px] mx-auto leading-relaxed">
                  there's something I've been wanting to tell you...
                </p>
              </motion.div>

              {/* Envelope Hero Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.7, type: 'spring', damping: 20 }}
                className="relative w-[295px] h-[198px] bg-[#f8f6f0] rounded-xl shadow-envelope border border-white/70 flex items-center justify-center p-3 mb-7 overflow-hidden group cursor-pointer hover:shadow-[0_18px_45px_-8px_rgba(244,114,182,0.3)] transition-all duration-300"
                onClick={() => {
                  handleInteractionTrigger();
                  setStep('password');
                }}
              >
                {/* Envelope lining / texture */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fcfaf7] to-[#ede7dc] opacity-90" />

                {/* Fold lines of envelope */}
                <svg
                  viewBox="0 0 290 195"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  fill="none"
                >
                  <path
                    d="M0 195 L145 95 L290 195"
                    fill="#f4eee4"
                    stroke="#e8dfd2"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 0 L145 105 L0 195"
                    fill="#efe7db"
                    opacity="0.6"
                    stroke="#e2d7c7"
                    strokeWidth="1"
                  />
                  <path
                    d="M290 0 L145 105 L290 195"
                    fill="#ebe2d4"
                    opacity="0.6"
                    stroke="#e2d7c7"
                    strokeWidth="1"
                  />
                  <path
                    d="M0 0 L145 110 L290 0 Z"
                    fill="#ffffff"
                    stroke="#e2d7c7"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 0 L145 110 L290 0"
                    stroke="#fbcfe8"
                    strokeWidth="2"
                    opacity="0.75"
                  />
                </svg>

                {/* Wax Seal in the center of the envelope */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  <WaxSeal color="pink" size={68} withRibbon={false} glow={true} />
                </div>

                {/* Mini cute stickers in corners */}
                <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none">
                  <FlowerSticker color="pink" size={24} />
                </div>
                <div className="absolute top-2.5 left-3 z-10 pointer-events-none opacity-60">
                  <span className="text-xs text-pink-300">✦</span>
                </div>
              </motion.div>

              {/* Open Pill Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <button
                  id="open-letter-btn"
                  onClick={() => {
                    handleInteractionTrigger();
                    setStep('password');
                  }}
                  className="px-8 py-3 rounded-full bg-white text-[#0d1527] hover:bg-pink-50 text-sm font-sans-clean font-semibold tracking-wider uppercase border border-pink-200/80 shadow-[0_8px_22px_-4px_rgba(244,114,182,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                >
                  <span>open</span>
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 transition-transform group-hover:scale-125" />
                </button>
              </motion.div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 2 — PASSWORD (0000)
              ==================================================== */}
          {step === 'password' && (
            <motion.section
              key="page-password"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center my-auto"
            >
              <AnimatePresence mode="wait">
                {isWrongPassword ? (
                  <motion.div
                    key="wrong-modal"
                    initial={{ opacity: 0, y: 15, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Cute Monkey peeking curiously */}
                    <div className="-mb-4 z-10">
                      <CuteMonkey pose="curious" size={135} />
                    </div>

                    {/* Dark Navy Card */}
                    <div className="w-full bg-[#162238]/95 border-2 border-pink-300/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
                      <span className="absolute top-2.5 left-3 text-pink-300/70 text-xs">✦</span>
                      <span className="absolute bottom-2.5 right-3 text-pink-300/70 text-xs">✦</span>

                      <h2 className="text-2xl font-serif-body font-semibold text-white tracking-wide mb-2">
                        Wrong Password!
                      </h2>
                      <p className="text-sm font-sans-clean text-pink-200/90 mb-5 leading-relaxed">
                        Clue: Tanggal &amp; Bulan Ulangtahun Kamu.
                      </p>

                      <button
                        id="try-again-btn"
                        onClick={handleTryAgain}
                        className="px-6 py-2.5 rounded-full bg-white text-[#0d1527] hover:bg-pink-50 font-sans-clean text-xs font-semibold tracking-wider uppercase shadow-md transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-pink-500" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal-keypad"
                    className={`w-full flex flex-col items-center ${
                      shakeKeypad ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
                  >
                    {/* Cute Shy Peeking Monkey */}
                    <div className="-mb-3 z-10 flex items-end gap-1">
                      <CuteMonkey pose="shy-peeking" size={125} />
                    </div>

                    {/* Password Card */}
                    <div className="w-full bg-[#131d33]/90 border border-slate-700/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col items-center relative">
                      <svg
                        className="absolute top-2 left-2 w-7 h-7 text-pink-300/40 pointer-events-none"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path d="M0 0 L15 0 M0 0 L0 15" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                      </svg>
                      <svg
                        className="absolute bottom-2 right-2 w-7 h-7 text-pink-300/40 pointer-events-none"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path d="M30 30 L15 30 M30 30 L30 15" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                      </svg>

                      <h2 className="text-base font-sans-clean font-medium text-slate-200 tracking-wide mb-4">
                        Enter a password
                      </h2>

                      {/* 4 PIN Boxes */}
                      <div className="flex gap-3 mb-6">
                        {[0, 1, 2, 3].map((idx) => {
                          const filled = pin.length > idx;
                          return (
                            <div
                              key={idx}
                              className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                                isSuccessPassword
                                  ? 'border-pink-400 bg-pink-500/20 scale-105 shadow-[0_0_15px_rgba(244,114,182,0.6)]'
                                  : filled
                                  ? 'border-pink-400 bg-pink-500/10 shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                                  : 'border-slate-600/80 bg-slate-800/40'
                              }`}
                            >
                              {filled && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-3.5 h-3.5 rounded-full ${
                                    isSuccessPassword ? 'bg-pink-300' : 'bg-pink-400'
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Numeric Keypad Grid */}
                      <div className="grid grid-cols-3 gap-3.5 w-full max-w-[260px] pb-1">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
                          (item) => (
                            <button
                              key={item}
                              id={`keypad-btn-${item === '*' ? 'star' : item === '#' ? 'hash' : item}`}
                              onClick={() => handleKeypadPress(item)}
                              className="w-16 h-16 rounded-full bg-[#fdfbf7] hover:bg-pink-50 active:bg-pink-100 text-[#0f172a] active:text-pink-600 font-sans-clean text-xl font-medium shadow-[0_4px_10px_rgba(0,0,0,0.25)] border border-pink-100 flex items-center justify-center mx-auto transition-all duration-150 hover:-translate-y-0.5 active:scale-90 select-none cursor-pointer"
                            >
                              {item}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 3 — PASSWORD BERHASIL
              ==================================================== */}
          {step === 'success' && (
            <motion.section
              key="page-success"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center text-center my-auto relative"
            >
              {/* Paper Airplanes */}
              <div className="absolute -left-4 top-10 z-0 opacity-80 animate-pulse">
                <PaperAirplane direction="right" size={95} />
              </div>
              <div className="absolute -right-4 top-10 z-0 opacity-80 animate-pulse">
                <PaperAirplane direction="left" size={95} />
              </div>

              {/* Cute White Monkey with Flower Bucket */}
              <div className="-mb-4 z-10 flex items-end justify-center">
                <CuteMonkey pose="holding-bucket" size={150} />
              </div>

              {/* Success Card Frame */}
              <div className="w-full bg-[#141f35]/95 border-2 border-pink-300/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md relative z-10">
                <h3 className="text-3xl font-script text-pink-300 mb-1">Yeay...</h3>

                <h2 className="text-xl font-serif-body font-medium text-slate-100 mb-6 leading-relaxed">
                  You found the right key to my heart &gt;&lt;
                </h2>

                <button
                  id="open-surprise-btn"
                  onClick={startEnvelopeTransition}
                  className="px-8 py-3 rounded-full bg-white text-[#0d1527] hover:bg-pink-50 text-sm font-sans-clean font-semibold tracking-wider border border-pink-200 shadow-[0_8px_20px_-4px_rgba(244,114,182,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Open Surprise</span>
                  <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 4 — ENVELOPE TRANSITION (Premium Origami Sequence)
              ==================================================== */}
          {step === 'transition' && (
            <motion.section
              key="page-transition"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center my-auto relative min-h-[420px]"
            >
              {/* Big Navy Envelope in center */}
              <div className="relative w-[320px] h-[215px] select-none">
                {/* Envelope Base Body */}
                <div className="absolute inset-0 bg-[#16233d] rounded-xl shadow-envelope border border-[#2b3d63] overflow-hidden">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_4px)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a101d] via-[#10192b] to-[#16233d]" />
                </div>

                {/* White Letter Paper sliding out */}
                <motion.div
                  initial={{ y: 20, opacity: 0, rotate: 0 }}
                  animate={
                    transitionPhase >= 4
                      ? { y: -115, opacity: 1, scale: 1.05, rotate: -2 }
                      : { y: 20, opacity: 0.6, rotate: 0 }
                  }
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-4 right-4 top-2 h-[195px] bg-[#fcfaf6] rounded-t-lg shadow-scrapbook border border-slate-200 p-4 z-20 flex flex-col items-center"
                >
                  <p className="text-[11px] font-sans-clean uppercase tracking-widest text-slate-400">
                    For You,
                  </p>
                  <p className="text-xl font-script text-[#0d1527] font-semibold mt-0.5">
                    My Favorite Person
                  </p>
                  <div className="w-12 h-0.5 bg-pink-300/60 rounded-full my-2" />
                  <p className="text-[12px] font-serif-body text-slate-600 italic text-center leading-tight line-clamp-3">
                    "hey you, ga kerasa udah berteman selama 8 tahun..."
                  </p>
                </motion.div>

                {/* Envelope Front Flaps */}
                <svg
                  viewBox="0 0 320 215"
                  className="absolute inset-0 w-full h-full pointer-events-none z-30"
                  fill="none"
                >
                  <path d="M0 0 L160 115 L0 215" fill="#182744" stroke="#25375c" strokeWidth="1" />
                  <path
                    d="M320 0 L160 115 L320 215"
                    fill="#15233e"
                    stroke="#25375c"
                    strokeWidth="1"
                  />
                  <path
                    d="M0 215 L160 110 L320 215"
                    fill="#1a2b4b"
                    stroke="#2e426d"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Top Flap */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[120px] origin-top z-40 pointer-events-none"
                  initial={{ rotateX: 0 }}
                  animate={transitionPhase >= 3 ? { rotateX: 180, zIndex: 10 } : { rotateX: 0 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <svg viewBox="0 0 320 120" className="w-full h-full" fill="none">
                    <path
                      d="M0 0 L160 118 L320 0 Z"
                      fill="#1f3258"
                      stroke="#2e426d"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>

                {/* Wax Seal on top flap */}
                <AnimatePresence>
                  {transitionPhase < 3 && (
                    <motion.div
                      key="transition-wax"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={
                        transitionPhase === 2
                          ? { scale: 1.18, opacity: 0.9, rotate: -6 }
                          : { scale: 1, opacity: 1, rotate: 0 }
                      }
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-[85px] left-1/2 -translate-x-1/2 z-50"
                    >
                      <WaxSeal color="blue" size={68} withRibbon={false} glow={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-serif-body italic text-pink-200/75 mt-6"
              >
                Opening your letter...
              </motion.p>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 5 — SURAT CINTA UTAMA (Progressive Typewriter + Monkey & Bouquet)
              ==================================================== */}
          {step === 'letter' && (
            <motion.section
              key="page-letter"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center my-4"
            >
              <div className="relative w-full max-w-[390px]">
                {/* Background Layer 1: Left postage stamp */}
                <div className="absolute -left-2 top-10 w-24 h-36 bg-[#f7f2e7] rounded-sm -rotate-6 shadow-md opacity-85 z-0 flex items-center justify-center p-2 border border-[#eae2d3]">
                  <PostageStamp size={46} />
                </div>

                {/* Background Layer 2: White paper sheet offset */}
                <div className="absolute -right-1 top-3 w-[92%] h-[98%] bg-[#faf8f3] rounded-lg rotate-2 shadow-md border border-slate-200/70 z-0" />

                {/* Main Foreground Letter Paper */}
                <div className="relative z-10 w-full bg-[#fdfbf7] text-[#1e293b] rounded-xl shadow-scrapbook border border-[#e7e1d5] -rotate-1 p-6 sm:p-7 overflow-hidden">
                  <div className="absolute top-12 right-6 w-32 h-32 rounded-full bg-pink-100/40 blur-2xl pointer-events-none" />
                  <div className="absolute bottom-16 left-6 w-28 h-28 rounded-full bg-blue-100/30 blur-2xl pointer-events-none" />

                  {/* Wax Seal with ribbon */}
                  <div className="absolute -top-3 -right-2 z-20 pointer-events-none">
                    <WaxSeal color="blue" size={54} withRibbon={true} glow={false} />
                  </div>

                  {/* Quill Feather Pen sticker on left */}
                  <div className="absolute top-14 -left-2 z-20 pointer-events-none opacity-85">
                    <QuillPen size={65} />
                  </div>

                  {/* Header of Letter */}
                  <div className="mb-4 pl-8 pt-1 flex items-start justify-between">
                    <div>
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-xs font-sans-clean font-semibold tracking-wider uppercase text-slate-400 mb-0.5"
                      >
                        For You,
                      </motion.p>
                      <motion.h2
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="text-2xl sm:text-3xl font-script text-[#0d1527] font-bold"
                      >
                        My Favorite Person
                      </motion.h2>
                    </div>

                    {/* Cute Shy Monkey near the top of the letter */}
                    <div className="w-16 h-16 pointer-events-none -mt-2">
                      <CuteMonkey pose="shy-peeking" size={62} withSparkles={false} />
                    </div>
                  </div>

                  {/* Body of Letter with progressive typewriter reveal */}
                  <div className="space-y-3 text-[15px] sm:text-[16px] font-serif-body text-[#2c3749] leading-[1.65] relative z-10">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 1 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-medium text-[#1e293b]"
                    >
                      hey you,
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 2 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      ga kerasa udah berteman selama 8 tahun.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 3 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      jujur, udah lama banget yah kita temenan. Selama itu juga ternyata ada rasa yang
                      aku simpan dan tahan selama ini.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 4 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Walaupun kita udah berteman lama sekali, aku masih belum berani buat mengungkapkan
                      rasa yang selama ini terpendam.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 5 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-medium text-[#1a2538]"
                    >
                      Mungkin ini saatnya aku jujur.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 6 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Sebenarnya aku masih malu untuk mengungkapkan rasa ini, tapi aku juga tidak ingin
                      menunda lebih lama.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 7 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="italic text-pink-700 font-semibold"
                    >
                      Jadi...
                    </motion.p>

                    {/* FOCAL POINT: maukah kamu menjadi pacar aku? */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={
                        revealedParagraphs >= 8
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.95 }
                      }
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="relative py-3.5 px-4 bg-gradient-to-r from-pink-50 via-pink-100/80 to-pink-50 rounded-xl border border-pink-300 text-center my-3 shadow-[0_4px_18px_-3px_rgba(244,114,182,0.4)]"
                    >
                      <span className="absolute -top-2.5 -left-1 text-pink-400 text-sm">✦</span>
                      <span className="absolute -bottom-2.5 -right-1 text-pink-400 text-sm">✦</span>
                      <p className="text-lg sm:text-xl font-serif-body font-bold text-[#b91c1c] tracking-wide">
                        maukah kamu menjadi pacar aku?
                      </p>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 9 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Kalau kamu nggak mau, gapapa.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 9 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Aku tetap menghargai kamu dan persahabatan kita.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 10 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Tapi kalau kamu mau...
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 10 ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-medium text-[#1e293b]"
                    >
                      mungkin kita bisa membuat cerita baru bersama.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: revealedParagraphs >= 10 ? 1 : 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="pt-3 pb-1 text-right"
                    >
                      <p className="text-sm sm:text-[15px] font-script font-semibold text-pink-600 leading-snug">
                        — from someone who has been keeping this feeling for a long time ♡
                      </p>
                    </motion.div>
                  </div>

                  {/* Cute Flower Bucket sitting at bottom corner of letter */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-pink-100/80">
                    <div className="flex items-center gap-1.5 opacity-85">
                      <FlowerSticker color="pink" size={20} />
                      <span className="text-pink-400 text-xs">❤</span>
                    </div>

                    <div className="w-16 h-18 -mb-3 -mr-2">
                      <FlowerBucket variant="small" size={60} withSparkles={false} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: "one more thing..." Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 mb-2"
              >
                <button
                  id="one-more-thing-btn"
                  onClick={() => {
                    handleInteractionTrigger();
                    setStep('secret-prompt');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-3 rounded-full bg-white text-[#0d1527] hover:bg-pink-50 text-sm font-sans-clean font-semibold tracking-wider uppercase border border-pink-200/80 shadow-[0_8px_20px_-4px_rgba(244,114,182,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                >
                  <span>one more thing...</span>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500 transition-transform group-hover:scale-125" />
                </button>
              </motion.div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 6 — ONE MORE THING (Secret Note Slide-up)
              ==================================================== */}
          {step === 'secret-prompt' && (
            <motion.section
              key="page-secret-prompt"
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center text-center my-auto"
            >
              {/* Cute White Monkey with small flower */}
              <div className="-mb-3 z-10">
                <CuteMonkey pose="sitting-flower" size={135} />
              </div>

              {/* Slide-up Paper Card */}
              <div className="w-full bg-[#fcfaf6] text-[#1e293b] rounded-2xl p-6 sm:p-7 shadow-scrapbook border border-pink-200/80 relative">
                <div className="absolute top-2.5 right-3">
                  <FlowerSticker color="pink" size={24} />
                </div>

                <p className="text-base sm:text-lg font-serif-body text-[#1e293b] leading-relaxed mb-4">
                  "kalau kamu sampai di sini,
                  <br />
                  berarti kamu benar-benar membaca semuanya..."
                </p>

                <p className="text-sm sm:text-base font-serif-body italic text-[#475569] mb-6">
                  sebenarnya masih ada satu hal lagi yang ingin aku bilang.
                </p>

                <button
                  id="open-secret-btn"
                  onClick={() => {
                    handleInteractionTrigger();
                    setStep('secret-letter');
                  }}
                  className="px-7 py-2.5 rounded-full bg-[#0d1527] text-white hover:bg-[#182744] text-xs font-sans-clean font-semibold tracking-wider uppercase shadow-md transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>open ♡</span>
                </button>
              </div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 7 — SECRET MESSAGE LETTER
              ==================================================== */}
          {step === 'secret-letter' && (
            <motion.section
              key="page-secret-letter"
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center text-center my-auto"
            >
              {/* Warm Ivory Note Card */}
              <div className="w-full bg-[#fdfbf7] text-[#1e293b] rounded-2xl p-6 sm:p-7 shadow-scrapbook border border-pink-200 relative -rotate-1">
                <div className="absolute -top-3 -right-2">
                  <WaxSeal color="pink" size={50} glow={true} />
                </div>

                <div className="my-3 space-y-4">
                  <p className="text-base sm:text-lg font-serif-body text-[#1e293b] leading-relaxed">
                    "whatever your answer is,
                    <br />
                    thank you for being part of my story for all these years."
                  </p>

                  <div className="w-16 h-0.5 bg-pink-300 mx-auto rounded-full" />

                  <p className="text-lg sm:text-xl font-script font-bold text-pink-600">
                    "8 years with you
                    <br />
                    will always mean something to me. ♡"
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    id="goto-choice-btn"
                    onClick={() => {
                      handleInteractionTrigger();
                      setStep('choice');
                    }}
                    className="px-8 py-2.5 rounded-full bg-[#0d1527] text-white hover:bg-[#182744] text-xs font-sans-clean font-semibold tracking-wider uppercase shadow-md transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>continue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 8 — FINAL QUESTION & PLAYFUL "TIDAK" INTERACTION
              ==================================================== */}
          {step === 'choice' && (
            <motion.section
              key="page-choice"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center text-center my-auto relative"
            >
              {/* Cute White Monkey standing with Flower Bucket or carrying TIDAK button or surrendered */}
              <div className="-mb-3 z-10 flex flex-col items-center">
                {monkeySurrendered ? (
                  <motion.div
                    initial={{ scale: 0.85, y: 10 }}
                    animate={{ scale: [1, 1.04, 1], y: [0, -3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <CuteMonkey
                      pose="surrendered-yes"
                      size={165}
                      buttonText="IYA ♡"
                      onButtonClick={() => {
                        handleInteractionTrigger();
                        setUserChoice('yes');
                        setShowBurst(true);
                        setTimeout(() => setShowBurst(false), 1400);
                        setStep('choice-result');
                      }}
                    />
                  </motion.div>
                ) : monkeyCarryingButton ? (
                  <motion.div
                    animate={{
                      x: [tidakPos.x, tidakPos.x + 8, tidakPos.x - 8, tidakPos.x],
                      y: [tidakPos.y, tidakPos.y - 4, tidakPos.y],
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <CuteMonkey
                      pose="holding-button"
                      size={155}
                      buttonText="TIDAK"
                      onButtonClick={handleTidakAttempt}
                    />
                  </motion.div>
                ) : (
                  <CuteMonkey pose="holding-bucket" size={145} />
                )}
              </div>

              <div className="w-full bg-[#131d33]/95 border-2 border-pink-300/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md relative overflow-visible">
                <h3 className="text-xl sm:text-2xl font-serif-body font-semibold text-slate-100 mb-1">
                  jadi...
                </h3>
                <h2 className="text-2xl sm:text-3xl font-script text-pink-300 font-bold mb-5 drop-shadow-xs">
                  mau jadi pacar aku? ♡
                </h2>

                {/* Playful taunt message if user attempted "TIDAK" */}
                <AnimatePresence>
                  {playfulTaunt && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-serif-body italic"
                    >
                      {playfulTaunt}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Button Container */}
                <div className="relative min-h-[64px] flex items-center justify-center gap-4 w-full flex-wrap">
                  {/* [ IYA ♡ ] Primary Button */}
                  <motion.button
                    id="choice-yes-btn"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleInteractionTrigger();
                      setUserChoice('yes');
                      setShowBurst(true);
                      setTimeout(() => setShowBurst(false), 1400);
                      setStep('choice-result');
                    }}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 text-white font-sans-clean font-bold text-base tracking-wider shadow-[0_6px_22px_rgba(244,114,182,0.5)] border border-pink-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer z-20"
                  >
                    <span>IYA ♡</span>
                    <Heart className="w-4 h-4 fill-white" />
                  </motion.button>

                  {/* If monkey surrendered, show the second IYA button (formerly TIDAK) */}
                  {monkeySurrendered && (
                    <motion.button
                      id="choice-surrendered-yes-btn"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleInteractionTrigger();
                        setUserChoice('yes');
                        setShowBurst(true);
                        setTimeout(() => setShowBurst(false), 1400);
                        setStep('choice-result');
                      }}
                      className="px-7 py-3 rounded-full bg-pink-500/30 hover:bg-pink-500/50 text-pink-100 font-sans-clean font-semibold text-sm border-2 border-pink-400 shadow-[0_4px_16px_rgba(244,114,182,0.3)] flex items-center gap-2 cursor-pointer animate-pulse"
                    >
                      <span>IYA JUGA ♡</span>
                      <Sparkles className="w-4 h-4 text-pink-300" />
                    </motion.button>
                  )}

                  {/* [ TIDAK ] Escaping Button before monkey carries it */}
                  {!monkeyCarryingButton && !monkeySurrendered && (
                    <motion.button
                      id="choice-tidak-btn"
                      animate={{
                        x: tidakPos.x,
                        y: tidakPos.y,
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      onClick={handleTidakAttempt}
                      onTouchStart={handleTidakAttempt}
                      className="px-6 py-3 rounded-full bg-slate-800/90 text-slate-300 font-sans-clean font-medium text-sm border border-slate-600/80 shadow-md transition-colors hover:bg-slate-700 active:scale-95 cursor-pointer select-none"
                    >
                      <span>TIDAK</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 9 — CELEBRATION (When "IYA ♡" is clicked)
              ==================================================== */}
          {step === 'choice-result' && (
            <motion.section
              key="page-choice-result"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.7 }}
              className="w-full flex flex-col items-center text-center my-auto py-2"
            >
              {/* Monkey lifting Flower Bouquet in Pure Joy */}
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: [0, -8, 0] }}
                transition={{
                  scale: { duration: 0.6, type: 'spring' },
                  y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="-mb-2 z-10"
              >
                <CuteMonkey pose="super-happy" size={170} />
              </motion.div>

              <div className="w-full bg-[#131d33]/95 border-2 border-pink-300/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
                {/* Stage 1: Screaming Joy */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-pink-300 mb-1 drop-shadow-md flex items-center justify-center gap-2 flex-wrap">
                    <span>AAAAA SENANG BANGETT</span>
                    <Heart className="w-6 h-6 fill-pink-400 text-pink-400 inline" />
                    <Sparkles className="w-5 h-5 text-yellow-300 inline animate-spin" />
                  </h3>
                </motion.div>

                {/* Stage 2: Thank you for accepting */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: celebrationStage >= 2 ? 1 : 0, y: celebrationStage >= 2 ? 0 : 8 }}
                  transition={{ duration: 0.6 }}
                  className="text-base sm:text-lg font-serif-body text-slate-100 mb-2 leading-relaxed"
                >
                  makasih ya udah nerima perasaan aku
                </motion.p>

                {/* Stage 3: Penantian tidak sia-sia */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: celebrationStage >= 3 ? 1 : 0, y: celebrationStage >= 3 ? 0 : 8 }}
                  transition={{ duration: 0.6 }}
                  className="text-sm sm:text-base font-serif-body italic text-pink-200 mb-3"
                >
                  ternyata penantian selama ini nggak sia-sia ♡
                </motion.p>

                {/* Stage 4: Cerita baru bersama */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: celebrationStage >= 4 ? 1 : 0, scale: celebrationStage >= 4 ? 1 : 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="py-3 px-4 bg-pink-500/15 rounded-xl border border-pink-400/30 my-4"
                >
                  <p className="text-base sm:text-lg font-serif-body font-medium text-pink-100">
                    mulai hari ini...
                    <br />
                    kita punya cerita baru bersama.
                  </p>
                </motion.div>

                {/* Continue to Final Page */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: celebrationStage >= 4 ? 1 : 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="pt-2"
                >
                  <button
                    id="celebrate-continue-btn"
                    onClick={() => {
                      handleInteractionTrigger();
                      setStep('final');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3 rounded-full bg-white text-[#0d1527] hover:bg-pink-50 text-sm font-sans-clean font-semibold tracking-wider border border-pink-200 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>continue</span>
                    <ArrowRight className="w-4 h-4 text-pink-500" />
                  </button>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ====================================================
              HALAMAN 10 — FINAL CLIMAX (Monkey sitting with Big Flower Bucket)
              ==================================================== */}
          {step === 'final' && (
            <motion.section
              key="page-final"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center text-center my-auto py-2"
            >
              {/* Climax Composition: White Monkey sitting gently beside Big Flower Bucket */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring' }}
                className="relative flex items-end justify-center gap-3 mb-6"
              >
                {/* 2D Cute White Monkey sitting peacefully holding blossom */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="z-10"
                >
                  <CuteMonkey pose="sitting-celebrate" size={135} />
                </motion.div>

                {/* Big Beautiful Flower Bucket */}
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="z-10"
                >
                  <FlowerBucket variant="large" size={145} />
                </motion.div>
              </motion.div>

              {/* Final Romantic Messages */}
              <div className="space-y-3 mb-6 px-3">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="text-lg md:text-xl font-serif-body text-slate-200 tracking-wide"
                >
                  thank you for reading until the end ♡
                </motion.h2>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-3xl md:text-4xl font-script text-pink-300 font-semibold tracking-wide drop-shadow-sm"
                >
                  i love you forever
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-sm md:text-base font-serif-body italic text-pink-200/90 leading-relaxed pt-1"
                >
                  and thank you...
                  <br />
                  for choosing me.
                </motion.p>
              </div>

              {/* Read Again / Replay Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.6 }}
                className="mb-5 flex flex-col items-center gap-3"
              >
                {/* Playing music badge on final page */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16233d]/80 border border-pink-300/30 text-pink-200 text-xs shadow-md">
                  <Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                  <span className="font-serif-body italic">background song is playing...</span>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                  </span>
                </div>

                <button
                  id="restart-btn"
                  onClick={handleRestart}
                  className="px-5 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-sans-clean tracking-wider uppercase border border-slate-700/60 shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-pink-400" />
                  <span>read again</span>
                </button>
              </motion.div>

              {/* Footer: "made with love ♡" */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="text-xs font-sans-clean text-slate-400/80 flex items-center gap-1 mt-auto"
              >
                <span>made with love</span>
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400 inline" />
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
