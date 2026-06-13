# SIRUP 5th Anniversary — Pixel-by-Pixel Analysis & Implementation Plan

## REFERENCE SCREENSHOTS BREAKDOWN

---

### SCREENSHOT 5 (Full hero, top of page — 1:07 AM)
> This is the ground truth for the hero section.

| Element | Real Site | Our Code | Status |
|---|---|---|---|
| **Header hamburger** | 3 CSS-drawn horizontal lines, top-left | Unicode `≡` symbol | ❌ Wrong glyph style |
| **SIRUP logo** | Custom white script font, centered | Caveat font, centered | ⚠️ Close, verify weight |
| **Social icons** | 5 icons: Twitter bird, IG circle, YouTube rect, music note, Spotify circle | SVG icons | ✅ OK |
| **Left edge text** | "BLU-RAY & DVD NOW ON SALE!" CCW, white, fixed left | Same | ✅ OK |
| **Right edge text** | "SCROLL" CW, very faint, fixed right | Same | ✅ OK |
| **Background shape** | FULL CIRCLE ~72vw diameter, indigo/slate (#353575 approx), center ~40vh from top | Semicircle only | ❌ CRITICAL BUG |
| **"2017-2022"** | ~22vw font size, starts ~left edge, top ~12vh, white bold serif | 16vw | ❌ Too small |
| **"5th"** | ~32vw font size, right side, overlaps circle, italic serif | 22vw | ❌ Too small |
| **"date caption"** | ~left-center, small white text, at ~35vh | Same | ✅ OK |
| **Character** | Head at ~12vh, face forward, lit dramatically | Same | ✅ OK |
| **"ANNIVERSARY"** | ~14.5vw, full-width bleed, at ~68vh, z:5 (char overlaps) | 15.2vw | ⚠️ Position off |

---

### SCREENSHOT 2 (Hero section, slight scroll — 1:07 AM)
> Confirms hero geometry more clearly.

| Element | Real Site observation |
|---|---|
| Circle | The full circle is clearly visible — LEFT half visible, center behind character head/shoulder |
| Circle color | Medium indigo — NOT very dark. Closer to #3a3a6a / #404080 |
| "2017-2022" | Clearly positioned ABOVE the circle top edge — the text is at Z1 (behind circle) |
| "5th" | Sits partially behind character right side, partially overlapping circle top-right |
| Character | Upper body covers the "2017" portion — text IS behind him |
| "ANNIVERSARY" | Bottom of viewport, character torso overlaps it — text is at same level as lower chest |
| Left "BLU-RAY" text | Fixed, reads CCW, appears at about 20-70% viewport height |

---

### SCREENSHOT 1 (Scrolled mid — 1:10 AM)
> Shows the mid-section between hero and ROOTS.

| Element | Real Site | Our Code | Status |
|---|---|---|---|
| **Left 4 thumbnails** | Horizontal row, LEFT side, at character hip/waist level (~55vh from top of canvas), each thumb is ~portrait ratio (taller than wide), ZERO gap | Horizontal row | ⚠️ Need sizing check |
| **Each thumbnail size** | Approx 100-120px wide × 140-160px tall (portrait) | 7vw × 7vw (square) | ❌ Should be portrait ratio |
| **JP text upper** | Right side, at ~35vh from page top | Right side | ✅ Position OK |
| **Right "ABOUT" vertical** | "ABOUT" small label, then "SIRUP" in MASSIVE letters rotated | We have this | ⚠️ "SIRUP" needs to be bigger |
| **Right vertical "S"** | The "S" alone appears to be ~8-10vw font vertically | 2.4vw | ❌ Way too small |
| **Circle (continuing)** | The circle's lower right portion is visible — confirming it's a FULL CIRCLE extending down | Only has semicircle | ❌ |

---

### SCREENSHOT 3 (ROOTS section — 1:08 AM)
> Shows the transition into the ROOTS area.

| Element | Real Site | Our Code | Status |
|---|---|---|---|
| **"SIRUP'S" label** | Small caps, left side, above ROOTS | Same | ✅ |
| **"ROOTS" text** | Massive ~22vw, left-aligned, partially cut off right edge (intentional bleed) | 22vw | ✅ Size OK |
| **JP ROOTS desc** | LEFT side, multi-line, below "ROOTS" | LEFT side | ✅ |
| **Right 4 thumbnails** | Horizontal row, RIGHT side, at character shin/knee level | Same | ✅ Position concept OK |
| **Right thumbnail size** | Same portrait ratio as left thumbs | Square | ❌ Should be portrait |
| **Circle (lower arc)** | The BOTTOM of the large circle is visible here — proving it's a full circle that goes BELOW the viewport | Not present | ❌ |
| **"ABOUT" vertical text** | Now showing bottom portion — "with Gospel and Hip-hop" visible | Same | ✅ |
| **Character legs** | Legs/lower body in center, standing inside the circle | Same | ✅ |

---

### SCREENSHOT 4 (Bottom of page — 1:08 AM)
> Shows the very bottom. CRITICAL for the circle geometry.

| Element | Real Site | Our Code | Status |
|---|---|---|---|
| **Circle bottom** | THE CIRCLE'S BOTTOM ARC IS FULLY VISIBLE. The circle is enormous — ~72vw diameter. Its bottom sits at approximately 175vh from top. Center is around 100vh (middle of full page). | No circle bottom | ❌ |
| **Character feet** | Standing inside the circle, feet touching ground at ~165vh | Same | ✅ |
| **"ROOTS PLAYLIST" button** | Dark indigo circle (~100px), left side at ~145vh, "ROOTS" on line 1, "PLAYLIST" on line 2 | Same | ✅ |
| **Right 4 thumbs** | TOP-RIGHT of this view (~120-130vh from top), 4 portrait photos in a row | Same concept | ✅ |
| **Living background** | The fire/fluid gradient background is visible around the circle | Working | ✅ |

---

## CRITICAL DIFFERENCES SUMMARY (Priority Order)

### 🔴 P0 — BLOCKING (must fix first)

**1. FULL CIRCLE vs Semicircle**
- Real: One massive **full circle**, `~72vw diameter`, `border-radius: 50%`
- Center position: approximately `left: 50%`, `top: ~28vh` (so it extends from ~28vh to ~28vh + 72vw, roughly to 28vh + 72vw below)
- Color: medium-dark indigo `#353575` (not pitch black, the gradient background should be visible inside it as a solid tint overlay)
- Z-index: 2 (above date text, below ANNIVERSARY and character)

**2. Typography sizes are too small**
- "2017-2022": needs `~21vw` (currently 16vw — needs +30%)
- "5th": needs `~30vw` (currently 22vw — needs +36%)
- Right vertical "SIRUP": needs `~10-12vw` (currently 2.4vw — needs 5× bigger)

### 🟠 P1 — HIGH PRIORITY

**3. Thumbnail aspect ratio — portrait not square**
- Real thumbnails are portrait ratio approximately `width: 10vw, height: 14vw`
- Currently: square `7vw × 7vw`
- All 8 thumbnails (4 left + 4 right) use the same portrait ratio

**4. Circle color / opacity**
- Real circle is NOT transparent — it's a solid fill but the hue matches the background palette
- Color: `~#353575` or `#3a3a6a` (medium indigo-slate)
- No opacity blur/transparency

**5. Typography vertical positions need recalibration**
- "2017-2022": currently `top: 6vh` → needs `top: 10vh` (below the circle top edge)
- "ANNIVERSARY": currently `top: 58vh` → keep approximately
- "ROOTS": top needs to be at `~118vh` from canvas top

### 🟡 P2 — MEDIUM PRIORITY

**6. Header hamburger**
- Real: 3 actual CSS `<span>` lines (horizontal bars) with specific widths
- Currently: Unicode `≡` character
- Fix: 3 `<span>` divs styled as bars

**7. Left thumbnail position (vertical alignment)**
- Left 4 thumbs: they sit at approximately the character's WAIST level, slightly to the left of center
- Currently positioned at `top: 52vh` from canvas — check this

**8. Circle extends below canvas**
- A `72vw` circle centered at `top: 28vh` with `height: 72vw`:
  - At 1920×1080: 72vw = 1382px tall
  - Bottom of circle = 28vh (302px) + 1382px = ~1684px from top
  - So the circle extends well past 100vh, into the ROOTS section
  - This means the min-height of the canvas must accommodate this

### 🟢 P3 — POLISH

**9. "ANNIVERSARY" text position**
- Should be approximately at character's lower chest / stomach
- Currently seems OK at `top: 58vh`

**10. Social icon set**
- Real icons: Twitter (bird), Instagram (square rounded), YouTube (rect play), Music note, Spotify (circle waves)
- Currently have similar SVGs — verify they match

---

## IMPLEMENTATION PLAN (Execution Order)

### Phase 1 — Circle Fix (HIGHEST IMPACT)
1. Change `.arch` from semicircle to full circle: `width: 72vw; height: 72vw; border-radius: 50%`
2. Reposition: `top: 18vh; left: 50%; transform: translateX(-50%)`
3. Color: `background: #353575`
4. Remove `box-shadow` inward glow, add subtle outer shadow

### Phase 2 — Typography Resize
1. `date-big` → `font-size: 21vw`
2. `fifth` → `font-size: 30vw`
3. `vert-sirup` → `font-size: 10vw`
4. Recheck `top` values after size change (larger text = recalibrate positions)

### Phase 3 — Thumbnail Portrait Ratio
1. Change all `.sq` from `7vw × 7vw` to `width: 10vw; height: 13.5vw`

### Phase 4 — Hamburger CSS Lines
1. Replace `≡` with 3 `<span>` bars: `width: 24px; height: 2px; background: white`

### Phase 5 — Position Calibration Pass
1. Recalibrate all `top:` values with updated font sizes
2. Ensure left thumbs align to character waist
3. Ensure right thumbs align to character shin/knee
4. Ensure ROOTS button at ~145vh

### Phase 6 — Canvas Min-Height
1. Set `min-height: 200vh` — the circle at 72vw diameter extends ~128vw below center
2. Verify footer/button aren't cut off

---

## WHAT LOOKS ALREADY CORRECT ✅
- LivingBackground (untouched) — perfect
- Edge "BLU-RAY" CCW / "SCROLL" CW — correct rotation and positioning
- ONE character image, centered on X-axis
- Social icons in header (5 icons)
- "ROOTS PLAYLIST" dark circle button
- JP text content and general placement
- "SIRUP'S" label above "ROOTS"
- Z-index ordering (dates Z1, circle Z2, ANNIVERSARY Z5, char Z10, overlays Z15)
- white-space: nowrap on all massive text

---

> **AWAITING USER APPROVAL TO EXECUTE**
