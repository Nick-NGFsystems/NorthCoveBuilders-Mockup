"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { featuredProjects } from "@/lib/site-data";

const allowedCategories = ["All", "Ranch", "Two Story"] as const;

type Props = {
  content?: Record<string, string>
}

export function PortfolioFilterGrid({ content = {} }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = useMemo(() => {
    if (activeCategory === "All") {
      return featuredProjects;
    }

    return featuredProjects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const labelFor = (cat: string) =>
    content[`ourWork.filter.${cat.toLowerCase().replace(/\s+/g, '')}`] || cat

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-3 md:justify-start">
        {allowedCategories.map((category) => {
          const active = category === activeCategory;
          const key = category.toLowerCase().replace(/\s+/g, '')
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active ? "bg-brand text-white" : "bg-surface text-foreground hover:bg-black/5"
              }`}
              data-ngf-field={`ourWork.filter.${key}`}
              data-ngf-label={`${category} Filter Label`}
              data-ngf-type="text"
              data-ngf-section="OurWork"
            >
              {labelFor(category)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => {
          const name     = content[`ourWork.projects.${idx}.name`]     || project.name
          const location = content[`ourWork.projects.${idx}.location`] || project.location || ''
          return (
          <Reveal key={project.name}>
            <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="block">
                <div className="relative h-64">
                  <Image src={project.image} alt={name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3
                    data-ngf-field={`ourWork.projects.${idx}.name`}
                    data-ngf-label="Project Name"
                    data-ngf-type="text"
                    data-ngf-section="OurWork"
                    className="text-xl font-semibold text-brand sm:text-2xl"
                  >
                    {name}
                  </h3>
                  {location && (
                    <p
                      data-ngf-field={`ourWork.projects.${idx}.location`}
                      data-ngf-label="Project Location"
                      data-ngf-type="text"
                      data-ngf-section="OurWork"
                      className="mt-0.5 text-sm text-foreground/50"
                    >
                      {location}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          </Reveal>
          )
        })}
      </div>
    </>
  );
}
