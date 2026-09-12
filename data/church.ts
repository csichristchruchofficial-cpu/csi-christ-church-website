// ============================================================
// CENTRAL CHURCH DATA FILE
// Edit everything about your church here. Nothing below is real —
// every value is a clearly-marked placeholder. Replace with your
// church's actual information before publishing.
// ============================================================

export const churchInfo = {
  name: "CSI கிறிஸ்து ஆலயம்",
  nameEnglish: "CSI Christ Church",
  tagline: "ஆராதிப்போம் • வளர்வோம் • சேவை செய்வோம்",
  logo: "/images/church-logo.png", // put your logo file here
  address: "Kallidaikurichi, Tamil Nadu 627416",
  phone: "+91 9629212785",
  email: "csichristchruchofficial@gmail.com",
  whatsapp: "+91 7010993776",
  pastorName: "Rev. P. Muthuraj M.Sc., B.D., P. G.Dip. Th.",
  pastorTitle: "தலைமை போதகர் (Chief Pastor & Pastorate Chairman)",
  pastorImage: "/images/chief-pastor.png",
  catechistName: "திரு. T. ரெபின் ஆஸ்டின் B.A., B.D.",
  catechistTitle: "சபை ஊழியர் (Catechist)",
  catechistImage: "/images/catechist.png",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=&output=embed", // replace with your real embed link
  social: {
    youtube: "https://youtube.com/@csichristchurchkallidaikurichi?si=eSlmSkiWtqxrH1kf",
    facebook: "https://www.facebook.com/share/1GJh4rL6ZW/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/csi_christ_church_kallidai_?igsi=aDB0NmdraGw5eXNl",
  },
};

export const serviceTimes = [
  {
    title: "ஞாயிறு ஆராதனை (Sunday Service)",
    time: "காலை 09:00 - 11:30 மணி",
    description: "வாரம் 1: Communion | வாரம் 2: Regular | வாரம் 3: Communion (Anglican) | வாரம் 4: Worship | வாரம் 5: Regular",
  },
  {
    title: "சுகமளிக்கும் ஆராதனை (Healing Service)",
    time: "செவ்வாய் மாலை 7:00 - 8:00 மணி",
    description: "ஒவ்வொரு செவ்வாய்க்கிழமையும் (Every Tuesday)",
  },
  {
    title: "வேத தியானம் (Bible Study)",
    time: "வெள்ளி மாலை 7:00 - 8:00 மணி",
    description: "ஒவ்வொரு வெள்ளிக்கிழமையும் (Every Friday)",
  },
  {
    title: "உபவாச ஜெபம் (Fasting Prayer)",
    time: "மாதத்தின் 4-வது வாரம்",
    description: "விசேஷ உபவாச ஜெபக் கூட்டம் (Every 4th Week)",
  },
];

export const sermons = [
  {
    id: "latest",
    tag: "சமீபத்திய வீடியோ (Latest Video)",
    title: "30.08.2026 - SUNDAY SERVICE",
    speaker: "Rev. P. Muthuraj",
    date: "30 ஆகஸ்ட் 2026",
    duration: "1 மணி 45 நிமிடம்",
    thumbnail: "https://i1.ytimg.com/vi/TvO2t1Or-BM/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=TvO2t1Or-BM",
    isLive: false,
    badgeColor: "bg-gold text-navy-950",
  },
  {
    id: "live",
    tag: "நேரலை ஆராதனை (Live Stream)",
    title: "ஞாயிறு ஆராதனை நேரலை (Sunday Service Live Stream)",
    speaker: "Rev. P. Muthuraj",
    date: "ஒவ்வொரு ஞாயிறு காலை 09:00 மணி",
    duration: "Live Stream",
    thumbnail: "https://i1.ytimg.com/vi/TvO2t1Or-BM/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/channel/UC4aaLgFQ9gWtYFuT7oHehdg/live",
    isLive: true,
    badgeColor: "bg-crimson text-white animate-pulse",
  },
  {
    id: "popular",
    tag: "பிரபலமான செய்தி (Popular Video)",
    title: "21வது ஸ்தோத்திரப் பண்டிகை | Kallidaikurichi Pastorate",
    speaker: "Rev. P. Muthuraj",
    date: "3,900+ பார்வைகள் (Views)",
    duration: "1 மணி 50 நிமிடம்",
    thumbnail: "https://i3.ytimg.com/vi/rNaI8Vcdn3U/hqdefault.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=rNaI8Vcdn3U",
    isLive: false,
    badgeColor: "bg-royal text-white",
  },
];

