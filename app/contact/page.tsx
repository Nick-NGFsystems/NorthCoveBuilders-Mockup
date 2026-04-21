import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Schedule a consultation with North Cove Builders. Call (616) 682-7422 or send us a message. Serving Greater Grand Rapids, the Lakeshore, and surrounding West Michigan communities including Hudsonville, Byron Center, Caledonia, Grand Rapids, Fennville, Saugatuck, Holland, and Grand Haven.",
};

export default function ContactPage() {
  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl text-brand sm:text-4xl md:text-5xl">Let’s build your home vision together.</h1>
          <p className="mt-4 text-foreground/80">
            Call <a href="tel:+16166827422" className="font-semibold text-brand">(616) 682-7422</a> or send a message below.
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            Email: <a href="mailto:northcovebuilders@gmail.com" className="font-semibold text-brand">northcovebuilders@gmail.com</a>
          </p>
          <p className="mt-2 text-sm text-foreground/70">6147 N. Cove Court, Hudsonville, MI 49426</p>
          <p className="mt-2 text-sm text-foreground/70">
            Serving Greater Grand Rapids, the Lakeshore, and surrounding West Michigan communities, including Hudsonville, Byron Center, Caledonia, Grand Rapids, Fennville, Saugatuck, Holland, and Grand Haven.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mx-auto mt-10 max-w-3xl">
          <ContactForm />
        </div>
      </Reveal>
    </section>
  );
}
