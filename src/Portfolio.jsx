import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,200&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --surface: #0c0c14;
    --surface2: #12121e;
    --accent: #7fffb2;
    --accent2: #ff6b6b;
    --accent3: #6b9fff;
    --accent4: #ffb86b;
    --text: #e8e8f0;
    --muted: #5a5a78;
    --border: rgba(127,255,178,0.1);
    --glow: 0 0 60px rgba(127,255,178,0.12);
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--bg); color: var(--text);
    font-family: 'DM Mono', monospace;
    overflow-x: hidden; cursor: none;
  }

  /* ── CURSORS ── */
  .c-dot {
    width: 6px; height: 6px; background: var(--accent);
    border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999;
    transform: translate(-50%,-50%); mix-blend-mode: screen;
  }
  .c-ring {
    width: 32px; height: 32px; border: 1px solid rgba(127,255,178,.45);
    border-radius: 50%; position: fixed; pointer-events: none; z-index: 9998;
    transform: translate(-50%,-50%); mix-blend-mode: screen;
    transition: width .3s, height .3s, border-color .3s;
  }
  .c-trail {
    width: 4px; height: 4px; background: rgba(127,255,178,.22);
    border-radius: 50%; position: fixed; pointer-events: none; z-index: 9997;
    transform: translate(-50%,-50%); mix-blend-mode: screen;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); }

  /* ── LOADER ── */
  .loader {
    position: fixed; inset: 0; background: var(--bg); z-index: 99999;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 28px;
    transition: opacity .7s, visibility .7s;
  }
  .loader.out { opacity: 0; visibility: hidden; }
  .loader-code { font-size: 11px; letter-spacing: 2px; color: var(--muted); animation: blinkAnim 1.2s step-end infinite; }
  @keyframes blinkAnim { 50% { opacity: 0; } }
  .loader-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px,8vw,96px); font-weight: 800; letter-spacing: -4px;
    background: linear-gradient(135deg, #fff 30%, var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    clip-path: inset(0 100% 0 0);
    animation: revealClip 1.2s .3s cubic-bezier(0.76,0,0.24,1) forwards;
  }
  @keyframes revealClip { to { clip-path: inset(0 0% 0 0); } }
  .loader-bar { width: 220px; height: 1px; background: var(--surface2); position: relative; overflow: hidden; }
  .loader-fill {
    position: absolute; left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, var(--accent3), var(--accent));
    animation: barFill 1.8s cubic-bezier(0.76,0,0.24,1) forwards;
  }
  @keyframes barFill { from { width: 0 } to { width: 100% } }
  .loader-pct { font-size: 11px; letter-spacing: 3px; color: var(--accent); }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 20px 52px; display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(to bottom, rgba(5,5,8,.9), transparent);
    backdrop-filter: blur(8px);
  }
  .nav-logo {
    font-family: 'Fraunces', serif; font-style: italic; font-weight: 200;
    font-size: 24px; color: var(--accent); letter-spacing: 1px;
  }
  .nav-links { display: flex; gap: 36px; }
  .nav-links a {
    font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--muted); text-decoration: none; position: relative;
    transition: color .3s; cursor: none;
  }
  .nav-links a::before {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--accent); transform: scaleX(0); transition: transform .3s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a:hover::before { transform: scaleX(1); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: center; padding: 0 52px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(127,255,178,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(127,255,178,.03) 1px, transparent 1px);
    background-size: 64px 64px;
    animation: gridScroll 25s linear infinite;
  }
  @keyframes gridScroll { to { background-position: 64px 64px; } }

  .orb {
    position: absolute; border-radius: 50%;
    filter: blur(100px); pointer-events: none;
    animation: orbFloat var(--dur,9s) ease-in-out infinite;
    animation-delay: var(--del,0s);
  }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(var(--tx,20px), var(--ty,-30px)) scale(1.1); }
  }

  /* hero text */
  .hero-eyebrow {
    font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 28px;
    display: flex; align-items: center; gap: 12px;
    opacity: 0; animation: slideUp .8s .3s forwards;
  }
  .hero-eyebrow::before { content:''; width:32px; height:1px; background:var(--accent); }
  .pulse-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 0 0 rgba(127,255,178,.6);
    animation: pulseRing 1.6s ease-out infinite;
  }
  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(127,255,178,.6); }
    100% { box-shadow: 0 0 0 14px rgba(127,255,178,0); }
  }

  .hero-name-wrap {
    position: relative; z-index: 2; line-height: 0.88;
    opacity: 0; animation: slideUp .9s .5s forwards;
  }
  .hero-name-big {
    font-family: 'Syne', sans-serif;
    font-size: clamp(68px,11vw,148px); font-weight: 800; letter-spacing: -5px;
    display: block;
  }
  .hero-name-big.fill {
    background: linear-gradient(135deg, #fff 0%, var(--accent) 130%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hero-name-big.outline {
    -webkit-text-stroke: 1.5px rgba(127,255,178,.3); color: transparent;
  }
  .name-glow {
    position: absolute; left: -20px; top: 50%;
    width: 450px; height: 200px;
    background: radial-gradient(ellipse, rgba(127,255,178,.06), transparent 70%);
    filter: blur(30px); pointer-events: none; transform: translateY(-50%);
    animation: glowPulse 4s ease-in-out infinite;
  }
  @keyframes glowPulse {
    0%,100% { opacity:.5; transform:translateY(-50%) scaleX(1); }
    50% { opacity:1; transform:translateY(-50%) scaleX(1.4); }
  }

  .hero-sub {
    font-size: clamp(13px,1.8vw,17px); line-height: 1.9;
    color: var(--muted); max-width: 520px; margin-top: 28px;
    opacity: 0; animation: slideUp .9s .7s forwards;
  }
  .hero-sub em { color: var(--text); font-style: normal; }

  .hero-ctas {
    display: flex; gap: 16px; align-items: center; margin-top: 40px;
    opacity: 0; animation: slideUp .9s .9s forwards;
  }

  .hero-chips {
    display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px;
    opacity: 0; animation: slideUp .9s 1.1s forwards;
  }
  .hero-chip {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    border: 1px solid var(--border); color: var(--muted);
    padding: 5px 14px; border-radius: 999px;
    transition: all .3s;
  }
  .hero-chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(127,255,178,.05); }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(36px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-scroll {
    position: absolute; bottom: 40px; right: 52px;
    writing-mode: vertical-rl;
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--muted); display: flex; align-items: center; gap: 12px;
    opacity: 0; animation: fadeUp 1s 1.5s forwards;
  }
  .hero-scroll::before {
    content: ''; width: 1px; height: 52px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: lineAnim 2s 1.5s ease-out infinite;
  }
  @keyframes lineAnim {
    0% { transform: scaleY(0); transform-origin: top; }
    50% { transform: scaleY(1); transform-origin: top; }
    100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
  }
  @keyframes fadeUp { to { opacity: 1; } }

  /* ── MARQUEE ── */
  .mq-wrap {
    overflow: hidden; border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 20px 0; background: var(--surface);
    position: relative;
  }
  .mq-track {
    display: flex; width: max-content;
    animation: mqScroll var(--mq-dur,20s) linear infinite;
    animation-direction: var(--mq-dir, normal);
  }
  .mq-track:hover { animation-play-state: paused; }
  @keyframes mqScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mq-item {
    display: inline-flex; align-items: center; gap: 20px;
    padding: 0 28px; white-space: nowrap;
    font-family: 'Syne', sans-serif;
    font-size: clamp(20px,3.5vw,38px); font-weight: 700; letter-spacing: -1px;
  }
  .mq-item.fill { color: var(--text); }
  .mq-item.outline { -webkit-text-stroke: 1px rgba(255,255,255,.18); color: transparent; }
  .mq-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .mq-sm { padding: 10px 0; }
  .mq-sm .mq-item {
    font-family: 'DM Mono', monospace; font-size: clamp(10px,1.4vw,12px);
    font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
  }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #050508;
    padding: 14px 28px; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    border: none; border-radius: 2px; cursor: none;
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .3s;
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%);
    transform: translateX(-130%); transition: transform .5s;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(127,255,178,.35); }
  .btn-primary:hover::after { transform: translateX(130%); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid var(--border); color: var(--muted);
    padding: 14px 28px; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    background: transparent; border-radius: 2px; cursor: none;
    transition: all .3s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: rgba(127,255,178,.04); transform: translateY(-2px); }

  /* ── SECTIONS ── */
  section { padding: 120px 52px; position: relative; }
  .sec-label {
    font-size: 9px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 12px;
    display: flex; align-items: center; gap: 12px;
  }
  .sec-label::after { content:''; flex:1; max-width:48px; height:1px; background:var(--accent); opacity:.5; }
  .sec-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(38px,5.5vw,72px); font-weight: 700;
    line-height: 1; letter-spacing: -3px; margin-bottom: 60px;
  }

  /* ── REVEAL ── */
  .reveal {
    opacity: 0; transform: translateY(44px);
    transition: opacity .8s cubic-bezier(.23,1,.32,1), transform .8s cubic-bezier(.23,1,.32,1);
  }
  .reveal.vis { opacity: 1; transform: translateY(0); }
  .reveal-scale {
    opacity: 0; transform: scale(.92);
    transition: opacity .75s cubic-bezier(.23,1,.32,1), transform .75s cubic-bezier(.23,1,.32,1);
  }
  .reveal-scale.vis { opacity: 1; transform: scale(1); }

  /* ── ABOUT ── */
  .about-sec { background: var(--surface); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .about-body { font-size: 15px; line-height: 1.9; color: var(--muted); }
  .about-body strong { color: var(--accent); font-weight: 400; }

  /* skill bars */
  .bar-list { display: flex; flex-direction: column; gap: 14px; margin-top: 44px; }
  .bar-item { display: flex; flex-direction: column; gap: 6px; }
  .bar-head { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }
  .bar-track { height: 2px; background: var(--surface2); border-radius: 1px; overflow: hidden; }
  .bar-fill {
    height: 100%; border-radius: 1px;
    background: linear-gradient(90deg, var(--accent3), var(--accent));
    width: 0; transition: width 1.3s cubic-bezier(.23,1,.32,1);
  }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 44px; }
  .stat-card {
    background: var(--surface2); padding: 28px 24px;
    border: 1px solid var(--border); position: relative; overflow: hidden;
    transition: transform .3s, border-color .3s;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    transform: scaleX(0); transform-origin: left; transition: transform .4s;
  }
  .stat-card:hover { transform: translateY(-5px); border-color: rgba(127,255,178,.3); }
  .stat-card:hover::before { transform: scaleX(1); }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 46px; font-weight: 800; color: var(--accent); line-height: 1; margin-bottom: 6px; }
  .stat-lbl { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }

  /* profile visual */
  .profile-box {
    aspect-ratio: 3/4; border: 1px solid var(--border);
    background: linear-gradient(135deg, var(--surface2), #0a1a10);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px;
    position: relative; overflow: hidden;
  }
  .profile-box::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 39px,
      rgba(127,255,178,.022) 39px, rgba(127,255,178,.022) 40px
    );
  }
  .profile-glyph {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 120px; font-weight: 200; color: rgba(127,255,178,.07); line-height: 1;
    animation: glyphPulse 4s ease-in-out infinite;
  }
  @keyframes glyphPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
  .cb { position: absolute; width: 22px; height: 22px; animation: cbFade 3s ease-in-out infinite; }
  @keyframes cbFade { 0%,100%{opacity:.35} 50%{opacity:1} }
  .cb.tl { top:14px; left:14px; border-top:1px solid var(--accent); border-left:1px solid var(--accent); }
  .cb.tr { top:14px; right:14px; border-top:1px solid var(--accent); border-right:1px solid var(--accent); animation-delay:.5s; }
  .cb.bl { bottom:14px; left:14px; border-bottom:1px solid var(--accent); border-left:1px solid var(--accent); animation-delay:1s; }
  .cb.br { bottom:14px; right:14px; border-bottom:1px solid var(--accent); border-right:1px solid var(--accent); animation-delay:1.5s; }
  .profile-footer {
    position: absolute; bottom: 20px; left: 18px; right: 18px;
    border-top: 1px solid var(--border); padding-top: 10px;
    font-size: 10px; color: var(--muted); display: flex; justify-content: space-between;
  }
  .status-blink { color: var(--accent); animation: blinkAnim 1.5s step-end infinite; }

  /* ── SKILLS ── */
  .skills-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .skill-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 32px 28px; position: relative; overflow: hidden;
    transition: transform .35s, border-color .35s, box-shadow .35s; cursor: none;
  }
  .skill-card::after {
    content: ''; position: absolute; width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle, rgba(127,255,178,.06), transparent 70%);
    top: -30px; right: -30px; transition: transform .4s;
  }
  .skill-card:hover { transform: translateY(-6px); border-color: rgba(127,255,178,.3); box-shadow: var(--glow); }
  .skill-card:hover::after { transform: scale(2.2); }
  .skill-card-title { font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag {
    font-size: 11px; padding: 5px 12px;
    border: 1px solid rgba(127,255,178,.12); color: var(--muted);
    border-radius: 1px; transition: all .25s; cursor: none;
  }
  .tag:hover { border-color: var(--accent); color: var(--accent); background: rgba(127,255,178,.05); transform: scale(1.05); }

  /* ── EXPERIENCE ── */
  .exp-sec { background: var(--surface); }
  .timeline { position: relative; padding-left: 36px; }
  .timeline::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 1px; background: linear-gradient(to bottom, var(--accent), transparent);
  }
  .tl-item {
    position: relative; padding-bottom: 64px;
    opacity: 0; transform: translateX(-24px);
    transition: opacity .7s, transform .7s;
  }
  .tl-item.vis { opacity: 1; transform: translateX(0); }
  .tl-dot {
    position: absolute; left: -42px; top: 8px;
    width: 14px; height: 14px; border: 2px solid var(--accent);
    border-radius: 50%; background: var(--bg);
    box-shadow: 0 0 16px rgba(127,255,178,.5);
  }
  .tl-dot::after {
    content: ''; position: absolute; inset: 2px;
    background: var(--accent); border-radius: 50%;
    animation: dotBeat 2s ease-in-out infinite;
  }
  @keyframes dotBeat { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(.4);opacity:.4} }
  .tl-date { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  .tl-company { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .tl-role { font-size: 11px; letter-spacing: 1px; color: var(--muted); margin-bottom: 20px; }
  .tl-points { list-style: none; }
  .tl-points li { font-size: 13px; line-height: 1.9; color: var(--muted); padding-left: 20px; position: relative; margin-bottom: 6px; }
  .tl-points li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 11px; }

  /* ── PROJECTS ── */
  .proj-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
  .proj-count { font-family: 'Fraunces', serif; font-style: italic; font-size: 72px; font-weight: 200; color: rgba(127,255,178,.12); line-height: 1; }
  .proj-featured-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2px; margin-bottom: 2px; }
  .proj-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  .proj-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 2px; margin-top: 2px; }

  .pc {
    background: var(--surface); border: 1px solid var(--border);
    padding: 36px; position: relative; overflow: hidden; cursor: none;
    opacity: 0; transform: translateY(36px);
    transition: opacity .75s cubic-bezier(.23,1,.32,1),
                transform .75s cubic-bezier(.23,1,.32,1),
                border-color .4s, box-shadow .4s;
  }
  .pc.vis { opacity: 1; transform: translateY(0); }
  .pc:hover { border-color: rgba(127,255,178,.3); box-shadow: var(--glow); transform: translateY(-5px) !important; }
  .pc::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at var(--px,50%) var(--py,50%), rgba(127,255,178,.065), transparent 55%);
    opacity: 0; transition: opacity .4s;
  }
  .pc:hover::before { opacity: 1; }
  .pc-num {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 72px; font-weight: 200; color: rgba(127,255,178,.06);
    position: absolute; top: 16px; right: 24px; line-height: 1;
    transition: color .4s;
  }
  .pc:hover .pc-num { color: rgba(127,255,178,.14); }
  .pc-cat { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--accent3); margin-bottom: 14px; }
  .pc-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 14px; line-height: 1.2; }
  .pc-big .pc-name { font-size: 28px; }
  .pc-desc { font-size: 13px; line-height: 1.85; color: var(--muted); margin-bottom: 20px; }
  .pc-techs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .pc-tech {
    font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 8px; border: 1px solid rgba(127,255,178,.12); color: var(--muted); border-radius: 1px;
  }
  .pc-link {
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent); text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: gap .3s;
  }
  .pc-link:hover { gap: 14px; }

  /* ── CERTS ── */
  .certs-sec { background: var(--surface); }
  .certs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .cert-card {
    border: 1px solid var(--border); padding: 24px;
    display: flex; gap: 14px; align-items: flex-start;
    cursor: none;
    opacity: 0; transform: scale(.94);
    transition: opacity .7s cubic-bezier(.23,1,.32,1), transform .7s cubic-bezier(.23,1,.32,1),
                border-color .3s, background .3s;
  }
  .cert-card.vis { opacity: 1; transform: scale(1); }
  .cert-card:hover { border-color: var(--accent); background: rgba(127,255,178,.03); transform: scale(1.02) !important; }
  .cert-icon {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(127,255,178,.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    border: 1px solid rgba(127,255,178,.18);
    transition: transform .3s, box-shadow .3s;
  }
  .cert-card:hover .cert-icon { transform: rotate(10deg) scale(1.1); box-shadow: 0 0 20px rgba(127,255,178,.2); }
  .cert-name { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }
  .cert-issuer { font-size: 10px; letter-spacing: 1px; color: var(--muted); }

  /* ── CONTACT ── */
  .contact-sec { text-align: center; position: relative; overflow: hidden; }
  .contact-bg {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: 'Syne', sans-serif;
    font-size: clamp(80px,18vw,260px); font-weight: 800; letter-spacing: -12px;
    color: rgba(127,255,178,.018); white-space: nowrap; pointer-events: none;
    animation: bgFloat 6s ease-in-out infinite;
  }
  @keyframes bgFloat {
    0%,100% { transform: translate(-50%,-50%) scale(1); }
    50% { transform: translate(-50%,-52%) scale(1.02); }
  }
  .contact-links { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; margin-top: 56px; }
  .c-link {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-decoration: none; color: var(--muted);
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    padding: 24px 28px; border: 1px solid var(--border);
    position: relative; overflow: hidden; cursor: none;
    transition: color .3s, border-color .3s, transform .3s;
  }
  .c-link::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(127,255,178,.06), transparent);
    transform: translateY(100%); transition: transform .35s;
  }
  .c-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-4px); }
  .c-link:hover::before { transform: translateY(0); }
  .c-link-icon { font-size: 22px; }

  /* ── FOOTER ── */
  footer {
    padding: 28px 52px; display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid var(--border); font-size: 10px; letter-spacing: 1px; color: var(--muted);
  }

  /* ── MOBILE ── */
  @media(max-width:768px){
    nav { padding: 16px 20px; }
    .nav-links { display: none; }
    section { padding: 80px 20px; }
    .hero { padding: 0 20px; }
    .about-grid, .proj-featured-row { grid-template-columns: 1fr; gap: 40px; }
    .skills-grid, .proj-grid, .proj-grid-2, .certs-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 12px; text-align: center; }
    .proj-header { flex-direction: column; align-items: flex-start; }
  }
