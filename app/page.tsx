export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] text-[var(--color-primary)] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6
                      border-b border-[var(--color-muted)]/30 bg-[var(--color-surface)]/80 backdrop-blur-sm">
        <span className="font-accent text-3xl text-[var(--color-secondary)] tracking-wide">
          Maison
        </span>
        <ul className="hidden md:flex gap-10 font-body text-xs tracking-[0.2em] uppercase text-[var(--color-primary)]/70">
          <li className="hover:text-[var(--color-secondary)] transition-colors cursor-pointer">Collections</li>
          <li className="hover:text-[var(--color-secondary)] transition-colors cursor-pointer">Craftsmanship</li>
          <li className="hover:text-[var(--color-secondary)] transition-colors cursor-pointer">About</li>
        </ul>
        <button className="font-body text-xs tracking-[0.25em] uppercase border border-[var(--color-primary)]
                           px-5 py-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]
                           transition-all duration-300">
          Cart (0)
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 px-10 md:px-20 pt-32">

        {/* Background texture — radial warm gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,_#e8d5bc_0%,_var(--color-surface)_70%)] pointer-events-none" />

        {/* Large decorative letter */}
        <span className="absolute top-28 right-10 md:right-20 font-display font-light
                         text-[22vw] leading-none text-[var(--color-muted)]/20 select-none pointer-events-none">
          M
        </span>

        {/* Tag line */}
        <p className="font-accent text-2xl md:text-3xl text-[var(--color-secondary)] mb-4 relative z-10">
          The art of carrying
        </p>

        {/* Hero heading */}
        <h1 className="font-display font-light text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tight relative z-10
                       text-[var(--color-primary)] max-w-4xl">
          Crafted for<br />
          <em className="italic text-[var(--color-secondary)]">those who</em><br />
          endure.
        </h1>

        {/* Sub copy + CTA row */}
        <div className="mt-12 flex flex-col md:flex-row md:items-end gap-8 relative z-10">
          <p className="font-body font-light text-sm leading-relaxed tracking-wide
                        text-[var(--color-primary)]/60 max-w-xs">
            Each piece is hand-stitched in small batches — made to accompany you for decades,
            not seasons.
          </p>
          <div className="flex gap-4">
            <button className="font-body text-xs tracking-[0.25em] uppercase bg-[var(--color-primary)]
                               text-[var(--color-surface)] px-8 py-4
                               hover:bg-[var(--color-secondary)] transition-colors duration-300">
              Explore Collection
            </button>
            <button className="font-body text-xs tracking-[0.25em] uppercase border border-[var(--color-muted)]
                               text-[var(--color-primary)] px-8 py-4
                               hover:border-[var(--color-primary)] transition-colors duration-300">
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--color-muted)]">Scroll</span>
          <div className="w-px h-12 bg-[var(--color-muted)] animate-pulse" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────────────────────────────────── */}
      <div className="border-y border-[var(--color-muted)]/40 bg-[var(--color-primary)] overflow-hidden py-4">
        <div className="flex gap-16 animate-[marquee_18s_linear_infinite] whitespace-nowrap w-max">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex gap-16">
              {["Handcrafted Leather", "Small Batches", "Lifetime Guarantee", "Free Shipping", "Sustainably Sourced"].map((t) => (
                <span key={t} className="font-body text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
                  {t} <span className="text-[var(--color-secondary)] mx-6">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES GRID ──────────────────────────────────────────────────── */}
      <section className="px-10 md:px-20 py-28">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-display font-light text-5xl md:text-7xl text-[var(--color-primary)]">
            Collections
          </h2>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-muted)] hidden md:block">
            New Season 2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Tote", sub: "The everyday essential", count: "12 pieces", accent: false },
            { label: "Clutch", sub: "Evening redefined", count: "8 pieces", accent: true },
            { label: "Satchel", sub: "Structure & soul", count: "15 pieces", accent: false },
          ].map(({ label, sub, count, accent }) => (
            <div
              key={label}
              className={`group relative cursor-pointer border overflow-hidden
                ${accent
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] border-[var(--color-muted)]/40 hover:border-[var(--color-primary)]"
                } transition-all duration-500`}
            >
              {/* Placeholder visual block */}
              <div className={`h-72 flex items-center justify-center relative
                ${accent ? "bg-[var(--color-secondary)]/20" : "bg-[var(--color-muted)]/10"}`}>
                <span className={`font-display font-light text-8xl select-none
                  ${accent ? "text-[var(--color-surface)]/20" : "text-[var(--color-muted)]/30"}`}>
                  {label[0]}
                </span>
                <div className="absolute inset-0 bg-[var(--color-secondary)]/10 opacity-0
                                group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 flex items-end justify-between">
                <div>
                  <h3 className={`font-display font-light text-3xl mb-1
                    ${accent ? "text-[var(--color-surface)]" : "text-[var(--color-primary)]"}`}>
                    {label}
                  </h3>
                  <p className="font-body text-xs tracking-widest uppercase text-[var(--color-muted)]">
                    {sub}
                  </p>
                </div>
                <span className="font-body text-xs tracking-[0.2em] text-[var(--color-secondary)]">
                  {count} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ─────────────────────────────────────────────────── */}
      <section className="px-10 md:px-20 py-24 border-t border-[var(--color-muted)]/30
                          bg-[var(--color-primary)] text-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-accent text-2xl text-[var(--color-secondary)] block mb-6">
            Our philosophy
          </span>
          <blockquote className="font-display font-light text-4xl md:text-6xl leading-tight tracking-tight">
            &quot;A bag is not an accessory —<br />
            <em className="italic text-[var(--color-secondary)]">it is a companion.</em>&quot;
          </blockquote>
          <p className="font-body text-sm text-[var(--color-muted)] mt-10 tracking-wide leading-relaxed max-w-xl mx-auto">
            We believe objects should outlive trends. Every stitch, every edge, every clasp
            is chosen to age gracefully alongside you.
          </p>
        </div>
      </section>

      {/* ── FEATURES ROW ─────────────────────────────────────────────────────── */}
      <section className="px-10 md:px-20 py-24 grid grid-cols-1 md:grid-cols-4 gap-10
                          border-b border-[var(--color-muted)]/30">
        {[
          { icon: "◈", title: "Full-grain Leather", body: "Sourced from tanneries with century-old traditions." },
          { icon: "◉", title: "Hand-stitched", body: "Every seam closed by a craftsperson, not a machine." },
          { icon: "◇", title: "Lifetime Repair", body: "We fix what we make. Indefinitely." },
          { icon: "◎", title: "Slow Fashion", body: "Limited runs. No overstock. No waste." },
        ].map(({ icon, title, body }) => (
          <div key={title} className="flex flex-col gap-4">
            <span className="font-display text-3xl text-[var(--color-secondary)]">{icon}</span>
            <h4 className="font-display font-medium text-xl text-[var(--color-primary)]">{title}</h4>
            <p className="font-body text-sm text-[var(--color-primary)]/60 leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="px-10 md:px-20 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-accent text-2xl text-[var(--color-secondary)]">Maison</span>
        <p className="font-body text-xs tracking-[0.2em] uppercase text-[var(--color-muted)]">
          © 2025 — All rights reserved
        </p>
        <div className="flex gap-8 font-body text-xs tracking-[0.2em] uppercase text-[var(--color-primary)]/50">
          <span className="hover:text-[var(--color-secondary)] cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-[var(--color-secondary)] cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-[var(--color-secondary)] cursor-pointer transition-colors">Instagram</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </main>
  );
}