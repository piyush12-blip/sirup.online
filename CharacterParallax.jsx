/**
 * CharacterParallax.jsx
 *
 * Correct architecture for a clipped foreground character over a panel.
 *
 * PROBLEM SOLVED:
 *   If the clip container moves at a different speed than the background panel,
 *   the clip boundary visually detaches from the panel dome — a floating
 *   rectangle artifact appears between the dome edge and the clip.
 *
 *   Solution: clip container moves at SAME speed as panel (speed=0.08).
 *   The image INSIDE the clip gets an additional inner Y offset, creating
 *   parallax depth without breaking the framing.
 *
 * BUG FIX vs original CharacterParallax.jsx from audit:
 *   The original ticker wrote img.style.transform directly:
 *     img.style.transform = `translate3d(-50%, ${-innerY}px, 0)`;
 *   This conflicts with GSAP entrance animation which ALSO manages transform
 *   via xPercent/yPercent. They fight every frame — entrance jitters or fails.
 *
 *   Fix: use gsap.quickSetter(img, 'y', 'px') so GSAP manages ALL transform
 *   components (xPercent, yPercent, y) in its internal cache — no conflict.
 *
 * USAGE in App.jsx:
 *
 *   import CharacterParallax from './CharacterParallax';
 *
 *   // BEFORE:
 *   <ParallaxLayer speed={0.15} zIndex={10} skewFactor={0.05}>
 *     <div style={{ overflow:'hidden', width:'75vw', height:'148vw', ... }}>
 *       <img ref={characterRef} src="/character.webp" />
 *     </div>
 *   </ParallaxLayer>
 *
 *   // AFTER:
 *   <ParallaxLayer speed={0.08} zIndex={10} skewFactor={0.05}>
 *     <CharacterParallax
 *       ref={characterRef}
 *       src="/character.webp"
 *       width="75vw"
 *       height="148vw"
 *       top="calc(40vh - 8vw)"
 *       innerParallax={0.08}
 *     />
 *   </ParallaxLayer>
 *
 * Props:
 *   src            {string}  Character image source (must be same-origin)
 *   ref            {ref}     Forwarded to <img> — GSAP entrance animations unchanged
 *   width          {string}  Clip container width. Default: '75vw'
 *   height         {string}  Clip container height. Default: '148vw'
 *   top            {string}  Container top offset. Default: 'calc(40vh - 8vw)'
 *   alt            {string}  Image alt text. Default: 'Artist'
 *   innerParallax  {number}  Extra inner Y drift (0–0.15). Default: 0.08
 */

import { useRef, useEffect, forwardRef } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from './KineticScrollProvider';

const CharacterParallax = forwardRef(function CharacterParallax(
  {
    src,
    width         = '75vw',
    height        = '148vw',
    top           = 'calc(40vh - 8vw)',
    alt           = 'Artist',
    innerParallax = 0.08,
    style,
  },
  forwardedRef,
) {
  const { lerpY }  = useKineticScroll();
  const localRef   = useRef(null);

  // Use forwarded ref (for GSAP entrance in App.jsx) — fallback to localRef
  const imgRef = forwardedRef || localRef;

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // gsap.quickSetter writes GSAP's internal y (px) property.
    // GSAP composes this with xPercent/yPercent from the entrance animation
    // into a single transform string — no conflict, no fighting.
    const setY = gsap.quickSetter(img, 'y', 'px');

    img.style.willChange = 'transform';

    let prevInnerY = null;

    function tick() {
      const innerY = -(lerpY.current * innerParallax);
      if (innerY === prevInnerY) return;
      prevInnerY = innerY;
      setY(innerY);
    }

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      if (img) img.style.willChange = 'auto';
    };
  }, [lerpY, innerParallax, imgRef]);

  return (
    // CLIP CONTAINER — overflow:hidden frames the character
    // This div moves with the OUTER ParallaxLayer at speed=0.08
    // Stays aligned with the panel dome at all scroll depths
    <div style={{
      position:      'absolute',
      left:          '50%',
      transform:     'translateX(-50%)',
      top,
      width,
      height,
      overflow:      'hidden',
      pointerEvents: 'none',
      ...style,
    }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        decoding="async"
        style={{
          position:      'absolute',
          left:          '50%',
          top:           '8vw',
          width:         '100%',
          height:        'auto',
          pointerEvents: 'none',
          // transform is managed exclusively by GSAP (quickSetter + entrance animation)
          // Do NOT set transform here — GSAP owns it
        }}
      />
    </div>
  );
});

export default CharacterParallax;
