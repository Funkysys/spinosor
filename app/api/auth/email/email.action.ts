"use server";

import { SubscriptionsEmail } from "@/emails/index";
import { resend } from "@/lib/resend";

export const emailSend = async (formData: FormData) => {
  const email = formData.get("email") as string;

  const emailSend = await resend.emails.send({
    from: "contact@discophiles-blog.eu",
    to: email,
    subject: "Welcome to DiscoPhiles",
    react: SubscriptionsEmail({
      subscriptions: process.env.NEXTAUTH_URL as string,
    }),
  });

  return emailSend;
};
