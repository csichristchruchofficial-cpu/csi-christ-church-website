"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { churchInfo } from "@/data/church";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialChecking, setInitialChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  // Check if already authenticated as an admin
  useEffect(() => {
    async function checkExistingSession() {
      if (!isSupabaseConfigured()) {
        setInitialChecking(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: adminRecord } = await supabase
            .from("admins")
            .select("user_id")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (adminRecord) {
            router.replace("/admin");
            return;
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setInitialChecking(false);
      }
    }

    checkExistingSession();
  }, [router, supabase]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        "Supabase credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Project Settings."
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError || !authData.user) {
        setErrorMessage(
          authError?.message === "Invalid login credentials"
            ? "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது (Invalid email or password)."
            : authError?.message || "உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்."
        );
        setLoading(false);
        return;
      }

      // 2. Authorize against the admins table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        // Sign out unauthorized user
        await supabase.auth.signOut();
        setErrorMessage(
          "அனுமதி மறுக்கப்பட்டது: இந்த கணக்கு நிர்வாகியாக (Admin) பதிவு செய்யப்படவில்லை. (Access Denied: This account is not an authorized administrator.)"
        );
        setLoading(false);
        return;
      }

      // 3. Success state and redirect
      setSuccessMessage(
        "அங்கீகரிக்கப்பட்டது! டாஷ்போர்டுக்கு அழைத்துச் செல்லப்படுகிறீர்கள்... (Authorized! Redirecting...)"
      );
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "எதிர்பாராத பிழை ஏற்பட்டது.";
      setErrorMessage(msg);
      setLoading(false);
    }
  }

  if (initialChecking) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <span className="text-sm font-semibold text-slate-300">
            சரிபார்க்கிறது (Verifying session)...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-royal/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Back to website button */}
      <div className="container-page mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-gold-light transition-colors"
        >
          <ArrowLeft size={16} />
          <span>இணையதள முகப்பிற்குச் செல் (Back to Church Website)</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        {/* Church Brand Header */}
        <div className="text-center">
          <div className="relative mx-auto h-20 w-20 rounded-full bg-white p-1 shadow-glow-gold/20 ring-4 ring-gold/60">
            <Image
              src={churchInfo.logo}
              alt={churchInfo.name}
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
            {churchInfo.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold tracking-wider text-gold uppercase">
            {churchInfo.nameEnglish} • Admin Portal
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-royal/30 px-3 py-1 text-xs font-semibold text-royal-light border border-royal/40">
            <ShieldCheck size={14} className="text-gold" />
            <span>அறிவிப்பு நிர்வாக டாஷ்போர்டு (Announcement Dashboard)</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {/* Supabase Setup Notice */}
          {!isSupabaseConfigured() && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-amber-400/50 bg-amber-500/15 p-4 text-xs sm:text-sm text-amber-200 space-y-2"
            >
              <div className="flex items-center gap-2 font-black text-amber-300">
                <AlertCircle size={16} />
                <span>Supabase Configuration Required</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                To connect your database, please add <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your <strong>Vercel Project Settings &rarr; Environment Variables</strong>.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-crimson/40 bg-crimson/15 p-4 text-xs sm:text-sm text-red-200"
            >
              <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs sm:text-sm text-emerald-200"
            >
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs sm:text-sm font-bold text-slate-200"
              >
                நிர்வாகி மின்னஞ்சல் (Admin Email)
              </label>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@csichristchurch.com"
                  className="block w-full rounded-2xl border border-white/20 bg-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs sm:text-sm font-bold text-slate-200"
              >
                கடவுச்சொல் (Password)
              </label>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-2xl border border-white/20 bg-white/10 pl-11 pr-11 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-gold focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "கடவுச்சொல்லை மறை" : "கடவுச்சொல்லைக் காட்டு"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3.5 text-sm font-black shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  உள்நுழைகிறது (Signing in)...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={18} />
                  உள்நுழைய (Sign In to Admin Portal)
                </span>
              )}
            </button>
          </form>

          {/* Help & Security Note */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              பாதுகாக்கப்பட்ட பகுதி: சபை அங்கீகாரம் பெற்ற நிர்வாகிகளுக்கு மட்டுமே அனுமதியுண்டு.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Secured with Supabase Authentication & Row Level Security (RLS).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

