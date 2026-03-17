"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { featuredProjects } from "@/lib/site-data";

const allowedCategories = ["All", "Ranch", "Two Story"] as const;

export function PortfolioFilterGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = useMemo(() => {
    if (activeCategory === "All") {
      return featuredProjects;
    }

    return featuredProjects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-3 md:justify-start">
        {allowedCategories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active ? "bg-brand text-white" : "bg-surface text-foreground hover:bg-black/5"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Reveal key={project.name}>
            <article className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              <Link href={project.houzzUrl} target="_blank" rel="noreferrer" className="block">
                <div className="relative h-64">
                  <Image src={project.image} alt={project.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-4 text-center md:text-left">
                  <h3 className="text-lg text-brand">{project.name}</h3>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
