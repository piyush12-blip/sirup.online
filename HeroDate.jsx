/**
 * HeroDate.jsx
 *
 * Anniversary SVG component matching 'header-title-23.svg'.
 * - Text fill: white (#ffffff) via prop
 * - viewBox cropped to 2730 710 230 395 to eliminate Illustrator canvas margins.
 */

export default function HeroDate({ fill = '#ffffff', width = '25vw', maxWidth = '400px', scaleX = 1.0, scaleY = 1.0 }) {
  return (
    <div style={{ width, maxWidth, margin: '0 auto', transform: `scaleX(${scaleX}) scaleY(${scaleY})`, transformOrigin: 'center' }}>
      <svg
        viewBox="2730 710 230 395"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <path
          id="ANNIVERSARY"
          fillRule="evenodd"
          clipRule="evenodd"
          fill={fill}
          style={{ opacity: 0.88 }}
          d="M2744.35,1094.35h147.89c-2.95-2.78-8.68-5.04-10.76-22.74c-1.39-11.46-1.73-14.93-2.08-33.85c0-20.13,30.2-81.06,51.9-129.315c13.88-30.2,30.9-60.059,33.85-63.009H2826.8c2.78,2.95,19.62,37.666,30.9,69.084c11.8,31.591,15.97,43.742,16.32,57.455c0.69,12.5-5.21,28.115-7.47,33.155c-14.92-49.125-49.99-128.277-62.83-159.694h-132.27c2.78,2.95,19.96,32.806,33.85,63.009c21.52,48.255,51.9,109.185,51.9,129.315c-0.52,18.92-0.87,22.39-2.26,33.85C2753.21,1089.31,2747.13,1091.57,2744.35,1094.35L2744.35,1094.35z"
        />
      </svg>
    </div>
  );
}
