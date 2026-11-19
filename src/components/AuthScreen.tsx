import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, KeyRound, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { UserRole } from '../types/venture';
import { isValidEmail } from '../utils/format';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSignUp: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<string | null>;
  isLoading: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp, isLoading }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Designer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleModeSwitch = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address (e.g., studio@brand.in).');
      return;
    }

    if (mode === 'login') {
      if (!password) {
        setError('Please enter your password.');
        return;
      }
      const err = await onLogin(trimmedEmail, password);
      if (err) setError(err);
      return;
    }

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    const err = await onSignUp(name.trim(), trimmedEmail, password, role);
    if (err) setError(err);
  };

  const handleDemoFill = async (demoEmail: string, demoPassword: string) => {
    setMode('login');
    setError(null);
    setEmail(demoEmail);
    setPassword(demoPassword);
    const err = await onLogin(demoEmail, demoPassword);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F171A]">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Editorial Brand Story */}
        <section className="relative lg:col-span-6 bg-[#32081B] text-[#FAF7F2] flex flex-col justify-between overflow-hidden min-h-[380px] lg:min-h-full">
          {!imageError ? (
            <img
              src="/src/assets/images/login_atelier_hero_1795115854704.jpg"
              alt="Curated luxury bridal lehenga showcase inside a 5-star Delhi NCR suite"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A102A] via-[#32081B] to-[#1F0511]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#240513] via-[#32081B]/70 to-[#32081B]/45" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col justify-between h-full gap-10">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#E8D9B8] font-medium">
                Delhi NCR Luxury Pop-Up Exhibition
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-white leading-[1.12] [text-wrap:balance]">
                Vibe &amp; Vogue: Designer Stall Studio
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#F3EDE3]/90 max-w-xl leading-relaxed">
                Touch. Try. Trust. Reach verified affluent brides-to-be and wedding guests aged 25–38 without committing to a flagship retail lease.
              </p>
            </div>

            <div className="border-t border-[#E8D9B8]/25 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#E8D9B8] tracking-wide">Turnkey 5-Star Format</p>
                <p className="mt-1 text-xl font-serif text-white tabular-nums">₹85,000</p>
                <p className="mt-1 text-xs text-[#F3EDE3]/75">Ready-to-display luxury stall</p>
              </div>
              <div>
                <p className="text-xs text-[#E8D9B8] tracking-wide">Target Cohort</p>
                <p className="mt-1 text-xl font-serif text-white">35 Designers</p>
                <p className="mt-1 text-xs text-[#F3EDE3]/75">Curated non-mainstream labels</p>
              </div>
              <div>
                <p className="text-xs text-[#E8D9B8] tracking-wide">Buying Window</p>
                <p className="mt-1 text-xl font-serif text-white">1–2 Months</p>
                <p className="mt-1 text-xs text-[#F3EDE3]/75">Pre-peak wedding intent</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Authentication Form */}
        <section className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#FAF7F2]">
          <div className="w-full max-w-md space-y-7">
            <div>
              <div className="inline-flex p-1 bg-[#EFE8DC] rounded-lg border border-[#E2D9CE]">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    mode === 'login'
                      ? 'bg-[#4A102A] text-[#FAF7F2]'
                      : 'text-[#6B5D62] hover:text-[#1F171A]'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signup')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    mode === 'signup'
                      ? 'bg-[#4A102A] text-[#FAF7F2]'
                      : 'text-[#6B5D62] hover:text-[#1F171A]'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl font-serif text-[#1F171A]">
                {mode === 'login' ? 'Enter the Studio' : 'Register Your Atelier'}
              </h2>
              <p className="mt-1.5 text-sm text-[#6B5D62]">
                {mode === 'login'
                  ? 'Sign in with your studio or founder credentials to run stall ROI assessments.'
                  : 'Create an account to evaluate exhibition economics and reserve stall interest.'}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] text-sm text-[#991B1B]"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ananya Verma"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8CEC0] rounded-lg text-sm text-[#1F171A] placeholder:text-[#9A8D91] focus:outline-none focus:border-[#4A102A] focus:ring-2 focus:ring-[#4A102A]/15"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.in"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8CEC0] rounded-lg text-sm text-[#1F171A] placeholder:text-[#9A8D91] focus:outline-none focus:border-[#4A102A] focus:ring-2 focus:ring-[#4A102A]/15"
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-[#1F171A] mb-1.5">
                  Password {mode === 'signup' && <span className="text-xs font-normal text-[#6B5D62]">(min. 6 characters)</span>}
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    className="w-full px-3.5 py-2.5 pr-11 bg-white border border-[#D8CEC0] rounded-lg text-sm text-[#1F171A] placeholder:text-[#9A8D91] focus:outline-none focus:border-[#4A102A] focus:ring-2 focus:ring-[#4A102A]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#6B5D62] hover:text-[#1F171A] rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label
                      htmlFor="auth-confirm-password"
                      className="block text-sm font-medium text-[#1F171A] mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="auth-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        required
                        className="w-full px-3.5 py-2.5 pr-11 bg-white border border-[#D8CEC0] rounded-lg text-sm text-[#1F171A] placeholder:text-[#9A8D91] focus:outline-none focus:border-[#4A102A] focus:ring-2 focus:ring-[#4A102A]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#6B5D62] hover:text-[#1F171A] rounded"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-[#1F171A] mb-1.5">Account Role</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(['Designer', 'Admin'] as UserRole[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRole(option)}
                          className={`px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${
                            role === option
                              ? 'bg-[#4A102A] text-white border-[#4A102A]'
                              : 'bg-white text-[#1F171A] border-[#D8CEC0] hover:border-[#4A102A]/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4A102A] hover:bg-[#380A1F] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <span>
                  {isLoading
                    ? 'Authenticating...'
                    : mode === 'login'
                      ? 'Sign In to Studio'
                      : 'Create Studio Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Access Card */}
            <div className="p-4 rounded-xl bg-[#F3EDE3] border border-[#E2D9CE] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-[#4A102A]">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Demo Access</span>
                </div>
                <span className="text-xs text-[#6B5D62]">Click to sign in immediately</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoFill('nishita.0251mba514@dgu.ac.in', 'Admin@123')}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#DFD5C7] rounded-lg text-left transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A102A]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Admin · Nishita Singh</span>
                    </div>
                    <p className="mt-0.5 text-xs font-mono text-[#6B5D62] truncate">
                      nishita.0251mba514@dgu.ac.in / Admin@123
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#4A102A] shrink-0">Use Admin</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoFill('designer@demo.com', 'Designer@123')}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#DFD5C7] rounded-lg text-left transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1F171A]">Designer · Ananya Verma</p>
                    <p className="mt-0.5 text-xs font-mono text-[#6B5D62] truncate">
                      designer@demo.com / Designer@123
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#4A102A] shrink-0">Use Designer</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2D9CE] bg-[#F3EDE3] px-6 py-4 text-center text-xs text-[#6B5D62]">
        Venture by Nishita Singh | nishita.0251mba514@dgu.ac.in | DBS Global University, Venture Quest
      </footer>
    </div>
  );
};
