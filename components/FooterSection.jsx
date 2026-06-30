import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ─── Footer Section ────────────────────────────────────────────────────────────
function FooterSection() {
  const containerRef = useRef(null);
  const debutRef = useRef(null);
  const sepRef = useRef(null);
  const nextRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    let dest = 0;
    let value = 0;
    const rate = 0.1;

    let isInitialActive = true;
    let isHoveringPanel = false;

    const onMouseMove = (e) => {
      dest = (e.clientX / window.innerWidth - 0.5) * 15;
      if (isInitialActive && !isHoveringPanel) {
        isInitialActive = false;
        if (panelRef.current) {
          panelRef.current.classList.remove('is-active');
        }
      }
    };

    const onMouseEnter = () => {
      isHoveringPanel = true;
      isInitialActive = false;
      if (panelRef.current) {
        panelRef.current.classList.add('is-active');
      }
    };

    const onMouseLeave = () => {
      isHoveringPanel = false;
      if (panelRef.current) {
        panelRef.current.classList.remove('is-active');
      }
    };

    let rafId;
    const update = () => {
      value += (dest - value) * rate;
      if (panelRef.current) {
        const targets = panelRef.current.querySelectorAll('[data-preserve-r]');
        targets.forEach(el => {
          el.style.transform = `perspective(480px) rotateY(${value}deg)`;
        });
      }
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(update);

    const linkEl = panelRef.current ? panelRef.current.querySelector('.footer-panel-link') : null;
    if (linkEl) {
      linkEl.addEventListener('mouseenter', onMouseEnter);
      linkEl.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      if (linkEl) {
        linkEl.removeEventListener('mouseenter', onMouseEnter);
        linkEl.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  useGSAP(() => {
    // Debut SVGs stagger reveal
    if (debutRef.current) {
      const items = debutRef.current.querySelectorAll('.debut-item');
      gsap.set(items, { opacity: 0, scaleY: 0, transformOrigin: 'center bottom' });
      ScrollTrigger.create({
        trigger: debutRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(items, { opacity: 1, scaleY: 1, duration: 1.0, ease: 'power3.out', stagger: 0.05 }),
      });
    }
    // Separate spinner reveal
    if (sepRef.current) {
      gsap.set(sepRef.current, { opacity: 0, y: '12.5vh' });
      ScrollTrigger.create({
        trigger: sepRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(sepRef.current, { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' }),
      });
    }
    // NEXT SVG reveal
    if (nextRef.current) {
      gsap.set(nextRef.current, { opacity: 0, y: '12.5vh' });
      ScrollTrigger.create({
        trigger: nextRef.current, start: 'top 85%', once: true,
        onEnter: () => gsap.to(nextRef.current, { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' }),
      });
    }
    // Panel reveal and parallax
    if (panelRef.current) {
      ScrollTrigger.create({
        trigger: panelRef.current,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          panelRef.current.classList.add('is-trigger', 'is-active');
        },
      });

      const parallaxTarget = panelRef.current.querySelector('[data-parallax]');
      if (parallaxTarget) {
        const factor = parseFloat(parallaxTarget.getAttribute('data-parallax') || '27');
        gsap.from(parallaxTarget, {
          y: () => window.innerWidth < 1920
            ? factor * (window.innerWidth / 1920) * 50
            : factor * 50,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          }
        });
      }
    }

    // Blackout overlay triggered by Budokan Album section
    ScrollTrigger.create({
      trigger: '.budokan-album-scroll',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('.vanta-front', { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
      onLeave: () => gsap.to('.vanta-front', { opacity: 0, duration: 1.0, ease: 'power2.out' }),
      onEnterBack: () => gsap.to('.vanta-front', { opacity: 0.8, duration: 1.0, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to('.vanta-front', { opacity: 0, duration: 1.0, ease: 'power2.out' }),
    });
  });

  return (
    <div ref={containerRef} className="section-footer-wrap" style={{ marginTop: '4vh' }}>

      {/* Debut SVGs */}
      <div ref={debutRef} className="footer-debut-wrap">
        {['footer-debut-1.svg', 'footer-debut-2.svg', 'footer-debut-3.svg'].map((f, i) => (
          <div key={i} className="debut-item" style={{ display: 'block', position: 'absolute', left: 0, bottom: 0, width: '100%' }}>
            <img src={`/asset/img/footer/${f}`} alt="" style={{ display: 'block', width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>

      {/* Separate spinning icon */}
      <div ref={sepRef} className="footer-sep-wrap">
        <img src="/asset/img/footer/footer-separate.svg" alt="" style={{
          display: 'block', width: '100%', height: 'auto',
          animation: 'footer-rotateY 2.0s linear infinite',
        }} />
      </div>

      {/* NEXT arrow */}
      <div ref={nextRef} className="footer-next-wrap">
        <img src="/asset/img/footer/footer-next.svg" alt="NEXT" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>

      {/* Footer Tickers */}
      <div className="footer-ticker-row-1">
        <div className="footer-ticker-track-1" />
      </div>
      <div className="footer-ticker-row-2">
        <div className="footer-ticker-track-2" />
      </div>

      {/* Footer Panel — rotating 3D card */}
      <div ref={panelRef} className="footer-panel">
        <div data-insert>
          <div data-parallax="27" style={{ width: '100%', height: '100%' }}>
            <div className="panel">
              <div data-preserve-r>
                <div data-preserve-axis className="preserve-axis">
                  <span>
                    <img src="/asset/img/footer/footer-panel-1.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                </div>
              </div>
            </div>
            <div className="panel">
              <div data-preserve-r>
                <div data-preserve-axis className="preserve-axis">
                  <span>
                    <img src="/asset/img/footer/pc/footer-panel-2.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="footer-panel-link"
          style={{
            display: 'block', position: 'absolute', left: 0, bottom: 0,
            width: '100%', height: '100%', borderRadius: '100vw 100vw 0 0',
            overflow: 'hidden', zIndex: 10, cursor: 'pointer'
          }}
        />
      </div>

      {/* Footer Links (bottom left) */}
      <div className="footer-links">
        {[
          { label: 'SIRUP OFFICIAL SITE', href: 'https://sirup.online' },
          { label: 'CHANNEL SRP', href: 'https://subscription.app.c-rayon.com/app/sirup/home' },
        ].map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-link-text">
            {label}
          </a>
        ))}
      </div>

      {/* Copyright (bottom center-right) */}
      <div className="footer-copyright">
        &copy; SIRUP {new Date().getFullYear()}
      </div>

      {/* Social icons (bottom right) */}
      <div className="footer-socials">
        {[
          { alt: 'Twitter/X', src: '/asset/img/icon-twitter.svg', href: 'https://twitter.com/IamSIRUP' },
          { alt: 'Instagram', src: '/asset/img/icon-instagram.svg', href: 'https://www.instagram.com/sirup_insta/' },
          { alt: 'YouTube', src: '/asset/img/icon-youtube.svg', href: 'https://www.youtube.com/channel/UCT0DEDLRQmlcBE93gLzWJ5A/featured' },
          { alt: 'Apple Music', src: '/asset/img/icon-apple.svg', href: 'https://music.apple.com/jp/artist/sirup/1281420386' },
          { alt: 'Spotify', src: '/asset/img/icon-spotify.svg', href: 'https://open.spotify.com/artist/1HzcHe0WFm4koBalCEOkVh' },
        ].map(({ alt, src, href }) => (
          <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <img src={src} alt={alt} style={{ width: 'auto', height: '100%', filter: 'invert(1)' }} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default FooterSection;
