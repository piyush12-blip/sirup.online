import React, { useState } from 'react';
import VelocityTicker from './VelocityTicker.jsx';

// ─── Main Live Ticker Section ──────────────────────────────────────────────────
function MainLiveSection() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div className="section-main-live" style={{ marginBottom: '4vh' }}>
      {/* Ticker 1 — moves right, dim */}
      <div className="live-ticker-row-1">
        <VelocityTicker baseSpeed={0.35} direction={1} opacity={0.4}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            className="live-ticker-img"
          />
        </VelocityTicker>
      </div>

      {/* Ticker 2 — moves left, bright */}
      <div className="live-ticker-row-2">
        <VelocityTicker baseSpeed={0.5} direction={-1} opacity={1.0}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            className="live-ticker-img"
          />
        </VelocityTicker>
      </div>

      {/* Ticker 3 — moves right, semi */}
      <div className="live-ticker-row-3">
        <VelocityTicker baseSpeed={0.4} direction={1} opacity={0.7}>
          <img
            src="https://sirup.online/5th/asset/img/ticker.svg"
            alt="SIRUP LIVE"
            className="live-ticker-img"
          />
        </VelocityTicker>
      </div>

      {/* Central CTA Button — exactly between Row 2 and Row 3 */}
      <div className="live-cta-wrap">
        <button
          data-cursor="hover"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            background: btnHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
            fontFamily: "'Termina', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '14px 32px',
            cursor: 'none',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
            transform: btnHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          LIVE ARCHIVE
        </button>
      </div>
    </div>
  );
}

export default MainLiveSection;
