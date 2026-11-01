import { business, features, labels, services, website, widget } from '../business.config.js'
import { hoursText } from './business.js'

// Makes text safe to place in HTML, e.g. "Check-up & Cleaning".
const escape = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// The demo website at "/", built from business.config.js with the chatbot added at the bottom.
export function demoPage() {
  const { primary, primaryDark, primaryLight } = widget.colors
  const showServices = features.services && services.length > 0

  const serviceCards = services
    .map((s) => `<div class="card"><h3>${escape(s.icon)} ${escape(s.name)}</h3><p>${escape(s.description)}</p><span class="price">${escape(s.price)}</span></div>`)
    .join('\n          ')
  const hours = DAYS.map((day) => `<li><span>${capitalize(day)}</span><span>${hoursText(day)}</span></li>`).join('\n              ')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escape(website.title)}</title>
    <meta name="description" content="${escape(website.subheadline)}" />
    <style>
      :root {
        --brand: ${primary};
        --brand-dark: ${primaryDark};
        --ink: #0f172a;
        --muted: #475569;
        --line: #e2e8f0;
        --soft: ${primaryLight};
      }
      * { box-sizing: border-box; margin: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: ui-sans-serif, system-ui, "Segoe UI", sans-serif; color: var(--ink); background: #fff; line-height: 1.6; }
      a { color: inherit; }
      .wrap { max-width: 1040px; margin: 0 auto; padding: 0 20px; }
      .notice { background: var(--ink); color: #e2e8f0; text-align: center; font-size: 14px; padding: 9px 16px; }
      nav .wrap { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 18px; padding-bottom: 18px; }
      .logo { font-weight: 700; font-size: 20px; text-decoration: none; }
      .links { display: flex; gap: 22px; font-size: 15px; }
      .links a { text-decoration: none; color: var(--muted); }
      .links a:hover { color: var(--brand); }
      .hero { background: linear-gradient(135deg, var(--soft), #fff); padding: 76px 0; }
      .hero h1 { font-size: clamp(34px, 6vw, 54px); line-height: 1.12; max-width: 680px; letter-spacing: -0.02em; }
      .hero p { margin-top: 18px; font-size: 19px; color: var(--muted); max-width: 560px; }
      .hero .hint { margin-top: 26px; display: inline-block; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 12px 18px; font-size: 16px; color: var(--brand-dark); font-weight: 600; }
      section { padding: 68px 0; }
      h2 { font-size: 30px; letter-spacing: -0.01em; }
      .lead { color: var(--muted); margin-top: 6px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 28px; }
      .card { border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
      .card h3 { font-size: 17px; }
      .card p { color: var(--muted); font-size: 15px; margin-top: 4px; }
      .price { color: var(--brand-dark); font-weight: 700; margin-top: 10px; display: block; }
      .tinted { background: #f8fafc; }
      .info { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; }
      .hours { margin-top: 14px; list-style: none; padding: 0; }
      .hours li { display: flex; justify-content: space-between; gap: 16px; max-width: 320px; padding: 7px 0; border-bottom: 1px solid var(--line); }
      .info p { margin-top: 14px; color: var(--muted); }
      footer { padding: 26px 0 96px; color: var(--muted); font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="notice">${escape(website.notice)}</div>

    <nav>
      <div class="wrap">
        <a class="logo" href="#">${escape(widget.icon)} ${escape(business.name)}</a>
        <div class="links">
          ${showServices ? `<a href="#services">${capitalize(escape(labels.services))}</a>` : ''}
          <a href="#visit">Visit us</a>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="wrap">
        <h1>${escape(website.headline)}</h1>
        <p>${escape(website.subheadline)}</p>
        <span class="hint">${escape(website.hint)}</span>
      </div>
    </header>

    <main>
      ${
        showServices
          ? `<section id="services">
        <div class="wrap">
          <h2>Our ${escape(labels.services)}</h2>
          <p class="lead">${escape(website.servicesSubtitle)}</p>
          <div class="grid">
          ${serviceCards}
          </div>
        </div>
      </section>`
          : ''
      }

      <section id="visit" class="tinted">
        <div class="wrap info">
          <div>
            <h2>Opening hours</h2>
            <ul class="hours">
              ${hours}
            </ul>
          </div>
          <div>
            <h2>Visit us</h2>
            <p>${escape(business.address)}</p>
            <p>${escape(business.phone)}<br />${escape(business.email)}</p>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap">${escape(website.footer)}</div>
    </footer>

    <script src="/chatbot.js"></script>
  </body>
</html>`
}
