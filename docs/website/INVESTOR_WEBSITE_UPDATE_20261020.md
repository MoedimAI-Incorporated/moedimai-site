# Investor website and enquiry delivery

Audience: Obi, Codex and the distinct reviewer `website_investor_review`.

State: IN PROGRESS. Codex is sole builder; the distinct reviewer does not author implementation. Obi's current chat requests publishing the approved investor design, removing Moedim Harvest links and delivering website interest to vivian@moedim.ai with Resend. Canonical platform coordination remains `moedim-platform/docs/sprints/ACTIVE_SPRINT.md`; this is a bounded website implementation contract, not a second board.

## Scope

Branch `codex/investor-site-and-enquiries`, cut from website main `95869d46d1d9976e142c1c1a3f8756836f6cc412`. Retain the existing static-homepage rewrite and Next.js support/legal routes. Use the approved local HTML and user-supplied images, optimized with intrinsic proportions and EXIF rotation. Remove Harvest navigation/referrals. Current company pages resolve to the matching approved homepage sections. No app, platform backend, Field, operational data, DDL, camera, microphone or device changes. Public marketing website is a Moedim-only surface, not a dashboard/demo clone. No operating SQL/KPI/financial feed changes; existing website analytics remain.

## Email contract

POST `/api/interest` uses a server-only Resend sending key. Recipient is fixed to `vivian@moedim.ai`; visitor email is Reply-To only. Sender `MoedimAI Website <website@moedimai.com>` uses the existing verified Resend domain. Enquiry types: waitlist, enterprise, government, development, investor and general. Strict bounded JSON validation, same-origin submissions, honeypot, fixed recipient, plain-text output, request UUID idempotency, request timeout and truthful failure/success states. Submitted data and provider response bodies are never logged. No automatic reply or marketing campaign is sent. Waitlist interest is emailed to Vivian, not stored in a mailing-list database.

Per-instance throttling is only a backstop. Before release, configure a Vercel Firewall rate limit for POST `/api/interest` (configured: three requests per IP per ten minutes, fixed window, HTTP 429). Resend quotas also apply. Do not describe memory throttling as distributed enforcement.

## Setup and release gate

1. Install sending-only `RESEND_API_KEY` and `WEBSITE_ENQUIRY_FROM` in the correct Vercel website project for Production and Preview. Never expose their values or commit them.
2. Independent source review, tests, lint, typecheck, build, client-secret scan and required CI before normal merge. Do not merge historical alternative PRs as part of this release.
3. Observe the exact new deployment Ready, and verify `www.moedim.ai` serves the approved version. Existing production was a manually promoted historical branch; main push alone is not deployment proof.
4. Hosted investor homepage, desktop/mobile navigation, enquiry errors and forms for minimal/full/highest-risk input. A clearly labelled test enquiry to Vivian is the only approved live email test. No other recipients or customer information.
5. Receipt records exact source/deployment, role, expected/actual result, artefacts, distinct review and Obi acceptance. Resend accepted is not inbox delivery; verify provider delivery separately. Do not declare complete before hosted proof and Obi acceptance.

## Validation plan

Mocked-provider tests cover fixed recipient and Reply-To, minimal/full enquiries, invalid/malformed/oversized payloads, cross-origin/honeypot rejection, no configuration, provider failure/timeout/invalid response, throttling and duplicate keys. Static homepage checks cover local assets, no Harvest links, all anchors, preserved image proportions and forbidden capture API absence. Run these in website CI along with existing gates.

## Current setup observations

The signed-in Resend account has verified `moedimai.com`. A dedicated sending-only key scoped to that domain was saved as a secret in Vercel project `moedimai-site` for Production and Preview, along with the sender setting. The first unused key was exposed by the browser accessibility output and revoked immediately; its replacement was transferred directly without printing its value. The existing Supabase SMTP key was untouched. Never retain either key value in evidence.

Vercel Firewall rule `rule_website_enquiry_rate_limit_Y5tjNI` is published, matching `/api/interest`, three requests per IP per 600 seconds, action429. Readback showed no staged changes. This setting is outside the Git source and needs separate hosted proof.

The release audit reproduced six runtime dependency findings on base `95869d46d1d9976e142c1c1a3f8756836f6cc412`, including a critical Next.js finding. Same-major Next.js/eslint-config-next16.4.2 and safe patched transitive packages resolve the runtime audit to zero. This is part of the website release, not a pass-over of inherited red.
