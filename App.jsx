import SVGS from './constants/icons.jsx';
import AboutPhotoStrip from './components/AboutPhotoStrip.jsx';
import RootsPhotoStrip from './components/RootsPhotoStrip.jsx';
import FooterSection from './components/FooterSection.jsx';
import VelocityTicker from './components/VelocityTicker.jsx';
import MainLiveSection from './components/MainLiveSection.jsx';

import React, { useRef, useEffect, useState } from 'react';
import LivingBackground from './LivingBackground.jsx';
import KineticScrollProvider, { useKineticScroll } from './KineticScrollProvider.jsx';
import { ParallaxLayer } from './ParallaxLayer.jsx';
import { FocalText } from './FocalText.jsx';
import { MagneticBadge } from './MagneticBadge.jsx';
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
import IntroLoader from './IntroLoader';
import PageNav from './PageNav';
import MusicPlayer from './MusicPlayer';
import SetlistSection from './SetlistSection';
import BeTheGrooveSection from './BeTheGrooveSection';
import DvdSection from './DvdSection';
import RotatingAlbum from './RotatingAlbum';
import BudokanAlbumScroll from './BudokanAlbumScroll';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared shadow ─────────────────────────────────────────────────────────────
const HERO_SHADOW = 'drop-shadow(0 3px 10px rgba(0,0,0,0.45)) drop-shadow(0 12px 30px rgba(0,0,0,0.20))';

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const containerRef = useRef(null);
  const characterRef = useRef(null);
  const panelRef = useRef(null);
  const headlineVeslineRef = useRef(null);
  const headlineDateRef = useRef(null);
  const seventhRef = useRef(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleNavigate = (target) => {
    let el = null;
    if (target === 'details') {
      el = document.querySelector('.about-photo');
    } else if (target === 'chess') {
      el = document.querySelector('.section-main-live');
    } else if (target === 'car') {
      el = document.querySelector('.section-footer-wrap');
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top;
      window.scrollTo({
        top: scrollY,
        behavior: 'smooth'
      });
    }
  };

  // ── Entrance animation (fires once loader is done) ──────────────────────────
  useGSAP(() => {
    if (!loaderDone) return;

    const tl = gsap.timeline({ defaults: { force3D: true } });

    if (panelRef.current) {
      gsap.set(panelRef.current, { yPercent: 40, opacity: 0 });
      tl.to(panelRef.current, { yPercent: 0, opacity: 1, duration: 2.4, ease: 'expo.out' }, 0);
    }

    if (characterRef.current) {
      gsap.set(characterRef.current, { yPercent: 110 });
      tl.to(characterRef.current, { yPercent: 0, duration: 2.6, ease: 'power4.out' }, 0.3);
    }

    if (headlineDateRef.current) {
      const dateChars = headlineDateRef.current.querySelectorAll('.date-char');
      if (dateChars.length) {
        gsap.set(dateChars, { y: 120, opacity: 0 });
        tl.to(dateChars, { y: 0, opacity: 1, duration: 1.6, ease: 'expo.out', stagger: { each: 0.05 } }, 0.9);
      }
    }

    if (seventhRef.current) {
      const seventhChars = seventhRef.current.querySelectorAll('.date-char');
      if (seventhChars.length) {
        gsap.set(seventhChars, { y: 160, opacity: 0 });
        tl.to(seventhChars, { y: 0, opacity: 1, duration: 1.8, ease: 'expo.out', stagger: { each: 0.08 } }, 1.4);
      }
    }

    if (headlineVeslineRef.current) {
      const inner = headlineVeslineRef.current.querySelector('.vesline-inner');
      const lastE = headlineVeslineRef.current.querySelector('.vesline-last-e');
      if (inner) {
        if (lastE) gsap.set(lastE, { opacity: 0, yPercent: -40 });
        gsap.set(inner, { xPercent: -100, y: 20 });
        tl.to(inner, { xPercent: 0, y: 0, duration: 3.5, ease: 'power4.out' }, 2.0);
        if (lastE) tl.to(lastE, { opacity: 1, yPercent: 0, duration: 0.6, ease: 'back.out(2.5)' }, 5.5);
      }
    }

  }, { scope: containerRef, dependencies: [loaderDone] });

  return (
    <div ref={containerRef} className="page page--live">

      {/* ── Intro Loader ── */}
      {!loaderDone && (
        <IntroLoader
          logoSrc="https://sirup.online/5th/asset/img/header/header-logo.svg"
          onComplete={() => setLoaderDone(true)}
        />
      )}


      {/* ── Fixed background ── */}
      <div className="page-vanta bg-canvas-layer" style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 0, pointerEvents: 'none',
      }}>
        <div className="vanta-back" style={{ position: 'absolute', inset: 0 }}>
          <LivingBackground isPlaying={true} speed={1} colorA="#1a1a2e" colorB="#533483" />
        </div>
        <div className="vanta-front blackout-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: '#09090B', opacity: 0, willChange: 'opacity' }} />
      </div>

      {/* ── SVG Filter ── */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="sharpen-alpha" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="1.6" offset="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* ── Custom Navigation Toggle (Burger) ── */}
      {loaderDone && (
        <div className={`page-toggle ${isMenuOpen ? 'is-active' : ''}`}>
          <div data-insert>
            <button
              className={isMenuOpen ? 'is-active' : ''}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      )}

      {/* ── Curtain Drawer Menu Overlay ── */}
      <PageNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenPlayer={() => setIsPlayerOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* ── Floating Glassmorphic Music Player ── */}
      <MusicPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />

      {/* ── Navbar ── */}
      <ScrollHeader
        logoSrc="https://sirup.online/5th/asset/img/header/header-logo.svg"
        socials={[
          { key: 'x', href: '#', svg: SVGS.x },
          { key: 'ig', href: '#', svg: SVGS.ig },
          { key: 'yt', href: '#', svg: SVGS.yt },
          { key: 'sp', href: '#', svg: SVGS.sp },
          { key: 'tk', href: '#', svg: SVGS.tk },
        ]}
        zIndex={100}
      />

      {/* ── Kinetic Physics Engine ── */}
      <KineticScrollProvider>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: HEADER  (section-header)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="section-header" style={{ zIndex: 30 }}>

          {/* Panel dome */}
          <ParallaxLayer parallaxFactor={0} zIndex={10}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(1000 * var(--pv))"
              className="header-panel"
              style={{ width: 'calc(2880 * var(--pv))', height: 'auto' }}
            >
              <div className="panel-container" style={{ position: 'relative', width: '100%', height: 'auto', transformStyle: 'preserve-3d' }}>
                <picture style={{ display: 'block', width: '100%', height: 'auto' }}>
                  <source srcSet="https://sirup.online/5th/asset/img/header/sd/header-panel.webp" media="(max-width: 960px)" type="image/webp" />
                  <img ref={panelRef} src="https://sirup.online/5th/asset/img/header/pc/header-panel.webp" alt=""
                    decoding="async" style={{ width: '100%', height: 'auto', pointerEvents: 'none', willChange: 'transform' }} />
                </picture>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Character */}
          <ParallaxLayer parallaxFactor={0} zIndex={30}>
            <CharacterParallax ref={characterRef} alt="SIRUP" />
          </ParallaxLayer>

          {/* VESLINE logo */}
          <ParallaxLayer parallaxFactor={-2} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              style={{
                position: 'absolute', left: '50%',
                transform: 'translateX(calc(-50% - 19vw))',
                top: 'calc(27vh + 15.2vw)',
                zIndex: 20, pointerEvents: 'none',
                width: '55vw', maxWidth: '1160px', display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                <div ref={headlineVeslineRef} style={{ overflow: 'hidden', pointerEvents: 'none' }}>
                  <div className="vesline-inner" style={{
                    display: 'block', width: '100%', opacity: 0.92,
                    mixBlendMode: 'screen', filter: HERO_SHADOW,
                  }}>
                    <HeroLogo fill="#ffffff" width="100%" maxWidth="none" />
                  </div>
                </div>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Date 2007-2012 */}
          <ParallaxLayer parallaxFactor={-1.5} zIndex={20}>
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '24vh',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vw',
              zIndex: 20, pointerEvents: 'none',
            }}>
              <HoverParallaxCard
                mode="global-tilt" maxTilt={-15} perspective={1920}
                globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
                style={{ pointerEvents: 'none', width: '100%', display: 'block', height: 'auto' }}
              >
                <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                  <div ref={headlineDateRef} style={{ display: 'flex', justifyContent: 'center' }}>
                    <DateSVG date="2007-2012" height="6.5vw" style={{
                      opacity: 0.92, transform: 'translateY(5.8vw) scaleY(1.04)',
                      mixBlendMode: 'screen', filter: HERO_SHADOW,
                    }} />
                  </div>
                </div>
              </HoverParallaxCard>
              {/* spacer for VESLINE */}
              <div aria-hidden="true" style={{ width: '47vw', maxWidth: '1100px', height: '26.44vw', flexShrink: 0, transform: 'translateX(-10vw) translateY(-4.6vw)' }} />
            </div>
          </ParallaxLayer>

          {/* 7th badge */}
          <ParallaxLayer parallaxFactor={-2.5} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              style={{
                position: 'absolute', right: '25vw', top: '57vh',
                zIndex: 20, pointerEvents: 'none',
                width: '12vw', display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}>
                <div ref={seventhRef}>
                  <DateSVG date="7th" height="100%" style={{
                    opacity: 0.92, width: '100%', mixBlendMode: 'screen', filter: HERO_SHADOW,
                  }} />
                </div>
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* Anniversary title + Synapse text */}
          <ParallaxLayer parallaxFactor={-2} zIndex={20}>
            <HoverParallaxCard
              mode="global-tilt" maxTilt={-15} perspective={1920}
              globalRate={0.1} transformOrigin="50% calc(800 * var(--pv))"
              style={{
                position: 'absolute', top: '95vh', left: '50%',
                transform: 'translateX(-50%)', width: '50vw',
                zIndex: 20, display: 'block', height: 'auto',
              }}
            >
              <div className="text-3d-axis" style={{ pointerEvents: 'none', width: '100%', height: 'auto', position: 'relative' }}>
                <img src="https://sirup.online/5th/asset/img/header/pc/header-title-24.svg" alt="2017-2022 5th ANNIVERSARY"
                  style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ position: 'absolute', top: '35px', left: '620px', width: '200px', zIndex: 60 }}>
                  <FocalText>
                    <p style={{
                      margin: 0, padding: 0,
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: '12px', lineHeight: '18px', fontWeight: 400,
                      textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.498021px',
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
              </div>
            </HoverParallaxCard>
          </ParallaxLayer>

          {/* ABOUT title vertical */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '180vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vw',
            zIndex: 40, pointerEvents: 'none',
          }}>
            <img src="/about_title (1).png" alt="ABOUT" style={{ width: '35vw', height: 'auto', opacity: 0.8, transform: 'translateX(36vw) translateY(-6vw) rotate(90deg)' }} />
            <div style={{ width: '52vw', height: 'auto', opacity: 0.8, transform: 'translateX(29vw) translateY(0vw) rotate(90deg)' }}>
              <HeroLogo fill="#ffffff" width="100%" maxWidth="none" />
            </div>
          </div>

          {/* About Photo Strip */}
          <AboutPhotoStrip />

          {/* About Text */}
          <div style={{ position: 'absolute', top: '170vh', left: '11.5vw', width: '280px', zIndex: 60 }}>
            <FocalText>
              <StaggeredTextReveal startTrigger="top 90%" style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '10.5px', fontWeight: 400, lineHeight: 2.0,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', margin: 0,
              }} lines={[
                'ラップと歌を自由に行き来する',
                'ボーカルスタイルと、',
                '自身のルーツであるネオソウル、R&B、ゴスペルと',
                'HIPHOPを融合したジャンルに捉われない音楽で、',
                'イギリス出身の「Years & Years」や',
                'アイリッシュウイスキー「JAMESON」と',
                '国内外問わず様々なアーティストやクリエイターと',
                'コラボレーションも果たすなど',
                '日本を代表するR&Bシンガーとして',
                '音楽のみならず様々な分野で活躍を広げている。'
              ]} />
            </FocalText>
          </div>

          {/* Roots Photo Strip */}
          <RootsPhotoStrip />

          {/* Roots Text */}
          <div style={{ position: 'absolute', top: 'calc(180vw - 925px)', left: '10vw', width: '323px', zIndex: 60 }}>
            <FocalText>
              <StaggeredTextReveal style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '12.5px', fontWeight: 400, lineHeight: 2.2,
                textAlign: 'left', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', margin: 0,
              }} lines={[
                'かつて掘り下げたネオソウルの楽曲から始まり',
                '自身の "歌" のスタイルを確立する上で大きな影響を受けた',
                '同時代のアーティストまで、',
                'ラッパー、R&Bシンガー、バンドなど様々なジャンルのアーティストと',
                '共演するSIRUPを理解するためのヒントとなる楽曲を',
                'プレイリストとして振り返る。'
              ]} />
            </FocalText>
          </div>

          {/* Roots Playlist Button */}
          <div style={{ position: 'absolute', top: 'calc(180vw - 640px)', left: '25vw', zIndex: 60 }}>
            <MagneticBadge
              label={"KEEP IN TOUCH\nPLAYLIST"}
              onClick={() => setIsPlayerOpen(true)}
            />
          </div>

          {/* ROOTS title */}
          <img src="/roots_title.png" alt="ROOTS" style={{
            position: 'absolute', left: '-5vw', top: '195vh',
            width: '60vw', height: 'auto', opacity: 0.8,
            zIndex: 20, pointerEvents: 'none',
          }} />



        </div>{/* end section-header */}

        {/* Rotating Album Showcase Section */}
        <RotatingAlbum />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: MAIN LIVE (ticker banners)
        ═══════════════════════════════════════════════════════════════════ */}
        <MainLiveSection />

        {/* Budokan 3D Box Album Scroll Showcase */}
        <BudokanAlbumScroll />

        {/* DVD Section */}
        <DvdSection />

        {/* Be The Groove Section */}
        <BeTheGrooveSection />

        {/* Setlist Section */}
        <SetlistSection />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION: FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <FooterSection />

      </KineticScrollProvider>

      {/* Noise overlay — always last */}
      <NoiseOverlay />

      {/* Keyframe animations injected globally */}
      <style>{`
        @keyframes footer-tickerL { 0% { transform: translate(0,0); } 100% { transform: translate(-50%,0); } }
        @keyframes footer-tickerR { 0% { transform: translate(0,0); } 100% { transform: translate(50%,0); } }
        @keyframes footer-rotateY { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        #bg-wrapper, #bg-wrapper > div, #bg-wrapper canvas { width:100%!important; height:100%!important; display:block!important; }
        #bg-wrapper > div { flex:1!important; }
        .burger { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; gap:5px; padding:4px; opacity:.85; transition:opacity .2s; }
        .burger:hover { opacity:1; }
        .bar { display:block; width:24px; height:2px; background:#fff; border-radius:1px; }
        .logo { position:absolute; left:50%; transform:translateX(-50%); font-family:'Great Vibes',cursive; font-weight:400; font-size:46px; color:#fff; pointer-events:none; }
        .socials { display:flex; align-items:center; gap:18px; }
        .si { color:rgba(255,255,255,0.55); display:flex; transition:color .2s; }
        .si:hover { color:#fff; }
      `}</style>

    </div>
  );
}
