import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useKineticScroll } from './KineticScrollProvider';
import { flipImage } from './useFlipImage';

gsap.registerPlugin(ScrollTrigger);

export default function ChessShowcase() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const flyRef = useRef(null);     // the flying/growing image
  const nextSecRef = useRef(null); // panel that slides up after
  const startRef = useRef(null);   // captured start rect
  const { lerpY, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const fly = flyRef.current;
    const nextSec = nextSecRef.current;
    if (!wrapper || !stage || !fly || !nextSec) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    gsap.set(nextSec, { y: vh });

    const tick = () => {
      const scrollY = lerpY.current;
      const top = wrapper.offsetTop;
      const trackH = wrapper.offsetHeight - vh;
      if (trackH <= 0) return;

      const raw = scrollY - top;
      const startLock = top;
      const endLock = top + trackH;
      const phase1End = trackH * 0.65;

      // Capture the setlist image the moment we enter
      if (scrollY >= startLock && !startRef.current) {
        const r = flipImage.rect || { left: vw/2 - 160, top: vh/2 - 90, width: 320, height: 180 };
        startRef.current = r;
        fly.style.backgroundImage = `url(${flipImage.src})`;
      }
      if (scrollY < startLock) startRef.current = null; // re-arm on scroll up

      const s = startRef.current;
      if (s) {
        const p = Math.max(0, Math.min(1, raw / phase1End));
        const e = 1 - Math.pow(1 - p, 3); // ease-out cubic

        // start: little slide rect -> end: fullscreen (drift + grow)
        const x = s.left + (0 - s.left) * e;
        const y = s.top + (0 - s.top) * e;
        const w = s.width + (vw - s.width) * e;
        const h = s.height + (vh - s.height) * e;

        fly.style.opacity = 1;
        fly.style.transform = `translate(${x}px, ${y}px)`;
        fly.style.width = `${w}px`;
        fly.style.height = `${h}px`;
      }

      // Phase 2: panel slides up
      const p2 = Math.max(0, Math.min(1, (raw - phase1End) / (trackH - phase1End)));
      const e2 = p2 * (2 - p2);
      nextSec.style.transform = `translateY(${(1 - e2) * 100}%)`;

      // Stage lock (unchanged)
      if (scrollY < startLock) stage.style.transform = 'translateY(0)';
      else if (scrollY > endLock) stage.style.transform = `translateY(${trackH}px)`;
      else stage.style.transform = `translateY(${scrollY - startLock}px)`;
    };

    addTick(tick);
    return () => removeTick(tick);
  }, [lerpY, addTick, removeTick]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: '300vh' }}>
      <div ref={stageRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', willChange: 'transform' }}>
        <div
          ref={flyRef}
          style={{
            position: 'fixed', top: 0, left: 0, opacity: 0,
            backgroundSize: 'cover', backgroundPosition: 'center',
            willChange: 'transform, width, height', zIndex: 1,
          }}
        />
        <div ref={nextSecRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform' }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: '#66eeff', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Next Chapter</span>
            <h3 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Strategic Gaming</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
