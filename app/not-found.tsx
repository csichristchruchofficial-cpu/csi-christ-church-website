import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center py-24 text-center bg-slate-50">
      <div className="container-page max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <span className="inline-block rounded-full bg-crimson/10 px-4 py-1 text-sm font-black text-crimson">
          404 பிழை
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-navy-900">
          பக்கம் கிடைக்கவில்லை
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          நீங்கள் தேடும் பக்கம் தற்காலிகமாக இல்லை அல்லது முகவரி மாற்றப்பட்டுள்ளது.
        </p>
        <div className="mt-8">
          <Link href="/" className="btn-primary">
            <Home size={18} />
            முகப்பு பக்கத்திற்குச் செல்ல
          </Link>
        </div>
      </div>
    </section>
  );
}
