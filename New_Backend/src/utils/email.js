import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async(to, subject, html) => {
  await sgMail.send({
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html
  });
}