# Security

## Reporting

Email **paintedfox.studio@gmail.com**. Say what you found, how to
reproduce it, and what it lets somebody do. You will get an answer,
including if the answer is that it is known or not a problem.

## What the threat model actually is

The site is a single static page. It has no server code, no database,
no forms, no accounts, and it stores nothing about its visitors. Booking
happens on Vagaro, messages on WhatsApp and Instagram; this site only
links to them.

That leaves two things worth protecting:

- **The page itself.** Anything that runs script here could rewrite the
  booking links to point somewhere else. That is the whole risk
  surface, which is why the Content-Security-Policy allows script,
  styles, images and fonts from this domain only, and nothing inline.
- **The page's look.** A copy of it inside someone else's frame is how
  a convincing fake "book here" gets built. `frame-ancestors 'none'`
  and `X-Frame-Options: DENY` refuse that.

## Rules the code follows

- No inline scripts and no `style=""` attributes; the CSP has no
  `unsafe-inline`.
- No `innerHTML`, `eval`, `document.write`, or `new Function`. Script
  only toggles a class.
- Every outside link carries `rel="noopener"`.
- No third-party origin is loaded. A new one needs a CSP line in
  `_headers`, and every CSP line needs a reason written next to it.

## Headers

Set in `_headers` at the repository root, with the reasoning beside each
one. The deliberate omissions are documented there.
