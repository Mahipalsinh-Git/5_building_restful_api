import nodemailer from "nodemailer";

// Mail service
// Testing email - mailtrap.io
// Production - resend, AWS SES

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function vefifyConnection() {
  try {
    const isVerified = await transporter.verify();
    console.log("Server is ready to take our messages");
    return isVerified;
  } catch (err) {
    console.error("Verification failed:", err);
  }
}

async function sentEmail(to, subject, html) {
  try {
    if (!isVerified) {
      throw new Error("Email service not working");
    }

    const info = await transporter.sendMail({
      //   from: '"Example Team" <team@example.com>', // sender address
      //   to: "alice@example.com, bob@example.com", // list of recipients
      //   subject: "Hello", // subject line
      //   text: "Hello world?", // plain text body
      //   html: "<b>Hello world?</b>", // HTML body

      from: `${process.env.SMTP_EMAIL}`, // sender address
      to: to, // list of recipients
      subject: subject, // subject line
      text: html, // plain text body for fallback
      html: html, // bydefaul sent html
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

// use html template : https://stripo.email/templates/type/confirmation/
// https://www.google.com/search?q=html+template+for+email&sca_esv=e81adbbb4a121c19&sxsrf=APpeQnvLWY6BHjWGD_ep5Sizn7bm-SmI6A%3A1782198176869&ei=oC86atHDNOeH1e8P-eHmuQs&biw=1920&bih=855&oq=html+te&gs_lp=Egxnd3Mtd2l6LXNlcnAiB2h0bWwgdGUqAggAMgsQABiABBiKBRiRAjIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEiC0BRQ5AZYusUUcAZ4AZABAJgBkgKgAd0RqgEFMC45LjO4AQPIAQD4AQGYAhKgAqASwgIKEAAYRxjWBBiwA8ICDRAAGIAEGIoFGEMYsAPCAg4QABjkAhjWBBiwA9gBAcICGRAuGIAEGIoFGEMYxwEY0QMYyAMYsAPYAQHCAgoQABiABBiKBRhDwgIIEAAYgAQYsQPCAhYQLhiABBiKBRhDGLEDGIMBGMcBGNEDwgINEAAYgAQYigUYQxixA8ICDhAuGIAEGLEDGMcBGNEDwgIQEAAYgAQYigUYQxixAxiDAcICDhAAGIAEGIoFGJECGLEDwgITEC4YgAQYigUYQxixAxjHARjRA8ICERAuGIAEGIoFGJECGMcBGNEDwgIIEC4YgAQYsQPCAhEQLhiDARjHARixAxjRAxiABMICDhAAGIAEGIoFGLEDGIMBwgIgEC4YgAQYigUYkQIYxwEY0QMYlwUY3AQY3gQY4ATYAQHCAhYQLhhDGIMBGMcBGLEDGNEDGIAEGIoFwgIKEC4YQxiABBiKBcICChAuGIAEGIoFGEPCAiUQLhhDGIMBGMcBGLEDGNEDGIAEGIoFGJcFGNwEGN4EGOAE2AEBmAMAiAYBkAYTugYGCAEQARgJkgcFNi44LjSgB4dUsgcFMC44LjS4B4gSwgcGMC4xMS43yAc1gAgB&sclient=gws-wiz-serp

sentVerificationEmail = async (email, token) => {
  try {
    if (!isVerified) {
      throw new Error("Email service not working");
    }

    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`, // sender address
      to: email, // list of recipients
      subject: subject, // subject line
      text: html, // plain text body for fallback
      html: html, // bydefaul sent html
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export { sentEmail, sentVerificationEmail };