`;

/* ─── DATA ─── */
const SKILL_BARS = [
  { name:"Python / ML", pct:82 },
  { name:"React / JavaScript", pct:88 },
  { name:"SQL & Databases", pct:75 },
  { name:"TensorFlow / PyTorch", pct:72 },
  { name:"Power BI / Analytics", pct:70 },
];

const SKILL_GROUPS = [
  { title:"Languages",   tags:["Python","JavaScript","SQL"] },
  { title:"AI / ML",     tags:["TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy","RL"] },
  { title:"Frontend",    tags:["React","React Native","HTML","CSS","Bootstrap"] },
  { title:"Backend & DB",tags:["Node.js","MySQL","MongoDB","Firebase"] },
  { title:"Data & Viz",  tags:["Power BI","Excel","Matplotlib","EDA"] },
  { title:"Tools",       tags:["Git","GitHub","Postman","Vercel","Unity"] },
];

const PROJECTS_FEATURED = [
  {
    num:"01", name:"E-Sakha", cat:"Live Web App",
    desc:"Production-grade responsive React website for E-Sakha. Mobile-first design with smooth cross-browser compatibility, clean UI/UX, and improved client online presence.",
    techs:["React","CSS","Vercel","REST APIs"], link:"www.esakha.in",
  },
  {
    num:"02", name:"Adaptive Game AI", cat:"Final Year Project",
    desc:"Adaptive NPC AI using priority matrices for decision-making and vector-based navigation for pathfinding in dynamic Unity game environments.",
    techs:["Unity","C#","AI / ML","Pathfinding"], link:null,
  },
];

const PROJECTS_REST = [
  {
    num:"03", name:"Deep RL Tetris Bot", cat:"Reinforcement Learning",
    desc:"AI agent trained to play Tetris via deep RL. Reward-based iterative training with Python and TensorFlow over thousands of episodes.",
    techs:["Python","TensorFlow","OpenAI Gym","RL"], link:null,
  },
  {
    num:"04", name:"Data Analytics Dashboard", cat:"Business Intelligence",
    desc:"Analyzed structured datasets with Pandas & NumPy. Built interactive Power BI dashboards surfacing key business metrics and trends.",
    techs:["Python","Pandas","Power BI","NumPy"], link:null,
  },
  {
    num:"05", name:"NLP Sentiment Analyzer", cat:"Natural Language Processing",
    desc:"Sentiment analysis model built with Python and Scikit-learn. Classifies text into positive, negative, and neutral categories with 85% accuracy.",
    techs:["Python","NLP","Scikit-learn","NLTK"], link:null,
  },
];

const PROJECTS_BOTTOM = [
  {
    num:"06", name:"React Native Expense Tracker", cat:"Mobile App",
    desc:"Cross-platform personal finance tracker with real-time budget monitoring, category-wise expense charts, and Firebase sync across devices.",
    techs:["React Native","Firebase","JavaScript","Expo"], link:null,
  },
  {
    num:"07", name:"COVID-19 Data Visualizer", cat:"Data Science",
    desc:"Interactive dashboard visualizing global COVID-19 spread via real-time API data. Country comparison charts and trend maps with React and Chart.js.",
    techs:["React","Chart.js","REST API","CSS"], link:null,
  },
  {
    num:"08", name:"AI Chatbot Assistant", cat:"Conversational AI",
    desc:"Rule-based and ML-driven chatbot built with Python and NLTK. Handles intent classification and context-aware responses for student Q&A use cases.",
    techs:["Python","NLTK","Flask","JSON"], link:null,
  },
];

const CERTS = [
  { name:"Introduction to Cybersecurity", issuer:"Cisco Networking Academy", icon:"🔒" },
  { name:"Generative AI Foundations",     issuer:"Amazon Web Services (AWS)", icon:"🤖" },
  { name:"Python for Data Science",       issuer:"Online Certification",      icon:"🐍" },
  { name:"Data Science 101",              issuer:"IBM",                        icon:"📊" },
  { name:"Introduction to Cybercrime",   issuer:"Simplilearn",                icon:"🛡️" },
  { name:"Cyber Job Simulation",          issuer:"Deloitte Australia",         icon:"💼" },
];

const MQ1 = ["DIKESH GAUTAM","AI ENGINEER","ML DEVELOPER","REACT DEV","OPEN TO WORK","HYDERABAD"];
const MQ2 = ["Python","·","TensorFlow","·","React","·","Node.js","·","SQL","·","Power BI","·","Unity","·","MongoDB","·","PyTorch","·","Pandas","·","Firebase","·","Git","·"];
const MQ3 = ["FULL STACK","DATA SCIENCE","REACT DEV","ML MODELS","WEB APPS","AI SYSTEMS","PYTHON DEV"];

/* ─── MARQUEE COMPONENT ─── */
function Mq({ items, dur=20, rev=false, sm=false }) {
  const doubled = [...items, ...items];
  return (
    <div className={`mq-wrap ${sm ? "mq-sm" : ""}`}>
      <div className="mq-track"
        style={{"--mq-dur":`${dur}s`,"--mq-dir":rev?"reverse":"normal"}}>
        {doubled.map((w,i) => (
          <span key={i} className={`mq-item ${i%4===2?"outline":"fill"}`}>
            {w}{!sm && <span className="mq-dot"/>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── PROJECT CARD ─── */
function PC({ p, delay=0, big=false }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
    ref.current.style.setProperty("--py", ((e.clientY-r.top)/r.height*100).toFixed(1)+"%");
  };
  return (
    <div ref={ref} className={`pc ${big?"pc-big":""}`}
      style={{transitionDelay:`${delay}s`}} onMouseMove={onMove}>
      <div className="pc-num">{p.num}</div>
      <div className="pc-cat">{p.cat}</div>
      <div className="pc-name">{p.name}</div>
      <div className="pc-desc">{p.desc}</div>
      <div className="pc-techs">{p.techs.map((t,i)=><span key={i} className="pc-tech">{t}</span>)}</div>
      {p.link && <a href={`https://www.esakha.in`} target="_blank" rel="noreferrer" className="www.esakha.in">Visit Live →</a>}
    </div>
  );
}

