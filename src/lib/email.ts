import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  return transporter
    .sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`, // sender address
      to: to, // list of recipients
      subject: subject, // subject line
      text: body, // plain text body
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      // Preview URL is only available when using an Ethereal test account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    })
    .catch((err) => {
      console.error('Error while sending mail:', err);
    });
}
