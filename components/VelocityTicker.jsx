import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from '../KineticScrollProvider.jsx';

// ─── Velocity Ticker Component ────────────────────────────────────────────────
function VelocityTicker({ baseSpeed = 0.4, direction = 1, opacity = 1, children }) {
  const trackRef = useRef(null);
  const xPos = useRef(0);
  const { velocity } = useKineticScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let oneWidth = 0;

    // Use ResizeObserver to measure repeating segment width dynamically
    const observer = new ResizeObserver(() => {
      oneWidth = track.scrollWidth / 3;
    });
    observer.observe(track);

    // Also monitor image loading to recalculate
    const imgs = track.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.complete) {
        oneWidth = track.scrollWidth / 3;
      } else {
        img.addEventListener('load', () => {
          oneWidth = track.scrollWidth / 3;
        }, { once: true });
      }
    });

    function tick() {
      if (oneWidth === 0) {
        oneWidth = track.scrollWidth / 3;
        return;
      }

      // Velocity adds urgency — magnitude only (abs), direction from prop
      const scrollBoost = Math.abs(velocity.current) * 0.6;
      const advance = (baseSpeed + scrollBoost) * direction;

      xPos.current += advance;

      // Seamless loop
      if (direction < 0 && xPos.current <= -oneWidth) xPos.current += oneWidth;
      if (direction > 0 && xPos.current >= 0)        xPos.current -= oneWidth;

      track.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
    }

    gsap.ticker.add(tick);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [baseSpeed, direction, velocity]);

  return (
    <div style={{ overflow: 'hidden', width: '100%', opacity, display: 'flex', alignItems: 'center', height: '100%' }}>
      <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {/* 3 copies — covers any viewport without seam */}
        {[0, 1, 2].map(i => (
          <span key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{children}</span>
        ))}
      </div>
    </div>
  );
}

export default VelocityTicker;
