import { useState, type FormEvent } from 'react'
import logoImg from '../assets/logo.png'
import zubaImg from '../assets/zuba.png'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 0 0 .639c.007.012.018.025.024.037 2.42 4.962 6.03 7.423 9.938 7.423s7.518-2.46 9.938-7.423c.006-.012.017-.025.024-.037a1.012 1.012 0 0 0 0-.639c-.007-.012-.018-.025-.024-.037-2.42-4.962-6.03-7.423-9.938-7.423s-7.518 2.46-9.938 7.423c-.006.012-.017.025-.024.037Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  )
}

function AppPreviewCard() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[58%] z-20 w-[min(92%,420px)] -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] select-none rounded-2xl border border-white/10 bg-white p-3 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.45)] md:top-[56%] md:w-[min(88%,380px)] md:-rotate-6"
      aria-hidden
    >
      <div className="flex gap-3">
        <div className="hidden w-14 shrink-0 flex-col gap-2 rounded-xl bg-slate-100 p-2 sm:flex">
          <div className="h-2 w-full rounded bg-slate-300/80" />
          <div className="h-2 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-6 w-full rounded-lg bg-orange-200/70" />
          <div className="h-6 w-full rounded-lg bg-slate-200" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-1.5">
            {['Sports', 'Food', 'Fashion'].map((label) => (
              <span
                key={label}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {['Rwanda Jersey', 'Coffee', 'Sneakers'].map((title, i) => (
              <div
                key={title}
                className={`overflow-hidden rounded-xl border border-slate-100 bg-slate-50 ${i === 2 ? 'hidden sm:block' : ''}`}
              >
                <div
                  className={`h-14 bg-gradient-to-br ${i === 0 ? 'from-orange-200 to-amber-100' : i === 1 ? 'from-emerald-100 to-teal-50' : 'from-violet-100 to-fuchsia-50'}`}
                />
                <div className="p-2">
                  <p className="truncate text-[11px] font-semibold text-slate-800">{title}</p>
                  <p className="text-[9px] text-slate-500">In stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-gray-100 md:flex-row">
      {/* Branding column — hidden on small screens; layout is mobile-first */}
      <aside
        className="relative hidden min-h-[420px] w-full overflow-hidden bg-[#003333] md:flex md:min-h-dvh md:w-[45%] lg:w-[42%]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#001f1f]/80 to-transparent" />
        {/* Layered diagonal planes */}
        <div className="absolute -left-1/4 top-0 h-[120%] w-[70%] skew-x-[-12deg] bg-[#004d4d]/40" />
        <div className="absolute -left-[10%] top-[8%] h-[110%] w-[55%] skew-x-[-12deg] bg-[#005858]/35" />
        <div className="absolute left-[5%] top-[18%] h-[95%] w-[48%] skew-x-[-12deg] bg-[#006666]/30" />

        <div className="relative z-10 flex h-full min-h-dvh flex-col items-center justify-center px-8 pb-32 pt-16">
          <img
            src={zubaImg}
            alt="Zuba"
            className="relative z-10 w-[min(85%,320px)] max-w-sm object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            width={320}
            height={120}
          />
        </div>

        <AppPreviewCard />
      </aside>

      {/* Form column — full width on mobile */}
      <main className="flex w-full flex-1 flex-col justify-center px-5 py-10 sm:px-8 md:w-[55%] md:px-10 md:py-12 lg:w-[58%] lg:px-14">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile-only mark using logo asset */}
          <div className="mb-8 flex justify-center md:hidden">
            <img
              src={logoImg}
              alt="Zuba"
              className="h-12 w-auto object-contain sm:h-14"
              width={160}
              height={48}
            />
          </div>

          <header className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back <span aria-hidden>👋</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">Please enter your details</p>
          </header>

          <div className="space-y-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200/80 bg-gray-200 px-5 py-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-200/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              Log In with Google
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-300/90" />
              <span className="text-sm font-medium text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-300/90" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className="w-full rounded-full border border-transparent bg-gray-200 py-3.5 pl-5 pr-12 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner outline-none ring-slate-900/10 transition focus:border-slate-300 focus:bg-white focus:ring-2"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <MailIcon className="h-5 w-5" />
                </span>
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  className="w-full rounded-full border border-transparent bg-gray-200 py-3.5 pl-5 pr-12 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner outline-none ring-slate-900/10 transition focus:border-slate-300 focus:bg-white focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200/80 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-end pt-0.5">
                <a
                  href="#forgot"
                  className="text-sm font-bold text-slate-900 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Log In
              </button>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <a
              href="#signup"
              className="font-bold text-slate-900 underline-offset-4 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
