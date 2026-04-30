import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TeamMemberBio } from "@/components/sections/TeamMemberBio";
import { teamMembers } from "@/lib/site-data";
import { getNgfContent, getItems } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the North Cove Builders team — Neal, Elisha, Cindy, and Bryan. Learn about our values, our process, and our commitment to a personal building experience.",
};


export default async function AboutPage() {
  const content = await getNgfContent()

  const heroEyebrow = content['about.heroEyebrow'] || 'About North Cove Builders'
  const heroHeading = content['about.heroHeading'] || 'A Clear and Personal Home Building Process from Design to Move-In'
  const heroIntro   = content['about.heroIntro']   || 'North Cove Builders has built over 250 custom homes in West Michigan, with experience spanning a wide range of settings and lifestyles. From waterfront lake homes and homes on rural acreage to thoughtfully designed neighborhood residences and short-term rental properties, each project is tailored to fit the land, the vision, and the way our clients live. Whether building on a wooded parcel, a lakefront lot, or within a growing community, we bring the same level of detail, organization, and care to every home we create.'
  const teamHeading = content['about.teamHeading'] || 'The Team Behind Your Building Experience'
  const valuesHeading = content['about.valuesHeading'] || 'We Keep God and our values at the forefront of everything we do'
  const valuesMission = content['about.valuesMission'] || 'At North Cove Builders, our faith & core values guide every decision we make. As a custom home builder, we are committed to creating a building experience that is personal, enjoyable, and that your new home is everything you\'ve dreamt it would be.'
  const valuesStatement = content['about.valuesStatement'] || ''
  const coreValuesHeading = content['about.coreValuesHeading'] || 'Core Values'
  // Core values — editable as a repeatable group
  const savedCoreValues = getItems(content, 'about.coreValues')
  const defaultCoreValues = [
    { text: 'Family is first. Ours. Yours. Always!' },
    { text: 'We treat everyone fairly, with honesty and respect.' },
    { text: "We build trust by acting with compassion and others' best interest in mind." },
    { text: 'Our team is built on positivity, hard work, and reliability.' },
  ]
  const coreValues = savedCoreValues.length > 0 ? savedCoreValues : defaultCoreValues


  return (
    <>
      <section className="bg-surface">
        <div className="section-shell !pt-40 pb-4 md:!pt-[8.5rem]">
          <p
            data-ngf-field="about.heroEyebrow"
            data-ngf-label="Eyebrow"
            data-ngf-type="text"
            data-ngf-section="About"
            className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-brand md:text-left"
          >
            {heroEyebrow}
          </p>
          <h1
            data-ngf-field="about.heroHeading"
            data-ngf-label="Heading"
            data-ngf-type="text"
            data-ngf-section="About"
            className="mt-3 text-center text-3xl text-brand sm:text-4xl md:text-left md:text-5xl"
          >
            {heroHeading}
          </h1>
          <p
            data-ngf-field="about.heroIntro"
            data-ngf-label="Intro Paragraph"
            data-ngf-type="textarea"
            data-ngf-section="About"
            className="mt-6 text-center text-base leading-8 text-foreground/70 md:max-w-3xl md:text-left"
          >
            {heroIntro}
          </p>
        </div>
      </section>

      <section id="team" className="bg-surface scroll-mt-28">
        <div className="section-shell !pt-6 md:!pt-8">
          <Reveal>
            <h2
              data-ngf-field="about.teamHeading"
              data-ngf-label="Team Section Heading"
              data-ngf-type="text"
              data-ngf-section="About"
              className="mb-8 text-center text-2xl text-brand sm:text-3xl md:text-left"
            >
              {teamHeading}
            </h2>
          </Reveal>
          <div
            className="grid gap-6 lg:grid-cols-2"
            data-ngf-group="team.members"
            data-ngf-item-label="Team Member"
            data-ngf-min-items="1"
            data-ngf-max-items="12"
            data-ngf-item-fields='[{"key":"image","label":"Photo","type":"image"},{"key":"name","label":"Name","type":"text"},{"key":"role","label":"Role","type":"text"},{"key":"bio","label":"Bio","type":"textarea"}]'
          >
            {teamMembers.map((member, index) => {
              const name = content[`team.members.${index}.name`] || member.name
              const role = content[`team.members.${index}.role`] || member.role
              const bio  = content[`team.members.${index}.bio`]  || member.bio
              const image = content[`team.members.${index}.image`] || member.image
              return (
              <Reveal key={member.name}>
                <article className="rounded-2xl bg-white p-4 sm:p-5 lg:h-full lg:p-6">
                  <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-5 lg:text-center">
                    <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl sm:h-48 sm:w-36 lg:h-56 lg:w-44">
                    <img
                      src={image}
                      alt={name}
                      data-ngf-field={`team.members.${index}.image`}
                      data-ngf-label="Photo"
                      data-ngf-type="image"
                      data-ngf-section="Team"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    </div>
                    <div className="min-w-0 text-left lg:text-center">
                      <h3
                        data-ngf-field={`team.members.${index}.name`}
                        data-ngf-label="Name"
                        data-ngf-type="text"
                        data-ngf-section="Team"
                        className="text-lg text-brand sm:text-xl"
                      >
                        {name}
                      </h3>
                      <p
                        data-ngf-field={`team.members.${index}.role`}
                        data-ngf-label="Role"
                        data-ngf-type="text"
                        data-ngf-section="Team"
                        className="mt-1 text-sm text-foreground/70"
                      >
                        {role}
                      </p>
                      <TeamMemberBio bio={bio} fieldPath={`team.members.${index}.bio`} />
                    </div>
                  </div>
                </article>
              </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="values" className="section-shell scroll-mt-28">
        <Reveal>
          <h2
            data-ngf-field="about.valuesHeading"
            data-ngf-label="Values Section Heading"
            data-ngf-type="text"
            data-ngf-section="About"
            className="text-center text-2xl text-brand sm:text-3xl md:text-left"
          >
            {valuesHeading}
          </h2>
          <p
            data-ngf-field="about.valuesMission"
            data-ngf-label="Mission Statement"
            data-ngf-type="textarea"
            data-ngf-section="About"
            className="mt-4 text-center leading-8 text-foreground/80 md:text-left"
          >
            {valuesMission}
          </p>
          <p
            data-ngf-field="about.valuesStatement"
            data-ngf-label="Values Statement"
            data-ngf-type="textarea"
            data-ngf-section="About"
            className="mt-3 text-center leading-8 text-foreground/80 md:text-left"
          >
            {valuesStatement}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-3 md:hidden">
          <Reveal>
            <details className="rounded-2xl border border-black/5 bg-white p-4">
              <summary className="accordion-summary flex cursor-pointer list-none items-center justify-between gap-3 text-left">
                <span
                  data-ngf-field="about.coreValuesHeading"
                  data-ngf-label="Core Values Heading"
                  data-ngf-type="text"
                  data-ngf-section="About"
                  className="text-lg font-semibold text-brand"
                >
                  {coreValuesHeading}
                </span>
                <span className="accordion-chevron text-brand">▾</span>
              </summary>
              <ul
                className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/80"
                data-ngf-group="about.coreValues"
                data-ngf-item-label="Value"
                data-ngf-min-items="1"
                data-ngf-max-items="10"
                data-ngf-item-fields='[{"key":"text","label":"Value","type":"text"}]'
              >
                {coreValues.map((val, i) => (
                  <li
                    key={i}
                    data-ngf-field={`about.coreValues.${i}.text`}
                    data-ngf-label="Value"
                    data-ngf-type="text"
                    data-ngf-section="About"
                  >
                    {val.text}
                  </li>
                ))}
              </ul>
            </details>
          </Reveal>
        </div>

        <div className="mt-8 hidden gap-5 md:grid md:grid-cols-1">
          <Reveal>
            <article className="card-soft">
              <h3
                data-ngf-field="about.coreValuesHeading"
                data-ngf-label="Core Values Heading"
                data-ngf-type="text"
                data-ngf-section="About"
                className="text-center text-xl text-brand md:text-left"
              >
                {coreValuesHeading}
              </h3>
              <ul
                className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/80"
                data-ngf-group="about.coreValues"
                data-ngf-item-label="Value"
                data-ngf-min-items="1"
                data-ngf-max-items="10"
                data-ngf-item-fields='[{"key":"text","label":"Value","type":"text"}]'
              >
                {coreValues.map((val, i) => (
                  <li
                    key={i}
                    data-ngf-field={`about.coreValues.${i}.text`}
                    data-ngf-label="Value"
                    data-ngf-type="text"
                    data-ngf-section="About"
                  >
                    {val.text}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="process" className="bg-surface scroll-mt-28">
        <div className="section-shell">
          <Reveal>
            <div className="rounded-2xl bg-brand p-8 text-center sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
                Our Process
              </p>
              <h2 className="mt-2 text-2xl text-white sm:text-3xl">
                A Clear, Organized, and Enjoyable Way to Build
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/80">
                We&apos;ve designed every step to keep you informed, involved, and confident — from pricing to move-in day.
              </p>
              <Link
                href="/process"
                className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand transition hover:bg-white/90"
              >
                See How We Build →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
