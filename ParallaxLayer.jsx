import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useKineticScroll } from './KineticScrollProvider.jsx'; // Corrected import path

export function ParallaxLayer({ 
  children, 
  speed = 0.1, 
  zIndex = 10, 
  skewFactor = 0,
  limit = null // 🚨 THE BRAKE PEDAL: Tell it exactly when to freeze (in pixels)
}) {
  const layerRef = useRef(null);
  const { lerpY, velocity } = useKineticScroll();
  const prevTransform = useRef('');

  useEffect(() => {
    const tick = () => {
      if (!layerRef.current) return;

      // 1. Calculate the normal parallax movement
      let yOffset = -(lerpY.current * speed);

      // 2. 🚨 THE HARD STOP MATH
      // If the character moves too far up or down, we clamp the math and freeze him in place!
      if (limit !== null) {
        if (yOffset > limit) yOffset = limit;
        if (yOffset < -limit) yOffset = -limit;
      }

      // 3. Apply the velocity skew
      let skewDeg = 0;
      if (skewFactor !== 0) {
        skewDeg = velocity.current * skewFactor;
      }

      const transformString = `translate3d(0, ${yOffset}px, 0) skewY(${skewDeg}deg)`;

      if (transformString !== prevTransform.current) {
        layerRef.current.style.transform = transformString;
        prevTransform.current = transformString;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, skewFactor, limit, lerpY, velocity]);

  return (
    <div 
      ref={layerRef} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: zIndex,
        willChange: 'transform',
        pointerEvents: 'none' 
      }}
    >
      {children}
    </div>
  );
}
