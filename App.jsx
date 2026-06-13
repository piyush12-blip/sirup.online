import React, { useRef, useEffect } from 'react';
import LivingBackground from './LivingBackground.jsx';
import KineticScrollProvider, { useKineticScroll } from './KineticScrollProvider.jsx';
import { ParallaxLayer } from './ParallaxLayer.jsx';
import { RevealImage } from './RevealImage.jsx';
import { FocalText } from './FocalText.jsx';
import { MagneticBadge } from './MagneticBadge.jsx';
import { InnerParallaxImage } from './InnerParallaxImage';
import { StaggeredTextReveal } from './StaggeredTextReveal.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import NoiseOverlay from './NoiseOverlay';
import HeroLogo from './HeroLogo';
import DateSVG from './DateSVG';
import CharacterParallax from './CharacterParallax';
import ScrollHeader from './ScrollHeader';
import MarqueeStrip from './MarqueeStrip';
import HoverParallaxCard from './HoverParallaxCard';
// CustomCursor is available in CustomCursor.jsx — wire in when ready
const IMAGE_POSITIONS = ['10%', '35%', '65%', '100%'];
const REVERSE_IMAGE_POSITIONS = ['100%', '65%', '35%', '10%'];

// ─── Photo Strips with Scroll Physics ────────────────────────────────────────
// These are sub-components so they can call useKineticScroll() while being
// rendered inside KineticScrollProvider — same velocity skewY as ParallaxLayer.

function AboutPhotoStrip({ cardsRef }) {
  const stripRef = useRef(null);
  const { velocity, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    if (!stripRef.current) return;
    // ✅ AI-1 Fix: quickSetter writes only the skewY sub-property — doesn't
    // clobber GSAP's transform matrix or thrash the 3D context on child cards.
    // Also skip writing skewY(0) when idle so 3D context stays stable.
    const setSkew = gsap.quickSetter(stripRef.current, 'skewY', 'deg');
    let lastSkew = null;
    const tick = () => {
      if (!stripRef.current) return;
      const v    = velocity.current * 0.04;
      const skew = Math.abs(v) < 0.01 ? 0 : v;
      if (skew !== lastSkew) { setSkew(skew); lastSkew = skew; }
    };
    addTick(tick);
    return () => removeTick(tick);
  }, [velocity, addTick, removeTick]);

  return (
    <div ref={stripRef} className="about-photo" style={{
      position:      'absolute',
      top:           '130vh',
      left:          '0.2vw',
      display:       'flex',
      gap:           '2px',
      zIndex:         60,
      willChange:    'transform',
      pointerEvents: 'auto', // ✅ AI-2 Fix: explicit auto so hover chain is never broken
    }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} ref={el => cardsRef.current[i] = el}
          style={{
            width:         '140px',
            height:        '180px',
            flexShrink:     0,
            pointerEvents: 'auto', // ✅ AI-2 Fix: explicit auto on every link in the chain
          }}>
          {/* Element 1: About cards — 8deg tilt, glow on hover */}
          <HoverParallaxCard
            maxTilt={8}
            perspective={800}
            scaleOnHover={1.04}
            glowOnHover={true}
            style={{ width: '100%', height: '100%' }}
          >
            <InnerParallaxImage
              src="https://sirup.online/5th/asset/img/header/header-about-photo.webp"
              alt="About Photo"
              objectPositionY={REVERSE_IMAGE_POSITIONS[i]}
            />
          </HoverParallaxCard>
        </div>
      ))}
    </div>
  );
}

