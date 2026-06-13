/**
 * NoiseOverlay.jsx ── v3
 *
 * A bulletproof, high-performance, GPU-accelerated film grain overlay.
 * Uses a pre-baked canvas noise sprite animated via CSS background-position.
 *
 * Injections & Rendering fixes:
 * 1. Keyframes are rendered inside an inline React <style> tag to prevent HMR and DOM timing issues.
 * 2. mixBlendMode is set to 'overlay' with OPACITY 0.25 to ensure the grain is clearly visible on
 *    dark backgrounds, text elements, and the character image.
 * 3. backgroundSize scales to SPRITE_H to prevent the mathematical alignment bug that makes the grain static.
 */

import { useEffect, useRef } from 'react';

const TILE_W     = 150;   // Finer, high-frequency grain dots
const TILE_H     = 150;
const NUM_FRAMES = 10;
const FPS        = 12;    // Cinematic, tactile filmic stutter (slightly slower for analog weight)
const OPACITY    = 0.12;  // Increased for a richer, more tactile cinematic film grain

const DURATION_S = NUM_FRAMES / FPS;
const SPRITE_H   = TILE_H * NUM_FRAMES;

export default function NoiseOverlay() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Generate the noise sprite sheet once on mount
    const canvas = document.createElement('canvas');
    canvas.width  = TILE_W;
    canvas.height = SPRITE_H;

    const ctx  = canvas.getContext('2d');
    const data = ctx.createImageData(TILE_W, SPRITE_H);
    const buf  = data.data;

    // Fill every pixel with high-frequency monochrome noise
    for (let i = 0; i < buf.length; i += 4) {
      const v  = (Math.random() * 256) | 0;
      buf[i]   = v;  // R
      buf[i+1] = v;  // G
      buf[i+2] = v;  // B
      buf[i+3] = 255; // A (Fully opaque, controlled via element opacity)
    }

    ctx.putImageData(data, 0, 0);
    const dataURL = canvas.toDataURL('image/png');

    overlay.style.backgroundImage = `url(${dataURL})`;
    overlay.style.backgroundSize  = `${TILE_W}px ${SPRITE_H}px`;
    overlay.style.animation       = `noiseShift ${DURATION_S}s steps(${NUM_FRAMES}, end) 0s infinite`;
  }, []);

  return (
    <>
      <style>{`
        @keyframes noiseShift {
          from { background-position: 0px 0px; }
          to   { background-position: ${TILE_W}px -${SPRITE_H}px; }
        }
      `}</style>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:          0,
          width:         '100%',
          height:        '100%',
          zIndex:         9999,
          pointerEvents: 'none',
          mixBlendMode:  'overlay',  // Guaranteed visibility across dark, mid, and highlight tones
          opacity:        OPACITY,
          willChange:    'background-position',
          transform:     'translateZ(0)', // Force GPU layer promotion
        }}
      />
    </>
  );
}
