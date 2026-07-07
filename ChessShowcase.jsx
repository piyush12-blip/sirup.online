import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useKineticScroll } from './KineticScrollProvider';

gsap.registerPlugin(ScrollTrigger);

export default function ChessShowcase() {
  const wrapperRef  = useRef(null); // tall scroll-track div (300vh)
  const stageRef    = useRef(null); // fixed stage that stays in viewport
  const imgBoxRef   = useRef(null); // image that grows
  const nextSecRef  = useRef(null); // black section that slides up
  const { lerpY, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    const wrapper  = wrapperRef.current;
    const stage    = stageRef.current;
    const imgBox   = imgBoxRef.current;
    const nextSec  = nextSecRef.current;
    if (!wrapper || !stage || !imgBox || !nextSec) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const initialW = Math.max(vw * 0.5, Math.min(vw * 0.8, 720));
    const initialH = initialW * (9 / 16);

    // Set initial state
    gsap.set(imgBox, { width: initialW, height: initialH });
    gsap.set(nextSec, { y: vh }); // start fully below viewport

    const tick = () => {
      const scrollY   = lerpY.current;
      const top       = wrapper.offsetTop;                  // where the tall track starts
      const trackH    = wrapper.offsetHeight - vh;         // scrollable distance inside this section
      if (trackH <= 0) return;

      // How far we've scrolled into this section
      const raw = scrollY - top;

      // Phase boundaries (proportional to trackH)
      const phase1End = trackH * 0.6; // image grows until 60% of track
      const phase2End = trackH;       // then black section slides in

      // ── Phase 1: image grows while section is pinned ──────────────────
      const p1 = Math.max(0, Math.min(1, raw / phase1End));
      const e1 = p1 < 0.5 ? 2 * p1 * p1 : 1 - Math.pow(-2 * p1 + 2, 2) / 2; // ease-in-out

      imgBox.style.width  = `${initialW + (vw - initialW) * e1}px`;
      imgBox.style.height = `${initialH + (vh - initialH) * e1}px`;

      // ── Phase 2: black section slides up ─────────────────────────────
      const p2 = Math.max(0, Math.min(1, (raw - phase1End) / (phase2End - phase1End)));
      const e2 = p2 * (2 - p2); // ease-out

      nextSec.style.transform = `translateY(${(1 - e2) * 100}%)`;

      // ── Stage offset: stays fixed in the viewport ─────────────────────
      // Clamp so stage doesn't move once it arrives or after it's done
      const clampedOffset = Math.max(0, Math.min(raw, trackH));
      stage.style.transform = `translateY(${scrollY - top + clampedOffset === 0 ? 0 : clampedOffset}px)`;

      // Actually: to make stage appear truly fixed, offset it against the
      // KineticScrollProvider's translate3d of the content wrapper.
      // The content wrapper is translated -lerpY, so to stay fixed we add lerpY back.
      // But we only want it to be fixed between top and (top + trackH).
      const startLock = top;
      const endLock   = top + trackH;

      if (scrollY < startLock) {
        // Section is below viewport — normal flow
        stage.style.transform = 'translateY(0)';
      } else if (scrollY > endLock) {
        // Section is done — sit at bottom of track
        stage.style.transform = `translateY(${trackH}px)`;
      } else {
        // Section is in view — lock it to viewport by cancelling scroll offset
        stage.style.transform = `translateY(${scrollY - startLock}px)`;
      }
    };

    addTick(tick);
    return () => removeTick(tick);
  }, [lerpY, addTick, removeTick]);

  return (
    // Tall track (300vh) drives the scroll distance
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '300vh',
        background: 'transparent',
      }}
    >
      {/* Stage — repositioned via JS to stay fixed while scrolling through track */}
      <div
        ref={stageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        {/* Stage 1: Growing image */}
        <div
          ref={imgBoxRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            willChange: 'width, height',
            zIndex: 1,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1920&q=80"
            alt="Showcase"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Stage 2: Black section slides up after image is full screen */}
        <div
          ref={nextSecRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#000',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform',
          }}
        >
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '4px', color: '#66eeff', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              Next Chapter
            </span>
            <h3 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              Strategic Gaming
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
