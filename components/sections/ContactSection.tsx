import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export function ContactSection() {
  return (
    <section className="bg-surface">
      <div className="section-shell">
        <Reveal>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">How Can We Help?</p>
            <h2 className="mt-3 text-3xl text-brand md:text-4xl">Wherever you are with your planning, we would love to help.</h2>
            <p className="mt-4 text-foreground/80">
              Please share more about your plans and ideas for your dream home, and we will be in touch soon.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
