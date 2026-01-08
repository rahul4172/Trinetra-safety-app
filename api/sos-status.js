let sosState = false;

export function activateSOS() {
  sosState = true;
}

export default function handler(req, res) {
  res.status(200).json({ sos: sosState });
}
