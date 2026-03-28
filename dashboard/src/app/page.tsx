'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STAGES = [
  {
    id: 'problem',
    title: 'The Invisible Problem',
    subtitle: '₱18k loss per trip due to AQI',
    content: 'Delhi NCR logistics faces a hidden enemy: Air Pollution. High PM2.5 and SO₂ levels degrade perishable goods (like dairy & vegetables) up to 28% faster in transit. Standard routing ignores air quality, leading to massive spoilage and profit drain.',
    visual: '🌫️ 📉 🚛',
  },
  {
    id: 'solution',
    title: 'Our Solution: Fresh-Route',
    subtitle: 'A* Routing with AQI Awareness',
    content: 'We factor real-time AQI data into our routing algorithm. By actively bypassing highly polluted industrial zones and prioritizing green corridors, we preserve cargo integrity, ensuring up to 96% freshness retention on arrival.',
    visual: '🗺️ ✨ 🍃',
  },
  {
    id: 'tech',
    title: 'Powered by Advanced Tech',
    subtitle: 'Next.js 16 • Tailwind CSS • Gemini 2.0 Pro',
    content: 'Built on a blazing-fast Next.js architecture with real-time fleet analytics. Our Gemini 2.0 Pro AI predicts shelf-life reduction and contamination risk on the fly, providing actionable recommendations to Fleet Managers.',
    visual: '🤖 🚀 💻',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Auto-cycle through the story map
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#06090f', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Left pane: The Story presentation */}
      <div style={{ flex: 1.2, padding: '60px 80px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 80 }}>
             <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #22c55e20, #16a34a30)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              🚛
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
                Fresh-Route <span style={{ color: '#22c55e' }}>Engine</span>
              </h1>
              <div style={{ fontSize: 13, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                Logistics Revolution
              </div>
            </div>
          </div>

          {/* Interactive Story Tabs */}
          <div style={{ position: 'relative' }}>
            {/* The line connecting nodes */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 15, width: 2, background: '#1e293b', borderRadius: 2 }} />

            {STAGES.map((stage, i) => {
              const isActive = i === activeStage;
              const isPast = i < activeStage;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(i)}
                  style={{
                    display: 'flex', gap: 24, marginBottom: 40, cursor: 'pointer',
                    opacity: isActive ? 1 : 0.5, transition: 'all 0.3s'
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 2, marginTop: 4 }}>
                     <div style={{
                       width: 32, height: 32, borderRadius: '50%', background: isActive ? '#0f172a' : '#06090f',
                       border: `2px solid ${isActive ? '#22c55e' : isPast ? '#475569' : '#1e293b'}`,
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       boxShadow: isActive ? '0 0 15px rgba(34,197,94,0.4)' : 'none', transition: 'all 0.3s'
                     }}>
                       {isActive && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />}
                     </div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px 0', color: isActive ? '#f1f5f9' : '#94a3b8' }}>
                      {stage.title}
                    </h2>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#22c55e' : '#64748b', margin: '0 0 12px 0' }}>
                      {stage.subtitle}
                    </h3>
                    
                    {/* Expandable content */}
                    <div style={{
                      height: isActive ? 'auto' : 0, overflow: 'hidden', transition: 'all 0.4s',
                      opacity: isActive ? 1 : 0
                    }}>
                      <p style={{ fontSize: 15, lineHeight: 1.6, color: '#cbd5e1', maxWidth: 480, margin: '0 0 20px 0' }}>
                        {stage.content}
                      </p>
                      <div className="glass-panel" style={{ padding: '16px 20px', display: 'inline-block', fontSize: 24, letterSpacing: 8 }}>
                        {stage.visual}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right pane: Login */}
      <div style={{ flex: 1, background: '#0a0f1c', borderLeft: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
          
          <div className="glass-panel-lg" style={{ padding: 40, position: 'relative', zIndex: 10, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#111827', border: '1px solid #1e293b', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                🔒
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>Welcome Ops Manager</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Secure portal for fleet management</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Work Email / Fleet ID</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jeshpreet@freshroute.ai"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8, background: '#0f172a',
                    border: '1px solid #1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#22c55e'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                  <a href="#" style={{ fontSize: 11, color: '#22c55e', textDecoration: 'none' }}>Forgot?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 8, background: '#0f172a',
                    border: '1px solid #1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#22c55e'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn || !email || !password}
                className="btn-primary"
                style={{
                  padding: '14px', fontSize: 14, marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                  opacity: (!email || !password) ? 0.5 : 1
                }}
              >
                {loggingIn ? (
                  <>
                    <span className="animate-spin-slow" style={{ display: 'inline-block' }}>⟳</span>
                    Authenticating...
                  </>
                ) : (
                  <>Authenticate System →</>
                )}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: '#475569' }}>
               2026 Fresh-Route Engine. Designed by Jeshpreet Mahun.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
