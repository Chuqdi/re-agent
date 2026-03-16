import axios from "axios";

export async function POST(req: Request) {
  try {
    const { to, subject, htmlMessage, name, userEmail } = await req.json();

    const domain = "nurturer.ai";
    const apiKey = process.env.MAILGUN_API_KEY;

    const baseURL = "https://api.mailgun.net/v3";
    const auth = Buffer.from(`api:${apiKey}`).toString("base64");

    await axios.post(
      `${baseURL}/${domain}/messages`,
      new URLSearchParams({
        from: `${'John'} <info@nurturer.ai>`,
        to: to,
        subject: subject,
        text: `Message from ${'John'}.`,
        html: htmlMessage,
        "h:Reply-To": `${'John'} <${userEmail}>`,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return Response.json({ success: true, message: "Email sent!" });

  } catch (error) {
    console.error("MAILGUN ERROR:", error?.response?.data || error);

    return Response.json({
      success: false,
      message: "Failed to send email",
    });
  }
}