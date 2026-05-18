import { memo } from 'react';

const SharedStyles = () => (
  <style>{`
    @keyframes aurora-1{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}25%{transform:translate(120px,-80px) scale(1.4) rotate(8deg)}50%{transform:translate(-100px,100px) scale(0.7) rotate(-6deg)}75%{transform:translate(80px,50px) scale(1.2) rotate(4deg)}}
    @keyframes aurora-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-120px,70px) scale(1.4) rotate(-6deg)}66%{transform:translate(100px,-80px) scale(0.65) rotate(7deg)}}
    @keyframes aurora-3{0%,100%{transform:translate(0,0) scale(1)}20%{transform:translate(90px,90px) scale(1.3)}50%{transform:translate(-110px,-60px) scale(0.75)}80%{transform:translate(60px,-90px) scale(1.25)}}
    @keyframes aurora-4{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-80px,-90px) scale(1.35) rotate(9deg)}70%{transform:translate(110px,70px) scale(0.7) rotate(-7deg)}}
    @keyframes aurora-5{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(100px,-70px) scale(1.2)}60%{transform:translate(-80px,85px) scale(0.8)}}
    @keyframes dna-scroll{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
    @keyframes neural-dot-pulse{0%,100%{opacity:var(--nd-o,0.4)}50%{opacity:calc(var(--nd-o,0.4) * 1.4)}}
    .neural-pulse-dot{display:block}
    @media(prefers-reduced-motion:reduce){.neural-pulse-dot{display:none}}
    @keyframes ecg-draw{0%{stroke-dashoffset:var(--ecg-len,2400)}100%{stroke-dashoffset:0}}
    @keyframes cell-drift-1{0%,100%{transform:translate(0,0)}25%{transform:translate(30px,-20px)}50%{transform:translate(-15px,25px)}75%{transform:translate(20px,10px)}}
    @keyframes cell-drift-2{0%,100%{transform:translate(0,0)}33%{transform:translate(-25px,15px)}66%{transform:translate(20px,-25px)}}
    @keyframes cell-drift-3{0%,100%{transform:translate(0,0)}20%{transform:translate(15px,20px)}60%{transform:translate(-20px,-15px)}}
    @keyframes xray-heart{0%,70%,100%{opacity:0.15;transform:scale(1)}75%{opacity:0.4;transform:scale(1.06)}80%{opacity:0.15;transform:scale(1)}}
    @keyframes vessel-flow{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
    @media(prefers-reduced-motion:reduce){*{animation-duration:0s!important;animation:none!important;transition:none!important}}
  `}</style>
);

/* ── AURORA ── bigger, faster, more visible ── */
const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    {[
      { w:'90%',h:'80%',t:'-15%',l:'-10%',color:'accent',op:0.55,blur:55,anim:'aurora-1 7s ease-in-out infinite'},
      { w:'75%',h:'70%',t:'10%',l:'40%',color:'secondary',op:0.5,blur:50,anim:'aurora-2 9s ease-in-out infinite'},
      { w:'80%',h:'75%',t:'30%',l:'-15%',color:'accent',op:0.4,blur:60,anim:'aurora-3 11s ease-in-out infinite'},
      { w:'65%',h:'60%',t:'0%',l:'50%',color:'secondary',op:0.45,blur:50,anim:'aurora-4 8s ease-in-out infinite'},
      { w:'60%',h:'55%',t:'40%',l:'25%',color:'accent',op:0.35,blur:55,anim:'aurora-5 10s ease-in-out infinite'},
    ].map((b,i)=>(
      <div key={i} className="absolute rounded-full" style={{
        width:b.w,height:b.h,top:b.t,left:b.l,
        background:`radial-gradient(ellipse at center, hsl(var(--ds-color-${b.color}) / ${b.op}) 0%, transparent 60%)`,
        filter:`blur(${b.blur}px)`,animation:b.anim,willChange:'transform',
      }}/>
    ))}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/20 via-transparent to-[hsl(var(--ds-color-bg))]/40"/>
  </div>
);

