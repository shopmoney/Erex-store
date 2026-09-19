import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import robotImg from '../assets/images/hero_robot_transparent.png';
import humanImg from '../assets/images/hero_human_transparent.png';

export function UnfoldingHeroBox() {
  const [animationKey, setAnimationKey] = useState(0);
  const [stage, setStage] = useState<'closed' | 'unfolding' | 'robotEmerging' | 'humanEmerging' | 'looping'>('closed');

  useEffect(() => {
    // Stage orchestration sequence
    setStage('closed');

    // 1. Box starts unfolding with blue light
    const t1 = setTimeout(() => {
      setStage('unfolding');
    }, 400);

    // 2. Robot pops up / floats out of the blue light
    const t2 = setTimeout(() => {
      setStage('robotEmerging');
    }, 1300);

    // 3. Human pops up / emerges next to the robot
    const t3 = setTimeout(() => {
      setStage('humanEmerging');
    }, 2300);

    // 4. Transition both to seamless ambient floating loop
    const t4 = setTimeout(() => {
      setStage('looping');
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [animationKey]);

  const replay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const isBoxUnfolded = stage !== 'closed';
  const isRobotVisible = stage === 'robotEmerging' || stage === 'humanEmerging' || stage === 'looping';
  const isHumanVisible = stage === 'humanEmerging' || stage === 'looping';
  const isLooping = stage === 'looping';

  return (
    <div className="relative w-full max-w-[480px] h-[380px] sm:h-[440px] flex items-center justify-center select-none">
      
      {/* Interactive Replay Badge */}
      <button
        onClick={replay}
        title="Replay Unfold & Pop-Up Animation"
        className="absolute -top-3 right-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#8A90A6] hover:text-[#F5F6FA] bg-[#12141F]/80 hover:bg-[#1E2333] border border-[#1E2333] transition-all cursor-pointer shadow-lg"
      >
        <RotateCcw className="w-3 h-3 text-[#2E5EFF]" />
        <span>Replay</span>
      </button>

      {/* CORE BLUE LIGHT BEAMS & VOLUMETRIC GLOW */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        
        {/* Soft Blue Radial Base Glow */}
        <motion.div
          animate={{
            scale: isBoxUnfolded ? (isLooping ? [1, 1.15, 1] : 1.2) : 0.2,
            opacity: isBoxUnfolded ? (isLooping ? [0.75, 0.95, 0.75] : 1) : 0,
          }}
          transition={{
            scale: isLooping ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 },
            opacity: isLooping ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 },
          }}
          className="absolute w-[360px] h-[260px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(46, 94, 255, 0.65) 0%, rgba(22, 199, 154, 0.3) 40%, transparent 75%)',
            filter: 'blur(55px)',
          }}
        />

        {/* Upward Volumetric Blue Light Shafts */}
        <motion.div
          animate={{
            opacity: isBoxUnfolded ? [0.4, 0.75, 0.4] : 0,
            height: isBoxUnfolded ? '320px' : '0px',
            scaleX: isBoxUnfolded ? [0.95, 1.08, 0.95] : 0.2,
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            height: { duration: 0.9, ease: 'easeOut' },
            scaleX: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute bottom-16 w-56 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(46, 94, 255, 0.7) 0%, rgba(22, 199, 154, 0.2) 60%, transparent 100%)',
            clipPath: 'polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Shimmering Ethereal Horizontal Blue Disc */}
        <motion.div
          animate={{
            scale: isBoxUnfolded ? [1, 1.08, 1] : 0,
            opacity: isBoxUnfolded ? 0.9 : 0,
          }}
          transition={{
            scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.6 },
          }}
          className="absolute bottom-16 w-64 h-16 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(46, 94, 255, 0.85) 0%, rgba(22, 199, 154, 0.4) 50%, transparent 75%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* 3D UNFOLDING BOX PEDESTAL AT THE BOTTOM */}
      <div 
        className="absolute bottom-6 w-48 h-28 pointer-events-none z-10 flex items-center justify-center"
        style={{ perspective: 900 }}
      >
        <motion.div
          className="relative w-28 h-20"
          animate={{
            rotateX: 62,
            rotateZ: -18,
            scale: isBoxUnfolded ? 1 : 0.85,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Base of the Box */}
          <div 
            className="absolute inset-0 bg-[#0E1018] border border-[#2E5EFF] rounded-lg shadow-[0_0_30px_rgba(46,94,255,0.7)] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, #1b2850 0%, #0E1018 70%)',
            }}
          >
            {/* Glowing Core Inside Box */}
            <motion.div
              animate={{
                scale: isBoxUnfolded ? [1, 1.3, 1] : 0.5,
                opacity: isBoxUnfolded ? [0.8, 1, 0.8] : 0.3,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-full bg-[#2E5EFF] blur-md shadow-[0_0_20px_#2E5EFF]"
            />
          </div>

          {/* Front Flap (Unfolds downward) */}
          <motion.div
            initial={{ rotateX: 90 }}
            animate={{ rotateX: isBoxUnfolded ? -85 : 90 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-10 left-0 right-0 h-10 bg-[#12141F] border border-[#2E5EFF]/70 rounded-b-md shadow-lg"
            style={{ transformOrigin: 'top center' }}
          />

          {/* Back Flap (Unfolds upward) */}
          <motion.div
            initial={{ rotateX: -90 }}
            animate={{ rotateX: isBoxUnfolded ? 85 : -90 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-10 left-0 right-0 h-10 bg-[#12141F] border border-[#2E5EFF]/70 rounded-t-md shadow-lg"
            style={{ transformOrigin: 'bottom center' }}
          />

          {/* Left Flap (Unfolds to left) */}
          <motion.div
            initial={{ rotateY: -90 }}
            animate={{ rotateY: isBoxUnfolded ? 85 : -90 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 -left-10 w-10 bg-[#12141F] border border-[#16C79A]/70 rounded-l-md shadow-lg"
            style={{ transformOrigin: 'right center' }}
          />

          {/* Right Flap (Unfolds to right) */}
          <motion.div
            initial={{ rotateY: 90 }}
            animate={{ rotateY: isBoxUnfolded ? -85 : 90 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 -right-10 w-10 bg-[#12141F] border border-[#16C79A]/70 rounded-r-md shadow-lg"
            style={{ transformOrigin: 'left center' }}
          />
        </motion.div>
      </div>

      {/* CHARACTERS STAGE */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        
        {/* ROBOT CHARACTER (Pops up first out of the blue light) */}
        <div className="absolute left-2 sm:left-6 top-8 sm:top-10 w-[210px] sm:w-[230px] aspect-square flex items-center justify-center">
          <AnimatePresence>
            {isRobotVisible && (
              <motion.div
                key={`robot-${animationKey}`}
                initial={{ 
                  y: 90, 
                  scale: 0.15, 
                  opacity: 0,
                  filter: 'drop-shadow(0 0 30px rgba(46,94,255,0.9))'
                }}
                animate={
                  isLooping
                    ? {
                        y: [0, -14, 0],
                        rotate: [-1, 1.5, -1],
                        scale: 1,
                        opacity: 1,
                        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.65)) drop-shadow(0 0 15px rgba(46,94,255,0.35))'
                      }
                    : {
                        y: [-12, 0],
                        scale: [0.15, 1.08, 1],
                        opacity: 1,
                        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.65)) drop-shadow(0 0 20px rgba(46,94,255,0.5))'
                      }
                }
                transition={
                  isLooping
                    ? {
                        y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                        duration: 0.5
                      }
                    : {
                        duration: 0.85,
                        ease: [0.34, 1.56, 0.64, 1], // bouncy spring pop-up
                      }
                }
                className="w-full h-full relative flex items-center justify-center bg-transparent"
              >
                {/* Robot Cutout Image with 100% transparent PNG alpha */}
                <img
                  src={robotImg}
                  alt="Stylized AI Robot holding guidebook"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain bg-transparent pointer-events-none"
                />

                {/* Subtle blue light reflection at the robot's base */}
                <div 
                  className="absolute bottom-2 left-6 right-6 h-8 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse, rgba(46, 94, 255, 0.5) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUMAN CHARACTER (Pops up second, next to the robot) */}
        <div className="absolute right-2 sm:right-6 top-8 sm:top-10 w-[210px] sm:w-[230px] aspect-square flex items-center justify-center">
          <AnimatePresence>
            {isHumanVisible && (
              <motion.div
                key={`human-${animationKey}`}
                initial={{ 
                  y: 90, 
                  scale: 0.15, 
                  opacity: 0,
                  filter: 'drop-shadow(0 0 30px rgba(22,199,154,0.9))'
                }}
                animate={
                  isLooping
                    ? {
                        y: [0, -11, 0],
                        rotate: [1, -1.2, 1],
                        scale: 1,
                        opacity: 1,
                        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.65)) drop-shadow(0 0 15px rgba(22,199,154,0.35))'
                      }
                    : {
                        y: [-10, 0],
                        scale: [0.15, 1.08, 1],
                        opacity: 1,
                        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.65)) drop-shadow(0 0 20px rgba(22,199,154,0.5))'
                      }
                }
                transition={
                  isLooping
                    ? {
                        y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
                        rotate: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
                        duration: 0.5
                      }
                    : {
                        duration: 0.85,
                        ease: [0.34, 1.56, 0.64, 1], // bouncy spring pop-up
                      }
                }
                className="w-full h-full relative flex items-center justify-center bg-transparent"
              >
                {/* Human Cutout Image with 100% transparent PNG alpha */}
                <img
                  src={humanImg}
                  alt="Stylized tech professional receiving guidebook"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain bg-transparent pointer-events-none"
                />

                {/* Subtle mint/blue light reflection at the human's base */}
                <div 
                  className="absolute bottom-2 left-6 right-6 h-8 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse, rgba(22, 199, 154, 0.45) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
