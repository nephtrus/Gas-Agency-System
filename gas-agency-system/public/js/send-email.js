export function sendEmail({ to_name, to_email, subject, message }) {
  emailjs.send("service_0lvg8ip", "template_ne8qqvs", {
    to_name,
    to_email,
    subject,
    message
  }).then(() => {
    console.log("✅ Email sent successfully.");
  }).catch((err) => {
    console.error("❌ Email failed", err);
  });
}
