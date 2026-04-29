import Image from "next/image";
import Link from "next/link";
import type { NgfSiteContent } from "@/lib/ngf";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Our Process" },
  { href: "/our-work", label: "Our Work" },
  { href: "/floor-plans", label: "Floor Plans" },
  { href: "/contact", label: "Contact" },
];

type FooterProps = { content: NgfSiteContent }

export function Footer({ content }: FooterProps) {

  const tagline = content['footer.tagline'] || 'Custom Home Builder serving Grand Rapids, the West Michigan Lakeshore, and surrounding areas.'
  const navLabel = content['footer.navLabel'] || 'Navigation'
  const contactLabel = content['footer.contactLabel'] || 'Contact'
  const phone = content['footer.phone'] || '(616) 682-7422'
  const email = content['footer.email'] || 'northcovebuilders@gmail.com'
  const address = content['footer.address'] || '6147 N. Cove Court, Hudsonville, MI 49426'
  const copyright = content['footer.copyright'] || `© ${new Date().getFullYear()} North Cove Builders. All rights reserved.`

  return (
    <footer className="bg-brand text-white">
      <div className="section-shell grid gap-10 py-14 text-center md:grid-cols-4 md:py-16 md:text-left">
        <div className="space-y-3 md:col-span-2">
          <div className="inline-flex items-center">
            <span className="inline-flex h-[3.25rem] w-[7.5rem] items-center justify-center rounded-xl bg-white px-2 py-1 md:w-[10.5rem]">
              <Image
                src="/brand/logo.png"
                alt="North Cove Builders logo"
                width={96}
                height={52}
                quality={100}
                className="h-full w-full object-contain md:hidden"
              />
              <Image
                src="/brand/logo-desktop.png"
                alt="North Cove Builders logo"
                width={260}
                height={120}
                quality={100}
                unoptimized
                className="hidden h-full w-full object-contain md:block"
              />
            </span>
          </div>
          <p
            data-ngf-field="footer.tagline"
            data-ngf-label="Tagline"
            data-ngf-type="text"
            data-ngf-section="Footer"
            className="mx-auto max-w-md text-white/85 md:mx-0"
          >
            {tagline}
          </p>
        </div>

        <div>
          <h3
            data-ngf-field="footer.navLabel"
            data-ngf-label="Navigation Section Label"
            data-ngf-type="text"
            data-ngf-section="Footer"
            className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80"
          >
            {navLabel}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3
            data-ngf-field="footer.contactLabel"
            data-ngf-label="Contact Section Label"
            data-ngf-type="text"
            data-ngf-section="Footer"
            className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80"
          >
            {contactLabel}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            <li>
              <a href="tel:+16166827422" className="hover:underline">
                <span
                  data-ngf-field="footer.phone"
                  data-ngf-label="Phone"
                  data-ngf-type="text"
                  data-ngf-section="Footer"
                >
                  {phone}
                </span>
              </a>
            </li>
            <li>
              <a href="mailto:northcovebuilders@gmail.com" className="hover:underline">
                <span
                  data-ngf-field="footer.email"
                  data-ngf-label="Email"
                  data-ngf-type="text"
                  data-ngf-section="Footer"
                >
                  {email}
                </span>
              </a>
            </li>
            <li>
              <span
                data-ngf-field="footer.address"
                data-ngf-label="Address"
                data-ngf-type="text"
                data-ngf-section="Footer"
              >
                {address}
              </span>
            </li>
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:underline">
                Facebook
              </a>
              <span className="mx-2">·</span>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
                Instagram
              </a>
              <span className="mx-2">·</span>
              <a href="https://www.houzz.com/pro/neal39/north-cove-builders" target="_blank" rel="noreferrer" className="hover:underline">
                Houzz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/70">
        <span
          data-ngf-field="footer.copyright"
          data-ngf-label="Copyright"
          data-ngf-type="text"
          data-ngf-section="Footer"
        >
          {copyright}
        </span>
      </div>
    </footer>
  );
}
