import React, { useState } from 'react';

interface User {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Simple hash for demo purposes (not for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('mercury_users') || '[]');
  } catch {
    return [];
  }
}

function saveUser(user: User) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('mercury_users', JSON.stringify(users));
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (mode === 'login') {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          setError('Aucun compte trouvé avec cet email.');
          return;
        }
        if (user.passwordHash !== simpleHash(password)) {
          setError('Mot de passe incorrect.');
          return;
        }
        localStorage.setItem('mercury_session', JSON.stringify(user));
        onLogin(user);
      } else {
        // Register
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas.');
          return;
        }
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          return;
        }
        if (!name.trim()) {
          setError('Veuillez entrer votre nom complet.');
          return;
        }
        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          setError('Un compte avec cet email existe déjà.');
          return;
        }
        const newUser: User = {
          email: email.toLowerCase(),
          name: name.trim(),
          passwordHash: simpleHash(password),
          createdAt: new Date().toISOString()
        };
        saveUser(newUser);
        localStorage.setItem('mercury_session', JSON.stringify(newUser));
        onLogin(newUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-gradient)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
        borderRadius: '50%', animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
        borderRadius: '50%', animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '60%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', animation: 'float 12s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '560px',
        animation: 'fadeInUp 0.6s ease'
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px', height: '80px',
            borderRadius: '22px',
            background: '#0ea5e9',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            marginBottom: '22px',
            fontSize: '36px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            M
          </div>
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}>
            PRODUCTION PLANNING
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontWeight: 500 }}>
            Production Planning Control Center
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 0, 0,0.08)',
          borderRadius: '28px',
          padding: '52px 52px',
          boxShadow: '0 32px 100px rgba(0,0,0,0.55)'
        }}>

          {/* Tab Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--surface-bg)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '32px',
            border: '1px solid rgba(0, 0, 0,0.06)'
          }}>
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.25s ease',
                  background: mode === m
                    ? '#0ea5e9'
                    : 'transparent',
                  color: mode === m ? 'white' : '#64748b',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transform: 'none'
                }}
              >
                {m === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {mode === 'login' ? 'Bon retour 👋' : 'Créer votre compte'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
              {mode === 'login'
                ? 'Connectez-vous pour accéder au tableau de bord de production.'
                : 'Inscrivez-vous pour rejoindre l\'équipe de production.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Name (register only) */}
            {mode === 'register' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <label style={{
                  display: 'block', fontSize: '0.78rem', fontWeight: 700,
                  color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase'
                }}>
                  Nom complet
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '16px', pointerEvents: 'none'
                  }}>👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    style={{ paddingLeft: '42px' }}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 700,
                color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>
                Adresse email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '16px', pointerEvents: 'none'
                }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jean@mercury.be"
                  required
                  style={{ paddingLeft: '42px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 700,
                color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '16px', pointerEvents: 'none'
                }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{ paddingLeft: '42px', paddingRight: '48px' }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', padding: '4px', boxShadow: 'none',
                    color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '16px', width: 'auto'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <label style={{
                  display: 'block', fontSize: '0.78rem', fontWeight: 700,
                  color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase'
                }}>
                  Confirmer le mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '16px', pointerEvents: 'none'
                  }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      paddingLeft: '42px',
                      borderColor: confirmPassword && confirmPassword !== password
                        ? 'rgba(239,68,68,0.5)' : undefined
                    }}
                    autoComplete="new-password"
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '6px' }}>
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                animation: 'shake 0.4s ease'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <p style={{ fontSize: '0.85rem', color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '8px',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                justifyContent: 'center',
                background: isLoading
                  ? '#cbd5e1'
                  : '#0ea5e9',
                boxShadow: isLoading ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                gap: '10px',
                letterSpacing: '0.02em'
              }}
            >
              {isLoading ? (
                <>
                  <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}
                    fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="40 20" opacity="0.4" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" />
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  {mode === 'login' ? '🚀 Se connecter' : '✨ Créer mon compte'}
                </>
              )}
            </button>

          </form>

          {/* Switch mode link */}
          <p style={{
            textAlign: 'center', marginTop: '24px',
            fontSize: '0.85rem', color: 'var(--text-tertiary)'
          }}>
            {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
            {' '}
            <button
              type="button"
              onClick={switchMode}
              style={{
                background: 'transparent', border: 'none', boxShadow: 'none',
                color: '#60a5fa', fontWeight: 600, cursor: 'pointer',
                padding: '0', fontSize: '0.85rem', display: 'inline',
                textDecoration: 'underline', width: 'auto'
              }}
            >
              {mode === 'login' ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.75rem', color: '#cbd5e1' }}>
          Mercury Flooring © {new Date().getFullYear()} — Production Management System
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
