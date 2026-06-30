import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useKineticScroll } from '../KineticScrollProvider.jsx';

gsap.registerPlugin(ScrollTrigger);

// ─── Roots Photo Strip ─────────────────────────────────────────────────────────
function RootsPhotoStrip() {
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const { velocity, addTick, removeTick } = useKineticScroll();

  useEffect(() => {
    if (!stripRef.current) return;
    const setSkew = gsap.quickSetter(stripRef.current, 'skewY', 'deg');
    let lastSkew = null;
    const tick = () => {
      if (!stripRef.current) return;
      const v = velocity.current * 0.04;
      const skew = Math.abs(v) < 0.01 ? 0 : v;
      if (skew !== lastSkew) { setSkew(skew); lastSkew = skew; }
    };
    addTick(tick);
    return () => removeTick(tick);
  }, [velocity, addTick, removeTick]);

  useGSAP(() => {
    if (!stripRef.current) return;
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach(card => {
      gsap.set(card, { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 });
      const overlay = card.querySelector('[data-overlay]');
      if (overlay) gsap.set(overlay, { scaleY: 0, opacity: 1, transformOrigin: 'bottom center' });
    });
    ScrollTrigger.create({
      trigger: stripRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          const delay = i * 0.07;
          gsap.to(card, { scaleY: 1, opacity: 1, duration: 1.0, ease: 'power3.out', delay });
          const overlay = card.querySelector('[data-overlay]');
          if (overlay) {
            gsap.to(overlay, { scaleY: 1, duration: 1.0, ease: 'power3.out', delay });
            gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power1.inOut', delay: delay + 1.0 });
          }
        });
      },
    });

    cards.forEach((card, i) => {
      const parallaxEx = i * 80;
      const target = card.querySelector('[data-parallax-ex]');
      if (!target) return;

      gsap.to(target, {
        y: () => parallaxEx * (stripRef.current.clientHeight / 560),
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });
  }, { scope: stripRef });

  const offsets = [-80, -40, 0, 40];

  return (
    <div ref={stripRef} className="roots-photo" style={{
      position: 'absolute', top: '260vh', right: '9vw',
      display: 'flex', gap: '2px', zIndex: 60,
      willChange: 'transform', pointerEvents: 'none',
    }}>
      {offsets.map((offset, i) => (
        <div key={i} ref={el => cardRefs.current[i] = el} className="photo photo-strip-card">

          <div data-insert style={{ height: '100%' }}>
            <div data-parallax-ex={i * 80} style={{ height: '100%', position: 'relative' }}>
              <span style={{ display: 'block', position: 'absolute', left: 0, width: '100%', bottom: `calc(${offset} * var(--pv))` }}>
                <img src="https://sirup.online/5th/asset/img/header/header-roots-photo.webp" alt="" style={{
                  display: 'block', width: '100%', height: 'auto', willChange: 'transform',
                }} />
                <div data-overlay="true" style={{
                  position: 'absolute', inset: 0, background: '#E03200',
                  mixBlendMode: 'overlay', pointerEvents: 'none', transformOrigin: 'bottom center',
                }} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RootsPhotoStrip;
