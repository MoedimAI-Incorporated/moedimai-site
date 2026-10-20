export function SiteFooter() {
  return (
    <footer className="border-t border-cream-50/10 bg-navy-900">
      <div className="container py-10">
        <p className="text-lg">MoedimAI</p>
        <p className="mt-3 text-sm text-cream-50/70">
          Intelligence and coordination for global trade.
        </p>
        <a href="mailto:vivian@moedim.ai" className="mt-4 inline-block text-gold-500">
          vivian@moedim.ai
        </a>
        <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-5 text-sm">
          <a href="/#platform">Platform</a>
          <a href="/#products">Products & solutions</a>
          <a href="/#investors">Investors</a>
          <a href="/contact">App support</a>
          <a href="/privacy">Privacy</a>
          <a href="/security">Security</a>
        </nav>
        <p className="mt-8 text-xs text-cream-50/60">© 2026 MoedimAI Inc.</p>
      </div>
    </footer>
  );
}
