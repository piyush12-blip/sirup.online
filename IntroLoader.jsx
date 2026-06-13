/**
 * IntroLoader.jsx
 *
 * Premium intro sequence:
 *   1. Black overlay covers everything
 *   2. SIRUP logo fades in
 *   3. Counter 000 → 100 with thin progress bar
 *   4. Overlay wipes upward off screen
 *   5. onComplete() fires → hero entrance animations begin
 *
 * Props:
 *   onComplete  {function}  Called when wipe finishes
 *   logoSrc     {string}    Path to logo image
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function IntroLoader({ onComplete, logoSrc }) {
  const overlayRef  = useRef(null);
  const logoRef     = useRef(null);
  const counterRef  = useRef(null);
  const barRef      = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo    = logoRef.current;
    const counter = counterRef.current;
    const bar     = barRef.current;

    if (!overlay || !logo || !counter || !bar) return;

    // — Counter object GSAP can animate —
    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Wipe the overlay upward off screen
        gsap.to(overlay, {
          yPercent: -102,
          duration: 0.9,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    // 1. Fade logo in
    tl.fromTo(logo,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      0.3
    );

    // 2. Animate counter 000 → 100 and bar width 0% → 100%
    tl.to(obj, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.floor(obj.val);
        counter.textContent = String(v).padStart(3, '0');
        bar.style.transform = `scaleX(${v / 100})`;
      },
    }, 0.5);

    // 3. Brief pause at 100 before wipe
    tl.to({}, { duration: 0.25 });

  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          10000,
        backgroundColor: '#000',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             '3vw',
        pointerEvents:   'none',
      }}
    >
      {/* Logo */}
      <img
        ref={logoRef}
        src={logoSrc}
        alt="SIRUP"
        style={{
          height:  'clamp(60px, 9vw, 140px)',
          width:   'auto',
          opacity: 0,
          filter:  'brightness(1.1)',
        }}
      />

      {/* Progress row */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '14px',
        width:          'clamp(160px, 22vw, 320px)',
      }}>
        {/* Bar track */}
        <div style={{
          width:           '100%',
          height:          '1px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          overflow:        'hidden',
        }}>
          <div
            ref={barRef}
            style={{
              width:           '100%',
              height:          '100%',
              backgroundColor: '#fff',
              transformOrigin: 'left center',
              transform:       'scaleX(0)',
            }}
          />
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          style={{
            fontFamily:    "'DM Sans', sans-serif",
            fontSize:      'clamp(11px, 1.1vw, 15px)',
            fontWeight:    300,
            letterSpacing: '0.3em',
            color:         'rgba(255,255,255,0.5)',
          }}
        >
          000
        </span>
      </div>
    </div>
  );
}
