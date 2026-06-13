import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const KineticScrollContext = createContext({
  lerpY:     { current: 0 },
  targetY:   { current: 0 },
  velocity:  { current: 0 },
  addTick:    () => {},
  removeTick: () => {},
});

export function useKineticScroll() {
  return useContext(KineticScrollContext);
}

const LERP_WEIGHT = 0.025; // Lower weight = more drift/inertia
const FRAME_BASE = 1000 / 60; // 16.67ms
const SNAP_THRESH = 0.05; // Stops micro-stuttering

function lerpDT(current, target, dt) {
  const alpha = 1 - Math.pow(1 - LERP_WEIGHT, dt / FRAME_BASE);
  return current + (target - current) * alpha;
}

export function KineticScrollProvider({ children }) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);

  const lerpY         = useRef(0);
  const targetY        = useRef(0);
  const velocity       = useRef(0);
  const lastTime       = useRef(performance.now());
  const rafId          = useRef(null);
  // ✅ FIX 5: Registry for child tick callbacks — called inside our RAF after velocity is written
  const tickCallbacks  = useRef(new Set());

  const addTick    = useCallback((fn) => { tickCallbacks.current.add(fn); },    []);
  const removeTick = useCallback((fn) => { tickCallbacks.current.delete(fn); }, []);

  // 1. Sync Native Body Height to Virtual Content Height
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      document.body.style.height = `${Math.ceil(h)}px`;
    });

    observer.observe(content);
    return () => {
      observer.disconnect();
      document.body.style.height = '';
    };
  }, []);

  // 2. Capture Native Scroll Velocity smoothly
  useEffect(() => {
    const handleScroll = () => {
      targetY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. The Pure Math Render Loop (Zero GSAP Dependency)
  useEffect(() => {
    const tick = (now) => {
      const dt = Math.min(now - lastTime.current, 50);
      lastTime.current = now;

      const prev = lerpY.current;
      const next = lerpDT(prev, targetY.current, dt);
      lerpY.current = next;

      // ✅ FIX 1: Normalize velocity by dt so it's FRAME-RATE INDEPENDENT.
      // Before: velocity = next - prev  → 2.4x weaker on 144Hz than 60Hz.
      // After:  divide by (dt / FRAME_BASE) → identical skew on all devices.
      velocity.current = (next - prev) / (dt / FRAME_BASE);

      if (Math.abs(lerpY.current - targetY.current) < SNAP_THRESH) {
        lerpY.current = targetY.current;
        velocity.current = 0;
      }

      if (contentRef.current) {
        // GPU-Accelerated 3D Translation
        contentRef.current.style.transform = `translate3d(0, ${-lerpY.current}px, 0)`;
      }

      // ✅ FIX 5: Call all registered child ticks AFTER velocity is final for this frame.
      // Photo strips, ParallaxLayer skews, etc. all read fresh velocity here.
      tickCallbacks.current.forEach(fn => fn());

      // Keep ScrollTrigger in sync with lerpY every frame
      ScrollTrigger.update();

      rafId.current = requestAnimationFrame(tick);
    };

    // Tell ScrollTrigger to read lerpY.current instead of window.scrollY.
    // Without this, triggers fire against the native scroll target (ahead of
    // the visual position), causing reveals to fire too early or never.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop() {
        return lerpY.current;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
    ScrollTrigger.defaults({ scroller: document.body });

    // ✅ FIX 2A: When ScrollTrigger is about to refresh (e.g. on resize),
    // snap lerpY to targetY so trigger positions are calculated against
    // the real visual position, not a stale lerped one.
    const onRefreshInit = () => {
      lerpY.current = targetY.current;
    };
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

    // ✅ FIX 2B: Call refresh() once after fonts + layout settle.
    // Great Vibes and DM Sans reflow the layout after the first frame.
    // Without this, every trigger fires at the wrong pixel position.
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    rafId.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId.current);
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
      ScrollTrigger.scrollerProxy(document.body, null);
    };
  }, []);

  return (
    <KineticScrollContext.Provider value={{ lerpY, targetY, velocity, addTick, removeTick }}>
      {/* THE FIXED VIEWPORT SHELL */}
      <div
        ref={viewportRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1, // Sits exactly 1 layer above the background canvas
        }}
      >
        {/* THE MOVING TRACK */}
        <div ref={contentRef} style={{ willChange: 'transform' }}>
          {children}
        </div>
      </div>
    </KineticScrollContext.Provider>
  );
}

export default KineticScrollProvider;
