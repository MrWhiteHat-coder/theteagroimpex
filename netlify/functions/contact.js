const nodemailer = require('nodemailer');

/*
  Serverless enquiry handler (Netlify Function).
  All enquiries are delivered to the Titan Mail mailbox configured in
  CONTACT_RECEIVER_EMAIL (default: support@theteagroimpex.in).
  SMTP credentials live ONLY in environment variables — never in the frontend.
  Required env vars for SMTP delivery:
    SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD
  Optional: CONTACT_RECEIVER_EMAIL, FROM_EMAIL, RESEND_API_KEY / BREVO_API_KEY / SENDGRID_API_KEY
*/

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CONTACT_RECEIVER_DEFAULT = 'support@theteagroimpex.in';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' })
    };
  }

  let data = {};
  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else {
      const params = new URLSearchParams(event.body || '');
      data = Object.fromEntries(params.entries());
    }
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Malformed request payload.' })
    };
  }

  // Honeypot spam check — pretend success so bots learn nothing.
  if (data['bot-field'] || data['botField'] || data['_gotcha']) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Enquiry received.' })
    };
  }

  const name = (data.name || '').trim();
  const company = (data.company || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const product = (data.product || '').trim();
  const requirement = (data.requirement || '').trim();
  const message = (data.message || '').trim();
  const sourcePage = (data.sourcePage || '').trim();

  if (!name || name.length < 2) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Please enter your full name.' })
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Please enter a valid email address.' })
    };
  }

  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || CONTACT_RECEIVER_DEFAULT;
  const subject = product
    ? `New Product Enquiry - ${product}`
    : `New Website Enquiry - ${name}`;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const textBody = `
Thete Agro Impex
New Website Enquiry
--------------------------------------------------
Customer Name: ${name}
Company Name: ${company || '-'}
Email: ${email}
Phone: ${phone || '-'}
Product: ${product || 'General enquiry'}
Requirement / Quantity: ${requirement || '-'}
Message:
${message || '-'}

Source Page: ${sourcePage || '-'}
Submitted At: ${timestamp} IST
Delivered To: ${toEmail}
--------------------------------------------------
`.trim();

  const rows = [
    ['Customer Name', name],
    ['Company Name', company || '-'],
    ['Email', `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`],
    ['Phone', phone ? `<a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>` : '-'],
    ['Product', escapeHtml(product || 'General enquiry')],
    ['Requirement / Quantity', escapeHtml(requirement || '-')]
  ];

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5eb; margin: 0; padding: 24px; color: #16291f; }
    .wrapper { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #dce3d5; overflow: hidden; box-shadow: 0 10px 30px rgba(18,61,44,0.06); }
    .header { background: #123d2c; padding: 26px 28px; color: #f4f5eb; }
    .header .eyebrow { color: #b8d57a; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin: 0 0 8px; }
    .header h1 { margin: 0; font-size: 23px; font-weight: 600; color: #d9ed9d; }
    .product-banner { background: #1f5940; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; }
    .content { padding: 30px 28px; }
    .row { border-bottom: 1px solid #eef1e6; margin-bottom: 16px; padding-bottom: 14px; }
    .row:last-child { border-bottom: 0; }
    .label { color: #68776d; display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 5px; text-transform: uppercase; }
    .value { color: #123d2c; font-size: 15px; font-weight: 500; }
    .value a { color: #1f5940; font-weight: 600; text-decoration: underline; }
    .box { background: #fbfcf7; border: 1px solid #dce3d5; border-radius: 10px; color: #16291f; font-size: 14px; line-height: 1.6; margin-top: 6px; padding: 16px; white-space: pre-wrap; }
    .footer { background: #f4f5eb; border-top: 1px solid #dce3d5; color: #68776d; display: flex; font-size: 11px; justify-content: space-between; padding: 16px 28px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="eyebrow">Thete Agro Impex · Export Desk</div>
      <h1>New Website Enquiry</h1>
    </div>
    ${product ? `<div class="product-banner">Product: ${escapeHtml(product)}</div>` : ''}
    <div class="content">
      ${rows.map(([label, value]) => `
      <div class="row">
        <span class="label">${label}</span>
        <div class="value">${value}</div>
      </div>`).join('')}
      <div class="row">
        <span class="label">Message</span>
        <div class="box">${escapeHtml(message || '-')}</div>
      </div>
    </div>
    <div class="footer">
      <span>Source: ${escapeHtml(sourcePage || 'theteagroimpex.in')}</span>
      <span>${timestamp} IST</span>
    </div>
  </div>
</body>
</html>
`.trim();

  try {
    // 1. RESEND API
    if (process.env.RESEND_API_KEY) {
      const fromEmail = process.env.FROM_EMAIL || `Thete Agro Impex <enquiry@theteagroimpex.in>`;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: subject,
          html: htmlBody,
          text: textBody
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error('Resend delivery error:', errJson);
        throw new Error(errJson.message || `Resend HTTP error ${res.status}`);
      }

      const resData = await res.json().catch(() => ({}));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.',
          id: resData.id
        })
      };
    }

    // 2. BREVO / SENDINBLUE API
    if (process.env.BREVO_API_KEY) {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Thete Agro Impex Website', email: process.env.FROM_EMAIL || 'support@theteagroimpex.in' },
          to: [{ email: toEmail, name: 'Thete Agro Impex Export Desk' }],
          replyTo: { email: email, name: name },
          subject: subject,
          htmlContent: htmlBody,
          textContent: textBody
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error('Brevo delivery error:', errJson);
        throw new Error(errJson.message || `Brevo HTTP error ${res.status}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.'
        })
      };
    }

    // 3. SENDGRID API
    if (process.env.SENDGRID_API_KEY) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: process.env.FROM_EMAIL || 'support@theteagroimpex.in', name: 'Thete Agro Impex' },
          reply_to: { email: email, name: name },
          subject: subject,
          content: [
            { type: 'text/plain', value: textBody },
            { type: 'text/html', value: htmlBody }
          ]
        })
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.error('SendGrid delivery error:', errText);
        throw new Error(`SendGrid HTTP error ${res.status}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.'
        })
      };
    }

    // 4. SMTP / NODEMAILER — Titan Mail (GoDaddy), Gmail, Zoho, Outlook etc.
    //    Preferred env names: SMTP_USERNAME / SMTP_PASSWORD (SMTP_USER / SMTP_PASS kept as fallbacks)
    const smtpUser = process.env.SMTP_USERNAME || process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    if (process.env.SMTP_HOST && smtpUser && smtpPass) {
      const port = Number(process.env.SMTP_PORT) || 465;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"Thete Agro Impex Website" <${smtpUser}>`,
        to: toEmail,
        replyTo: company ? `${name} (${company}) <${email}>` : `${name} <${email}>`,
        subject: subject,
        text: textBody,
        html: htmlBody
      });

      console.log('SMTP email sent successfully:', info.messageId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.'
        })
      };
    }

    // No email provider configured. Fail clearly instead of silently dropping enquiries.
    throw new Error('No email provider configured. Set SMTP_HOST, SMTP_PORT, SMTP_USERNAME and SMTP_PASSWORD (or an API provider key).');

  } catch (deliveryError) {
    // Log full details server-side; expose only safe diagnostic info to the client
    console.error('Email transmission failed:', deliveryError);
    const diagCode = (deliveryError && (deliveryError.code || deliveryError.responseCode)) || 'SEND_FAILED';
    // SMTP server response text (e.g. "535 5.7.8 Authentication Credentials Invalid")
    // helps pinpoint auth issues without exposing any secrets.
    const smtpResponse = (deliveryError && deliveryError.response) || '';
    // Show which credentials the function is ACTUALLY using (never the password)
    const diagUser = process.env.SMTP_USERNAME || process.env.SMTP_USER || '(unset)';
    const diagHost = process.env.SMTP_HOST || '(unset)';
    const diagPort = process.env.SMTP_PORT || '(unset)';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'We couldn\'t send your enquiry right now. Please try again or contact our team directly.',
        diag: String(diagCode),
        smtp: String(smtpResponse).slice(0, 120),
        using: `${diagUser} @ ${diagHost}:${diagPort}`
      })
    };
  }
};