/* ── DNA ── scrolling double helix with seamless loop ── */
const DNABackground = () => {
  const N = 60, VW = 800, SEGMENT_H = 1400, CX = VW / 2, AMP = 130;
  const makePoints = (yOffset: number) =>
    Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const y = yOffset + t * SEGMENT_H;
      const phase = t * Math.PI * 6;
      const depth = Math.cos(phase);
      return {
        y, x1: CX + Math.sin(phase) * AMP, x2: CX + Math.sin(phase + Math.PI) * AMP,
        r1: 2.5 + (depth + 1) * 2, r2: 2.5 + (-depth + 1) * 2,
        o1: 0.3 + (depth + 1) * 0.3, o2: 0.3 + (-depth + 1) * 0.3,
        bridge: i % 3 === 0,
      };
    });
  const totalH = SEGMENT_H * 2;
  const seg1 = makePoints(0);
  const seg2 = makePoints(SEGMENT_H);
  const allPts = [...seg1, ...seg2];
  const spine1 = `M ${allPts[0].x1} ${allPts[0].y} ` + allPts.map(p => `L ${p.x1} ${p.y}`).join(' ');
  const spine2 = `M ${allPts[0].x2} ${allPts[0].y} ` + allPts.map(p => `L ${p.x2} ${p.y}`).join(' ');

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
      <SharedStyles />
      <div className="absolute inset-0" style={{ animation: 'dna-scroll 30s linear infinite', willChange: 'transform' }}>
        <svg className="absolute left-0 w-full opacity-20" style={{ height: '200%', top: '0%' }} viewBox={`0 0 ${VW} ${totalH}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="dg-a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="hsl(var(--ds-color-accent))" stopOpacity="0.9" /><stop offset="100%" stopColor="hsl(var(--ds-color-accent))" stopOpacity="0" /></radialGradient>
            <radialGradient id="dg-b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="hsl(var(--ds-color-secondary))" stopOpacity="0.9" /><stop offset="100%" stopColor="hsl(var(--ds-color-secondary))" stopOpacity="0" /></radialGradient>
            <linearGradient id="dg-br"><stop offset="0%" stopColor="hsl(var(--ds-color-accent))" stopOpacity="0.5" /><stop offset="50%" stopColor="hsl(var(--ds-color-secondary))" stopOpacity="0.3" /><stop offset="100%" stopColor="hsl(var(--ds-color-accent))" stopOpacity="0.5" /></linearGradient>
          </defs>
          <path d={spine1} fill="none" stroke="hsl(var(--ds-color-accent))" strokeWidth="1.2" opacity="0.25" />
          <path d={spine2} fill="none" stroke="hsl(var(--ds-color-secondary))" strokeWidth="1.2" opacity="0.25" />
          {allPts.map((p, i) => (
            <g key={i}>
              {p.bridge && <line x1={p.x1} y1={p.y} x2={p.x2} y2={p.y} stroke="url(#dg-br)" strokeWidth="0.8" opacity="0.5" />}
              <circle cx={p.x1} cy={p.y} r={p.r1 * 3} fill="url(#dg-a)" opacity={p.o1 * 0.35} />
              <circle cx={p.x2} cy={p.y} r={p.r2 * 3} fill="url(#dg-b)" opacity={p.o2 * 0.35} />
              <circle cx={p.x1} cy={p.y} r={p.r1} fill="hsl(var(--ds-color-accent))" opacity={p.o1} />
              <circle cx={p.x2} cy={p.y} r={p.r2} fill="hsl(var(--ds-color-secondary))" opacity={p.o2} />
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/40 via-transparent to-[hsl(var(--ds-color-bg))]/60" />
    </div>
  );
};

/* ── ECG ── slow progressive draw ── */
const HeartbeatBackground = () => {
  const beatPath = 'l40,0 q12,0 18,-10 q6,-10 12,0 l25,0 l6,0 l0,5 l5,-65 l5,82 l5,-30 l0,8 l6,0 l30,0 q12,0 18,-12 q6,-12 12,0 l35,0';
  const flat = 'l80,0';
  const segment = `${flat} ${beatPath}`;
  const makeLead = (y: number) => {
    const beats = `${segment} ${segment} ${segment} ${segment} ${segment} ${segment} ${flat}`;
    return `M0,${y} ${beats}`;
  };
  const totalLen = 2800;
  const leads = [
    { y: 150, sw: 2.5, o: 1.0, dur: 14 },
    { y: 225, sw: 1.8, o: 0.5, dur: 15 },
    { y: 295, sw: 1.2, o: 0.3, dur: 13 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
      <SharedStyles />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none" style={{ opacity: 0.18 }}>
        <defs>
          <filter id="ecg-gl"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {Array.from({ length: 25 }, (_, i) => <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={400} stroke="hsl(var(--ds-color-accent))" strokeWidth="0.3" opacity="0.1" />)}
        {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 50} x2={1200} y2={i * 50} stroke="hsl(var(--ds-color-accent))" strokeWidth="0.3" opacity="0.1" />)}
        {leads.map((l, i) => (
          <g key={i} filter="url(#ecg-gl)">
            <path d={makeLead(l.y)} fill="none" stroke="hsl(var(--ds-color-accent))" strokeWidth={l.sw} strokeLinecap="round" strokeLinejoin="round" opacity={l.o}
              strokeDasharray={totalLen} style={{ ['--ecg-len' as string]: totalLen, animation: `ecg-draw ${l.dur}s linear infinite`, willChange: 'stroke-dashoffset' }} />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/20 via-transparent to-[hsl(var(--ds-color-bg))]/40" />
    </div>
  );
};

/* ── NEURAL ── elegant brain network, full viewport, synaptic pulses ── */
const NeuralBackground = () => {
  const VW = 1200, VH = 700;
  const mb32 = (s: number) => { let t = s + 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const seed = (i: number) => mb32(i * 31 + 7);

  // Brain shape via density — denser in center ellipse, sparser outside
  const ECX = 600, ECY = 310, ERX = 380, ERY = 240;
  const isInEllipse = (x: number, y: number) => ((x - ECX) / ERX) ** 2 + ((y - ECY) / ERY) ** 2 < 1;

  interface Node2D { x: number; y: number; r: number; o: number; dur: number; delay: number; color: string }
  const nodes: Node2D[] = [];

  // Zone 1: Dense (brain body) — 75 nodes
  let attempt = 0;
  while (nodes.length < 75 && attempt < 400) {
    const x = ECX + (seed(attempt * 2) - 0.5) * ERX * 2;
    const y = ECY + (seed(attempt * 2 + 1) - 0.5) * ERY * 2;
    attempt++;
    if (!isInEllipse(x, y)) continue;
    const distNorm = Math.sqrt(((x - ECX) / ERX) ** 2 + ((y - ECY) / ERY) ** 2);
    if (seed(attempt + 600) > 1 - distNorm * 0.55) continue; // denser at center
    nodes.push({
      x, y,
      r: 1.2 + seed(attempt + 200) * 1.0,
      o: 0.30 + seed(attempt + 300) * 0.25,
      dur: 5 + seed(attempt + 400) * 9,
      delay: seed(attempt + 500) * 6,
      color: 'accent',
    });
  }

  // Zone 2: Sparse (axonal spread) — 35 nodes across full viewport
  attempt = 0;
  while (nodes.length < 110 && attempt < 200) {
    const x = seed(attempt * 2 + 2000) * VW;
    const y = seed(attempt * 2 + 2001) * VH;
    attempt++;
    if (isInEllipse(x, y)) continue; // outside brain body only
    nodes.push({
      x, y,
      r: 1.0 + seed(attempt + 3200) * 0.8,
      o: 0.20 + seed(attempt + 3300) * 0.20,
      dur: 6 + seed(attempt + 3400) * 10,
      delay: seed(attempt + 3500) * 8,
      color: seed(attempt + 3000) < 0.3 ? 'secondary' : 'accent',
    });
  }

  // Edges — connect nearby nodes
  const connCount = new Array(nodes.length).fill(0);
  const edges: { a: number; b: number; dist: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (connCount[i] >= 4 || connCount[j] >= 4) continue;
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = (i >= 75 || j >= 75) ? 90 : 120;
      if (dist < maxDist) {
        edges.push({ a: i, b: j, dist });
        connCount[i]++;
        connCount[j]++;
      }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
      <SharedStyles />
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.51 }}>
        {/* Connection lines — thin, subtle */}
        {edges.map((e, i) => {
          const a = nodes[e.a], b = nodes[e.b];
          const lineO = 0.10 + (1 - e.dist / 120) * 0.14;
          return (
            <line key={`e${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="hsl(var(--ds-color-accent))" strokeWidth="0.5" opacity={lineO} />
          );
        })}

        {/* Synaptic pulses — light traveling along connections */}
        {edges.map((e, i) => {
          if (seed(i + 300) > 0.6) return null; // only ~60% of edges get pulses
          const a = nodes[e.a], b = nodes[e.b];
          const dur = 1.5 + seed(i + 700) * 2.5;
          const delay = seed(i + 800) * 8;
          return (
            <circle key={`p${i}`} r="1.5" fill="white" className="neural-pulse-dot">
              <animateMotion
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                path={`M${a.x},${a.y} L${b.x},${b.y}`}
              />
              <animate
                attributeName="opacity"
                values="0;0;0.7;0.5;0"
                keyTimes="0;0.1;0.3;0.7;1"
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Nodes — delicate dots with subtle halo */}
        {nodes.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r * 2.5}
              fill={`hsl(var(--ds-color-${n.color}))`} opacity={0.04 + seed(i + 100) * 0.04} />
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={`hsl(var(--ds-color-${n.color}))`}
              opacity={n.o}
              style={{
                ['--nd-o' as string]: `${n.o}`,
                animation: `neural-dot-pulse ${n.dur}s ease-in-out ${n.delay}s infinite`,
              }}
            />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/30 via-transparent to-[hsl(var(--ds-color-bg))]/20" />
    </div>
  );
};

/* ── XRAY ── real chest radiograph + animated scan overlay ── */
const XRayBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    {/* Real X-ray image — grayscale base */}
    <img src="/backgrounds/xray-chest.jpg" alt="" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'grayscale(1) brightness(0.4) contrast(1.3)', opacity: 0.25 }} />
    {/* Color tint overlay — adapts to design token accent color */}
    <div className="absolute inset-0" style={{ background: 'hsl(var(--ds-color-accent))', mixBlendMode: 'color', opacity: 0.6 }} />
    {/* Animated heart pulse glow */}
    <div className="absolute" style={{
      left: '42%', top: '38%', width: '16%', height: '24%',
      background: 'radial-gradient(ellipse, hsl(var(--ds-color-accent) / 0.3) 0%, transparent 70%)',
      animation: 'xray-heart 1.5s ease-in-out infinite',
    }} />
    {/* Scan line sweep */}
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--ds-color-accent) / 0.08) 49%, hsl(var(--ds-color-accent) / 0.15) 50%, hsl(var(--ds-color-accent) / 0.08) 51%, transparent 100%)',
      backgroundSize: '100% 200%',
      animation: 'cell-drift-1 8s ease-in-out infinite',
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/40 via-transparent to-[hsl(var(--ds-color-bg))]/50" />
  </div>
);

