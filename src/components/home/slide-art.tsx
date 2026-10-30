'use client';
import { motion, useReducedMotion } from 'framer-motion';

const G = '#75AE42';
const L = '#94B53E';
const D = '#0A1512';
const P = '#15271F';
const B = '#2C4A3D';

/** Packet travelling along an SVG path (SMIL). Omitted entirely for reduced motion. */
function Packet({ path, dur = 3, begin = 0, r = 4, color = L, show }: { path: string; dur?: number; begin?: number; r?: number; color?: string; show: boolean }) {
  if (!show) return null;
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
}

/** White tile holding one of the company's own technology-stack logos (files in /public/icon). */
function Logo({ file, x, y, size = 32, delay = 0, anim, title }: { file: string; x: number; y: number; size?: number; delay?: number; anim: boolean; title: string }) {
  return (
    <motion.g initial={anim ? { opacity: 0, scale: 0.6 } : false} animate={anim ? { opacity: 1, scale: 1, y: [0, -4, 0] } : { opacity: 1 }}
      transition={{ opacity: { duration: 0.5, delay }, scale: { type: 'spring', stiffness: 180, damping: 14, delay }, y: { duration: 4.5, repeat: Infinity, delay: delay + 0.6, ease: 'easeInOut' } }} style={{ transformOrigin: `${x + size / 2}px ${y + size / 2}px` }}>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.28} fill="#fff" />
      <image href={`/icon/${file}`} x={x + size * 0.16} y={y + size * 0.16} width={size * 0.68} height={size * 0.68} preserveAspectRatio="xMidYMid meet"><title>{title}</title></image>
    </motion.g>
  );
}

const T = { fontFamily: 'var(--font-inter), system-ui, sans-serif' } as const;

