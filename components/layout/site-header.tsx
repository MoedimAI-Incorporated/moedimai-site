/* eslint-disable @next/next/no-img-element */
const links = [
  ["Platform", "/#platform"],
  ["Products & solutions", "/#products"],
  ["About", "/#about"],
  ["Investors", "/#investors"],
];
export function SiteHeader() {
  return (
    <header className="border-b border-cream-50/10 bg-navy-900">
      <div className="container flex min-h-20 flex-wrap items-center justify-between gap-5 py-4">
        <a href="/" aria-label="MoedimAI home">
          <img src="/site/investor-logo.png" alt="MoedimAI" className="h-10 w-auto" />
        </a>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5 text-sm">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-cream-50/80 hover:text-gold-300">
              {label}
            </a>
          ))}
          <a href="/#contact" className="text-gold-500">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
