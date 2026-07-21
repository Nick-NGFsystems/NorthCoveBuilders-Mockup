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
    body: "A better way to start building; Transparent pricing from the very beginning. During your initial one-hour consultation, you'll receive a customized, itemized quote along with an interactive pricing tool to explore your options. No floor plans required—just bring your ideas.",
  },
  {
    title: "Secure a Homesite",
    body: "Every great home begins with the right homesite. Whether you already own property or need help finding it, we can help you through the process using our local expertise and trusted relationships. Our complimentary site assessment provides a clear understanding of site preparation requirements and expected costs before you move forward.",
  },
  {
    title: "Design Your Custom Home",
    body: "Design a home that fits your lifestyle, priorities, and budget. Whether you customize an existing floor plan or create a one-of-a-kind design from scratch, we'll help bring your vision to life.",
  },
  {
    title: "Choose Your Finishes & Colors",
    body: "Bring your vision to life with our experienced design team. Together, you'll select the interior and exterior finishes that reflect your style and make your home uniquely yours. Choose from our trusted vendor partners or work with your own favorites.",
  },
  {
    title: "Construction",
    body: "Our in-house carpentry crews help ensure exceptional craftsmanship, consistent quality, and reliable scheduling. Throughout construction, you'll meet with us at key milestones and receive regular updates, progress photos, and timeline updates, so you're always informed.",
  },
  {
    title: "After You Move In",
    body: "We stand behind our work. Every home includes a comprehensive one-year warranty, plus a 30-day touch-up visit to ensure your home looks just as beautiful after move-in as it did on closing day.",
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