export const historyTimeline = [
  { year: "[ஆண்டு]", event: "திருச்சபையின் ஆரம்பம்" },
  { year: "[ஆண்டு]", event: "முதல் ஆராதனை" },
  { year: "[ஆண்டு]", event: "வளர்ச்சியின் காலம்" },
  { year: "[ஆண்டு]", event: "முக்கியமான நிகழ்வு" },
  { year: "[ஆண்டு]", event: "இன்றைய திருச்சபை" },
];

export const ministries = [
  {
    id: "children",
    title: "சிறுவர் ஊழியம்",
    description: "குழந்தைகளுக்கான வேதப்பாடம் மற்றும் நடவடிக்கைகள்.",
    image: "/images/children-ministry.jpg",
  },
  {
    id: "youth",
    title: "வாலிபர் ஊழியம்",
    description: "இளைஞர்களை இணைத்து வளர்க்கும் ஊழியம்.",
    image: "/images/youth-ministry.jpg",
  },
  {
    id: "women",
    title: "பெண்கள் ஊழியம்",
    description: "பெண்களுக்கான ஐக்கியம் மற்றும் வேதப்பாட ஆய்வு.",
    image: "/images/women-ministry.jpg",
  },
  {
    id: "prayer",
    title: "ஜெப ஊழியம்",
    description: "ஜெபக் கூட்டங்கள் மற்றும் ஜெப சேவைகள்.",
    image: "/images/prayer.jpg",
  },
  {
    id: "worship",
    title: "ஆராதனை ஊழியம்",
    description: "பாடகர் குழு மற்றும் இசை ஊழியம்.",
    image: "/images/worship.jpg",
  },
  {
    id: "outreach",
    title: "சுவிசேஷ ஊழியம்",
    description: "சமூகத்திற்குள் சுவிசேஷம் அறிவிக்கும் ஊழியம்.",
    image: "/images/outreach.jpg",
  },
];

export const events = [
  {
    id: "e1",
    name: "சிறப்பு ஜெபக் கூட்டம்",
    date: "[தேதி]",
    time: "[நேரம்]",
    location: "[இடம்]",
    description: "விவரங்களுக்கு இங்கே எழுதவும்.",
  },
  {
    id: "e2",
    name: "வாலிபர் ஐக்கியம்",
    date: "[தேதி]",
    time: "[நேரம்]",
    location: "[இடம்]",
    description: "விவரங்களுக்கு இங்கே எழுதவும்.",
  },
  {
    id: "e3",
    name: "குடும்ப ஆராதனை",
    date: "[தேதி]",
    time: "[நேரம்]",
    location: "[இடம்]",
    description: "விவரங்களுக்கு இங்கே எழுதவும்.",
  },
];

export const galleryCategories = [
  "பண்டிகைகள் & நிகழ்வுகள்",
  "சிறுவர் ஊழியம்",
  "ஆலயம் & ஆராதனை",
];

export interface GalleryAlbum {
  id: string;
  name: string;
  nameEnglish: string;
  category: string;
  tag: string;
  description: string;
  coverImage: string;
  accentColor: "gold" | "crimson" | "royal";
}

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "festivals-events",
    name: "பண்டிகைகள் & நிகழ்வுகள்",
    nameEnglish: "Festivals & Church Functions",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    tag: "கிறிஸ்துமஸ் & சிறப்பு விழாக்கள்",
    description: "கிறிஸ்துமஸ் பெருவிழா 2025, புத்தாண்டு ஆயத்த ஆராதனை மற்றும் திருச்சபையின் விசேஷ பண்டிகை ஆராதனைத் தருணங்கள்.",
    coverImage: "/images/gallery/festival-event-01.jpg",
    accentColor: "crimson",
  },
  {
    id: "child-ministry",
    name: "சிறுவர் ஊழியம் & ஞாயிறு பள்ளி",
    nameEnglish: "Child Ministry & Sunday School",
    category: "சிறுவர் ஊழியம்",
    tag: "ஞாயிறு பள்ளி சிறார்கள்",
    description: "ஞாயிறு பள்ளி சிறார்களின் ஆவிக்குரிய பாடல்கள், வேதாகம வகுப்புகள் மற்றும் சிறுவர் தின விழா கொண்டாட்டங்கள்.",
    coverImage: "/images/gallery/child-ministry-05.jpg",
    accentColor: "gold",
  },
  {
    id: "church-sanctuary",
    name: "ஆலயம் & கருவறை ஆராதனை",
    nameEnglish: "Church & Holy Worship",
    category: "ஆலயம் & ஆராதனை",
    tag: "பரிசுத்த ஆலயம் & கருவறை",
    description: "CSI கிறிஸ்து ஆலயத்தின் புனித கருவறை பலிபீட அலங்காரம் மற்றும் ஆலய வெளித்தோற்றக் கோபுரம்.",
    coverImage: "/images/gallery/church-sanctuary-main.jpg",
    accentColor: "royal",
  },
];

