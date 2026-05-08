import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import type { NgfSiteContent } from "@/lib/ngf";

type ContactSectionProps = {
  content: NgfSiteContent;
};

export function ContactSection({ content }: ContactSectionProps) {
  const eyebrow = content['contact.eyebrow'] || 'How Can We Help?'
  const heading = content['contact.heading'] || 'Wherever you are with your planning, we would love to help.'
  const intro = content['contact.intro'] || 'Please share more about your plans and ideas for your dream home, and we will be in touch soon.'

  return (
    <section className="bg-surface">
      <div className="section-shell">
        <Reveal>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p
              data-ngf-field="contact.eyebrow"
              data-ngf-label="Eyebrow"
              data-ngf-type="text"
              data-ngf-section="Contact"
              className="text-sm font-semibold uppercase tracking-[0.15em] text-brand"
            >
              {eyebrow}
            </p>
            <h2
              data-ngf-field="contact.heading"
              data-ngf-label="Heading"
              data-ngf-type="text"
              data-ngf-section="Contact"
              className="mt-3 text-3xl text-brand md:text-4xl"
            >
              {heading}
            </h2>
            <p
              data-ngf-field="contact.intro"
              data-ngf-label="Intro Text"
              data-ngf-type="textarea"
              data-ngf-section="Contact"
              className="mt-4 text-foreground/80"
            >
              {intro}
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <ContactForm content={content} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
