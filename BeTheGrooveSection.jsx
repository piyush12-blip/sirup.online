import React from 'react';

export default function BeTheGrooveSection() {
  return (
    <div className="container-be" id="be">
      
      {/* Title section */}
      <div className="be-title">
        <h2>
          <span><img src="/setlist/be-title-1-pc.svg" alt="BE THE GROOVE" /></span>
          <span><img src="/setlist/be-title-2-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-3-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-4-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-5-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-6-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-7-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-8-pc.svg" alt="" /></span>
          <span><img src="/setlist/be-title-9-pc.svg" alt="" /></span>
        </h2>
      </div>

      {/* Main Image */}
      <div className="be-photo">
        <img src="/setlist/be-the-groove.png" alt="BE THE GROOVE Live Video Release" />
      </div>

      {/* Catch text */}
      <div className="be-catch">
        <p>SIRUP武道館公演「Roll & Bounce」よりライブ映像『BE THE GROOVE (Roll & Bounce Live at BUDOKAN)』を配信中！</p>
      </div>

      {/* Description & Release Details */}
      <div className="be-lead">
        <p>
          2022年11月11日（金）に開催されたSIRUP武道館公演「Roll & Bounce」より、アンコールで披露した “BE THE GROOVE” のライブ映像を配信中！
          <br /><br />
          Apple Music / LINE MUSIC / Amazon Music限定で、2022年12月28日(水)より配信中！
          <br /><br />
          ＜Release Information＞
          <br />
          <strong>SIRUP『BE THE GROOVE (Roll & Bounce Live at BUDOKAN)』</strong>
          <br />
          2022.12.28(wed) Digital Release
        </p>
      </div>

      {/* Digital Streaming Links */}
      <div className="be-link">
        <ul>
          <li>
            <a href="https://music.apple.com/jp/music-video/be-the-groove-roll-bounce-live-at-budokan-live-video/1660006541" target="_blank" rel="noopener noreferrer">
              <img src="/setlist/link-apple-pc.png" alt="Apple Music" />
            </a>
          </li>
          <li>
            <a href="https://lin.ee/iLsr2xw" target="_blank" rel="noopener noreferrer">
              <img src="/setlist/link-line-pc.png" alt="LINE MUSIC" />
            </a>
          </li>
          <li>
            <a href="https://music.amazon.co.jp/videos/B0BQ6ZD4SZ?ref=dm_sh_dbQ2DBGoeCS7Wgp0ODbQKFdF5" target="_blank" rel="noopener noreferrer">
              <img src="/setlist/link-amazon-pc.png" alt="Amazon Music" />
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
