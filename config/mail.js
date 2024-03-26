const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.transporter = transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
});

exports.mailGenerator = mailGenerator = (origin) =>
  new Mailgen({
    theme: "default",
    product: {
      name: "Press Play",
      link: `${origin}`,
      logo: "https://i.ibb.co/N2ffWPS/Layer-2.png",
    },
  });

exports.sendActivationMail = async (user) => {
  const mail = {
    body: {
      name: user.firstName,
      intro: "Welcome to Press Play",
      action: {
        instructions: "To activate your account, click on the link below:",
        button: {
          color: "#E2605B",
          text: "Activate Account",
          link: `${user.origin}/api/users/activate-account?token=${user.token}`,
        },
      },
      outro: "Do not share this link with anyone.",
    },
  };
  sendEmail(user, "Activate your account", mail);
};

exports.sendPasswordResetMail = async (user) => {
  const mail = {
    body: {
      name: user.firstName,
      intro: "Request for a Password Reset.",
      action: {
        instructions: "To reset your password, click on the link below:",
        button: {
          color: "#E2605B",
          text: "Reset password",
          link: `${user.origin}/user/password-reset?token=${user.resetLink}`,
        },
      },
      outro:
        "Please ignore this email if you did not request a password reset.",
    },
  };
  await sendEmail(user, "Reset your password", mail);
};

let sendEmail = (to, subject, mail) => {
  const origin = to.origin || process.env.APP_URL;
  to = to.email || to;

  html = mailGenerator(origin).generate(mail);

  const message = {
    from: `Press Play <${process.env.MAILER_USERNAME}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(message);
};

