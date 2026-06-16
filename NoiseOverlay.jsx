import { useEffect, useRef } from 'react';

/**
 * NoiseOverlay.jsx (Real Film Grain Rumble Overlay)
 * 
 * Recreates the exact film grain rumble from sirup.online:
 * 1. Loads the original transparent rumble.webp noise texture.
 * 2. Uses a requestAnimationFrame loop to randomly jitter the overlay
 *    in x and y (by up to 50px) on every frame.
 * 3. Automatically disables and suspends GPU updates on mobile screens (width < 960px)
 *    to preserve battery and performance, matching the media queries.
 */
export default function NoiseOverlay() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    let animFrameId = null;

    const tick = () => {
      // Jitter top/left between -100px and -50px randomly on each frame
      el.style.top = `${50 * Math.random() - 100}px`;
      el.style.left = `${50 * Math.random() - 100}px`;
      animFrameId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      // Suspend animation on mobile screens matching the media query max-width: 959px
      if (window.innerWidth >= 960) {
        if (!animFrameId) {
          tick();
        }
      } else {
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
        el.style.top = '';
        el.style.left = '';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial trigger

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="page-rumble"
      aria-hidden="true"
    />
  );
}
