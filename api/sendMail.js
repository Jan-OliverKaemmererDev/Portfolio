const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.ionos.de",
      port: 465,
      secure: true, 
      auth: {
        user: "contact@jan-oliver-kaemmerer.dev",
        pass: process.env.MAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: '"Website Contact" <contact@jan-oliver-kaemmerer.dev>',
      to: "contact@jan-oliver-kaemmerer.dev",
      subject: `New Contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Mail Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

