import { site } from "@/content/site";
import type { ContactInquiry } from "@/lib/contact-schema";

const colors = {
  paper: "#f2eee3",
  ink: "#171612",
  forest: "#1e3a31",
  bone: "#e7e0d1",
  signal: "#d95d39",
  card: "#faf7ef",
  muted: "#5c574d",
  border: "#d5cdbd",
} as const;

const fontBody =
  "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
const fontDisplay =
  "'Bricolage Grotesque', 'Arial Black', Arial, sans-serif";

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEntities[character] ?? character);
}

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function renderDetailRows(data: ContactInquiry) {
  const rows = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email, email: true },
    ...(data.company ? [{ label: "Company", value: data.company }] : []),
    { label: "Project", value: data.projectType },
    { label: "Budget", value: data.budget },
    { label: "Timeline", value: data.timeline },
  ];

  return rows
    .map((row) => {
      const value = row.email
        ? `<a href="mailto:${escapeHtml(row.value)}" style="color:${colors.forest};text-decoration:underline;text-underline-offset:2px;">${escapeHtml(row.value)}</a>`
        : escapeHtml(oneLine(row.value));

      return `
        <tr>
          <td class="email-detail-label" style="width:96px;padding:0 16px 14px 0;vertical-align:top;font-family:${fontBody};font-size:11px;line-height:1.5;letter-spacing:0.14em;text-transform:uppercase;color:${colors.muted};">${escapeHtml(row.label)}</td>
          <td class="email-detail-value" style="padding:0 0 14px;vertical-align:top;font-family:${fontBody};font-size:15px;line-height:1.55;color:${colors.ink};word-break:break-word;">${value}</td>
        </tr>`;
    })
    .join("");
}

export function renderContactInquiryEmail(data: ContactInquiry) {
  const name = oneLine(data.name);
  const company = data.company ? oneLine(data.company) : "";
  const projectType = oneLine(data.projectType);
  const message = escapeHtml(data.message).replace(/\r?\n/g, "<br />");
  const preheader = `${name} sent a ${projectType.toLowerCase()} inquiry${company ? ` for ${company}` : ""}.`;
  const replySubject = encodeURIComponent(`Re: ${projectType} inquiry`);

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${escapeHtml(preheader)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Instrument+Sans:ital,wght@0,400..600;1,400&display=swap" rel="stylesheet" />
    <style>
      @media (max-width: 600px) {
        .email-shell { padding: 22px 12px !important; }
        .email-hero { padding: 30px 24px !important; }
        .email-card { padding: 24px !important; }
        .email-title { font-size: 30px !important; }
        .email-detail-label { display: block !important; width: auto !important; padding: 0 0 2px !important; }
        .email-detail-value { display: block !important; padding: 0 0 14px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${colors.paper};color:${colors.ink};">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colors.paper};">
      <tr>
        <td class="email-shell" align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;">
            <tr>
              <td style="padding:0 4px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${fontDisplay};font-size:24px;line-height:1;font-weight:700;letter-spacing:-0.05em;color:${colors.ink};">${escapeHtml(site.wordmark)}<span style="color:${colors.signal};">.</span></td>
                    <td align="right" style="font-family:${fontBody};font-size:11px;line-height:1.4;letter-spacing:0.18em;text-transform:uppercase;color:${colors.muted};">Contact form</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-hero" bgcolor="${colors.forest}" style="background-color:${colors.forest};border-radius:24px;padding:36px 34px 34px;">
                <p style="margin:0 0 18px;font-family:${fontBody};font-size:11px;line-height:1.4;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,238,227,0.72);">New project inquiry</p>
                <h1 class="email-title" style="margin:0;font-family:${fontDisplay};font-size:36px;line-height:1.02;font-weight:700;letter-spacing:-0.04em;color:${colors.paper};">${escapeHtml(projectType)}</h1>
                <p style="margin:18px 0 0;font-family:${fontBody};font-size:15px;line-height:1.65;color:rgba(242,238,227,0.82);">From <strong style="color:${colors.paper};">${escapeHtml(name)}</strong>${company ? ` at <strong style="color:${colors.paper};">${escapeHtml(company)}</strong>` : ""}.</p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.card}" style="background-color:${colors.card};border:1px solid ${colors.border};border-radius:24px;">
                  <tr>
                    <td class="email-card" style="padding:30px 32px 24px;">
                      <p style="margin:0 0 22px;font-family:${fontBody};font-size:11px;line-height:1.4;letter-spacing:0.18em;text-transform:uppercase;color:${colors.muted};">The details</p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${renderDetailRows(data)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top:16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.bone}" style="background-color:${colors.bone};border-radius:24px;">
                  <tr>
                    <td class="email-card" style="padding:30px 32px;">
                      <p style="margin:0 0 14px;font-family:${fontBody};font-size:11px;line-height:1.4;letter-spacing:0.18em;text-transform:uppercase;color:${colors.muted};">The brief</p>
                      <p style="margin:0;font-family:${fontBody};font-size:16px;line-height:1.7;color:${colors.ink};">${message}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;">
                <a href="mailto:${escapeHtml(data.email)}?subject=${replySubject}" style="display:inline-block;background-color:${colors.signal};border-radius:999px;padding:14px 24px;font-family:${fontBody};font-size:14px;line-height:1;font-weight:700;color:${colors.ink};text-decoration:none;">Reply to ${escapeHtml(name)} &rarr;</a>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 6px 0;font-family:${fontBody};font-size:12px;line-height:1.65;color:${colors.muted};">
                Sent from the ${escapeHtml(site.name)} portfolio contact form. Reply directly to reach ${escapeHtml(name)} at ${escapeHtml(data.email)}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderContactInquiryText(data: ContactInquiry) {
  return [
    `New project inquiry — ${data.projectType}`,
    "",
    `From: ${oneLine(data.name)} <${data.email}>`,
    data.company ? `Company: ${oneLine(data.company)}` : null,
    `Budget: ${data.budget}`,
    `Timeline: ${data.timeline}`,
    "",
    "The brief",
    "---------",
    data.message,
    "",
    `Reply to this email to reach ${oneLine(data.name)} at ${data.email}.`,
    `Sent from the ${site.name} portfolio contact form.`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
