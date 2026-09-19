import React from 'react';
import { motion } from 'motion/react';

export function FloatingVectors() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. TOP-LEFT: Floating 3D Isometric Geometric Prism / Cube */}
      <motion.div
        className="absolute top-16 left-[5%] md:left-[8%] hidden sm:block opacity-60"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="drop-shadow-[0_0_15px_rgba(46,94,255,0.4)]">
          {/* Top Face */}
          <polygon
            points="32,8 54,20 32,32 10,20"
            fill="url(#cubeTopGrad)"
            stroke="#2E5EFF"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
          {/* Left Face */}
          <polygon
            points="10,20 32,32 32,56 10,44"
            fill="url(#cubeLeftGrad)"
            stroke="#1E2333"
            strokeWidth="1.2"
          />
          {/* Right Face */}
          <polygon
            points="32,32 54,20 54,44 32,56"
            fill="url(#cubeRightGrad)"
            stroke="#16C79A"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />
          <defs>
            <linearGradient id="cubeTopGrad" x1="10" y1="8" x2="54" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E5EFF" stopOpacity="0.5" />
              <stop offset="1" stopColor="#16C79A" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="cubeLeftGrad" x1="10" y1="20" x2="32" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0E1018" stopOpacity="0.9" />
              <stop offset="1" stopColor="#12141F" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="cubeRightGrad" x1="32" y1="20" x2="54" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16C79A" stopOpacity="0.2" />
              <stop offset="1" stopColor="#0E1018" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 2. TOP-RIGHT: Elegant Concentric Orbital Vector Ring with Traveling Bead */}
      <motion.div
        className="absolute top-24 right-[8%] md:right-[14%] hidden md:block opacity-70"
        animate={{
          y: [0, 16, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
        }}
      >
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none" className="drop-shadow-[0_0_20px_rgba(46,94,255,0.35)]">
          {/* Outer dashed track */}
          <circle
            cx="44"
            cy="44"
            r="38"
            stroke="#1E2333"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          {/* Inner glowing ring */}
          <circle
            cx="44"
            cy="44"
            r="26"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="32 8"
          />
          {/* Traveling orbital beacon */}
          <circle
            cx="44"
            cy="18"
            r="4"
            fill="#16C79A"
            className="drop-shadow-[0_0_8px_#16C79A]"
          />
          <circle
            cx="44"
            cy="18"
            r="1.5"
            fill="#FFFFFF"
          />
          <defs>
            <linearGradient id="ringGrad" x1="18" y1="18" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E5EFF" />
              <stop offset="1" stopColor="#16C79A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 3. CENTER-LEFT: Floating 3D Vector Torus / Ring */}
      <motion.div
        className="absolute top-[48%] left-[2%] md:left-[4%] hidden lg:block opacity-55"
        animate={{
          y: [0, -14, 0],
          rotateX: [20, 35, 20],
          rotateZ: [0, -15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ perspective: 600 }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="drop-shadow-[0_0_20px_rgba(22,199,154,0.3)]">
          <ellipse
            cx="36"
            cy="36"
            rx="30"
            ry="18"
            stroke="url(#torusGrad1)"
            strokeWidth="3"
            strokeDasharray="60 10"
          />
          <ellipse
            cx="36"
            cy="36"
            rx="18"
            ry="10"
            stroke="url(#torusGrad2)"
            strokeWidth="1.8"
          />
          <defs>
            <linearGradient id="torusGrad1" x1="6" y1="18" x2="66" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E5EFF" />
              <stop offset="0.6" stopColor="#16C79A" />
              <stop offset="1" stopColor="#2E5EFF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="torusGrad2" x1="18" y1="26" x2="54" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16C79A" stopOpacity="0.7" />
              <stop offset="1" stopColor="#1E2333" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 4. BEHIND HERO ILLUSTRATION: Floating Layered Publications / Pages Token */}
      <motion.div
        className="absolute top-[28%] right-[4%] md:right-[6%] hidden xl:block opacity-65"
        animate={{
          y: [0, -20, 0],
          rotate: [-4, 6, -4],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="drop-shadow-[0_0_18px_rgba(46,94,255,0.4)]">
          {/* Back Plane */}
          <polygon
            points="28,6 48,16 28,26 8,16"
            fill="#12141F"
            stroke="#1E2333"
            strokeWidth="1"
          />
          {/* Middle Plane */}
          <polygon
            points="28,14 48,24 28,34 8,24"
            fill="url(#planeMidGrad)"
            stroke="#2E5EFF"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
          {/* Top Plane */}
          <polygon
            points="28,22 48,32 28,42 8,32"
            fill="url(#planeTopGrad)"
            stroke="#16C79A"
            strokeWidth="1.4"
          />
          <defs>
            <linearGradient id="planeMidGrad" x1="8" y1="14" x2="48" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E5EFF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#0E1018" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="planeTopGrad" x1="8" y1="22" x2="48" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16C79A" stopOpacity="0.4" />
              <stop offset="1" stopColor="#2E5EFF" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 5. MINIMALIST PLUS / CROSS ACCENT MARKERS */}
      <motion.div
        className="absolute top-[20%] left-[45%] hidden lg:block opacity-40"
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="3" x2="10" y2="17" stroke="#2E5EFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="#2E5EFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[22%] right-[12%] hidden sm:block opacity-35"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="9" y1="2" x2="9" y2="16" stroke="#16C79A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="9" x2="16" y2="9" stroke="#16C79A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 6. FLOATING CURVED VECTOR ARC */}
      <motion.div
        className="absolute top-[72%] left-[8%] hidden md:block opacity-45"
        animate={{
          y: [0, 12, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <svg width="70" height="40" viewBox="0 0 70 40" fill="none">
          <path
            d="M5 35 Q 35 5, 65 35"
            stroke="url(#arcGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
          <circle cx="35" cy="20" r="2.5" fill="#2E5EFF" className="drop-shadow-[0_0_6px_#2E5EFF]" />
          <defs>
            <linearGradient id="arcGrad" x1="5" y1="35" x2="65" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16C79A" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#2E5EFF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#16C79A" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 7. REFINED VECTOR DOT MATRIX ACCENT */}
      <motion.div
        className="absolute top-[38%] left-[18%] hidden xl:block opacity-25"
        animate={{
          opacity: [0.15, 0.35, 0.15],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {[0, 16, 32].map((x) =>
            [0, 16, 32].map((y) => (
              <circle
                key={`${x}-${y}`}
                cx={x + 8}
                cy={y + 8}
                r="1.5"
                fill={x === 16 && y === 16 ? '#2E5EFF' : '#8A90A6'}
              />
            ))
          )}
        </svg>
      </motion.div>

    </div>
  );
}
