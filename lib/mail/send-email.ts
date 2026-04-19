import type { ReactElement } from "react";

import { Resend } from "resend";

type SendEmailArgs = {
  from: string;
  html?: string;
  react?: ReactElement;
  subject: string;
  to: string | string[];
};

export async function sendEmail({ from, html, react, subject, to }: SendEmailArgs) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send email.");
  }

  if (!html && !react) {
    throw new Error("Either html or react email content is required.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from,
    html,
    react,
    subject,
    to,
  });
}
