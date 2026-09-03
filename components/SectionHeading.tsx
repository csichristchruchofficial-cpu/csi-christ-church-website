export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-base sm:text-lg font-medium ${
            light ? "text-slate-300" : "text-slate-600"
          } ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-crimson via-gold to-royal shadow-sm ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
