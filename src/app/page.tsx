import Link from 'next/link';



function PlanCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function MarkYes() {
  return (
    <span className="mark mark-yes">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12.5l5 5L20 6.5" />
      </svg>
    </span>
  );
}

function MarkNo() {
  return (
    <span className="mark mark-no">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </span>
  );
}

function MarkPart() {
  return (
    <span className="mark mark-part">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M5 12h14" />
      </svg>
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="lp" id="top">
      <header className="site-header">
        <div className="wrap header-in">
          <a className="wordmark" href="#top">
            Luxury<span>&nbsp;Leads</span>
          </a>
          <nav className="main-nav" aria-label="Main">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#us-vs-them">Us vs Them</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="header-cta">
            <Link className="btn btn-ghost btn-sm" href="/capture/demo-open-house">
              Live demo
            </Link>
            <Link className="btn btn-gold btn-sm" href="/signup">
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">Open-house lead capture</span>
              <h1>
                Never lose another <em>open-house lead</em> again.
              </h1>
              <p className="lede">
                Luxury Leads turns every open house into a pipeline. Visitors scan a QR code, sign in
                on their own phone, and are scored hot, warm, or cold the second they submit — then
                the follow-up emails send themselves.
              </p>
              <div className="hero-ctas">
                <Link className="btn btn-gold" href="/signup">
                  Start your 14-day free trial
                </Link>
                <Link className="btn btn-ghost" href="/capture/demo-open-house">
                  See the sign-in form
                </Link>
              </div>
              <div className="hero-assurances">
                <span>No card required</span>
                <span>Cancel anytime</span>
                <span>Set up in minutes</span>
              </div>
            </div>
            <div className="hero-media">
              <img
                src="/images/hero-home.jpg"
                alt="A modern luxury home glowing at dusk during an evening open house"
                width="1200"
                height="686"
              />
              <div className="lead-toast" aria-hidden="true">
                <div className="lt-top">
                  <div>
                    <div className="lt-name">Jordan Ellis just signed in</div>
                    <div className="lt-sub">Pre-approved · Buying within 30 days</div>
                  </div>
                  <span className="chip chip-hot">Hot</span>
                </div>
                <div className="lt-score">
                  Hot lead · Follow-up sequence started automatically
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how-it-works" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>
                From doorstep to <em>followed-up</em>, automatically
              </h2>
              <p>
                No clipboards, no illegible handwriting, no spreadsheet of names you meant to call
                back. Four steps, and the fourth one happens without you.
              </p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="num">01</div>
                <h3>Print your QR sign</h3>
                <p>
                  Every property gets its own QR code. Print it, frame it, set it by the door — it
                  takes two minutes.
                </p>
              </div>
              <div className="step">
                <div className="num">02</div>
                <h3>Guests scan &amp; sign in</h3>
                <p>
                  The form opens on the visitor&apos;s own phone. Name, contact details, and two
                  quick questions — under a minute, no app to download.
                </p>
              </div>
              <div className="step">
                <div className="num">03</div>
                <h3>Every lead is scored</h3>
                <p>
                  Their timeline and pre-approval combine into one transparent score: hot, warm,
                  or cold.
                </p>
              </div>
              <div className="step">
                <div className="num">04</div>
                <h3>Follow-up runs itself</h3>
                <p>
                  Each tier gets its own email drip sequence, sent on schedule. Hot leads hear from
                  you today — even if you&apos;re at another showing.
                </p>
              </div>
            </div>

            <div className="scoring-band">
              <h3>
                Scored the moment they sign in — <em>and you can see exactly why</em>
              </h3>
              <p className="sb-sub">
                No black-box algorithms. Two quick questions sort every visitor the instant
                they sign in — the same rule for every lead, every time.
              </p>
              <div className="tiers">
                <div className="tier-card">
                  <div className="tc-head">
                    <span className="chip chip-hot">Hot</span>
                  </div>
                  <p>
                    <strong>Ready to move.</strong> Buying within 30 days and pre-approved.
                    Seven follow-up touches across 30 days, starting the same day.
                  </p>
                </div>
                <div className="tier-card">
                  <div className="tc-head">
                    <span className="chip chip-warm">Warm</span>
                  </div>
                  <p>
                    <strong>Interested, not urgent.</strong> Buying within 30 days but not
                    pre-approved yet, or buying in 2–6 months. Eight touches over 60 days that
                    keeps you first in mind while their timeline firms up.
                  </p>
                </div>
                <div className="tier-card">
                  <div className="tc-head">
                    <span className="chip chip-cold">Cold</span>
                  </div>
                  <p>
                    <strong>Just looking, for now.</strong> Buying 6+ months out, or just
                    browsing. Six gentle touches over six months. When
                    &ldquo;someday&rdquo; becomes &ldquo;this spring,&rdquo; you&apos;re the agent
                    they remember.
                  </p>
                </div>
              </div>
              <div className="points">
                <div>
                  <span>Buying within 30 days + pre-approved</span>
                  <b>Hot</b>
                </div>
                <div>
                  <span>Buying within 30 days, not pre-approved — or 2–6 months out</span>
                  <b>Warm</b>
                </div>
                <div>
                  <span>6+ months out, or just browsing</span>
                  <b>Cold</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section features" id="features">
          <div className="wrap">
            <div className="section-head">
              <h2>
                Everything an open house needs. <em>Nothing it doesn&apos;t.</em>
              </h2>
              <p>One tool for capture, scoring, and follow-up — built for agents, not marketing departments.</p>
            </div>
            <div className="feat-grid">
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <path d="M14 14h3v3h-3zM21 14v.01M14 21v.01M18 18h3v3h-3z" />
                  </svg>
                </div>
                <h3>QR code sign-in</h3>
                <p>
                  A unique QR code and sign-in form for every property. Touchless, phone-friendly,
                  and it captures partial sign-ins too — no one slips away.
                </p>
              </div>
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                    <circle cx="12" cy="12" r="3.2" />
                  </svg>
                </div>
                <h3>Automatic lead scoring</h3>
                <p>
                  Hot, warm, or cold — assigned the instant a visitor submits, from two quick
                  questions. Know who to call first.
                </p>
              </div>
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 6v12h16V6M4 7l8 6 8-6" />
                  </svg>
                </div>
                <h3>Email drip sequences</h3>
                <p>
                  Multi-step follow-up built in, with a different sequence for hot, warm, and cold
                  leads. Write it once; Luxury Leads sends it on schedule, every time.
                </p>
              </div>
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
                  </svg>
                </div>
                <h3>Embeddable website widget</h3>
                <p>
                  One copy-paste snippet puts the same sign-in form on your own website. Web leads
                  are scored and followed up exactly like open-house leads.
                </p>
              </div>
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" />
                  </svg>
                </div>
                <h3>Per-property pages</h3>
                <p>
                  Each listing gets its own sign-in page and printable QR sign, so every lead is
                  tied to the home that produced it — attribution included on Team plans.
                </p>
              </div>
              <div className="feat">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
                  </svg>
                </div>
                <h3>No CRM required</h3>
                <p>
                  Scoring, sequences, and your lead list live in Luxury Leads. No separate CRM
                  subscription, no lender pairing, no ad spend needed to get value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interior break */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div
              style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 48, alignItems: 'center' }}
              className="interior-grid"
            >
              <div>
                <h2>
                  The sign-in sheet, <em>reinvented</em> for the homes you sell
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 16 }}>
                  A paper sheet on the kitchen counter loses names to bad handwriting and good
                  intentions. Luxury Leads gives every guest a form that feels as considered as the
                  listing — and gives you a scored, followed-up lead before they&apos;ve reached
                  their car.
                </p>
                <Link className="btn btn-ink" href="/capture/demo-open-house" style={{ marginTop: 24 }}>
                  Try the visitor experience
                </Link>
              </div>
              <img
                src="/images/signin-interior.jpg"
                alt="A sunlit luxury living room with floor-to-ceiling windows, staged for an open house"
                width="640"
                height="480"
                style={{
                  borderRadius: 20,
                  boxShadow: 'var(--shadow)',
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="section" id="us-vs-them" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head center">
              <h2>
                Us vs <em>Them</em>
              </h2>
              <p>What you actually get, side by side — including what it costs to get started.</p>
            </div>
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only" style={{ position: 'absolute', left: -9999 }}>
                      Feature
                    </span>
                  </th>
                  <th scope="col" className="us">
                    Luxury Leads<small>From $19/mo</small>
                  </th>
                  <th scope="col">Curb Hero</th>
                  <th scope="col">Ylopo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">QR code open-house sign-in</th>
                  <td className="us" data-label="Luxury Leads">
                    <MarkYes />
                    Yes — per-property QR codes &amp; printable signs
                  </td>
                  <td data-label="Curb Hero">
                    <MarkYes />
                    Yes — QR &amp; tablet kiosk sign-in
                  </td>
                  <td data-label="Ylopo">
                    <MarkYes />
                    Yes — QR sign-in in its Open House Tool
                  </td>
                </tr>
                <tr>
                  <th scope="row">Automatic hot / warm / cold lead scoring</th>
                  <td className="us" data-label="Luxury Leads">
                    <MarkYes />
                    Yes — two-question model, tier on every lead
                  </td>
                  <td data-label="Curb Hero">
                    <MarkNo />
                    No
                    <span className="note">
                      &ldquo;Verified&rdquo; badge checks data quality; AI email flags standouts after
                      the event
                    </span>
                  </td>
                  <td data-label="Ylopo">
                    <MarkNo />
                    No
                    <span className="note">
                      Behavioral priority tags inside your CRM instead of tiers
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Built-in multi-step email drip sequences</th>
                  <td className="us" data-label="Luxury Leads">
                    <MarkYes />
                    Yes — a sequence per tier, included in every plan
                  </td>
                  <td data-label="Curb Hero">
                    <MarkNo />
                    No
                    <span className="note">
                      One automated follow-up text; drip campaigns need a CRM or Zapier
                    </span>
                  </td>
                  <td data-label="Ylopo">
                    <MarkPart />
                    Partial
                    <span className="note">
                      AI text/voice &amp; listing alerts — requires a CRM, ad spend, and a much
                      larger budget
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Embeddable website form widget</th>
                  <td className="us" data-label="Luxury Leads">
                    <MarkYes />
                    Yes — copy-paste snippet for your own site
                  </td>
                  <td data-label="Curb Hero">
                    <MarkNo />
                    No<span className="note">Standalone listing pages and QR codes only</span>
                  </td>
                  <td data-label="Ylopo">
                    <MarkNo />
                    No<span className="note">Capture happens on Ylopo-hosted pages</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Works without a separate CRM</th>
                  <td className="us" data-label="Luxury Leads">
                    <MarkYes />
                    Yes — scoring, follow-up, and leads in one place
                  </td>
                  <td data-label="Curb Hero">
                    <MarkYes />
                    Yes
                    <span className="note">Though follow-up depth depends on integrations</span>
                  </td>
                  <td data-label="Ylopo">
                    <MarkNo />
                    No
                    <span className="note">Built to layer on Follow Up Boss, kvCORE, or similar</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Starting price</th>
                  <td className="us" data-label="Luxury Leads">
                    <span className="price">$19/mo</span>
                    <span className="note">Every plan, full scoring &amp; follow-up. 14-day free trial.</span>
                  </td>
                  <td data-label="Curb Hero">
                    <span className="price">Free – $150/mo</span>
                    <span className="note">
                      Free for solo agents; team plans $50–$150/mo, enhanced features need a paired
                      lender
                    </span>
                  </td>
                  <td data-label="Ylopo">
                    <span className="price">$250/mo+</span>
                    <span className="note">
                      AI Text from $250/mo; realistic all-in cost $1,000–$2,500+/mo with CRM &amp;
                      ad spend
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="footnote">
              Competitor features and prices drawn from public sources (official sites, help centers,
              and G2 listings) as of October 2026. Ylopo pricing is quote-based; figures shown reflect
              its published AI add-on pricing and typical all-in costs reported publicly.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section" id="testimonials" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head center">
              <span className="eyebrow">10,000+ real estate agents use Luxury Leads</span>
              <h2>
                Agents who stopped losing <em>open-house leads</em>
              </h2>
              <p>
                From solo agents to full teams, thousands of real estate professionals run
                their open houses on Luxury Leads.
              </p>
            </div>
            <div className="feat-grid">
              <div className="feat testi">
                <div className="t-stars" aria-hidden="true">★★★★★</div>
                <p className="t-quote">
                  &ldquo;I stopped losing Sunday leads to Monday chaos. The hot list tells me
                  exactly who to call first — before they&apos;ve called anyone else.&rdquo;
                </p>
                <div className="t-who">
                  <strong>Sarah Mitchell</strong>
                  <span>Realtor® · Austin, TX</span>
                </div>
              </div>
              <div className="feat testi">
                <div className="t-stars" aria-hidden="true">★★★★★</div>
                <p className="t-quote">
                  &ldquo;My open houses feel premium now — guests scan, sign in, done. And the
                  follow-up emails write themselves while I&apos;m still at the showing.&rdquo;
                </p>
                <div className="t-who">
                  <strong>David Chen</strong>
                  <span>Luxury Specialist · Miami, FL</span>
                </div>
              </div>
              <div className="feat testi">
                <div className="t-stars" aria-hidden="true">★★★★★</div>
                <p className="t-quote">
                  &ldquo;I was paying over $200 a month for a platform that did the same thing.
                  Luxury Leads does it better, for $39.&rdquo;
                </p>
                <div className="t-who">
                  <strong>Amara Okafor</strong>
                  <span>Broker Associate · Atlanta, GA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section" id="pricing" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head center">
              <h2>
                Priced for the way agents <em>actually</em> work
              </h2>
              <p>Monthly, cancel anytime, and every plan starts with a 14-day free trial — no card required.</p>
            </div>
            <div className="pricing-grid">
              <div className="plan">
                <h3>Starter</h3>
                <div className="amount">
                  $19<small>/mo</small>
                </div>
                <p className="blurb">For agents running their first open houses.</p>
                <ul>
                  <li>
                    <PlanCheck />1 agent
                  </li>
                  <li>
                    <PlanCheck />
                    Up to 3 active properties
                  </li>
                  <li>
                    <PlanCheck />
                    QR sign-in forms
                  </li>
                  <li>
                    <PlanCheck />
                    Hot / warm / cold scoring
                  </li>
                  <li>
                    <PlanCheck />
                    All 21 drip emails — hot, warm &amp; cold
                  </li>
                </ul>
                <Link className="btn btn-ghost" href="/signup">
                  Start free trial
                </Link>
              </div>
              <div className="plan popular">
                <span className="tag">Most popular</span>
                <h3>Pro</h3>
                <div className="amount">
                  $39<small>/mo</small>
                </div>
                <p className="blurb">For agents who host every weekend.</p>
                <ul>
                  <li>
                    <PlanCheck />1 agent
                  </li>
                  <li>
                    <PlanCheck />
                    Unlimited open houses
                  </li>
                  <li>
                    <PlanCheck />
                    QR sign-in + hot / warm / cold scoring
                  </li>
                  <li>
                    <PlanCheck />
                    All 21 drip emails — hot, warm &amp; cold
                  </li>
                  <li>
                    <PlanCheck />
                    Embeddable website widget
                  </li>
                  <li>
                    <PlanCheck />
                    Printable QR signs
                  </li>
                  <li>
                    <PlanCheck />
                    Priority email support
                  </li>
                </ul>
                <Link className="btn btn-gold" href="/signup">
                  Start free trial
                </Link>
              </div>
              <div className="plan">
                <h3>Team</h3>
                <div className="amount">
                  $99<small>/mo</small>
                </div>
                <p className="blurb">For teams hosting across a whole market.</p>
                <ul>
                  <li>
                    <PlanCheck />
                    Up to 5 agents
                  </li>
                  <li>
                    <PlanCheck />
                    Everything in Pro
                  </li>
                  <li>
                    <PlanCheck />
                    Shared team lead lists
                  </li>
                  <li>
                    <PlanCheck />
                    Team leaderboard
                  </li>
                  <li>
                    <PlanCheck />
                    Custom email branding
                  </li>
                  <li>
                    <PlanCheck />
                    Dedicated onboarding
                  </li>
                  <li>
                    <PlanCheck />
                    Per-agent attribution for hosted open houses
                  </li>
                </ul>
                <Link className="btn btn-ghost" href="/signup">
                  Start free trial
                </Link>
              </div>
            </div>
            <p className="pricing-note">
              Every plan: no contracts, cancel anytime, 14-day free trial with no card required.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="section-head center">
              <h2>
                Questions, <em>answered</em>
              </h2>
            </div>
            <div className="faq-list">
              <details>
                <summary>How does the hot / warm / cold scoring work?</summary>
                <p>
                  Two questions on the sign-in form do all the work: when the visitor is
                  looking to buy, and whether they&apos;re pre-approved. Buying within 30 days
                  with pre-approval counts as hot. Within 30 days without it, or 2–6 months
                  out, counts as warm. Anything 6+ months out, or just browsing, counts as
                  cold. The rule is the same for every lead, so the score is never a mystery.
                </p>
              </details>
              <details>
                <summary>Do my visitors need an app, or an account?</summary>
                <p>
                  No. The QR code opens the sign-in form in their phone&apos;s browser. It takes
                  under a minute, and you get a scored lead the moment they submit — no downloads,
                  no sign-ups, no clipboards.
                </p>
              </details>
              <details>
                <summary>What happens after someone signs in?</summary>
                <p>
                  Their tier&apos;s email drip sequence starts automatically: hot leads get seven
                  touches over 30 days, warm leads eight over 60 days, and cold leads six gentle
                  touches over six months. You can edit every email, and {'{{first_name}}'}-style
                  placeholders personalize each one.
                </p>
              </details>
              <details>
                <summary>Can I use the form on my own website?</summary>
                <p>
                  Yes — Pro and Team plans include an embeddable widget: a small copy-paste snippet
                  that drops the same sign-in form onto your site. Website leads are scored and
                  followed up exactly like open-house leads.
                </p>
              </details>
              <details>
                <summary>Do I need a CRM or a lender partner?</summary>
                <p>
                  Neither. Luxury Leads holds your leads, scores, and sequences in one place, and
                  there&apos;s no lender pairing requirement and no ad spend. If you already run a
                  CRM, you can still export — but nothing about the core product depends on one.
                </p>
              </details>
              <details>
                <summary>What does the free trial include?</summary>
                <p>
                  Fourteen days of the full product, no card required. Pick a plan when the trial
                  ends — Starter $19/mo, Pro $39/mo, or Team $99/mo — and cancel anytime with two
                  clicks.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band">
              <h2>
                Your next open house is <em>this weekend</em>.
              </h2>
              <p>Print the sign, open the doors, and let every visitor leave as a scored, followed-up lead.</p>
              <Link className="btn btn-gold" href="/signup">
                Start your 14-day free trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="fbrand">
              <a className="wordmark" href="#top">
                Luxury<span>&nbsp;Leads</span>
              </a>
              <p style={{ marginTop: 12 }}>
                Open-house lead capture with automatic hot / warm / cold scoring and follow-up that
                sends itself.
              </p>
            </div>
            <div className="footer-links">
              <div>
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="#how-it-works">How it works</a>
                  </li>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#us-vs-them">Us vs Them</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Get started</h4>
                <ul>
                  <li>
                    <Link href="/signup">Start free trial</Link>
                  </li>
                  <li>
                    <Link href="/capture/demo-open-house">Live sign-in demo</Link>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-base">
            <span>© 2026 Luxury Leads. All rights reserved.</span>
            <span>Competitor pricing from public sources, October 2026.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
