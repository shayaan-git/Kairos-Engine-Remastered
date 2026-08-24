import { configs } from "../config/config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      type: "OAuth2",
      user: configs.GOOGLE_USER,
      clientId: configs.GOOGLE_CLIENT_ID,
      clientSecret: configs.GOOGLE_CLIENT_SECRET,
      refreshToken: configs.GOOGLE_REFRESH_TOKEN,
   },
});

// Verify the connection configuration
transporter.verify((error, success) => {
   if (error) {
      console.error("Error connecting to email server:", error);
   } else {
      console.log("Email server is ready to send messages:", success);
   }
});

// Function to send email
export const sendEmail = async ({ to, subject, html }) => {
   const mailOptions = {
      from: configs.GOOGLE_USER, // sender address
      to,
      subject,
      html,
   };
   const info = await transporter.sendMail(mailOptions);
   console.log("Email_sent: ", info);
};