export const galleryImages = [
  // --- சிறுவர் ஊழியம் (Child Ministry from D:\for website\Used\child ministry) ---
  {
    src: "/images/gallery/child-ministry-01.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "சிறுவர் ஊழியம் & ஞாயிறு பள்ளி ஆராதனை",
  },
  {
    src: "/images/gallery/child-ministry-02.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "சிறுவர் வேதாகம பாடம் & துதிப்பாடல்",
  },
  {
    src: "/images/gallery/child-ministry-03.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "ஞாயிறு பள்ளி சிறார்கள் ஆவிக்குரிய ஐக்கியம்",
  },
  {
    src: "/images/gallery/child-ministry-04.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "சிறுவர் ஊழியம் சிறப்பு நிகழ்வு",
  },
  {
    src: "/images/gallery/child-ministry-05.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "சிறுவர் தின விழா கொண்டாட்டம்",
  },
  {
    src: "/images/gallery/child-ministry-06.jpg",
    category: "சிறுவர் ஊழியம்",
    alt: "ஞாயிறு பள்ளி விசுவாச சிறார்கள்",
  },

  // --- பண்டிகைகள் & நிகழ்வுகள் (Festivals & Events from D:\for website\Used\Festivals&church events) ---
  {
    src: "/images/gallery/festival-event-01.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "கிறிஸ்துமஸ் பெருவிழா கொண்டாட்டம் 2025",
  },
  {
    src: "/images/gallery/festival-event-03.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "திருச்சபை பண்டிகை ஆராதனை நிகழ்வு",
  },
  {
    src: "/images/gallery/festival-event-04.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "விசேஷ பண்டிகை ஆராதனை",
  },
  {
    src: "/images/gallery/festival-event-05.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "திருச்சபை சிறப்பு ஐக்கிய கூட்டம்",
  },
  {
    src: "/images/gallery/festival-event-06.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "பண்டிகை ஆராதனை & பாடல் குழுவினர்",
  },
  {
    src: "/images/gallery/festival-event-07.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "CSI கிறிஸ்து ஆலயம் விழா தோற்றம்",
  },
  {
    src: "/images/gallery/festival-event-08.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "புத்தாண்டு ஆயத்த சிறப்பு ஆராதனை",
  },
  {
    src: "/images/gallery/festival-event-09.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "திருச்சபை விசேஷ ஆராதனை நிகழ்வு",
  },
  {
    src: "/images/gallery/festival-event-10.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "பண்டிகை ஆராதனை விசுவாச குடும்பங்கள்",
  },
  {
    src: "/images/gallery/festival-event-11.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "திருச்சபை சிறப்பு விழா நிகழ்வு",
  },
  {
    src: "/images/gallery/festival-event-12.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "பண்டிகை ஆராதனை பாடல் வேளை",
  },
  {
    src: "/images/gallery/festival-event-13.jpg",
    category: "பண்டிகைகள் & நிகழ்வுகள்",
    alt: "திருச்சபை எழுப்புதல் ஆராதனை",
  },

  // --- ஆலயம் & ஆராதனை (Church Sanctuary & Altar) ---
  {
    src: "/images/gallery/church-sanctuary-main.jpg",
    category: "ஆலயம் & ஆராதனை",
    alt: "CSI கிறிஸ்து ஆலயம் கருவறை & பலிபீட அலங்காரம்",
  },
  {
    src: "/images/church-building.jpg",
    category: "ஆலயம் & ஆராதனை",
    alt: "CSI கிறிஸ்து ஆலயம் பரிசுத்த கருவறை",
  },
  {
    src: "/images/church-hero.jpg",
    category: "ஆலயம் & ஆராதனை",
    alt: "CSI கிறிஸ்து ஆலயம் வெளிப்புற தோற்றம் & சிலுவை கோபுரம்",
  },
];

export const navLinks = [
  { href: "/", label: "முகப்பு", labelEnglish: "Home" },
  { href: "/about", label: "எங்களைப் பற்றி", labelEnglish: "About Us" },
  { href: "/sub-churches", label: "கிளைத் திருச்சபைகள்", labelEnglish: "Sub Churches" },
  { href: "/ministries", label: "ஊழியங்கள்", labelEnglish: "Ministries" },
  { href: "/sermons", label: "பிரசங்கங்கள்", labelEnglish: "Sermons" },
  { href: "/events", label: "நிகழ்வுகள்", labelEnglish: "Events" },
  { href: "/gallery", label: "புகைப்பட தொகுப்பு", labelEnglish: "Photo Gallery" },
  { href: "/prayer", label: "ஜெப விண்ணப்பம்", labelEnglish: "Prayer Request" },
  { href: "/contact", label: "தொடர்புக்கு", labelEnglish: "Contact Us" },
];

