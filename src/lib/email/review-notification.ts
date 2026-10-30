import { site } from "@/content/site";
import type { ReviewSubmission } from "@/lib/community-schema";

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) => htmlEntities[character] ?? character,
  );
}

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function renderReviewNotificationText(review: ReviewSubmission) {
  return [
    "New client review awaiting moderation",
    "",
    `Name: ${oneLine(review.name)}`,
    `Email: ${review.email}`,
    review.company ? `Company: ${oneLine(review.company)}` : null,
    review.role ? `Role: ${oneLine(review.role)}` : null,
    review.rating ? `Rating: ${review.rating}/5` : "Rating: not given",
    "",
    "Review",
    "------",
    review.quote,
    "",
    `Consent to publish: ${review.consent ? "yes" : "no"}`,
    `Confirmed client: ${review.clientConfirmation ? "yes" : "no"}`,
    "",
    `Moderate it at ${site.url}/admin/reviews`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function renderReviewNotificationEmail(review: ReviewSubmission) {
  const name = oneLine(review.name);
  const company = review.company ? oneLine(review.company) : "";
  const role = review.role ? oneLine(review.role) : "";
  const quote = escapeHtml(review.quote).replace(/\r?\n/g, "<br />");
  const adminUrl = `${site.url}/admin/reviews`;

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New review awaiting moderation</title>
  </head>
  <body style="margin:0;padding:0;background:#f2eee3;color:#171612;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2eee3;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;">
            <tr>
              <td style="padding:0 4px 18px;font-family:Arial,sans-serif;font-size:24px;font-weight:700;letter-spacing:-0.04em;">
                ${escapeHtml(site.wordmark)}<span style="color:#d95d39;">.</span>
              </td>
            </tr>
            <tr>
              <td style="background:#1e3a31;border-radius:22px;padding:32px;color:#f2eee3;font-family:Arial,sans-serif;">
                <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c9d5ce;">Review moderation</p>
                <h1 style="margin:0;font-size:32px;line-height:1.05;">A client left a review.</h1>
                <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#dce5df;">It is pending until you check the client, the exact words, and the publication consent.</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;background:#faf7ef;border:1px solid #d5cdbd;border-radius:22px;padding:28px;font-family:Arial,sans-serif;">
                <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5c574d;">From</p>
                <p style="margin:0;font-size:16px;line-height:1.6;"><strong>${escapeHtml(name)}</strong>${company ? ` at <strong>${escapeHtml(company)}</strong>` : ""}</p>
                <p style="margin:4px 0 0;font-size:14px;line-height:1.6;color:#5c574d;">${escapeHtml(review.email)}${role ? ` · ${escapeHtml(role)}` : ""}</p>
                <p style="margin:4px 0 0;font-size:14px;line-height:1.6;color:#5c574d;">${review.rating ? `${review.rating}/5 rating` : "No rating given"}</p>
                <p style="margin:22px 0 0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#5c574d;">The review</p>
                <p style="margin:8px 0 0;font-size:16px;line-height:1.7;">${quote}</p>
                <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#5c574d;">Consent to publish: <strong>${review.consent ? "yes" : "no"}</strong><br />Confirmed client: <strong>${review.clientConfirmation ? "yes" : "no"}</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:22px;font-family:Arial,sans-serif;">
                <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#d95d39;border-radius:999px;padding:14px 22px;color:#171612;font-size:14px;font-weight:700;text-decoration:none;">Open moderation queue</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
