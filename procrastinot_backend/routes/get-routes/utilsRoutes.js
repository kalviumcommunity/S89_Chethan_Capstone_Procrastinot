const express = require('express');
const router = express.Router();

router.get('/test-email', async (req, res) => {
  let nodemailer;
  try { nodemailer = require('nodemailer'); } catch (e) {
    return res.status(500).json({ ok: false, error: 'nodemailer not installed' });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return res.status(500).json({ ok: false, error: 'SMTP env vars missing' });
  }

  if (!req.user || !req.user.email) {
    return res.status(400).json({ ok: false, error: 'Authenticated user email not available' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: req.user.email,
      subject: 'Procrastinot Email Test',
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;">
          <h2 style="margin:0 0 12px">Procrastinot Email Test</h2>
          <p style="margin:0 0 8px">Hi ${req.user.username || 'there'},</p>
          <p style="margin:0 0 8px">This is a test email to confirm your SMTP settings are working.</p>
          <div style="padding:12px;border-left:3px solid #dc2626;background:#f9f9f9;">
            <div><strong>Server:</strong> ${SMTP_HOST}:${SMTP_PORT}</div>
            <div><strong>User:</strong> ${SMTP_USER.replace(/(.{2}).+(@.*)/, '$1***$2')}</div>
          </div>
          <p style="margin-top:12px;color:#555;">If you received this, your email configuration is correct. 🥷</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true, to: req.user.email, messageId: info.messageId });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Failed to send test email' });
  }
});

module.exports = router;
