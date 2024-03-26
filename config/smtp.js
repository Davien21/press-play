import env from "../../../config/env";
import nodemailer from "nodemailer";

const sendEmail = async (email) => {
  const { from, to, subject, html } = email;

  // Create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    host: env.MAILER_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: env.MAILER_USERNAME,
      pass: env.MAILER_PASSWORD,
    },
    // debug: true, // show debug output
    // logger: true // enable logging
  });

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    // console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    throw error;
  }
};
const smtp = { sendEmail };
export { smtp };
