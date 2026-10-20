import { createInterestHandler } from "@/lib/website-interest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handler = createInterestHandler({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.WEBSITE_ENQUIRY_FROM,
});
export async function POST(request: Request) {
  return handler(request);
}