export const subChurches = [
  {
    id: "sub-1",
    name: "கிளை ஆலயம் 1 (Sub Church 1)",
    location: "கல்லிடைக்குறிச்சி வட்டம்",
    address: "கல்லிடைக்குறிச்சி திருச்சபை வட்டம், திருநெல்வேலி",
    time: "ஞாயிறு மாலை 05:00 மணி",
    pastor: "Rev. P. Muthuraj",
    image: "/images/sub-church-1.jpg",
    description: "CSI கிறிஸ்து ஆலயத்தின் கீழ் செயல்படும் ஆவிக்குரிய கிளைத் திருச்சபை.",
  },
  {
    id: "sub-2",
    name: "கிளை ஆலயம் 2 (Sub Church 2)",
    location: "கல்லிடைக்குறிச்சி வட்டம்",
    address: "கல்லிடைக்குறிச்சி திருச்சபை வட்டம், திருநெல்வேலி",
    time: "ஞாயிறு மாலை 06:30 மணி",
    pastor: "Rev. P. Muthuraj",
    image: "/images/sub-church-2.jpg",
    description: "CSI கிறிஸ்து ஆலயத்தின் கீழ் செயல்படும் ஆவிக்குரிய கிளைத் திருச்சபை.",
  },
  {
    id: "sub-3",
    name: "கிளை ஆலயம் 3 (Sub Church 3)",
    location: "கல்லிடைக்குறிச்சி வட்டம்",
    address: "கல்லிடைக்குறிச்சி திருச்சபை வட்டம், திருநெல்வேலி",
    time: "ஞாயிறு மாலை 05:00 மணி",
    pastor: "Rev. P. Muthuraj",
    image: "/images/sub-church-3.jpg",
    description: "CSI கிறிஸ்து ஆலயத்தின் கீழ் செயல்படும் ஆவிக்குரிய கிளைத் திருச்சபை.",
  },
  {
    id: "sub-4",
    name: "கிளை ஆலயம் 4 (Sub Church 4)",
    location: "கல்லிடைக்குறிச்சி வட்டம்",
    address: "கல்லிடைக்குறிச்சி திருச்சபை வட்டம், திருநெல்வேலி",
    time: "ஞாயிறு மாலை 06:30 மணி",
    pastor: "Rev. P. Muthuraj",
    image: "/images/sub-church-4.jpg",
    description: "CSI கிறிஸ்து ஆலயத்தின் கீழ் செயல்படும் ஆவிக்குரிய கிளைத் திருச்சபை.",
  },
];

export const pastorsHistory = [
  {
    id: "current-chief-pastor",
    name: "Rev. P. Muthuraj M.Sc., B.D., P. G.Dip. Th.",
    role: "தலைமை போதகர் (Chief Pastor)",
    year: "2020 - தற்போது வரை (Present)",
    image: "/images/chief-pastor.png",
    isCurrent: true,
  },
  {
    id: "current-catechist",
    name: "திரு. T. ரெபின் ஆஸ்டின் B.A., B.D.",
    role: "சபை ஊழியர் (Catechist)",
    year: "தற்போது வரை (Present)",
    image: "/images/catechist.png",
    isCurrent: true,
  },
  {
    id: "past-pastor-1",
    name: "முந்தைய போதகர் 1 (Past Pastor 1)",
    role: "முந்தைய போதகர்",
    year: "2016 - 2020",
    image: "/images/pastor-placeholder.jpg",
    isCurrent: false,
  },
  {
    id: "past-pastor-2",
    name: "முந்தைய போதகர் 2 (Past Pastor 2)",
    role: "முந்தைய போதகர்",
    year: "2012 - 2016",
    image: "/images/pastor-placeholder.jpg",
    isCurrent: false,
  },
  {
    id: "past-pastor-3",
    name: "முந்தைய போதகர் 3 (Past Pastor 3)",
    role: "முந்தைய போதகர்",
    year: "2007 - 2012",
    image: "/images/pastor-placeholder.jpg",
    isCurrent: false,
  },
  {
    id: "past-pastor-4",
    name: "முந்தைய போதகர் 4 (Past Pastor 4)",
    role: "முந்தைய போதகர்",
    year: "2002 - 2007",
    image: "/images/pastor-placeholder.jpg",
    isCurrent: false,
  },
];
