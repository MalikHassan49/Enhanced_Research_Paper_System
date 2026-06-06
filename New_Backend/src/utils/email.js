import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend"

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await resend.emails.send({
      from: "HassanSoft@enhancedresearch.site",
      to,
      subject,
      text,
      html
    });
    console.log("Email sent successfully");
    console.log("Email Response: ", response);
  } catch (error) {
    console.log("Error while sending email");
    console.log(error);
  }
}