import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // Simple shared secret so random people can’t call your webhook
    const auth = req.headers.authorization || "";
    const expected = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`;
    if (!process.env.SUPABASE_WEBHOOK_SECRET || auth !== expected) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const payload = req.body;

    // Supabase webhook payload typically includes:
    // type: "INSERT" | "UPDATE"
    // record: new row
    const eventType = payload?.type;
    const record = payload?.record;

    // Only email on NEW submissions
    if (eventType !== "INSERT" || !record) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    await resend.emails.send({
      // This must be a verified sender in Resend.
      // For now use a Resend-provided sender like onboarding@resend.dev
      from: process.env.EMAIL_FROM,
      to: process.env.CLUB_INBOX_EMAIL,
      subject: `New TRPH registration: ${record.full_name || "(no name)"}`,
      html: `
        <p>A new registration was submitted.</p>
        <ul>
          <li><strong>Name:</strong> ${record.full_name || ""}</li>
          <li><strong>Email:</strong> ${record.email || ""}</li>
          <li><strong>Mobile:</strong> ${record.mobile || ""}</li>
          <li><strong>City:</strong> ${record.city || ""}</li>
          <li><strong>Status:</strong> ${record.status || ""}</li>
          <li><strong>Payment ref:</strong> ${record.payment_ref || ""}</li>
          <li><strong>Payment proof path:</strong> ${record.payment_proof_path || ""}</li>
          <li><strong>Submitted at:</strong> ${record.created_at || ""}</li>
        </ul>
        <p>Review in Supabase → Table Editor → registrations.</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}