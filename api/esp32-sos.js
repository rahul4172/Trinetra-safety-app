import webpush from "web-push";
import { getSubscription } from "./save-subscription";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
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

  const subscription = getSubscription();

  if (!subscription) {
    return res.status(200).json({
      success: false,
      message: "No active device subscribed yet"
    });
  }

  const payload = JSON.stringify({
    title: "🚨 TRINETRA EMERGENCY",
    body: "Physical SOS button pressed",
    url: "/?sos=true"
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log("🚨 PUSH SENT");

    return res.status(200).json({
      success: true,
      message: "SOS sent"
    });
  } catch (err) {
    console.error("Push failed", err);
    return res.status(500).json({ error: "Push failed" });
  }
}
