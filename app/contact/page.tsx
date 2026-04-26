import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getNgfContent } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Schedule a consultation with North Cove Builders. Call (616) 682-7422 or send us a message. Serving Greater Grand Rapids, the Lakeshore, and surrounding West Michigan communities including Hudsonville, Byron Center, Caledonia, Grand Rapids, Fennville, Saugatuck, Holland, and Grand Haven.",
};

export default async function ContactPage() {
  const content = await getNgfContent()

  const heading = content['contactPage.heading'] || 'Let\'s build your home vision together.'
  const callText = content['contactPage.callText'] || 'Call'
  const phone = content['contactPage.phone'] || '(616) 682-7422'
  const sendMessageText = content['contactPage.sendMessage'] || 'or send a message below.'
  const emailLabel = content['contactPage.emailLabel'] || 'Email:'
  const email = content['contactPage.email'] || 'northcovebuilders@gmail.com'
  const address = content['contactPage.address'] || '6147 N. Cove Court, Hudsonville, MI 49426'
  const serviceArea = content['contactPage.serviceArea'] || 'Serving Greater Grand Rapids, the Lakeshore, and surrounding West Michigan communities, including Hudsonville, Byron Center, Caledonia, Grand Rapids, Fennville, Saugatuck, Holland, and Grand Haven.'

  return (
    <section className="section-shell !pt-40 md:!pt-[8.5rem]">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <h1
            data-ngf-field="contactPage.heading"
            data-ngf-label="Heading"
            data-ngf-type="text"
            data-ngf-section="ContactPage"
            className="text-3xl text-brand sm:text-4xl md:text-5xl"
          >
            {heading}
          </h1>
          <p className="mt-4 text-foreground/80">
            <span
              data-ngf-field="contactPage.callText"
              data-ngf-label="Call Label"
              data-ngf-type="text"
              data-ngf-section="ContactPage"
            >
              {callText}
            </span>
            {' '}
            <a href="tel:+16166827422" className="font-semibold text-brand">
              <span
                data-ngf-field="contactPage.phone"
                data-ngf-label="Phone"
                data-ngf-type="text"
                data-ngf-section="ContactPage"
              >
                {phone}
              </span>
            </a>
            {' '}
            <span
              data-ngf-field="contactPage.sendMessage"
              data-ngf-label="Send Message Text"
              data-ngf-type="text"
              data-ngf-section="ContactPage"
            >
              {sendMessageText}
            </span>
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            <span
              data-ngf-field="contactPage.emailLabel"
              data-ngf-label="Email Label"
              data-ngf-type="text"
              data-ngf-section="ContactPage"
            >
              {emailLabel}
            </span>
            {' '}
            <a href="mailto:northcovebuilders@gmail.com" className="font-semibold text-brand">
              <span
                data-ngf-field="contactPage.email"
                data-ngf-label="Email"
                data-ngf-type="text"
                data-ngf-section="ContactPage"
              >
                {email}
              </span>
            </a>
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            <span
              data-ngf-field="contactPage.address"
              data-ngf-label="Address"
              data-ngf-type="text"
              data-ngf-section="ContactPage"
            >
              {address}
            </span>
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            <span
              data-ngf-field="contactPage.serviceArea"
              data-ngf-label="Service Area"
              data-ngf-type="textarea"
              data-ngf-section="ContactPage"
            >
              {serviceArea}
            </span>
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mx-auto mt-10 max-w-3xl">
          <ContactForm content={content} />
        </div>
      </Reveal>
    </section>
  );
}
