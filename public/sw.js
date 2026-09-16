// CSI Christ Church Kallidaikurichi - Service Worker for Web Push Notifications

self.addEventListener("install", (event) => {
  // Activate immediately without waiting for old worker to exit
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim all active clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {
    title: "CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி",
    message: "புதிய திருச்சபை அறிவிப்பு வெளியிடப்பட்டுள்ளது.",
    url: "/",
    category: "Announcement",
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.message = event.data.text();
    }
  }

  const title = payload.title || "CSI கிறிஸ்து ஆலயம் • கல்லிடைக்குறிச்சி";
  const options = {
    body: payload.message,
    icon: "/images/church-logo.png",
    badge: "/images/church-logo.png",
    vibrate: [100, 50, 100, 50, 100],
    data: {
      url: payload.url || "/",
      timestamp: Date.now(),
    },
    tag: payload.tag || "church-announcement",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