function RootsPhotoStrip({ cardsRef }) {
  const stripRef = useRef(null);
  const { velocity, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    if (!stripRef.current) return;
    // ✅ Same quickSetter fix as AboutPhotoStrip
    const setSkew = gsap.quickSetter(stripRef.current, 'skewY', 'deg');
    let lastSkew = null;
    const tick = () => {
      if (!stripRef.current) return;
      const v    = velocity.current * 0.04;
      const skew = Math.abs(v) < 0.01 ? 0 : v;
      if (skew !== lastSkew) { setSkew(skew); lastSkew = skew; }
    };
    addTick(tick);
    return () => removeTick(tick);
  }, [velocity, addTick, removeTick]);

  return (
    <div ref={stripRef} className="roots-photo" style={{
      position:      'absolute',
      top:           '260vh',
      right:         '9vw',
      display:       'flex',
      gap:           '2px',
      zIndex:         60,
      willChange:    'transform',
      pointerEvents: 'auto', // ✅ explicit auto
    }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} ref={el => cardsRef.current[i] = el}
          style={{
            width:         '140px',
            height:        '180px',
            flexShrink:     0,
            pointerEvents: 'auto', // ✅ explicit auto
          }}>
          {/* Element 2: Roots cards — same tilt + glow */}
          <HoverParallaxCard
            maxTilt={8}
            perspective={800}
            scaleOnHover={1.04}
            glowOnHover={true}
            style={{ width: '100%', height: '100%' }}
          >
            <InnerParallaxImage
              src="https://sirup.online/5th/asset/img/header/header-roots-photo.webp"
              alt="Roots Photo"
              objectPositionY={IMAGE_POSITIONS[i]}
            />
          </HoverParallaxCard>
        </div>
      ))}
    </div>
  );
}

const SVGS = {
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L2.25 2.25h6.952l4.263 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  ig: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  yt: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M23 7s-.3-2-1.2-2.8C20.7 3 19.4 3 18.8 2.9 16.4 2.7 12 2.7 12 2.7s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1c0 2.3.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.2 12 22.2 12 22.2s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2C23.3 9.2 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
    </svg>
  ),
  sp: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.808-.87 7.076-.496 9.712 1.115.293.18.386.563.21.853zm1.243-2.783c-.225.367-.704.484-1.07.258-2.686-1.65-6.784-2.13-9.964-1.166-.406.122-.83-.108-.952-.515-.122-.406.108-.83.514-.95 3.65-1.102 8.16-.563 11.215 1.314.366.225.483.704.257 1.06zm.116-2.905c-3.216-1.908-8.525-2.083-11.564-1.16-.48.146-.995-.125-1.14-.606-.145-.48.125-.995.606-1.14 3.49-1.063 9.35-.86 13.06 1.34.433.256.575.815.318 1.248-.256.434-.814.576-1.247.318z" />
    </svg>
  ),
  tk: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1 4.54-2.73 6.08-1.57 1.4-3.69 2.11-5.83 2-2.12-.11-4.14-1.08-5.5-2.65-1.55-1.78-2.22-4.18-1.85-6.49.27-1.68 1.07-3.26 2.3-4.4 1.53-1.44 3.64-2.16 5.75-2.09.11 0 .22.01.32.02v4.22c-.11-.01-.21-.01-.32-.01-1.39-.1-2.82.4-3.77 1.43-.88.94-1.21 2.3-1 3.59.18 1.1.84 2.1 1.75 2.74 1.07.75 2.45 1.01 3.73.74 1.25-.26 2.35-1 3-2.09.61-1.01.88-2.19.86-3.37.04-4.8.01-9.6.02-14.41z"/>
    </svg>
  ),
};

