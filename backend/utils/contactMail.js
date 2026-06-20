import { Resend } from "resend"

const DEFAULT_NOTIFY_TO = "dasguptamainak02@gmail.com"
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>"

const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) return null
    return new Resend(process.env.RESEND_API_KEY)
}

const escapeHtml = (value = "") =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")

const buildTextBody = ({ name, email, subject, message }) =>
    [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject || "(no subject)"}`,
        "",
        String(message || ""),
    ].join("\n")

const buildHtmlBody = ({ name, email, subject, message }) =>
    `
<h2>New Portfolio Contact Message</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(subject || "(no subject)")}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
`.trim()

const sendContactNotification = async ({ name, email, subject, message }) => {
    const resend = getResendClient()
    if (!resend) {
        console.warn("RESEND_API_KEY not set - skipping contact email notification")
        return { sent: false, skipped: true, reason: "missing_api_key" }
    }

    const to = process.env.CONTACT_NOTIFY_TO || DEFAULT_NOTIFY_TO
    const from = process.env.CONTACT_NOTIFY_FROM || DEFAULT_FROM
    const subjectLine = `New portfolio message: ${subject || "(no subject)"}`

    const { data, error } = await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: subjectLine,
        text: buildTextBody({ name, email, subject, message }),
        html: buildHtmlBody({ name, email, subject, message }),
    })

    if (error) {
        throw new Error(error.message || "Resend send failed")
    }

    return { sent: true, id: data?.id || null }
}

export { sendContactNotification }
