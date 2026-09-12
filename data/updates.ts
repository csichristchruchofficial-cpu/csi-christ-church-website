export type ChurchUpdate = {
  id: string;
  message: string;
  publishedAt: string;
  category: "Announcement" | "Prayer" | "Event";
};

// These are the only messages shown publicly. Replace or add approved
// WhatsApp announcements here until a database-backed WhatsApp bridge is set up.
export const churchUpdates: ChurchUpdate[] = [
  {
    id: "welcome",
    category: "Announcement",
    message:
      "Welcome to CSI Christ Church. Church announcements and ministry updates will appear here.",
    publishedAt: "2026-09-12T09:00:00+05:30",
  },
  {
    id: "sunday-service",
    category: "Prayer",
    message:
      "Join us in prayer and worship for Sunday service at 9:00 AM. அனைவரும் அன்புடன் வரவேற்கப்படுகிறீர்கள்.",
    publishedAt: "2026-09-11T18:00:00+05:30",
  },
];
