'use client';

interface ModalProps {
  type: 'settings' | 'help' | 'profile' | null;
  onClose: () => void;
}

export default function Modals({ type, onClose }: ModalProps) {
  if (!type) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {type === 'settings' && <SettingsModal onClose={onClose} />}
        {type === 'help' && <HelpModal onClose={onClose} />}
        {type === 'profile' && <ProfileModal onClose={onClose} />}
      </div>
    </div>
  );
}

function ModalHeader({ title, icon, onClose }: { title: string; icon: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
      </div>
      <button
        onClick={onClose}
        style={{
          width: 30, height: 30, borderRadius: 8, border: '1px solid #1e293b',
          background: 'transparent', color: '#94a3b8', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#f1f5f9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        ✕
      </button>
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = [
    { label: 'Dark Mode', description: 'Use dark theme across the dashboard', enabled: true },
    { label: 'Real-time AQI Updates', description: 'Auto-refresh AQI data every 15 minutes', enabled: true },
    { label: 'Push Notifications', description: 'Receive alerts for AQI spikes and route changes', enabled: true },
    { label: 'Auto-Reroute', description: 'Automatically reroute trucks when AQI exceeds threshold', enabled: false },
    { label: 'Gemini AI Insights', description: 'Enable AI-powered shelf-life predictions', enabled: true },
    { label: 'Sound Alerts', description: 'Play sound for critical alerts', enabled: false },
  ];

  return (
    <>
      <ModalHeader title="Settings" icon="⚙️" onClose={onClose} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {settings.map((setting, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 10, background: '#0f172a',
              border: '1px solid #1e293b', transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{setting.label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{setting.description}</div>
            </div>
            <div
              className="toggle-switch"
              style={{ background: setting.enabled ? '#22c55e' : '#334155', flexShrink: 0, cursor: 'pointer' }}
            >
              <div className="toggle-knob" style={{ left: setting.enabled ? 19 : 3 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={onClose}>Save Changes</button>
      </div>
    </>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  const faqs = [
    { q: 'What is the Fresh-Route Engine?', a: 'A logistics optimization system that routes perishable goods through low-AQI corridors to reduce contamination and spoilage during transit.' },
    { q: 'How does AQI-based routing work?', a: 'We use a modified A* algorithm where the cost function weighs both distance (40%) and AQI exposure (60%). High-AQI zones receive exponential penalties.' },
    { q: 'Is the AQI data real-time?', a: 'Yes! We aggregate from CPCB (govt), OpenAQ (crowd-sourced), and IQAir (commercial) — refreshing every 15 minutes with 500m × 500m grid resolution.' },
    { q: 'How accurate are Gemini AI predictions?', a: 'Gemini analyzes PM2.5, SO₂, NO₂, temperature, and humidity to predict shelf-life impact. Accuracy ranges from 74-92% confidence depending on cargo type.' },
    { q: 'What if rerouting makes deliveries late?', a: 'A 10-minute delay costs ~₹200 in fuel. Spoiled goods cost ₹18,000+. We optimize for VALUE, not just distance.' },
  ];

  return (
    <>
      <ModalHeader title="Help & FAQ" icon="❓" onClose={onClose} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              padding: '12px 14px', borderRadius: 10, background: '#0f172a',
              border: '1px solid #1e293b', cursor: 'pointer',
            }}
          >
            <summary style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#22c55e' }}>Q:</span> {faq.q}
            </summary>
            <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, paddingLeft: 22 }}>
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>A:</span> {faq.a}
            </div>
          </details>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: '#94a3b8' }}>
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>📧 Support:</span> support@freshroute.ai | <span style={{ color: '#3b82f6', fontWeight: 600 }}>📞</span> +91-11-FRESHRT
      </div>
    </>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <ModalHeader title="Profile" icon="👤" onClose={onClose} />
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff',
            border: '3px solid #1e293b', boxShadow: '0 0 30px rgba(34,197,94,0.2)',
          }}
        >
          JM
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>Jeshpreet Mahun</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Fleet Operations Manager</div>
        <span className="badge badge-green" style={{ marginTop: 8, display: 'inline-flex' }}>Active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Email', value: 'jeshpreet@freshroute.ai', icon: '📧' },
          { label: 'Department', value: 'Logistics Operations', icon: '🏢' },
          { label: 'Region', value: 'Delhi NCR', icon: '📍' },
          { label: 'Fleet Size', value: '50 Vehicles', icon: '🚛' },
          { label: 'Member Since', value: 'January 2026', icon: '📅' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 8, background: '#0f172a', border: '1px solid #1e293b',
            }}
          >
            <span style={{ fontSize: 12, color: '#64748b' }}>{item.icon} {item.label}</span>
            <span style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn-ghost" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={onClose}>Edit Profile</button>
      </div>
    </>
  );
}
