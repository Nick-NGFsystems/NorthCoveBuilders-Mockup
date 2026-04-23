import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TeamMemberBio } from "@/components/sections/TeamMemberBio";
import { teamMembers } from "@/lib/site-data";
import { getNgfContent, getItems } from "@/lib/ngf";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the North Cove Builders team — Neal, Elisha, Cindy, and Bryan. Learn about our values, our process, and our commitment to a personal building experience.",
};

const processSteps = [
  {
    title: "Price Planning",
    body: "Upfront and transparent pricing from the beginning. In your 1-hour consultation, you receive a customized itemized quote and interactive pricing tool. No floor plans needed—just bring your ideas.",
  },
  {
    title: "Secure a Home Site",
    body: "If you already own property, great. If not, we help identify options through local relationships and area knowledge. We also provide a complimentary site assessment to review prep work and costs.",
  },
  {
    title: "Design Your Custom Home Plan",
    body: "Design a plan that fits your lifestyle and budget. We can customize existing floor plans or help you create your dream home from scratch.",
  },
  {
    title: "Choose Your Finishes & Colors",
    body: "With our design team, you select interior and exterior finishes that make your house feel like home. Work with trusted vendors or bring your own favorites.",
  },
  {
    title: "Construction",
    body: "Our in-house carpentry crews support consistency in quality and schedule. You'll have key on-site meetings plus regular updates on milestones, progress photos, and timelines.",
  },
  {
    title: "After You Move In",
    body: "Every new home includes a full 1-year warranty and a 30-day touch-up appointment to handle dents or dings from move-in.",
  },
];

export default async function AboutPage() {
  const content = await getNgfContent()

  const heroEyebrow = content['about.heroEyebrow'] || 'About North Cove Builders'
  const heroHeading = content['about.heroHeading'] || 'A personal builder experience from first conversation to final walkthrough.'
  const teamHeading = content['about.teamHeading'] || 'Meet the Team'
  const valuesHeading = content['about.valuesHeading'] || 'Mission & Values'
  const valuesMission = content['about.valuesMission'] || 'We love what we do! Everything we do is to ensure your building experience is enjoyable and that your new home is everything you\'ve dreamt it would be.'
  const valuesStatement = content['about.valuesStatement'] || 'We keep God and our values at the forefront of everything we do.'
  const coreValuesHeading = content['about.coreValuesHeading'] || 'Core Values'
  const processHeading = content['about.processHeading'] || 'Our Process'
  const stepLabelPrefix = content['about.stepLabelPrefix'] || 'Step'
  const tapToExpand = content['about.tapToExpand'] || 'Tap to expand'

  // Core values — editable as a repeatable group
  const savedCoreValues = getItems(content, 'about.coreValues')
  const defaultCoreValues = [
    { text: 'Family is first. Ours. Yours. Always!' },
    { text: 'We treat everyone fairly, with honesty and respect.' },
    { text: "We build trust by acting with compassion and others' best interest in mind." },
    { text: 'Our team is built on positivity, hard work, and reliability.' },
  ]
  const coreValues = savedCoreValues.length > 0 ? savedCoreValues : defaultCoreValues

  // Process steps — editable as a repeatable group (merged with the hardcoded
  // defaults defined above so clients can override any field per step)
  const savedProcessSteps = getItems(content, 'about.processSteps')
  const processStepsDisplay = savedProcessSteps.length > 0
    ? savedProcessSteps.map((s, i) => ({
        title: s.title || processSteps[i]?.title || '',
        body:  s.body  || processSteps[i]?.body  || '',
      }))
    : processSteps

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
            <h2
              data-ngf-field="about.processHeading"
              data-ngf-label="Process Section Heading"
              data-ngf-type="text"
              data-ngf-section="About"
              className="mb-8 text-center text-2xl text-brand sm:text-3xl md:text-left"
            >
              {processHeading}
            </h2>
          </Reveal>

          <div
            className="grid gap-3 md:hidden"
            data-ngf-group="about.processSteps"
            data-ngf-item-label="Process Step"
            data-ngf-min-items="1"
            data-ngf-max-items="12"
            data-ngf-item-fields='[{"key":"title","label":"Step Title","type":"text"},{"key":"body","label":"Step Body","type":"textarea"}]'
          >
            {processStepsDisplay.map((step, index) => (
              <Reveal key={`m-${index}`}>
                <details className="rounded-2xl border border-black/5 bg-white p-4">
                  <summary className="accordion-summary cursor-pointer list-none text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                          <span
                            data-ngf-field="about.stepLabelPrefix"
                            data-ngf-label="Step Label Prefix"
                            data-ngf-type="text"
                            data-ngf-section="About"
                          >
                            {stepLabelPrefix}
                          </span>
                          {` ${index + 1}`}
                        </p>
                        <p
                          data-ngf-field={`about.processSteps.${index}.title`}
                          data-ngf-label="Step Title"
                          data-ngf-type="text"
                          data-ngf-section="About"
                          className="mt-1 text-base font-semibold text-foreground"
                        >
                          {step.title}
                        </p>
                        <p
                          data-ngf-field="about.tapToExpand"
                          data-ngf-label="Tap-to-expand Label"
                          data-ngf-type="text"
                          data-ngf-section="About"
                          className="mt-1 text-xs uppercase tracking-[0.12em] text-brand/70"
                        >
                          {tapToExpand}
                        </p>
                      </div>
                      <span className="accordion-chevron mt-1 text-brand">▾</span>
                    </div>
                  </summary>
                  <p
                    data-ngf-field={`about.processSteps.${index}.body`}
                    data-ngf-label="Step Body"
                    data-ngf-type="textarea"
                    data-ngf-section="About"
                    className="mt-3 text-sm leading-7 text-foreground/80"
                  >
                    {step.body}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          <ol
            className="hidden gap-4 md:grid md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3"
            data-ngf-group="about.processSteps"
            data-ngf-item-label="Process Step"
            data-ngf-min-items="1"
            data-ngf-max-items="12"
            data-ngf-item-fields='[{"key":"title","label":"Step Title","type":"text"},{"key":"body","label":"Step Body","type":"textarea"}]'
          >
            {processStepsDisplay.map((step, index) => (
              <Reveal key={`d-${index}`}>
                <li className="card-soft h-full flex flex-col text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                    <span
                      data-ngf-field="about.stepLabelPrefix"
                      data-ngf-label="Step Label Prefix"
                      data-ngf-type="text"
                      data-ngf-section="About"
                    >
                      {stepLabelPrefix}
                    </span>
                    {` ${index + 1}`}
                  </p>
                  <p
                    data-ngf-field={`about.processSteps.${index}.title`}
                    data-ngf-label="Step Title"
                    data-ngf-type="text"
                    data-ngf-section="About"
                    className="mt-2 text-lg text-foreground"
                  >
                    {step.title}
                  </p>
                  <p
                    data-ngf-field={`about.processSteps.${index}.body`}
                    data-ngf-label="Step Body"
                    data-ngf-type="textarea"
                    data-ngf-section="About"
                    className="mt-3 flex-1 text-sm leading-7 text-foreground/80"
                  >
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
