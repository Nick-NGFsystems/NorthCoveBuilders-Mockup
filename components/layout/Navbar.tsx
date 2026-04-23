"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NgfSiteContent } from "@/lib/ngf";

const navLinkKeys = [
  { href: "/", key: "home", defaultLabel: "Home" },
  { href: "/about", key: "about", defaultLabel: "About" },
  { href: "/our-work", key: "ourWork", defaultLabel: "Our Work" },
  { href: "/floor-plans", key: "floorPlans", defaultLabel: "Floor Plans" },
];

const secondaryLinkKeys = [
  { href: "https://www.houzz.com/pro/neal39/north-cove-builders", key: "houzz", defaultLabel: "Houzz Gallery" },
  { href: "/available", key: "available", defaultLabel: "Available" },
];

type NavbarProps = {
  content: NgfSiteContent;
};

export function Navbar({ content }: NavbarProps) {
  const navLinks = navLinkKeys.map(link => ({
    ...link,
    label: content[`nav.${link.key}`] ?? link.defaultLabel,
  }));

  const secondaryLinks = secondaryLinkKeys.map(link => ({
    ...link,
    label: content[`nav.${link.key}`] ?? link.defaultLabel,
  }));

  const ctaLabel = content['nav.cta'] ?? "Let's connect!";
  const moreLabel = content['nav.more'] ?? 'More';
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const lastScrollY = useRef(0);
  const moreMenuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      const pastThreshold = currentY > 96;

      setHidden(scrollingDown && pastThreshold);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!moreMenuRef.current) {
        return;
      }

      if (!moreMenuRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-brand/95 text-white backdrop-blur transition-transform duration-300 ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-2 px-4 md:gap-4 md:px-8">
        <Link href="/" className="flex items-center">
          <span className="inline-flex h-[3.25rem] w-[7.5rem] items-center justify-center rounded-xl bg-white px-2 py-1 md:h-[3.75rem] md:w-[13rem]">
            <Image
              src="/brand/logo.png"
              alt="North Cove Builders logo"
              width={180}
              height={96}
              quality={100}
              priority
              className="h-full w-full object-contain md:hidden"
            />
            <Image
              src="/brand/logo-desktop.png"
              alt="North Cove Builders logo"
              width={180}
              height={96}
              quality={100}
              priority
              className="hidden h-full w-full object-contain md:block"
            />
          </span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition hover:text-white/80"
                data-ngf-field={`nav.${link.key}`}
                data-ngf-label={`${link.key.charAt(0).toUpperCase() + link.key.slice(1)} Link`}
                data-ngf-type="text"
                data-ngf-section="Nav"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li ref={moreMenuRef} className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-white/35 px-3 py-1.5 transition hover:bg-white/10"
              onClick={() => setMoreOpen((previous) => !previous)}
              aria-expanded={moreOpen}
              aria-controls="desktop-more-menu"
              data-ngf-field="nav.more"
              data-ngf-label="More Menu Button"
              data-ngf-type="text"
              data-ngf-section="Nav"
            >
              {moreLabel}
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-200 ${moreOpen ? "rotate-0" : "rotate-180"}`}
              >
                <path
                  d="M5.5 7.5 10 12l4.5-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              id="desktop-more-menu"
              className={`absolute right-0 top-10 min-w-44 rounded-2xl bg-white p-2 text-brand shadow-lg transition-all duration-200 ${
                moreOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-surface"
                  onClick={() => setMoreOpen(false)}
                  data-ngf-field={`nav.${link.key}`}
                  data-ngf-label={`${link.key.charAt(0).toUpperCase() + link.key.slice(1)} Link`}
                  data-ngf-type="text"
                  data-ngf-section="Nav"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </li>
        </ul>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Link
            href="/contact"
            className="rounded-full bg-white px-3 py-2.5 text-sm font-semibold text-brand transition hover:bg-white/90 sm:px-4"
            data-ngf-field="nav.cta"
            data-ngf-label="CTA Button"
            data-ngf-type="text"
            data-ngf-section="Nav"
          >
            <span className="sm:hidden">Connect</span>
            <span className="hidden sm:inline">{ctaLabel}</span>
          </Link>

          <button
            type="button"
            className="rounded-full border border-white/40 px-3 py-2 text-sm font-semibold lg:hidden"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`fixed inset-x-0 bottom-0 top-20 z-40 bg-[#0f2f57] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-5 pb-8 pt-4" onClick={(event) => event.stopPropagation()}>
          <nav className="grid gap-2">
            {[...navLinks, ...secondaryLinks].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl border border-brand bg-white px-4 py-4 text-base font-semibold text-brand shadow-sm transition-all duration-300 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 45}ms` }}
                data-ngf-field={`nav.${link.key}`}
                data-ngf-label={`${link.key.charAt(0).toUpperCase() + link.key.slice(1)} Link`}
                data-ngf-type="text"
                data-ngf-section="Nav"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
