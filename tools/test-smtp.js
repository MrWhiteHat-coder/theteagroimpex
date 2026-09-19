/*
  SMTP credential tester — run this BEFORE touching Netlify.
  Usage:  node tools/test-smtp.js
  It asks for the password in the terminal (never stored, never committed)
  and prints exactly what the mail server says.

  Default host/port are Titan Mail; override via env vars if needed.
*/
const readline = require('readline');
const nodemailer = require('nodemailer');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

(async () => {
  console.log('--- SMTP credential test (nothing is stored or sent anywhere) ---');
  const host = process.env.SMTP_HOST || 'smtp.titan.email';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = (await ask(`SMTP username [${process.env.SMTP_USERNAME || 'support@theteagroimpex.in'}]: `)).trim()
    || process.env.SMTP_USERNAME || 'support@theteagroimpex.in';
  const pass = await ask('SMTP password (hidden typing not supported — input not echoed to any file): ');

  if (!pass) { console.log('No password entered. Aborted.'); rl.close(); return; }

  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15000
  });

  try {
    await transporter.verify();
    console.log(`\n✅ SUCCESS — ${host}:${port} accepted ${user}. These credentials are correct.`);
    console.log('   Use exactly these values in Netlify SMTP_USERNAME / SMTP_PASSWORD.');
  } catch (err) {
    console.log(`\n❌ FAILED — code: ${err.code || 'N/A'}`);
    if (err.response) console.log(`   Server said: ${err.response}`);
    if (err.code === 'EAUTH') {
      console.log('\n   Meaning: wrong username or password for this server.');
      console.log('   - Username must be the FULL email address.');
      console.log('   - Password must be the mailbox password (same one used for webmail login).');
      console.log('   - Verify both by logging into Titan webmail first, then retry.');
    }
  }
  rl.close();
})();
