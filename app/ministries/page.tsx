import type { Metadata } from "next";
import MinistriesSection from "@/components/MinistriesSection";

export const metadata: Metadata = {
  title: "ஊழியங்கள்",
  description: "எங்கள் திருச்சபையின் பல்வேறு ஊழியங்களைப் பற்றி அறியுங்கள்.",
};

export default function MinistriesPage() {
  return (
    <div className="pt-8">
      <MinistriesSection />
    </div>
  );
}
