import type { Metadata } from "next";
import { getNgfContent, getItems } from "@/lib/ngf";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Learn how North Cove Builders guides you from first conversation to final walkthrough — transparent pricing, custom design, and a clear 6-step building process.",
};

const defaultSteps = [
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

export default async function ProcessPage() {
  const content = await getNgfContent();

  const eyebrow        = content["process.eyebrow"]        || "Our Process";
  const heading        = content["process.heading"]        || "A clear path from first conversation to final walkthrough.";
  const intro          = content["process.intro"]          || "Building a custom home is one of the most significant investments you'll ever make. We've designed every step of our process to keep you informed, involved, and confident from day one.";
  const stepsHeading   = content["process.stepsHeading"]   || "A Clear, Organized, and Enjoyable Way to Build";
  const stepLabelPrefix = content["process.stepLabelPrefix"] || "Step";
  const ctaHeading     = content["process.ctaHeading"]     || "Ready to get started?";
  const ctaBody        = content["process.ctaBody"]        || "Your first consultation is a 1-hour session where we walk through pricing, your vision, and next steps — no floor plans needed.";
  const ctaButton      = content["process.ctaButton"]      || "Schedule a Consultation";

  const savedSteps = getItems(content, "process.steps");
  const steps =
    savedSteps.length > 0
      ? savedSteps.map((s, i) => ({
          title: s.title || defaultSteps[i]?.title || "",
          body:  s.body  || defaultSteps[i]?.body  || "",
        }))
      : defaultSteps;

  return (
    <ProcessTimeline
      steps={steps}
      eyebrow={eyebrow}
      heading={heading}
      intro={intro}
      stepsHeading={stepsHeading}
      stepLabelPrefix={stepLabelPrefix}
      ctaHeading={ctaHeading}
      ctaBody={ctaBody}
      ctaButton={ctaButton}
    />
  );
}