/* ── STETHOSCOPE ── real photo + color tint + subtle pulse ── */
const StethoscopeBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    {/* Real stethoscope image */}
    <img src="/backgrounds/stethoscope.jpg" alt="" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'grayscale(1) brightness(0.55) contrast(1.4)', opacity: 0.4 }} />
    {/* Color tint — adapts to design token */}
    <div className="absolute inset-0" style={{ background: 'hsl(var(--ds-color-accent))', mixBlendMode: 'color', opacity: 0.6 }} />
    {/* Subtle vignette */}
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--ds-color-bg) / 0.6) 100%)',
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/35 via-transparent to-[hsl(var(--ds-color-bg))]/45" />
  </div>
);

/* ── MICROSCOPY ── real fluorescence image + drift overlay ── */
const MicroscopyBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    {/* Real microscopy image — scaled up to allow drift without edges showing */}
    <div className="absolute" style={{ inset: '-40px', animation: 'cell-drift-2 30s ease-in-out infinite', willChange: 'transform' }}>
      <img src="/backgrounds/microscopy.jpg" alt="" aria-hidden="true"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.7) contrast(1.4)', opacity: 0.55 }} />
    </div>
    {/* Color tint — adapts to accent color */}
    <div className="absolute inset-0" style={{ background: 'hsl(var(--ds-color-accent))', mixBlendMode: 'color', opacity: 0.7 }} />
    {/* Secondary color glow spots for depth */}
    <div className="absolute" style={{
      width: '40%', height: '40%', top: '10%', left: '60%', borderRadius: '50%',
      background: 'radial-gradient(ellipse, hsl(var(--ds-color-secondary) / 0.2) 0%, transparent 70%)',
      animation: 'cell-drift-3 20s ease-in-out infinite',
    }} />
    <div className="absolute" style={{
      width: '35%', height: '35%', top: '55%', left: '5%', borderRadius: '50%',
      background: 'radial-gradient(ellipse, hsl(var(--ds-color-secondary) / 0.15) 0%, transparent 70%)',
      animation: 'cell-drift-1 25s ease-in-out infinite',
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/25 via-transparent to-[hsl(var(--ds-color-bg))]/35" />
  </div>
);

/* ── AI ── artificial intelligence brain on circuit board ── */
const AIBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    <img src="/backgrounds/ai-brain.jpg" alt="" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.3)', opacity: 0.35 }} />
    {/* Color tint — adapts to design token */}
    <div className="absolute inset-0" style={{ background: 'hsl(var(--ds-color-accent))', mixBlendMode: 'color', opacity: 0.65 }} />
    {/* Pulse glow on brain center */}
    <div className="absolute" style={{
      left: '35%', top: '20%', width: '30%', height: '50%',
      background: 'radial-gradient(ellipse, hsl(var(--ds-color-accent) / 0.15) 0%, transparent 70%)',
      animation: 'xray-heart 3s ease-in-out infinite',
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/30 via-transparent to-[hsl(var(--ds-color-bg))]/40" />
  </div>
);

/* ── HEART ── anatomical 3D heart ── */
const HeartBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[hsl(var(--ds-color-bg))]" />
    <SharedStyles />
    <img src="/backgrounds/heart.jpg" alt="" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.3)', opacity: 0.35 }} />
    <div className="absolute inset-0" style={{ background: 'hsl(var(--ds-color-accent))', mixBlendMode: 'color', opacity: 0.6 }} />
    {/* Subtle heartbeat pulse */}
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse at 50% 45%, hsl(var(--ds-color-accent) / 0.12) 0%, transparent 60%)',
      animation: 'xray-heart 1.5s ease-in-out infinite',
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--ds-color-bg))]/30 via-transparent to-[hsl(var(--ds-color-bg))]/40" />
  </div>
);

