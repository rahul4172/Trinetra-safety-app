export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { device_key } = req.body;

  if (device_key !== process.env.ESP32_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized device" });
  }

  try {
    // 🚨 SOS LOGIC HERE
    // Example: call WhatsApp API, SMS, email, database, webhook, etc.

    console.log("🚨 SOS TRIGGERED FROM ESP32");

    return res.status(200).json({
      success: true,
      message: "SOS triggered successfully"
    });

  } catch (err) {
    return res.status(500).json({ error: "SOS failed" });
  }
}
