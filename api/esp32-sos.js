export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { device_key } = req.body;

    if (device_key !== process.env.ESP32_SECRET_KEY) {
      return res.status(401).json({ error: "Unauthorized device" });
    }

    console.log("🚨 SOS RECEIVED FROM ESP32");

    return res.status(200).json({
      success: true,
      message: "SOS received"
    });

  } catch (err) {
    console.error("ESP32 SOS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
