"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { churchInfo } from "@/data/church";
import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementStatus,
} from "@/lib/supabase/types";
import {
  Bell,
  Check,
  X,
  Trash2,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ExternalLink,
  Loader2,
  RefreshCw,
  Calendar,
  Send,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Authentication & User State
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form State
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("Announcement");
  const [autoApprove, setAutoApprove] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Feedback State
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // Active Tab for announcement list view
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  const fetchSubscriberCount = useCallback(async () => {
    try {
      const res = await fetch("/api/push/subscribers-count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.count ?? 0);
      }
    } catch {
      // Ignore
    }
  }, []);

  // 1. Fetch all announcements from the secure admin API
  const fetchAnnouncements = useCallback(async () => {
    setLoadingList(true);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/announcements", {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace("/admin/login");
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.error || "அறிவிப்புகளைப் பெற முடியவில்லை.");
      }

      const data = (await res.json()) as { announcements: Announcement[] };
      setAnnouncements(data.announcements || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "பிழை ஏற்பட்டது.";
      setActionError(msg);
    } finally {
      setLoadingList(false);
    }
  }, [router]);

  // 2. Verify Authentication & Admin Status
  useEffect(() => {
    async function verifyAdmin() {
      if (!isSupabaseConfigured()) {
        router.replace("/admin/login");
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace("/admin/login");
          return;
        }

        const { data: adminRecord, error: adminErr } = await supabase
          .from("admins")
          .select("user_id, email")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (adminErr || !adminRecord) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        setAdminEmail(session.user.email || adminRecord.email || "Administrator");
        setCheckingAuth(false);
        fetchAnnouncements();
        fetchSubscriberCount();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      }
    }

    verifyAdmin();
  }, [router, supabase, fetchAnnouncements, fetchSubscriberCount]);

  // 3. Create Announcement Mutation
  async function handleCreateAnnouncement(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setFormSuccess(null);
    setActionError(null);

    const targetStatus: AnnouncementStatus = autoApprove ? "approved" : "pending";

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          category,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "அறிவிப்பை உருவாக்க முடியவில்லை.");
      }

      setMessage("");
      setAutoApprove(false);
      setFormSuccess(
        autoApprove
          ? "அறிவிப்பு வெற்றிகரமாக உருவாக்கப்பட்டு நேரலையில் வெளியிடப்பட்டது! (Announcement created and published live!)"
          : "அறிவிப்பு உருவாக்கப்பட்டது (நிலுவையில் உள்ளது). (Announcement created as pending)."
      );

      // Refresh list and switch to appropriate tab
      await fetchAnnouncements();
      if (autoApprove) {
        setActiveTab("approved");
      } else {
        setActiveTab("pending");
      }

      setTimeout(() => setFormSuccess(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "பிழை ஏற்பட்டது.";
      setActionError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // 4. Update Announcement Status (Approve / Reject)
  async function handleUpdateStatus(id: string, newStatus: AnnouncementStatus) {
    setProcessingId(id);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "நிலையை மாற்ற முடியவில்லை.");
      }

      // Optimistically update or re-fetch
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
                published_at:
                  newStatus === "approved" ? new Date().toISOString() : null,
              }
            : item
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "பிழை ஏற்பட்டது.";
      setActionError(msg);
    } finally {
      setProcessingId(null);
    }
  }

  // 5. Delete Announcement
  async function handleDeleteAnnouncement(id: string) {
    const confirmed = window.confirm(
      "இந்த அறிவிப்பை நிரந்தரமாக நீக்க விரும்புகிறீர்களா? (Are you sure you want to permanently delete this announcement?)"
    );
    if (!confirmed) return;

    setProcessingId(id);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "நீக்க முடியவில்லை.");
      }

      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "பிழை ஏற்பட்டது.";
      setActionError(msg);
    } finally {
      setProcessingId(null);
    }
  }

  // 6. Sign Out
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  // Filter announcements for the active tab
  const pendingItems = announcements.filter((a) => a.status === "pending");
  const approvedItems = announcements.filter((a) => a.status === "approved");
  const rejectedItems = announcements.filter((a) => a.status === "rejected");

  const currentTabItems =
    activeTab === "pending"
      ? pendingItems
      : activeTab === "approved"
      ? approvedItems
      : rejectedItems;

  const categoryBadgeColors: Record<AnnouncementCategory, string> = {
    Announcement: "bg-royal/20 text-royal-light border-royal/40",
    Prayer: "bg-gold/20 text-amber-300 border-gold/40",
    Event: "bg-crimson/20 text-red-300 border-crimson/40",
  };

  function formatDate(iso: string) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <span className="text-sm font-semibold text-slate-300">
            நிர்வாகி அணுகலை சரிபார்க்கிறது (Verifying Administrator Session)...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-gold selection:text-navy-950 pb-20">
      {/* ============================================================== */}
      {/* 1. TOP ADMIN BAR                                               */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 backdrop-blur-md shadow-md">
        <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-white p-0.5 shadow ring-2 ring-gold/60">
              <Image
                src={churchInfo.logo}
                alt={churchInfo.name}
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm sm:text-base text-white truncate">
                {churchInfo.name}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-wider truncate">
                Admin Announcement Dashboard
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">
                {adminEmail}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Administrator
              </span>
            </div>

            {/* Phone Subscribers Badge */}
            <div
              title="பதிவுசெய்துள்ள போன் மற்றும் பிரவுசர் சந்தாதாரர்கள் (Registered Push Subscribers)"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-royal/20 border border-royal/30 px-3 py-1.5 text-xs text-blue-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>
                <strong>{subscriberCount !== null ? subscriberCount : "..."}</strong> போன் சந்தாதாரர்கள் (Subscribers)
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              title="நேரலை இணையதளத்தைப் பார்க்க (View Live Site)"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/20 hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">நேரலை தளம் (View Site)</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              title="வெளியேற (Sign Out)"
              className="inline-flex items-center gap-1.5 rounded-xl border border-crimson/40 bg-crimson/20 px-3 py-1.5 text-xs font-bold text-red-200 hover:bg-crimson hover:text-white transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">வெளியேறு (Logout)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT                                      */}
      {/* ============================================================== */}
      <main className="container-page mt-8 space-y-8">
        {/* Banner Alert for Errors */}
        {actionError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-2xl border border-crimson/50 bg-crimson/15 p-4 text-xs sm:text-sm text-red-200 animate-overlay-fade-in"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Banner Alert for Form Success */}
        {formSuccess && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/15 p-4 text-xs sm:text-sm text-emerald-200 animate-overlay-fade-in"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
            <button
              onClick={() => setFormSuccess(null)}
              className="text-emerald-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Grid: Creation Form & Announcements List */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* ------------------------------------------------------------ */}
          {/* COLUMN 1: CREATE ANNOUNCEMENT FORM (4 cols on lg)           */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-navy-900/70 backdrop-blur-md p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 text-gold-light">
              <PlusCircle size={20} className="text-gold" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                புதிய அறிவிப்பை உருவாக்கு
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Create a new church announcement, prayer request, or event notification.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="mt-6 space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  பிரிவு (Category)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Announcement", "Prayer", "Event"] as const).map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-xl py-2 px-2 text-xs font-bold transition-all border ${
                          isSelected
                            ? cat === "Announcement"
                              ? "bg-royal text-white border-royal-light shadow-md"
                              : cat === "Prayer"
                              ? "bg-gold text-navy-950 border-amber-300 shadow-md"
                              : "bg-crimson text-white border-red-400 shadow-md"
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {cat === "Announcement"
                          ? "அறிவிப்பு"
                          : cat === "Prayer"
                          ? "ஜெபம்"
                          : "நிகழ்வு"}
                        <span className="block text-[10px] opacity-80 font-normal">
                          {cat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="announcement-message"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
                >
                  செய்தி / அறிவிப்பு விவரம் (Message Content)
                </label>
                <textarea
                  id="announcement-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="எ.கா: எதிர்வரும் ஞாயிறு ஆராதனை காலை 9:00 மணிக்கு நடைபெறும். அனைவரும் கலந்துகொள்ள அன்புடன் அழைக்கிறோம்..."
                  className="w-full rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-gold focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 text-right block mt-1">
                  {message.length} எழுத்துக்கள் (characters)
                </span>
              </div>

              {/* Instant Publish Checkbox */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/10">
                <input
                  id="auto-approve-toggle"
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30 text-gold focus:ring-gold/40 bg-white/10 cursor-pointer"
                />
                <label
                  htmlFor="auto-approve-toggle"
                  className="text-xs font-semibold text-slate-200 cursor-pointer select-none"
                >
                  உடனே நேரலையில் வெளியிட (Approve & Publish Live Immediately)
                </label>
              </div>

              {/* Web Push Broadcast Notice */}
              <div className="rounded-2xl bg-royal/15 border border-royal/30 p-3 text-xs text-blue-200 flex items-start gap-2.5">
                <Bell className="h-4 w-4 text-royal-light shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Browser Web Push:</strong> அறிவிப்பு அங்கீகரிக்கப்படும்போது, போனில் அறிவிப்புகளை இயக்கியுள்ள அனைத்து சந்தாதாரர்களுக்கும் சிஸ்டம் நோட்டிபிகேஷன் தானாகவே அனுப்பப்படும்.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full btn-primary !py-3 text-sm font-black shadow-md shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    உருவாக்குகிறது (Creating)...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={16} />
                    {autoApprove
                      ? "உடனே வெளியிடு (Publish Live)"
                      : "நிலுவையில் சேர் (Add as Pending)"}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* COLUMN 2: ANNOUNCEMENTS MANAGEMENT (7 cols on lg)           */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/15 bg-navy-900/70 p-4 sm:p-5 backdrop-blur-md">
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/30 border border-white/10 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("pending")}
                  className={`relative rounded-xl px-3.5 py-1.5 text-xs font-black transition-all flex items-center gap-2 ${
                    activeTab === "pending"
                      ? "bg-amber-500 text-navy-950 shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Clock size={14} />
                  <span>நிலுவையில் உள்ளவை (Pending)</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      activeTab === "pending"
                        ? "bg-navy-950 text-amber-300"
                        : "bg-white/10 text-amber-400"
                    }`}
                  >
                    {pendingItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("approved")}
                  className={`relative rounded-xl px-3.5 py-1.5 text-xs font-black transition-all flex items-center gap-2 ${
                    activeTab === "approved"
                      ? "bg-emerald-500 text-navy-950 shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>நேரலையில் (Live Approved)</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      activeTab === "approved"
                        ? "bg-navy-950 text-emerald-300"
                        : "bg-white/10 text-emerald-400"
                    }`}
                  >
                    {approvedItems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("rejected")}
                  className={`relative rounded-xl px-3.5 py-1.5 text-xs font-black transition-all flex items-center gap-2 ${
                    activeTab === "rejected"
                      ? "bg-crimson text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <X size={14} />
                  <span>நிராகரிக்கப்பட்டவை (Rejected)</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                      activeTab === "rejected"
                        ? "bg-white text-crimson"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {rejectedItems.length}
                  </span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchAnnouncements}
                disabled={loadingList}
                title="புதுப்பிக்க (Refresh announcements)"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors shrink-0"
              >
                <RefreshCw
                  size={13}
                  className={loadingList ? "animate-spin text-gold" : ""}
                />
                <span>புதுப்பி (Refresh)</span>
              </button>
            </div>

            {/* Announcements List Container */}
            <div className="space-y-4">
              {loadingList ? (
                <div className="rounded-3xl border border-white/10 bg-navy-900/40 p-12 text-center text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold mb-3" />
                  <p className="text-sm font-semibold">
                    அறிவிப்புகள் ஏற்றப்படுகின்றன (Loading announcements)...
                  </p>
                </div>
              ) : currentTabItems.length === 0 ? (
                /* Empty State */
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-3">
                    {activeTab === "pending" ? (
                      <Clock size={28} className="text-amber-400" />
                    ) : activeTab === "approved" ? (
                      <CheckCircle2 size={28} className="text-emerald-400" />
                    ) : (
                      <X size={28} className="text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {activeTab === "pending"
                      ? "நிலுவையில் உள்ள அறிவிப்புகள் ஏதுமில்லை"
                      : activeTab === "approved"
                      ? "நேரலை அறிவிப்புகள் ஏதுமில்லை"
                      : "நிராகரிக்கப்பட்ட அறிவிப்புகள் ஏதுமில்லை"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    {activeTab === "pending"
                      ? "அனைத்து அறிவிப்புகளும் மதிப்பாய்வு செய்யப்பட்டுள்ளன. புதிய அறிவிப்பை இடதுபுறம் உள்ள படிவத்தில் சேர்க்கலாம்."
                      : activeTab === "approved"
                      ? "இணையதள முகப்பில் காட்டப்படும் நேரலை அறிவிப்புகள் இங்கே தோன்றும்."
                      : "நிராகரிக்கப்பட்ட அறிவிப்புகள் எதுவும் இல்லை."}
                  </p>
                </div>
              ) : (
                /* Announcement Cards */
                currentTabItems.map((item) => {
                  const isProcessing = processingId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-white/15 bg-navy-900/60 backdrop-blur-md p-5 sm:p-6 shadow-md transition-all hover:border-gold/40 flex flex-col justify-between gap-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                              categoryBadgeColors[item.category]
                            }`}
                          >
                            {item.category === "Announcement"
                              ? "அறிவிப்பு"
                              : item.category === "Prayer"
                              ? "ஜெபம்"
                              : "நிகழ்வு"}{" "}
                            ({item.category})
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              item.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : item.status === "pending"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            ● {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar size={13} />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <p className="whitespace-pre-line text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                        {item.message}
                      </p>

                      {/* Action Buttons Row */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {/* Approve Button */}
                          {item.status !== "approved" && (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-black text-white shadow transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={14} />
                              )}
                              <span>ஒப்புதல் அளி (Approve)</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {item.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-2 text-xs font-black text-white shadow transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <X size={14} />
                              )}
                              <span>நிராகரி (Reject)</span>
                            </button>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleDeleteAnnouncement(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/15 px-3 py-2 text-xs font-bold text-red-300 hover:bg-crimson hover:text-white transition-all active:scale-95 disabled:opacity-50"
                          title="அறிவிப்பை நீக்கு (Delete Announcement)"
                        >
                          <Trash2 size={14} />
                          <span>நீக்கு (Delete)</span>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