/** Original brand illustrations for the three hero messages (decorative; no data or claims). */
export function SlideArt({ index }: { index: number }) {
  const reduce = useReducedMotion();
  const anim = !reduce;
  const float = (d = 0, y = 8) => (anim ? { animate: { y: [0, -y, 0] }, transition: { duration: 5 + d, repeat: Infinity, ease: 'easeInOut' as const, delay: d } } : {});
  const pulse = (d = 0) => (anim ? { animate: { opacity: [0.2, 0.9, 0.2], scale: [1, 1.35, 1] }, transition: { duration: 2.6, repeat: Infinity, delay: d } } : {});
  const pop = (d: number) => ({ initial: anim ? { opacity: 0, scale: 0.7 } : false, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, delay: d, type: 'spring' as const, stiffness: 160, damping: 14 } });

  return (
    <svg viewBox="0 0 640 440" className="h-full w-full" role="presentation" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0F1C18" /><stop offset="1" stopColor={P} /></linearGradient>
        <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={L} /><stop offset="1" stopColor={G} /></linearGradient>
        <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={L} /><stop offset="1" stopColor="#3f6b22" /></linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={L} stopOpacity="0" /><stop offset=".5" stopColor={L} stopOpacity=".22" /><stop offset="1" stopColor={L} stopOpacity="0" /></linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={G} stopOpacity=".38" /><stop offset="1" stopColor={G} stopOpacity="0" /></radialGradient>
        <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="#fff" opacity=".10" /></pattern>
        <clipPath id="dashClip"><rect x="150" y="84" width="360" height="236" rx="18" /></clipPath>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".14" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="640" height="440" fill="url(#bg)" />
      <rect width="640" height="440" fill="url(#dots)" />
      <motion.circle cx="380" cy="190" r="240" fill="url(#halo)" {...(anim ? { animate: { scale: [1, 1.08, 1] }, transition: { duration: 6, repeat: Infinity } } : {})} style={{ transformOrigin: '380px 190px' }} />

      {/* ============ 0 · Enterprise & SaaS ============ */}
      {index === 0 && (
        <g>
          {([['nextjs.svg', 'Next.js'], ['node_js.svg', 'Node.js'], ['react_js.svg', 'React'], ['docker.svg', 'Docker'], ['kubernetes.svg', 'Kubernetes']] as [string, string][]).map(([file, name], k) => (
            <Logo key={name} file={file} title={name} x={70 + k * 44} y={14} size={34} delay={0.3 + k * 0.12} anim={anim} />
          ))}
          {[0, 1].map(n => (
            <motion.rect key={n} x={110 + n * 28} y={52 + n * 30} width="370" height="250" rx="20" fill={P} stroke={B} strokeWidth="1.5" opacity={0.7 - n * 0.15} {...float(n * 0.7, 5)} />
          ))}
          {/* rising particles */}
          {anim && [60, 130, 215, 300, 390, 470, 545, 600].map((px, k) => (
            <motion.circle key={px} cx={px} cy="420" r={2 + (k % 3)} fill={L} initial={{ opacity: 0 }} animate={{ y: [0, -380], opacity: [0, 0.6, 0] }} transition={{ duration: 6 + (k % 4), repeat: Infinity, delay: k * 0.7, ease: 'easeOut' }} />
          ))}
          <motion.ellipse cx="330" cy="195" rx="290" ry="150" fill="none" stroke={G} strokeOpacity=".25" strokeDasharray="4 8" {...(anim ? { animate: { strokeDashoffset: [0, -24] }, transition: { duration: 2, repeat: Infinity, ease: 'linear' } } : {})} />
          <Packet show={anim} path="M40 195 a290 150 0 1 1 580 0 a290 150 0 1 1 -580 0" dur={9} r={5} color={L} />

          <motion.g {...pop(0.1)} style={{ transformOrigin: '330px 195px' }}>
            <motion.g {...float(0.3, 6)}>
              <rect x="150" y="84" width="360" height="236" rx="18" fill={D} stroke={G} strokeWidth="2" />
              {['#ef6f6c', '#f3c64f', G].map((c, k) => (
                <motion.circle key={c} cx={176 + k * 18} cy="108" r="5" fill={c} {...(anim ? { animate: { opacity: [0.45, 1, 0.45], scale: [1, 1.3, 1] }, transition: { duration: 2.4, repeat: Infinity, delay: k * 0.4 } } : {})} style={{ transformOrigin: `${176 + k * 18}px 108px` }} />
              ))}
              <rect x="236" y="98" width="150" height="20" rx="10" fill={P} /><text x="311" y="112" textAnchor="middle" fontSize="12" fontWeight="600" fill="#cfe0d4" style={T}>SaaS Platform</text>
              <rect x="170" y="134" width="78" height="168" rx="10" fill={P} />
              {['Dashboard', 'Tenants', 'Users', 'Billing'].map((t, r) => (
                <g key={t}>
                  <circle cx="181" cy={151 + r * 28} r="2.6" fill={r === 0 ? L : B} {...(anim ? { animate: { fill: [0, 1, 2, 3, 4].map(s => (s % 4 === r ? L : B)) }, transition: { duration: 8, repeat: Infinity, ease: 'linear' } } : {})} />
                  <motion.text x="192" y={155 + r * 28} fontSize="10" fontWeight={r === 0 ? 700 : 500} fill={r === 0 ? '#fff' : '#a7b8ae'} style={T}
                    {...(anim ? { animate: { fill: [0, 1, 2, 3, 4].map(s => (s % 4 === r ? '#ffffff' : '#a7b8ae')) }, transition: { duration: 8, repeat: Infinity, ease: 'linear' } } : {})}>{t}</motion.text>
                </g>
              ))}
              {/* moving menu highlight: cycles Dashboard → Tenants → Users → Billing */}
              <motion.rect x="174" y="141" width="70" height="20" rx="7" fill={G} opacity=".22"
                {...(anim ? { animate: { y: [141, 169, 197, 225, 141] }, transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' } } : {})} />
              <text x="272" y="136" fontSize="12.5" fontWeight="700" fill="#fff" style={T}>Analytics</text>
              <text x="272" y="150" fontSize="10.5" fill="#a7b8ae" style={T}>Product overview</text>
              {[0.55, 0.8, 0.62, 0.95, 0.7, 1].map((v, k) => (
                <motion.rect key={k} x={272 + k * 36} width="22" rx="6" fill="url(#bar)"
                  initial={{ height: v * 135, y: 292 - v * 135 }}
                  animate={anim ? { height: [v * 120, v * 150, v * 120], y: [292 - v * 120, 292 - v * 150, 292 - v * 120] } : { height: v * 135, y: 292 - v * 135 }}
                  transition={{ duration: 3.2 + k * 0.3, repeat: Infinity, ease: 'easeInOut', delay: k * 0.15 }} />
              ))}
              {/* percentage labels ride on top of each bar (illustrative values) */}
              {[0.55, 0.8, 0.62, 0.95, 0.7, 1].map((v, k) => (
                <motion.text key={'p' + k} x={283 + k * 36} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" style={T}
                  initial={{ y: 292 - v * 135 - 6 }} animate={anim ? { y: [292 - v * 120 - 6, 292 - v * 150 - 6, 292 - v * 120 - 6] } : { y: 292 - v * 135 - 6 }}
                  transition={{ duration: 3.2 + k * 0.3, repeat: Infinity, ease: 'easeInOut', delay: k * 0.15 }}>{Math.round(v * 100)}%</motion.text>
              ))}
              <text x="272" y="310" fontSize="9.5" fill="#a7b8ae" style={T}>Illustrative sample data</text>
              <motion.path d="M280 258 L316 236 L352 246 L388 206 L424 222 L460 168" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
                initial={{ pathLength: anim ? 0 : 1 }} animate={anim ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }} transition={{ duration: 4.5, repeat: anim ? Infinity : 0, times: [0, 0.5, 0.85, 1] }} />
              <Packet show={anim} path="M280 258 L316 236 L352 246 L388 206 L424 222 L460 168" dur={4.5} r={5} color="#fff" />
              {/* light sweep across the dashboard window */}
              {anim && (
                <g clipPath="url(#dashClip)">
                  <motion.rect y="84" width="90" height="236" fill="url(#sweep)" initial={{ x: 120 }} animate={{ x: [120, 520] }} transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }} />
                </g>
              )}
            </motion.g>
          </motion.g>

          <motion.text x="330" y="344" textAnchor="middle" fontSize="13" fontWeight="600" fill={L} style={T} initial={{ opacity: anim ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>Scalable · Multi-tenant · Cloud-native</motion.text>
          <motion.g {...pop(0.5)} style={{ transformOrigin: '540px 90px' }}>
            <motion.g {...float(0.2, 10)}>
              <rect x="440" y="52" width="150" height="62" rx="14" fill="url(#gr)" />
              <rect x="455" y="68" width="30" height="30" rx="9" fill="#fff" /><image href="/icon/kubernetes.svg" x="459" y="72" width="22" height="22" preserveAspectRatio="xMidYMid meet"><title>Kubernetes</title></image><text x="494" y="79" fontSize="13" fontWeight="700" fill={D} style={T}>Cloud-native</text><text x="494" y="96" fontSize="12" fontWeight="500" fill={D} opacity=".75" style={T}>SaaS Product</text>
              <motion.circle cx="578" cy="58" r="7" fill="#ef6f6c" {...(anim ? { animate: { scale: [1, 1.4, 1] }, transition: { duration: 1.6, repeat: Infinity } } : {})} style={{ transformOrigin: '578px 58px' }} />
            </motion.g>
          </motion.g>
          <motion.g {...pop(0.8)} style={{ transformOrigin: '110px 290px' }}>
            <motion.g {...float(1, 9)}>
              <motion.rect x="64" y="252" width="130" height="56" rx="14" fill={D} stroke={G} strokeWidth="1.5" {...(anim ? { animate: { strokeOpacity: [0.4, 1, 0.4], strokeWidth: [1.5, 3, 1.5] }, transition: { duration: 2.4, repeat: Infinity } } : {})} />
              {anim && <motion.circle cx="96" cy="284" fill="none" stroke={G} strokeWidth="2" initial={{ r: 14, opacity: 0 }} animate={{ r: [14, 34], opacity: [0.7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />}
              <motion.path d="M96 268 l14 5 v10 c0 8 -6 13 -14 16 c-8 -3 -14 -8 -14 -16 v-10z" fill={G} {...(anim ? { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2.4, repeat: Infinity } } : {})} style={{ transformOrigin: '96px 284px' }} />
              <motion.path d="M90 284 l5 5 9 -10" stroke={D} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" {...(anim ? { initial: { pathLength: 0 }, animate: { pathLength: [0, 1, 1, 0] }, transition: { duration: 2.4, repeat: Infinity, times: [0, 0.35, 0.85, 1] } } : {})} />
              <text x="122" y="276" fontSize="12.5" fontWeight="700" fill="#fff" style={T}>Enterprise</text><text x="122" y="293" fontSize="12.5" fontWeight="500" fill="#a7b8ae" style={T}>Security</text>
            </motion.g>
          </motion.g>
          <motion.g {...pop(1.1)} style={{ transformOrigin: '520px 290px' }}>
            <motion.g {...float(0.6, 8)}>
              <rect x="470" y="258" width="130" height="50" rx="14" fill={D} stroke={B} strokeWidth="1.5" />
              {[0, 1, 2].map(k => (
                <motion.g key={k} {...(anim ? { animate: { y: [0, -4, 0], scale: [1, 1.14, 1] }, transition: { duration: 2.4, repeat: Infinity, delay: k * 0.35 } } : {})} style={{ transformOrigin: `${490 + k * 21}px 283px` }}>
                  <circle cx={490 + k * 21} cy="283" r="11" fill={k === 1 ? L : k === 2 ? G : '#3f6b4f'} stroke={D} strokeWidth="2.5" />
                  <circle cx={490 + k * 21} cy="279" r="3.4" fill={D} opacity=".8" />
                  <path d={`M${484.5 + k * 21} 290.5 a5.5 5.5 0 0 1 11 0z`} fill={D} opacity=".8" />
                </motion.g>
              ))}
              <motion.rect x="552" y="273" width="44" height="20" rx="10" fill={G} {...(anim ? { animate: { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }, transition: { duration: 2.4, repeat: Infinity, delay: 1.1 } } : {})} style={{ transformOrigin: '574px 283px' }} />
              <text x="574" y="287" textAnchor="middle" fontSize="10" fontWeight="800" fill={D} style={T}>Admin</text><text x="535" y="328" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#cfe0d4" style={T}>Role-based access</text>
            </motion.g>
          </motion.g>
        </g>
      )}

      {/* ============ 1 · AI & Machine Learning ============ */}
      {index === 1 && (
        <g>
          {(() => {
            const cols: [number, number[]][] = [[80, [100, 190, 280]], [180, [60, 145, 235, 320]], [280, [100, 190, 280]], [365, [190]]];
            const edges: React.ReactElement[] = [];
            const paths: string[] = [];
            cols.slice(0, -1).forEach(([x1, ys1], c) => cols[c + 1][1].forEach((y2, j) => ys1.forEach((y1, i) => {
              edges.push(<motion.line key={`${c}-${i}-${j}`} x1={x1} y1={y1} x2={cols[c + 1][0]} y2={y2} stroke={G} strokeOpacity=".32" strokeWidth="1.5" strokeDasharray="5 7" {...(anim ? { animate: { strokeDashoffset: [0, -24] }, transition: { duration: 1.4, repeat: Infinity, ease: 'linear' } } : {})} />);
              if ((i + j + c) % 3 === 0) paths.push(`M${x1} ${y1} L${cols[c + 1][0]} ${y2}`);
            })));
            return (
              <>
                {edges}
                {([['openai.svg', 'OpenAI'], ['pytorch.svg', 'PyTorch'], ['tensorflow.svg', 'TensorFlow'], ['python.svg', 'Python']] as [string, string][]).map(([file, name], k) => (
                  <Logo key={name} file={file} title={name} x={236 + k * 44} y={14} size={34} delay={0.3 + k * 0.12} anim={anim} />
                ))}
                {([[36, 'database.svg', 'Data'], [114, 'pytorch.svg', 'ML Models'], [208, 'openai.svg', 'NLP Chatbots']] as [number, string, string][]).map(([lx, file, name], k) => (
                  <Logo key={name} file={file} title={name} x={lx} y={340} size={24} delay={0.8 + k * 0.15} anim={anim} />
                ))}
                {([[80, 'Data'], [180, 'ML Models'], [280, 'NLP Chatbots']] as [number, string][]).map(([x, t], k) => (
                  <motion.text key={t} x={x} y="358" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#cfe0d4" style={T} initial={{ opacity: anim ? 0 : 1, y: anim ? 6 : 0 }}
                    animate={anim ? { opacity: [0.45, 1, 0.45], y: [0, -3, 0], fill: ['#cfe0d4', '#ffffff', '#cfe0d4'] } : { opacity: 1 }} transition={{ duration: 3.2, repeat: Infinity, delay: k * 0.5, times: [0, 0.3, 1] }}>{t}</motion.text>
                ))}
                <motion.text x="365" y="246" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={L} style={T} {...(anim ? { animate: { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }, transition: { duration: 3.2, repeat: Infinity, delay: 1.5 } } : {})}>Generative AI</motion.text>
                {/* scanning beam sweeping across the network */}
                {anim && <motion.rect y="44" width="46" height="300" rx="23" fill="url(#beam)" initial={{ x: 40 }} animate={{ x: [40, 360] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />}
                {/* ripples radiating from the output node + sparkles */}
                {anim && [0, 1, 2].map(k => <motion.circle key={k} cx="365" cy="190" fill="none" stroke={L} strokeWidth="2" initial={{ r: 18, opacity: 0 }} animate={{ r: [18, 70], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.2 + k * 1, ease: 'easeOut' }} />)}
                {anim && ([[330, 138], [405, 148], [420, 205], [322, 176]] as [number, number][]).map(([sx, sy], k) => (
                  <motion.path key={k} d={`M${sx} ${sy - 7} L${sx + 2} ${sy - 2} L${sx + 7} ${sy} L${sx + 2} ${sy + 2} L${sx} ${sy + 7} L${sx - 2} ${sy + 2} L${sx - 7} ${sy} L${sx - 2} ${sy - 2}Z`} fill="#fff"
                    animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3], rotate: [0, 90] }} transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.6 }} style={{ transformOrigin: `${sx}px ${sy}px` }} />
                ))}
                {paths.map((p, k) => <Packet key={k} show={anim} path={p} dur={2.2 + (k % 3) * 0.5} begin={(k * 0.37) % 2.5} r={3.5} color={k % 2 ? '#fff' : L} />)}
                {cols.flatMap(([x, ys], c) => ys.map((y, i) => (
                  <motion.g key={`n${c}-${i}`} {...pop(0.1 + (c * 3 + i) * 0.05)} style={{ transformOrigin: `${x}px ${y}px` }}>
                    <motion.circle cx={x} cy={y} r="19" fill={G} {...(anim ? { animate: { opacity: [0.12, 0.85, 0.12], scale: [1, 1.5, 1] }, transition: { duration: 3.2, repeat: Infinity, delay: c * 0.5, times: [0, 0.3, 1] } } : {})} style={{ transformOrigin: `${x}px ${y}px` }} />
                    <circle cx={x} cy={y} r={c === 3 ? 17 : 11} fill={c === 3 ? 'url(#gr)' : D} stroke={c === 3 ? 'none' : L} strokeWidth="2.5" filter={c === 3 ? 'url(#glow)' : undefined} />
                  </motion.g>
                )))}
                <motion.circle cx="365" cy="190" r="30" fill="none" stroke={L} strokeWidth="2" strokeDasharray="8 10" {...(anim ? { animate: { rotate: 360 }, transition: { duration: 8, repeat: Infinity, ease: 'linear' } } : {})} style={{ transformOrigin: '365px 190px' }} />
              </>
            );
          })()}

          <motion.g {...pop(0.6)} style={{ transformOrigin: '520px 190px' }}>
            <motion.g {...float(0.4, 6)}>
              <rect x="420" y="52" width="196" height="288" rx="18" fill={D} stroke={G} strokeWidth="2" />
              <circle cx="446" cy="80" r="14" fill={D} stroke={G} strokeWidth="1.5" />
              <svg x="436" y="70" width="20" height="20" viewBox="0 0 92 95.4" overflow="hidden"><image href="/assets/images/logo.svg" x="-2" y="0" width="276.75" height="95.4" /></svg><text x="464" y="80" fontSize="13" fontWeight="700" fill="#fff" style={T}>AI Assistant</text><text x="464" y="94" fontSize="10.5" fill={L} style={T}>● Online</text>
              <line x1="420" x2="616" y1="102" y2="102" stroke={P} />
              <motion.g {...(anim ? { animate: { opacity: [0, 1, 1, 1, 0], y: [8, 0, 0, 0, 0] }, transition: { duration: 8, repeat: Infinity, times: [0, 0.08, 0.5, 0.95, 1] } } : {})}>
                <rect x="486" y="116" width="116" height="38" rx="12" fill={B} /><text x="498" y="132" fontSize="11" fontWeight="600" fill="#fff" style={T}>What services</text><text x="498" y="147" fontSize="11" fontWeight="600" fill="#fff" style={T}>do you offer?</text>
              </motion.g>
              <motion.g {...(anim ? { animate: { opacity: [0, 0, 1, 0, 0] }, transition: { duration: 8, repeat: Infinity, times: [0, 0.2, 0.28, 0.4, 1] } } : { opacity: 0 })}>
                <rect x="434" y="170" width="62" height="28" rx="12" fill={P} />
                {[0, 1, 2].map(k => <motion.circle key={k} cx={452 + k * 14} cy="184" r="4" fill={L} {...(anim ? { animate: { y: [0, -4, 0] }, transition: { duration: 0.8, repeat: Infinity, delay: k * 0.15 } } : {})} />)}
              </motion.g>
              <motion.g {...(anim ? { animate: { opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 0] }, transition: { duration: 8, repeat: Infinity, times: [0, 0.38, 0.46, 0.95, 1] } } : {})}>
                <rect x="434" y="170" width="170" height="76" rx="12" fill="url(#gr)" />
                {['AI & Machine Learning,', 'SaaS, Cloud, Web, Mobile', 'and Enterprise software.'].map((line, k) => (
                  <motion.text key={line} x="446" y={190 + k * 17} fontSize="11.5" fontWeight={k === 0 ? 800 : 600} fill={D} style={T}
                    initial={{ opacity: anim ? 0 : 1, x: 0 }} animate={anim ? { opacity: [0, 0, 1, 1, 0], x: [-8, -8, 0, 0, 0] } : { opacity: 1 }}
                    transition={{ duration: 8, repeat: Infinity, times: [0, 0.46 + k * 0.05, 0.54 + k * 0.05, 0.95, 1], ease: 'easeOut' }}>{line}</motion.text>
                ))}
                <motion.text x="446" y="238" fontSize="9.5" fontWeight="600" fill={D} opacity=".7" style={T}
                  initial={{ opacity: anim ? 0 : 0.7 }} animate={anim ? { opacity: [0, 0, 0.7, 0.7, 0] } : { opacity: 0.7 }} transition={{ duration: 8, repeat: Infinity, times: [0, 0.66, 0.72, 0.95, 1] }}>— AAHA Solutions</motion.text>
              </motion.g>
              <rect x="434" y="296" width="132" height="30" rx="15" fill={P} stroke={B} /><text x="450" y="315" fontSize="12" fill="#a7b8ae" style={T}>Ask AAHA…</text>{anim && <motion.rect x="520" y="305" width="1.8" height="14" fill={L} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />}<motion.circle cx="590" cy="311" r="13" fill={G} {...(anim ? { animate: { scale: [1, 1.18, 1] }, transition: { duration: 2, repeat: Infinity } } : {})} style={{ transformOrigin: '590px 311px' }} /><path d="M584 311 h12 m-5 -5 l5 5 -5 5" stroke={D} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          </motion.g>
        </g>
      )}

      {/* ============ 2 · Cloud & Mobile ============ */}
      {index === 2 && (
        <g>
          <motion.circle cx="270" cy="150" r="120" fill="none" stroke={G} strokeOpacity=".45" strokeWidth="2" strokeDasharray="10 12" {...(anim ? { animate: { rotate: 360 }, transition: { duration: 24, repeat: Infinity, ease: 'linear' } } : {})} style={{ transformOrigin: '270px 150px' }} />
          <motion.circle cx="270" cy="150" r="146" fill="none" stroke={L} strokeOpacity=".2" strokeWidth="1.5" strokeDasharray="3 9" {...(anim ? { animate: { rotate: -360 }, transition: { duration: 36, repeat: Infinity, ease: 'linear' } } : {})} style={{ transformOrigin: '270px 150px' }} />

          {[
            { d: 'M110 318 C 130 260, 200 250, 250 205', t: 3 }, { d: 'M270 330 L270 215', t: 2.4 }, { d: 'M430 318 C 410 260, 340 250, 290 205', t: 3.4 },
          ].map((p, k) => (
            <g key={k}>
              <path d={p.d} fill="none" stroke={G} strokeOpacity=".35" strokeWidth="2" strokeDasharray="5 7" />
              <Packet show={anim} path={p.d} dur={p.t} begin={k * 0.7} r={4.5} />
              <Packet show={anim} path={p.d} dur={p.t} begin={k * 0.7 + p.t / 2} r={3} color="#fff" />
            </g>
          ))}
          <path d="M330 140 C 400 140, 410 110, 458 110" fill="none" stroke={G} strokeOpacity=".35" strokeWidth="2" strokeDasharray="5 7" />
          <Packet show={anim} path="M330 140 C 400 140, 410 110, 458 110" dur={2.2} r={4.5} color="#fff" />

          <motion.g {...pop(0.1)} style={{ transformOrigin: '270px 150px' }}>
            <motion.g {...float(0, 9)}>
              <path d="M170 190 a50 50 0 0 1 92 -26 a60 60 0 0 1 112 22 a44 44 0 0 1 -8 86 h-184 a44 44 0 0 1 -12 -82z" transform="translate(-6 -48)" fill="url(#gr)" />
              <path d="M238 156 l-22 20 22 20 M302 156 l22 20 -22 20 M282 148 l-14 56" transform="translate(0 -22)" stroke={D} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="350" y="78" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#fff" style={T}>DevOps</text>
              <motion.g {...(anim ? { animate: { rotate: 360 }, transition: { duration: 8, repeat: Infinity, ease: 'linear' } } : {})} style={{ transformOrigin: '350px 104px' }}>
                <circle cx="350" cy="104" r="13" fill={D} stroke="#fff" strokeWidth="2.5" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <rect key={a} x="347" y="84" width="6" height="8" rx="2" fill="#fff" transform={`rotate(${a} 350 104)`} />)}
                <circle cx="350" cy="104" r="4" fill={G} />
              </motion.g>
              <text x="262" y="204" textAnchor="middle" fontSize="14" fontWeight="800" fill={D} style={T}>Cloud Migration</text>
            </motion.g>
          </motion.g>

          {([[110, 328, 0.5, 'AWS'], [270, 340, 0.7, 'Azure'], [430, 328, 0.9, 'Google Cloud']] as [number, number, number, string][]).map(([x, y, d, name], k) => (
            <motion.g key={k} {...pop(d)} style={{ transformOrigin: `${x}px ${y}px` }}>
              <rect x={x - 62} y={y - 24} width="124" height="48" rx="11" fill={D} stroke={B} strokeWidth="1.5" />
              <rect x={x - 56} y={y - 16} width="32" height="32" rx="9" fill="#fff" /><image href={`/icon/${['brand-aws.svg', 'brand-azure.svg', 'brand-googlecloud.svg'][k]}`} x={x - 52} y={y - 12} width="24" height="24" preserveAspectRatio="xMidYMid meet" /><motion.circle cx={x + 52} cy={y - 14} r="3.5" fill={G} {...pulse(k * 0.5)} style={{ transformOrigin: `${x + 52}px ${y - 14}px` }} />
              <text x={x - 18} y={y + 5} fontSize="12.5" fontWeight="700" fill="#fff" style={T}>{name}</text>
            </motion.g>
          ))}

          <motion.text x="512" y="274" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#cfe0d4" style={T} initial={{ opacity: anim ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>Native &amp; cross-platform</motion.text>
          <motion.g {...pop(0.4)} style={{ transformOrigin: '520px 150px' }}>
            <motion.g {...float(0.8, 12)}>
              <rect x="458" y="40" width="108" height="210" rx="20" fill={D} stroke={G} strokeWidth="2.5" />
              <rect x="498" y="50" width="28" height="6" rx="3" fill={B} />
              <rect x="472" y="72" width="80" height="48" rx="11" fill="url(#gr)" /><text x="512" y="92" textAnchor="middle" fontSize="13" fontWeight="800" fill={D} style={T}>Native Apps</text><text x="512" y="107" textAnchor="middle" fontSize="10" fontWeight="600" fill={D} opacity=".8" style={T}>iOS &amp; Android</text>
              <text x="512" y="144" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" style={T}>Mobile App</text>
              <text x="512" y="166" textAnchor="middle" fontSize="10" fill="#a7b8ae" style={T}>Flutter · Swift</text>
              <rect x="472" y="173" width="80" height="17" rx="8.5" fill={P} /><text x="512" y="185" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={L} style={T}>React Native</text>
              <motion.rect x="472" y="198" width="80" height="30" rx="15" fill={L} {...(anim ? { animate: { opacity: [0.6, 1, 0.6] }, transition: { duration: 2.4, repeat: Infinity } } : {})} />
              <text x="512" y="217" textAnchor="middle" fontSize="12" fontWeight="800" fill={D} style={T}>Get Started</text>
              <motion.g {...(anim ? { animate: { scale: [0, 1, 1, 0] }, transition: { duration: 4, repeat: Infinity, times: [0, 0.1, 0.8, 1] } } : {})} style={{ transformOrigin: '560px 46px' }}>
                <circle cx="560" cy="46" r="10" fill="#ef6f6c" /><rect x="556" y="40" width="8" height="8" rx="2" fill="#fff" opacity=".85" />
              </motion.g>
            </motion.g>
          </motion.g>
        </g>
      )}
    </svg>
  );
}