/* ─── MAIN ─── */
export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [pct,    setPct]    = useState(0);
  const [mouse,  setMouse]  = useState({x:-200,y:-200});
  const [ring,   setRing]   = useState({x:-200,y:-200});
  const [trail,  setTrail]  = useState({x:-200,y:-200});
  const ringRef  = useRef({x:-200,y:-200});
  const trailRef = useRef({x:-200,y:-200});
  const mainRef  = useRef(null);

  /* loader */
  useEffect(()=>{
    let v=0, id=setInterval(()=>{
      v += Math.random()*5+2;
      if(v>=100){v=100;clearInterval(id);setTimeout(()=>setLoaded(true),500);}
      setPct(Math.floor(v));
    },40);
    return ()=>clearInterval(id);
  },[]);

  /* cursor */
  useEffect(()=>{
    let af1,af2;
    const lerp=(a,b,t)=>a+(b-a)*t;
    const onMove=(e)=>{
      setMouse({x:e.clientX,y:e.clientY});
      const step=()=>{
        ringRef.current.x=lerp(ringRef.current.x,e.clientX,.11);
        ringRef.current.y=lerp(ringRef.current.y,e.clientY,.11);
        setRing({...ringRef.current});
        af1=requestAnimationFrame(step);
      };
      cancelAnimationFrame(af1);af1=requestAnimationFrame(step);
    };
    const step2=()=>{
      trailRef.current.x=lerp(trailRef.current.x,ringRef.current.x,.07);
      trailRef.current.y=lerp(trailRef.current.y,ringRef.current.y,.07);
      setTrail({...trailRef.current});
      af2=requestAnimationFrame(step2);
    };
    af2=requestAnimationFrame(step2);
    window.addEventListener("mousemove",onMove);
    return ()=>{window.removeEventListener("mousemove",onMove);cancelAnimationFrame(af1);cancelAnimationFrame(af2);};
  },[]);

  /* intersection reveals */
  useEffect(()=>{
    if(!mainRef.current) return;
    const els=mainRef.current.querySelectorAll(".reveal,.reveal-scale,.tl-item,.pc,.cert-card");
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");}});
    },{threshold:0.07});
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[loaded]);

  /* skill bars */
  useEffect(()=>{
    const fills=document.querySelectorAll(".bar-fill");
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.style.width=e.target.dataset.pct+"%";
          io.unobserve(e.target);
        }
      });
    },{threshold:.4});
    fills.forEach(f=>io.observe(f));
    return ()=>io.disconnect();
  },[loaded]);

  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <>
      <style>{style}</style>

      {/* cursors */}
      <div className="c-trail" style={{left:trail.x,top:trail.y}}/>
      <div className="c-ring"  style={{left:ring.x, top:ring.y}}/>
      <div className="c-dot"   style={{left:mouse.x,top:mouse.y}}/>

      {/* loader */}
      <div className={`loader ${loaded?"out":""}`}>
        <div className="loader-code">// initializing portfolio.exe</div>
        <div className="loader-title">DIKESH</div>
        <div className="loader-bar"><div className="loader-fill"/></div>
        <div className="loader-pct">{String(pct).padStart(3,"0")}%</div>
      </div>

      {/* nav */}
      <nav>
        <div className="nav-logo">DG</div>
        <div className="nav-links">
          {["about","skills","experience","projects","contact"].map(s=>(
            <a key={s} onClick={()=>go(s)}>{s}</a>
          ))}
        </div>
      </nav>

      <main ref={mainRef}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-grid"/>

          {/* orbs */}
          <div className="orb" style={{width:600,height:600,background:"radial-gradient(circle,rgba(127,255,178,.055),transparent 70%)",top:-160,right:-120,"--tx":"30px","--ty":"-40px","--dur":"10s","--del":"0s"}}/>
          <div className="orb" style={{width:400,height:400,background:"radial-gradient(circle,rgba(107,159,255,.05),transparent 70%)",bottom:60,left:60,"--tx":"-20px","--ty":"25px","--dur":"8s","--del":"-3s"}}/>
          <div className="orb" style={{width:260,height:260,background:"radial-gradient(circle,rgba(255,184,107,.04),transparent 70%)",top:"40%",left:"42%","--tx":"14px","--ty":"-10px","--dur":"12s","--del":"-6s"}}/>

          <div style={{position:"relative",zIndex:2}}>
            <div className="hero-eyebrow">
              <div className="pulse-dot"/> Available for Opportunities
            </div>

            {/* BIG MOVING NAME */}
            <div className="hero-name-wrap">
              <div className="name-glow"/>
              <span className="hero-name-big fill">DIKESH</span>
              <span className="hero-name-big outline">GAUTAM</span>
            </div>

            <div className="hero-sub">
              <em>AI/ML Engineer</em> · Full-Stack Developer · Data Analyst<br/>
              Building intelligent systems &amp; beautiful digital products<br/>
              from <em>Hyderabad, India</em>.
            </div>

            <div className="hero-ctas">
              <button className="btn-primary" onClick={()=>go("projects")}>↓ View Projects</button>
              <button className="btn-ghost"   onClick={()=>go("contact")}>Get In Touch →</button>
            </div>

            <div className="hero-chips">
              {["Python","React","TensorFlow","SQL","Power BI","Unity","Node.js"].map(t=>(
                <span key={t} className="hero-chip">{t}</span>
              ))}
            </div>
          </div>

          <div className="hero-scroll">Scroll Down</div>
        </section>

        {/* ── MARQUEE – MOVING NAME ── */}
        <Mq items={MQ1} dur={22}/>
        <Mq items={MQ2} dur={14} rev sm/>

        {/* ── ABOUT ── */}
        <section id="about" className="about-sec">
          <div className="sec-label">01 — About</div>
          <div className="about-grid">
            <div>
              <h2 className="sec-title reveal">Who<br/>I Am.</h2>
              <div className="about-body reveal">
                <p>I'm an <strong>AI/ML Engineering graduate</strong> from University of Mumbai with hands-on experience across machine learning, web development, and data analytics.</p>
                <br/>
                <p>From training <strong>deep reinforcement learning agents</strong> to shipping production React applications, I think across the full stack — writing clean code, crunching datasets, and designing intuitive UIs.</p>
                <br/>
                <p>Currently based in <strong>Hyderabad</strong>, actively seeking roles in Data Analytics, Python Development, or Software Engineering.</p>
              </div>

              <div className="bar-list reveal">
                {SKILL_BARS.map((sb,i)=>(
                  <div key={i} className="bar-item">
                    <div className="bar-head"><span>{sb.name}</span><span style={{color:"var(--accent)"}}>{sb.pct}%</span></div>
                    <div className="bar-track"><div className="bar-fill" data-pct={sb.pct}/></div>
                  </div>
                ))}
              </div>

              <div className="stats-grid reveal">
                {[{num:"Fresher",lbl:"Years Exp"},{num:"8+",lbl:"Projects"},{num:"6+",lbl:"Certificate"},{num:"7.04",lbl:"CGPA/10"}].map((s,i)=>(
                  <div key={i} className="stat-card">
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-scale">
              <div className="profile-box">
                <div className="cb tl"/><div className="cb tr"/>
                <div className="cb bl"/><div className="cb br"/>
                <img 
  src="/profile1.jpg" 
  alt="Dikesh Gautam" 
  className="profile-img"
/>
                <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--muted)"}}>Software Developer</div>
                <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--accent)"}}>AI / ML Engineer</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:8,letterSpacing:1}}>Mumbai → Hyderabad</div>
                <div className="profile-footer">
                  <span>BE · AI&ML · 2025</span>
                  <span><span className="status-blink">●</span> Open to Work</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE 2 ── */}
        <Mq items={MQ3} dur={26} rev/>

        {/* ── SKILLS ── */}
        <section id="skills">
          <div className="sec-label">02 — Skills</div>
          <h2 className="sec-title reveal">Tech<br/>Stack.</h2>
          <div className="skills-grid">
            {SKILL_GROUPS.map((g,i)=>(
              <div key={i} className="skill-card reveal" style={{transitionDelay:`${i*.07}s`}}>
                <div className="skill-card-title">{g.title}</div>
                <div className="tags">{g.tags.map((t,j)=><span key={j} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="exp-sec">
          <div className="sec-label">03 — Experience</div>
          <h2 className="sec-title reveal">Work<br/>History.</h2>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot"/>
              <div className="tl-date">Jun 2023 – Dec 2023</div>
              <div className="tl-company">NY All in One Solutions and Services ltd.</div>
              <div className="tl-role">Web Development Intern · Nagpur</div>
              <ul className="tl-points">
                <li>Developed 5+ responsive UI components using React, improving page load performance.</li>
                <li>Built reusable components and optimized performance using modern JavaScript practices.</li>
                <li>Contributed to mobile app features using React Native frontend development.</li>
                <li>Integrated REST APIs ensuring smooth data flow between frontend and backend.</li>
                <li>Used Git for version control and collaborated with developers on code reviews.</li>
              </ul>
            </div>
            <div className="tl-item" style={{transitionDelay:".2s"}}>
              <div className="tl-dot"/>
              <div className="tl-date">Dec 2022 – Jan 2023</div>
              <div className="tl-company">Suvidha Foundation</div>
              <div className="tl-role">Web Developer Intern · Nagpur</div>
              <ul className="tl-points">
                <li>Redesigned "CODE KARO YAARO" educational website for kids and parents.</li>
                <li>Delivered full-stack updates per client requirements within deadline.</li>
                <li>Enhanced UI for improved accessibility and ease of use.</li>
                <li>Maintained platform stability through active debugging and feature iterations.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects">
          <div className="proj-header">
            <div>
              <div className="sec-label">04 — Projects</div>
              <h2 className="sec-title reveal" style={{marginBottom:0}}>Selected<br/>Work.</h2>
            </div>
            <div className="proj-count reveal">08</div>
          </div>

          {/* row 1: 2 featured */}
          <div className="proj-featured-row">
            {PROJECTS_FEATURED.map((p,i)=><PC key={p.num} p={p} delay={i*.1} big/>)}
          </div>

          {/* row 2: 3 */}
          <div className="proj-grid">
            {PROJECTS_REST.map((p,i)=><PC key={p.num} p={p} delay={i*.08}/>)}
          </div>

          {/* row 3: 3 more */}
          <div className="proj-grid" style={{marginTop:2}}>
            {PROJECTS_BOTTOM.map((p,i)=><PC key={p.num} p={p} delay={i*.08}/>)}
          </div>
        </section>

        {/* ── CERTS ── */}
        <section className="certs-sec">
          <div className="sec-label">05 — Certifications</div>
          <h2 className="sec-title reveal">Credentials.</h2>
          <div className="certs-grid">
            {CERTS.map((c,i)=>(
              <div key={i} className="cert-card reveal" style={{transitionDelay:`${i*.08}s`}}>
                <div className="cert-icon">{c.icon}</div>
                <div>
                  <div className="cert-name">{c.name}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="contact-sec">
          <div className="contact-bg">HELLO</div>
          <div className="sec-label" style={{justifyContent:"center"}}>06 — Contact</div>
          <h2 className="sec-title reveal" style={{textAlign:"center"}}>
            Let's Build<br/>
            <span style={{background:"linear-gradient(135deg,var(--accent),var(--accent3))",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
              Something.
            </span>
          </h2>
          <p className="reveal" style={{textAlign:"center",color:"var(--muted)",fontSize:15,lineHeight:1.9,maxWidth:460,margin:"0 auto"}}>
            Actively seeking entry-level roles in Data Analytics,<br/>
            Python Development, or Software Engineering.<br/>
            Let's connect and build something great together.
          </p>
          <div className="contact-links reveal">
            {[
              {icon:"✉",label:"Email",href:"mailto:dikeshgautam09@gmail.com"},
              {icon:"💼",label:"LinkedIn",href:"https://www.linkedin.com/in/dikesh-gautam-5a3740227/"},
              {icon:"⌨",label:"GitHub",href:"https://github.com/dikesh098"},
              {icon:"🌐",label:"Portfolio",href:"https://dikeshgautam.vercel.app/"},
              {icon:"📞",label:"+91 8010948092",href:"tel:+918010948092"},
            ].map((c,i)=>(
              <a key={i} href={c.href} target="_blank" rel="noreferrer" className="c-link">
                <span className="c-link-icon">{c.icon}</span>{c.label}
              </a>
            ))}
          </div>
        </section>

        {/* final marquee */}
        <Mq items={["AVAILABLE FOR WORK","DIKESH GAUTAM","AI ENGINEER","REACT DEV","LET'S CONNECT","HYDERABAD"]} dur={20}/>

        <footer>
          <span style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",color:"var(--text)"}}>Dikesh Gautam</span>
          <span>Designed &amp; Developed by Dikesh · 2025</span>
          <span style={{color:"var(--accent)"}}>Hyderabad, India</span>
        </footer>

      </main>
    </>
  );
}