export default function App() {
  const containerRef          = useRef(null); // ✅ FIX 3: scope for useGSAP
  const characterRef          = useRef(null);
  const panelRef              = useRef(null);
  const aboutCardsRef         = useRef([]);
  const rootsCardsRef         = useRef([]);
  const headlineVeslineRef    = useRef(null);
  const headlineDateRef       = useRef(null);
  const seventhRef            = useRef(null);


  // Staggered offsets — GSAP owns these, not React inline styles
  const ABOUT_OFFSETS = [0, 18.7, 37.5, 56.3];
  const ROOTS_OFFSETS = [0, 16.4, 32.9, 49.3];

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { force3D: true } });

    // ── 1. PANEL — the stage appears first ──────────────────────────────────
    if (panelRef.current) {
      gsap.set(panelRef.current, { xPercent: -50, yPercent: 40, opacity: 0 });
      tl.to(panelRef.current, {
        yPercent: 0,
        opacity:  1,
        duration: 2.4,
        ease:     'expo.out',
      }, 0);
    }

    // ── 2. CHARACTER — the star walks in ────────────────────────────────────
    if (characterRef.current) {
      gsap.set(characterRef.current, { xPercent: -50, yPercent: 110 });
      tl.to(characterRef.current, {
        yPercent: 0,
        duration: 2.6,
        ease:     'power4.out',
      }, 0.3);
    }

    // ── 3. DATE "2007-2012" — cascade with no bounce ────────────────────────────
    if (headlineDateRef.current) {
      const dateChars = headlineDateRef.current.querySelectorAll('.date-char');
      if (dateChars.length > 0) {
        gsap.set(dateChars, { y: 120, opacity: 0 });
        tl.to(dateChars, {
          y:        0,
          opacity:  1,
          duration: 1.6,
          ease:     'expo.out', // Removed bounce here
          stagger:  { each: 0.05, from: 'start' },
        }, 0.9);
      }
    }

    // ── 4. "7th" — the punchline ─────────────────────────────────────────────
    if (seventhRef.current) {
      const seventhChars = seventhRef.current.querySelectorAll('.date-char');
      if (seventhChars.length > 0) {
        gsap.set(seventhChars, { y: 160, opacity: 0 });
        tl.to(seventhChars, {
          y:        0,
          opacity:  1,
          duration: 1.8,
          ease:     'expo.out',
          stagger:  { each: 0.08, from: 'start' },
        }, 1.4);
      }
    }

    // ── 5. VESLINE — single drift tween, no glitch ──────────────────────────
    // power4.out: covers 94% of distance in first 50% of time, then crawls.
    // At 3.5s: shoots in for ~1.75s (the drift), creeps the last 6% for ~1.75s (tyres locking).
    // y: 20 → 0 adds a vertical settle — word drifts in from left AND slightly below,
    // then stabilises. Real 2D drift, zero GPU transition glitch.
    if (headlineVeslineRef.current) {
      const inner = headlineVeslineRef.current.querySelector('.vesline-inner');
      const lastE = headlineVeslineRef.current.querySelector('.vesline-last-e');

      if (inner) {
        if (lastE) {
          gsap.set(lastE, { opacity: 0, yPercent: -40 });
        }

        // Start off-screen left AND slightly below for the 2D drift
        gsap.set(inner, { xPercent: -100, y: 20 });

        // Single smooth drift — power4.out IS the car braking
        tl.to(inner, {
          xPercent: 0,
          y:        0,
          duration: 3.5,
          ease:     'power4.out',
        }, 2.0);

        // Last E snaps in after drift settles (2.0 + 3.5 = 5.5s)
        if (lastE) {
          tl.to(lastE, {
            opacity:  1,
            yPercent: 0,
            duration: 0.6,
            ease:     'back.out(2.5)',
          }, 5.5);
        }
      }
    }

    // ── Scroll-triggered photo strips ───────────────────────────────────────
    // These are independent of the hero entrance — they fire when scrolled into view.
    ABOUT_OFFSETS.forEach((offset, i) => {
      const card = aboutCardsRef.current[i];
      if (!card) return;
      gsap.set(card, { y: offset });
      gsap.to(card, {
        y:        0,
        duration: 0.9,
        ease:     'power3.out',
        delay:    i * 0.07,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      });
    });

    ROOTS_OFFSETS.forEach((offset, i) => {
      const card = rootsCardsRef.current[i];
      if (!card) return;
      gsap.set(card, { y: offset });
      gsap.to(card, {
        y:        0,
        duration: 0.9,
        ease:     'power3.out',
        delay:    i * 0.07,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      });
    });

  }, { scope: containerRef }); // ✅ FIX 3: GSAP context scoped → proper cleanup on HMR/unmount

  return (
    <div ref={containerRef}>

      {/* LAYER 0: Sibling Fixed Background (Never gets trapped or clipped) */}
      <div className="bg-canvas-layer" style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none'
      }}>
        <LivingBackground isPlaying={true} speed={1} colorA="#1a1a2e" colorB="#533483" />
      </div>

      {/* SVG Filter: Alpha gamma sharpening — makes Glodok thin strokes crisper, simulates higher stroke contrast */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="sharpen-alpha" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="1.6" offset="0"/>
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* SCROLL-AWARE HEADER — lives outside KineticScrollProvider so
          position:fixed is real viewport-fixed, not transform-relative */}
      <ScrollHeader
        logoSrc="https://sirup.online/5th/asset/img/header/header-logo.svg"
        socials={[
          { key: 'x',  href: '#', svg: SVGS.x  },
          { key: 'ig', href: '#', svg: SVGS.ig },
          { key: 'yt', href: '#', svg: SVGS.yt },
          { key: 'sp', href: '#', svg: SVGS.sp },
          { key: 'tk', href: '#', svg: SVGS.tk },
        ]}
        zIndex={100}
      />

      {/* LAYER 1: THE PHYSICS ENGINE */}
      <KineticScrollProvider>

        {/* THE RUNWAY (Gives the scrollbar a massive track) */}
        <div style={{ position: 'relative', minHeight: '350vw', width: '100%', zIndex: 30 }}>
        {/* 👑 CROWN 1: Panel background — moves at 0.15, sits behind headlines */}
        <ParallaxLayer speed={0.15} zIndex={10}>
          <img
            ref={panelRef}
            src="https://sirup.online/5th/asset/img/header/pc/header-panel.webp"
            alt=""
            decoding="async"
            style={{
              position: 'absolute', left: '50%',
              top: 'calc(40vh - 8vw)',
              width: '75vw', height: '148vw',
              pointerEvents: 'none',
              objectFit: 'fill',
              willChange: 'transform',
            }}
          />
        </ParallaxLayer>

        {/* 👑 CROWN 2: Character — outer speed=0.08 keeps clip locked to panel.
            CharacterParallax adds inner drift (0.08) via gsap.quickSetter so
            entrance animation (yPercent) and inner parallax (y) never conflict. */}
        <ParallaxLayer speed={0.08} zIndex={30} skewFactor={0.05}>
          <CharacterParallax
            ref={characterRef}
            src="/character.webp"
            alt="SIRUP"
            width="75vw"
            height="148vw"
            top="calc(40vh - 8vw)"
            innerParallax={0.08}
          />
        </ParallaxLayer>



        {/* VESLINE SVG — Element 3: floaty viewport shift, slow */}
        {/* HoverParallaxCard is the outer positioner. headlineVeslineRef stays */}
        {/* on the inner div so GSAP querySelector('.vesline-inner') still works. */}
        <HoverParallaxCard
          mode="shift"
          shiftX={6}
          shiftY={4}
          shiftDuration={0.8}
          style={{
            position:      'absolute',
            left:          '50%',
            transform:     'translateX(calc(-50% - 22vw))',
            top:           'calc(24vh + 15.2vw)',
            zIndex:         20,
            pointerEvents: 'none',
          }}
        >
          <div
            ref={headlineVeslineRef}
            style={{ overflow: 'hidden', pointerEvents: 'none' }}
          >
            <div
              className="vesline-inner"
              style={{
                display:      'block',
                width:        '100%',
                opacity:       0.92,
                mixBlendMode: 'screen',
                filter:       'drop-shadow(0 0 0 rgba(0,0,0,0.32)) drop-shadow(0 3px 10px rgba(0,0,0,0.45)) drop-shadow(0 12px 30px rgba(0,0,0,0.20))',
              }}
            >
              <HeroLogo fill="#ffffff" width="55vw" maxWidth="1160px" />
            </div>
          </div>
        </HoverParallaxCard>

        {/* Background Layer (zIndex 5) - Behind Guy, In front of Panel */}
        <div style={{
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)', top: '24vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.5vw',
          zIndex: 20, pointerEvents: 'none',
        }}>
          {/* Element 5: 2007-2012 — inverse shift (moves OPPOSITE mouse) */}
          {/* Counter-direction vs VESLINE creates real Z-depth separation */}
          <HoverParallaxCard
            mode="shift"
            shiftX={3}
            shiftY={2}
            shiftDuration={1.2}
            inverse={true}
          >
            <div ref={headlineDateRef} style={{ display: 'flex', justifyContent: 'center' }}>
              <DateSVG 
                date="2007-2012"
                height="6.5vw"
                style={{
                  opacity: 0.92,
                  transform: 'translateY(5.8vw) scaleY(1.04)',
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 0 0 rgba(0,0,0,0.32)) drop-shadow(0 3px 10px rgba(0,0,0,0.45)) drop-shadow(0 12px 30px rgba(0,0,0,0.20))',
                }}
              />
            </div>
          </HoverParallaxCard>

          {/* Bottom: VESLINE spacer — plain div, correct dimensions, no duplicate SVG render */}
          <div
            aria-hidden="true"
            style={{ width: '47vw', maxWidth: '1100px', height: '26.44vw', flexShrink: 0, transform: 'translateX(-10vw) translateY(-4.6vw)' }}
          />
        </div>

        {/* Foreground Layer (zIndex 12) - In front of Guy */}
        <div style={{
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)', top: '24vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.5vw',
          zIndex: 40, pointerEvents: 'none',
          isolation: 'isolate',
        }}>
          {/* Top: 2007-2012 spacer — plain div, no duplicate SVG render */}
          <div
            aria-hidden="true"
            style={{ height: '6.5vw', width: '100%', flexShrink: 0, transform: 'translateY(5.8vw) scaleY(1.04)' }}
          />

          {/* Bottom: VESLINE spacer — plain div, correct dimensions, no duplicate SVG render */}
          <div
            aria-hidden="true"
            style={{ width: '47vw', maxWidth: '1100px', height: '26.44vw', flexShrink: 0, transform: 'translateX(-10vw) translateY(-4.6vw)' }}
          />
        </div>

        {/* Z 12 - ABOUT TITLE (Separated) */}
        <div style={{
          position: 'absolute', left: '50%',
          transform: 'translateX(-50%)', top: '180vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.5vw',
          zIndex: 40, pointerEvents: 'none',
        }}>
          {/* Top: ABOUT */}
          <img src="/about_title (1).png" alt="ABOUT" style={{ width: '35vw', height: 'auto', opacity: 0.8, transform: 'translateX(36vw) translateY(-6vw) rotate(90deg)' }} />
          {/* Bottom: VESLINE */}
          <div style={{ width: '52vw', height: 'auto', opacity: 0.8, transform: 'translateX(29vw) translateY(0vw) rotate(90deg)' }}>
            <HeroLogo fill="#ffffff" width="100%" maxWidth="none" />
          </div>
        </div>

        {/* Element 4: "7th" — shift mode, forward direction, slightly slower */}
        <HoverParallaxCard
          mode="shift"
          shiftX={4}
          shiftY={3}
          shiftDuration={1.0}
          style={{
            position:      'absolute',
            right:          '10vw',
            top:            '57vh',
            zIndex:          20,
            pointerEvents: 'none',
          }}
        >
          <div ref={seventhRef}>
            <DateSVG
              date="7th"
              height="12vw"
              style={{
                opacity: 0.92,
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 0 rgba(0,0,0,0.32)) drop-shadow(0 3px 10px rgba(0,0,0,0.45)) drop-shadow(0 12px 30px rgba(0,0,0,0.20)) blur(0.5px)',
              }}
            />
          </div>
        </HoverParallaxCard>

        {/* Element 6: Anniversary SVG — gentle 4deg tilt like a framed photo */}
        <HoverParallaxCard
          maxTilt={4}
          perspective={1200}
          scaleOnHover={1.02}
          glowOnHover={false}
          style={{
            position:  'absolute',
            top:       '95vh',
            left:      '50%',
            transform: 'translateX(-50%)',
            width:     '50vw',
            zIndex:     20,
          }}
        >
          <img
            src="https://sirup.online/5th/asset/img/header/pc/header-title-24.svg"
            alt="2017-2022 5th ANNIVERSARY"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          {/* Z 15 - SYNAPSE PARAGRAPH (inside Anniversary container) */}
          <div style={{ position: 'absolute', top: '35px', left: '620px', width: '200px', zIndex: 60 }}>
            <FocalText>
              <p className="pc" style={{
                margin: 0, padding: 0,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '12px',
                lineHeight: '18px',
                fontWeight: 400,
                textAlign: 'left',
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.498021px',
              }}>
                {'\u30672017\u5e74\u306b\u30c7\u30d3\u30e5\u30fc\u30b7\u30f3\u30b0\u30eb\u300cSynapse\u300d\u3092\u30ea\u30ea\u30fc\u30b9'}
                <br />
                {'\u3053\u308c\u307e\u3067\u306b2\u679a\u306e\u30d5\u30eb\u30a2\u30eb\u30d0\u30e0\u30683\u679a\u306eEP\u4f5c\u54c1\u3092'}
                <br />
                {'\u30ea\u30ea\u30fc\u30b9\u3057\u3066\u304d\u305fSIRUP\u304c2022\u5e74'}
                <br />
                {'\u30c7\u30d3\u30e5\u30fc5\u5468\u5e74\u3092\u8fce\u3048\u305f\u3002'}
              </p>
            </FocalText>
          </div>
        </HoverParallaxCard>

        {/* Z 15 - ABOUT PHOTO STRIP (Left) — scroll physics via AboutPhotoStrip */}
        <AboutPhotoStrip cardsRef={aboutCardsRef} />

        {/* Z 15 - ABOUT TEXT */}
        <div style={{ position: 'absolute', top: '170vh', left: '11.5vw', width: '280px', zIndex: 60 }}>
          <FocalText>
            <StaggeredTextReveal
              className="pc" 
              startTrigger="top 90%"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '10.5px', 
                fontWeight: 400, lineHeight: 2.0,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.05em', margin: 0,
              }}
              lines={[
                '\u30e9\u30c3\u30d7\u3068\u6b4c\u3092\u81ea\u7531\u306b\u884c\u304d\u6765\u3059\u308b',
                '\u30dc\u30fc\u30ab\u30eb\u30b9\u30bf\u30a4\u30eb\u3068\u3001',
                '\u81ea\u8eab\u306e\u30eb\u30fc\u30c4\u3067\u3042\u308b\u30cd\u30aa\u30bd\u30a6\u30eb\u3001R\uff06B\u3001\u30b4\u30b9\u30da\u30eb\u3068',
                'HIPHOP\u3092\u878d\u5408\u3057\u305f\u30b8\u30e3\u30f3\u30eb\u306b\u6349\u308f\u308c\u306a\u3044\u97f3\u697d\u3067\u3001',
                '\u30a4\u30ae\u30ea\u30b9\u51fa\u8eab\u306e\u300cYears & Years\u300d\u3084',
                '\u30a2\u30a4\u30ea\u30c3\u30b7\u30e5\u30a6\u30a4\u30b9\u30ad\u30fc\u300cJAMESON\u300d\u3068',
                '\u56fd\u5185\u5916\u554f\u308f\u305a\u69d8\u3005\u306a\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8\u3084\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u3068',
                '\u30b3\u30e9\u30dc\u30ec\u30fc\u30b7\u30e7\u30f3\u3082\u679c\u305f\u3059\u306a\u3069',
                '\u65e5\u672c\u3092\u4ee3\u8868\u3059\u308bR&B\u30b7\u30f3\u30ac\u30fc\u3068\u3057\u3066',
                '\u97f3\u697d\u306e\u307f\u306a\u3089\u305a\u69d8\u3005\u306a\u5206\u91ce\u3067\u6d3b\u8e8d\u3092\u5e83\u3052\u3066\u3044\u308b\u3002'
              ]}
            />
          </FocalText>
        </div>

        {/* Z 15 - ROOTS PHOTO STRIP (Right) — scroll physics via RootsPhotoStrip */}
        <RootsPhotoStrip cardsRef={rootsCardsRef} />

        {/* Z 15 - ROOTS TEXT */}
        <div style={{ position: 'absolute', top: 'calc(180vw - 925px)', left: '10vw', width: '323px', zIndex: 60 }}>
          <FocalText>
            <StaggeredTextReveal 
              className="pc" 
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '12.5px', 
                fontWeight: 400, lineHeight: 2.2,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.05em', margin: 0,
              }}
              lines={[
                '\u304b\u3064\u3066\u6398\u308a\u4e0b\u3052\u305f\u30cd\u30aa\u30bd\u30a6\u30eb\u306e\u697d\u66f2\u304b\u3089\u59cb\u307e\u308a',
                '\u81ea\u8eab\u306e \u201c\u6b4c\u201d \u306e\u30b9\u30bf\u30a4\u30eb\u3092\u78ba\u7acb\u3059\u308b\u4e0a\u3067\u5927\u304d\u306a\u5f71\u97ff\u3092\u53d7\u3051\u305f',
                '\u540c\u6642\u4ee3\u306e\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8\u307e\u3067\u3001',
                '\u30e9\u30c3\u30d1\u30fc\u3001R&B\u30b7\u30f3\u30ac\u30fc\u3001\u30d0\u30f3\u30c9\u306a\u3069\u69d8\u3005\u306a\u30b8\u30e3\u30f3\u30eb\u306e\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8\u3068',
                '\u5171\u6f14\u3059\u308bSIRUP\u3092\u7406\u89e3\u3059\u308b\u305f\u3081\u306e\u30d2\u30f3\u30c8\u3068\u306a\u308b\u697d\u66f2\u3092',
                '\u30d7\u30ec\u30a4\u30ea\u30b9\u30c8\u3068\u3057\u3066\u632f\u308a\u8fd4\u308b\u3002'
              ]}
            />
          </FocalText>
        </div>

        {/* Z 15 - ROOTS PLAYLIST BUTTON */}
        <div style={{ position: 'absolute', top: 'calc(180vw - 640px)', left: '25vw', zIndex: 60 }}>
          <MagneticBadge label={"ROOTS\nPLAYLIST"} />
        </div>

        {/* Z 12 - ROOTS TITLE */}
        <img
          src="/roots_title.png"
          alt="ROOTS"
          style={{
            position: 'absolute', left: '-5vw',
            transform: 'translateX(0)', top: '195vh',
            width: '60vw', height: 'auto',
            opacity: 0.8,
            zIndex: 20, pointerEvents: 'none',
          }}
        />

        {/* ── MARQUEE — Footer / Below Roots ─────────────────── */}
        <div style={{
          position: 'absolute',
          top: '360vh',
          width: '100%',
          zIndex: 60,
        }}>
          <MarqueeStrip
            items={['SIRUP', '7TH ANNIVERSARY', 'VESUVINE', '2026', 'ROOTS PLAYLIST']}
            speed={0.4}
          />
        </div>

        <div style={{
          position: 'absolute',
          top: 'calc(360vh + 56px)',
          width: '100%',
          zIndex: 60,
        }}>
          <MarqueeStrip
            items={['SYNAPSE', 'NEO SOUL', 'R&B', 'JAZZ', 'POP', 'ELECTRONIC']}
            speed={0.28}
            reverse={true}
            color="rgba(255,255,255,0.15)"
          />
        </div>

        <style>{`
          #bg-wrapper, #bg-wrapper > div, #bg-wrapper canvas { width:100%!important; height:100%!important; display:block!important; }
          #bg-wrapper > div { flex:1!important; }
          .burger { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:4px; opacity:.85; transition:opacity .2s; }
          .burger:hover { opacity:1; }
          .bar { display:block; width:24px; height:2px; background:#fff; border-radius:1px; }
          .logo { position:absolute; left:50%; transform:translateX(-50%); font-family:'Great Vibes',cursive; font-weight:400; font-size:46px; color:#fff; pointer-events:none; }
          .socials { display:flex; align-items:center; gap:18px; }
          .si { color:rgba(255,255,255,0.55); display:flex; transition:color .2s; }
          .si:hover { color:#fff; }
          .thumb { width:130px; height:167px; overflow:hidden; flex-shrink:0; box-shadow:2px 0 10px rgba(0,0,0,0.6); }
          .thumb img { width:100%; height:100%; object-fit:cover; display:block; }
          .roots-btn { position:absolute; z-index:60; width:115px; height:115px; border-radius:50%; background:#1a1a2e; border:1.5px solid rgba(255,255,255,0.22); color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; font-size:9.5px; letter-spacing:0.18em; text-transform:uppercase; text-align:center; line-height:1.5; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 36px rgba(0,0,0,0.7); transition:transform .2s,box-shadow .2s,background .2s; }
          .roots-btn:hover { background:#26195e; transform:scale(1.07); box-shadow:0 16px 48px rgba(0,0,0,0.8); }
          @media (max-width:768px) { .logo { font-size:32px; } .thumb { width:80px; height:103px; } }
        `}</style>
        </div>
      </KineticScrollProvider>

      {/* 🚨 INJECT THE NOISE OVERLAY HERE 🚨 */}
      {/* Must be the absolute last child! */}
      <NoiseOverlay />

    </div>
  );
}
