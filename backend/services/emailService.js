const nodemailer = require("nodemailer");

let transporter;

async function initTransporter() {
  if (transporter) return transporter;
  // Use Ethereal Email for testing if no real SMTP credentials are provided
  let testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  console.log("📨 Ethereal Test Email Account created! Waiting to send alerts...");
  return transporter;
}

exports.sendHighWasteEmail = async (waste) => {
  try {
    const tp = await initTransporter();

    const info = await tp.sendMail({
      from: '"FoodSave System Alerts" <alerts@foodsave.local>',
      to: "admin@foodsave.com", // List of receivers
      subject: "🚨 High Waste Alert Detected",
      text: `Warning: A high volume of ${waste.type} food waste (${waste.weight}kg) was just logged to the system.`,
      html: `
        <div style="font-family: sans-serif; p-4 border: 1px solid #ccc; border-radius: 8px;">
          <h2 style="color: #e11d48;">🚨 High Waste Alert</h2>
          <p>The system has detected an unusually high amount of recorded food waste.</p>
          <ul>
            <li><strong>Type:</strong> ${waste.type}</li>
            <li><strong>Weight:</strong> ${waste.weight.toFixed(1)} kg</li>
            <li><strong>Date:</strong> ${new Date(waste.createdAt || waste.date).toLocaleString()}</li>
          </ul>
          <p>Please review the recent cafeteria operations to determine the root cause of this excess.</p>
        </div>
      `,
    });

    console.log("📨 Alert Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Failed to send alert email", err);
  }
};
