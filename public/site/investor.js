"use strict";
const menu = document.querySelector(".menu"),
  nav = document.querySelector(".nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  menu.textContent = open ? "Close" : "Menu";
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
    menu.focus();
  }
});
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    let next;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    }
  });
});
const dialog = document.getElementById("enquire"),
  form = document.getElementById("enquiry-form"),
  success = document.getElementById("enquiry-success"),
  error = document.getElementById("enquiry-error"),
  kind = document.getElementById("enquiry-kind"),
  submit = document.getElementById("send-enquiry");
let opener,
  requestId = crypto.randomUUID(),
  sending = false,
  currentKind = kind.value;
function changeKind() {
  if (currentKind !== kind.value) {
    requestId = crypto.randomUUID();
    form.elements.consent.checked = false;
    currentKind = kind.value;
  }
  setKind();
}
function setKind() {
  const waiting = kind.value === "waitlist";
  document.getElementById("enquiry-title").textContent = waiting
    ? "Join the Product Waitlist"
    : "Tell us what you’re working on";
  document.getElementById("consent-label").textContent = waiting
    ? "I agree to receive product updates and early-access emails from MoedimAI. I can unsubscribe by replying to any email."
    : "I agree that MoedimAI may contact me about this enquiry.";
  submit.textContent = waiting ? "Join the Waitlist" : "Send Enquiry";
}
function openEnquiry(button, value) {
  opener = button;
  kind.value = value;
  changeKind();
  form.hidden = false;
  success.hidden = true;
  error.hidden = true;
  dialog.showModal();
  document.body.classList.add("locked");
}
document
  .querySelectorAll("[data-waitlist]")
  .forEach((button) => button.addEventListener("click", () => openEnquiry(button, "waitlist")));
document.querySelectorAll("[data-enquiry]").forEach((button) =>
  button.addEventListener("click", (e) => {
    e.preventDefault();
    openEnquiry(button, button.dataset.enquiry);
  }),
);
kind.addEventListener("change", changeKind);
form.addEventListener("input", () => {
  requestId = crypto.randomUUID();
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  document.body.classList.remove("locked");
  if (opener) opener.focus();
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      dialog.close();
  }
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sending) return;
  sending = true;
  submit.disabled = true;
  error.hidden = true;
  const previous = submit.textContent;
  submit.textContent = "Sending…";
  form.setAttribute("aria-busy", "true");
  const d = new FormData(form);
  try {
    const response = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: d.get("name"),
        email: d.get("email"),
        organisation: d.get("organisation") || "",
        message: d.get("message") || "",
        kind: d.get("kind"),
        website: d.get("website") || "",
        consent: d.get("consent") === "on",
        requestId,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || result.sent !== true)
      throw new Error(
        result.error || "We couldn’t send your enquiry. Please email vivian@moedim.ai.",
      );
    form.hidden = true;
    success.hidden = false;
    form.reset();
    requestId = crypto.randomUUID();
    success.setAttribute("tabindex", "-1");
    success.focus();
  } catch (problem) {
    error.textContent =
      problem instanceof Error && problem.message.includes("vivian@moedim.ai")
        ? problem.message
        : "We couldn’t send your enquiry. Please try again or email vivian@moedim.ai.";
    error.hidden = false;
  } finally {
    sending = false;
    submit.disabled = false;
    submit.textContent = previous;
    form.removeAttribute("aria-busy");
  }
});
