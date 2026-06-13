// HoverParallaxCard.jsx — v3 (perspective + pointer-events fixed)
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

/**
 * HoverParallaxCard
 *
 * mode="tilt"  — 3D card tilt. Uses two divs: outer catches pointer events
 *               and sets perspective; inner receives rotateX/Y from GSAP.
 *               Rect is cached on mouseenter (not per-frame) to avoid layout flushes.
 *
 * mode="shift" — viewport-relative float driven by window mousemove.
 *               inverse={true} moves OPPOSITE to mouse (counter-parallax depth).
 *
 * enabled={false} — disables all wiring (use during IntroLoader entrance).
 */
export function HoverParallaxCard({
  mode          = 'tilt',
  // --- tilt mode ---
  maxTilt       = 8,
  perspective   = 800,
  scaleOnHover  = 1.04,
  glowOnHover   = false,
  glowShadow    = '0 20px 60px rgba(0,0,0,0.6)',
  // --- shift mode ---
  shiftX        = 6,
  shiftY        = 4,
  shiftDuration = 0.8,
  inverse       = false,
  // --- shared ---
  enabled       = true,
  className,
  style,
  children,
}) {
  const outerRef = useRef(null); // perspective container + pointer event target
  const innerRef = useRef(null); // receives rotateX / rotateY from GSAP

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !enabled) return;

    // (hover:hover) and (pointer:fine) = real mouse, not touch/stylus.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Respect OS reduced-motion preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {

      // ── TILT MODE ──────────────────────────────────────────────────────────
      // GSAP rotates the INNER div. Perspective is on the OUTER div.
      // Rotating the same element that has 'perspective' set does nothing
      // in CSS 3D — perspective must be on a PARENT of the rotating element.
      if (mode === 'tilt' && inner) {
        const rotX = gsap.quickTo(inner, 'rotateX', { duration: 0.6, ease: 'power3' });
        const rotY = gsap.quickTo(inner, 'rotateY', { duration: 0.6, ease: 'power3' });

        // Rect cached once on mouseenter — not recalculated per frame.
        let rectCache = null;

        const onEnter = () => {
          rectCache = outer.getBoundingClientRect();
          gsap.to(inner, {
            scale:    scaleOnHover,
            duration: 0.5,
            ease:     'expo.out',
            ...(glowOnHover ? { boxShadow: glowShadow } : {}),
          });
        };

        const onMove = (e) => {
          if (!rectCache) return;
          const px = (e.clientX - rectCache.left) / rectCache.width  - 0.5;
          const py = (e.clientY - rectCache.top)  / rectCache.height - 0.5;
          rotY( px * maxTilt * 2);
          rotX(-py * maxTilt * 2);
        };

        const onLeave = () => {
          rectCache = null;
          gsap.to(inner, {
            rotateX:  0,
            rotateY:  0,
            scale:    1,
            duration: 0.6,
            ease:     'expo.out',
            ...(glowOnHover ? { boxShadow: '0 0px 0px rgba(0,0,0,0)' } : {}),
          });
        };

        outer.addEventListener('mouseenter', onEnter);
        outer.addEventListener('mousemove',  onMove);
        outer.addEventListener('mouseleave', onLeave);

        return () => {
          outer.removeEventListener('mouseenter', onEnter);
          outer.removeEventListener('mousemove',  onMove);
          outer.removeEventListener('mouseleave', onLeave);
        };
      }

      // ── SHIFT MODE ─────────────────────────────────────────────────────────
      // Window-level listener — works with pointerEvents:'none' on element.
      const xTo = gsap.quickTo(outer, 'x', { duration: shiftDuration,       ease: 'power3' });
      const yTo = gsap.quickTo(outer, 'y', { duration: shiftDuration + 0.2, ease: 'power3' });
      const dir = inverse ? -1 : 1;

      const onWinMove = (e) => {
        const nx = e.clientX / window.innerWidth  - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        xTo(nx * shiftX * 2 * dir);
        yTo(ny * shiftY * 2 * dir);
      };

      window.addEventListener('mousemove', onWinMove, { passive: true });
      return () => window.removeEventListener('mousemove', onWinMove);

    }, outerRef);

    return () => ctx.revert();
  }, [
    enabled, mode, maxTilt, perspective, scaleOnHover, glowOnHover, glowShadow,
    shiftX, shiftY, shiftDuration, inverse,
  ]);

  // ── TILT: outer = perspective shell + pointer target
  //         inner = the div that actually rotates
  if (mode === 'tilt') {
    return (
      <div
        ref={outerRef}
        className={className}
        style={{
          perspective:   `${perspective}px`,
          pointerEvents: 'auto',
          width:         '100%',
          height:        '100%',
          isolation:     'isolate', // ✅ AI-1 Fix: own stacking context so ancestor skewY can't corrupt the 3D context
          ...style,
        }}
      >
        <div
          ref={innerRef}
          style={{
            width:          '100%',
            height:         '100%',
            transformStyle: 'preserve-3d',
            willChange:     'transform',
            transformOrigin: 'center center',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // ── SHIFT: single div, window-level listener, no pointer events needed
  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        willChange:    'transform',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default HoverParallaxCard;
