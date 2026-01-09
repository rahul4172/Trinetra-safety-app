let subscription = null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  subscription = req.body;
  console.log("✅ Push subscription saved");

  return res.status(200).json({ success: true });
}

export function getSubscription() {
  return subscription;
}
