import webpush from "web-push";
import { subscriptions } from "./save-subscription";

webpush.setVapidDetails(
  "mailto:admin@trinetra.app",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { device_key } = req.body;

  if (device_key !== process.env.ESP32_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized device" });
  }

  const payload = JSON.stringify({
    title: "🚨 TRINETRA SOS",
    body: "Emergency triggered from physical button",
    sos: true
  });

  await Promise.all(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(() => {})
    )
  );

  console.log("🚨 SOS PUSH SENT");

  return res.status(200).json({
    success: true,
    message: "SOS push sent"
  });
}
