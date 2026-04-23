"use client";

import { useState } from "react";

type TeamMemberBioProps = {
  bio: string;
  fieldPath?: string;
};

export function TeamMemberBio({ bio, fieldPath }: TeamMemberBioProps) {
  const [expanded, setExpanded] = useState(false);

  const editorProps = fieldPath
    ? {
        "data-ngf-field": fieldPath,
        "data-ngf-label": "Bio",
        "data-ngf-type": "textarea",
        "data-ngf-section": "Team",
      }
    : {};

  return (
    <div>
      <p {...editorProps} className="mt-3 text-sm leading-7 text-foreground/80 md:hidden">
        {expanded
          ? bio
          : `${bio.slice(0, 180).trimEnd()}${bio.length > 180 ? "..." : ""}`}
      </p>
      <p {...editorProps} className="mt-3 hidden text-sm leading-7 text-foreground/80 md:block">{bio}</p>
      {bio.length > 180 ? (
        <button
          type="button"
          className="mt-2 text-sm font-semibold text-brand hover:underline md:hidden"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