const BACKGROUNDS: Record<string, React.FC> = {
  aurora: AuroraBackground,
  'gradient-mesh': NeuralBackground,
  particles: DNABackground,
  heartbeat: HeartbeatBackground,
  xray: XRayBackground,
  stethoscope: StethoscopeBackground,
  microscopy: MicroscopyBackground,
  ai: AIBackground,
  heart: HeartBackground,
};

export const HERO_BACKGROUND_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'image', label: 'Foto', description: 'Upload de imagem de fundo' },
  { value: 'aurora', label: 'Aurora', description: 'Aurora borealis — gradientes organicos' },
  { value: 'heartbeat', label: 'Eletrocardiograma', description: 'ECG desenhado em tempo real' },
  { value: 'particles', label: 'DNA', description: 'Dupla helice girando com glow' },
  { value: 'gradient-mesh', label: 'Neural', description: 'Rede neural cerebral com sinapses' },
  { value: 'xray', label: 'Raio-X', description: 'Radiografia torácica com coração pulsante' },
  { value: 'stethoscope', label: 'Estetoscópio', description: 'Foto real com tinta adaptável ao tema' },
  { value: 'microscopy', label: 'Microscopia', description: 'Células fluorescentes flutuando' },
  { value: 'ai', label: 'Inteligência Artificial', description: 'Androide com circuitos internos' },
  { value: 'heart', label: 'Coração', description: 'Coração anatômico 3D com iluminação' },
];

interface Props { type: string }
export const HeroAnimatedBackground = memo(({ type }: Props) => {
  const C = BACKGROUNDS[type];
  return C ? <C /> : null;
});
