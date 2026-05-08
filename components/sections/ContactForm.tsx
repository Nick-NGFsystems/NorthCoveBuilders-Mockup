"use client";

import { useState } from "react";

// Bedrooms and bathrooms are static numbers — not worth portal-editing
const bedroomOptions = ["", "2", "3", "4", "5", "5+"];
const bathroomOptions = ["", "1", "1.5", "2", "2.5", "3", "3.5", "4+"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  hasLot: string;
  timeline: string;
  homeType: string;
  bedrooms: string;
  bathrooms: string;
  idealBudget: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  hasLot: "",
  timeline: "",
  homeType: "",
  bedrooms: "",
  bathrooms: "",
  idealBudget: "",
  message: "",
};

type Props = {
  content?: Record<string, string>
}

export function ContactForm({ content = {} }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const labels = {
    name:       content['contactForm.labels.name']       || 'Name',
    email:      content['contactForm.labels.email']      || 'Email',
    phone:      content['contactForm.labels.phone']      || 'Phone',
    hasLot:     content['contactForm.labels.hasLot']     || 'Do you have a lot?',
    timeline:   content['contactForm.labels.timeline']   || 'Timeline',
    homeType:   content['contactForm.labels.homeType']   || 'Home Type',
    bedrooms:   content['contactForm.labels.bedrooms']   || 'Bedrooms',
    bathrooms:  content['contactForm.labels.bathrooms']  || 'Bathrooms',
    budget:     content['contactForm.labels.idealBudget']|| 'Ideal Budget',
    message:    content['contactForm.labels.message']    || 'Message',
  }
  const submitIdle    = content['contactForm.submit']      || 'Submit Inquiry'
  const submitSending = content['contactForm.sending']     || 'Sending...'
  const successMsg    = content['contactForm.successMsg']  || 'Thanks! We received your request and will follow up soon.'

  // Dropdown options — editable from portal sidebar (ContactForm section → Show all fields)
  const hasLotOptions = [
    '',
    content['contactForm.options.hasLot.0'] || 'Yes',
    content['contactForm.options.hasLot.1'] || 'No',
    content['contactForm.options.hasLot.2'] || 'In Progress',
  ]
  const timelineOptions = [
    '',
    content['contactForm.options.timeline.0'] || 'As soon as possible',
    content['contactForm.options.timeline.1'] || '3–6 months',
    content['contactForm.options.timeline.2'] || '6–12 months',
    content['contactForm.options.timeline.3'] || '1–2 years',
    content['contactForm.options.timeline.4'] || '2+ years',
    content['contactForm.options.timeline.5'] || 'Just exploring',
  ]
  const homeTypeOptions = [
    '',
    content['contactForm.options.homeType.0'] || 'Ranch',
    content['contactForm.options.homeType.1'] || 'Two Story',
    content['contactForm.options.homeType.2'] || 'Not Sure Yet',
  ]
  const idealBudgetOptions = [
    '',
    content['contactForm.options.idealBudget.0'] || '$400k - $500k',
    content['contactForm.options.idealBudget.1'] || '$500k - $600k',
    content['contactForm.options.idealBudget.2'] || '$600k - $700k',
    content['contactForm.options.idealBudget.3'] || '$700k - $800k',
    content['contactForm.options.idealBudget.4'] || '$800k - $900k',
    content['contactForm.options.idealBudget.5'] || '$900k+',
  ]

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "There was a problem submitting your request.");
      }

      setStatus("success");
      setMessage(successMsg);
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  const lbl = (key: string, label: string, text: string) => (
    <span
      data-ngf-field={`contactForm.labels.${key}`}
      data-ngf-label={label}
      data-ngf-type="text"
      data-ngf-section="ContactForm"
    >
      {text}
    </span>
  )

  return (
    <form onSubmit={onSubmit} className="card-soft !p-4 sm:!p-6 grid gap-4 text-center sm:text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {lbl('name', 'Name Label', labels.name)}
          <input
            required
            value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            className="rounded-xl border border-black/10 px-4 py-3 outline-none ring-brand transition focus:ring-2"
            type="text"
            name="name"
            autoComplete="name"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {lbl('email', 'Email Label', labels.email)}
          <input
            required
            value={form.email}
            onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
            className="rounded-xl border border-black/10 px-4 py-3 outline-none ring-brand transition focus:ring-2"
            type="email"
            name="email"
            autoComplete="email"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {lbl('phone', 'Phone Label', labels.phone)}
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((previous) => ({ ...previous, phone: event.target.value }))}
            className="rounded-xl border border-black/10 px-4 py-3 outline-none ring-brand transition focus:ring-2"
            type="tel"
            name="phone"
            autoComplete="tel"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {lbl('hasLot', 'Has Lot Label', labels.hasLot)}
          <select
            value={form.hasLot}
            onChange={(event) => setForm((previous) => ({ ...previous, hasLot: event.target.value }))}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
            name="hasLot"
          >
            {hasLotOptions.map((hasLotOption) => (
              <option key={hasLotOption} value={hasLotOption}>
                {hasLotOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {lbl('timeline', 'Timeline Label', labels.timeline)}
          <select
            value={form.timeline}
            onChange={(event) => setForm((previous) => ({ ...previous, timeline: event.target.value }))}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
            name="timeline"
          >
            {timelineOptions.map((timelineOption) => (
              <option key={timelineOption} value={timelineOption}>
                {timelineOption}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {lbl('homeType', 'Home Type Label', labels.homeType)}
          <select
            value={form.homeType}
            onChange={(event) => setForm((previous) => ({ ...previous, homeType: event.target.value }))}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
            name="homeType"
          >
            {homeTypeOptions.map((homeTypeOption) => (
              <option key={homeTypeOption} value={homeTypeOption}>
                {homeTypeOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {lbl('bedrooms', 'Bedrooms Label', labels.bedrooms)}
          <select
            value={form.bedrooms}
            onChange={(event) => setForm((previous) => ({ ...previous, bedrooms: event.target.value }))}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
            name="bedrooms"
          >
            {bedroomOptions.map((bedroomOption) => (
              <option key={bedroomOption} value={bedroomOption}>
                {bedroomOption}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {lbl('bathrooms', 'Bathrooms Label', labels.bathrooms)}
          <select
            value={form.bathrooms}
            onChange={(event) => setForm((previous) => ({ ...previous, bathrooms: event.target.value }))}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
            name="bathrooms"
          >
            {bathroomOptions.map((bathroomOption) => (
              <option key={bathroomOption} value={bathroomOption}>
                {bathroomOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium">
        {lbl('idealBudget', 'Budget Label', labels.budget)}
        <select
          value={form.idealBudget}
          onChange={(event) => setForm((previous) => ({ ...previous, idealBudget: event.target.value }))}
          className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none ring-brand transition focus:ring-2"
          name="idealBudget"
        >
          {idealBudgetOptions.map((idealBudgetOption) => (
            <option key={idealBudgetOption} value={idealBudgetOption}>
              {idealBudgetOption}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium">
        {lbl('message', 'Message Label', labels.message)}
        <textarea
          value={form.message}
          onChange={(event) => setForm((previous) => ({ ...previous, message: event.target.value }))}
          className="min-h-32 rounded-xl border border-black/10 px-4 py-3 outline-none ring-brand transition focus:ring-2"
          name="message"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-brand mx-auto disabled:cursor-not-allowed disabled:opacity-70 sm:mx-0" disabled={status === "submitting"}>
          <span
            data-ngf-field={status === "submitting" ? "contactForm.sending" : "contactForm.submit"}
            data-ngf-label={status === "submitting" ? "Sending Text" : "Submit Button Text"}
            data-ngf-type="text"
            data-ngf-section="ContactForm"
          >
            {status === "submitting" ? submitSending : submitIdle}
          </span>
        </button>
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-foreground/70"}`}>{message}</p>
      </div>

      {/* Dropdown option config — hidden from visitors, editable from portal sidebar.
          Use "Show all fields" toggle in the editor sidebar, then scroll to ContactForm. */}
      <div className="sr-only" aria-hidden="true">
        <span data-ngf-field="contactForm.options.hasLot.0" data-ngf-label="Has Lot Option 1" data-ngf-type="text" data-ngf-section="ContactForm">{hasLotOptions[1]}</span>
        <span data-ngf-field="contactForm.options.hasLot.1" data-ngf-label="Has Lot Option 2" data-ngf-type="text" data-ngf-section="ContactForm">{hasLotOptions[2]}</span>
        <span data-ngf-field="contactForm.options.hasLot.2" data-ngf-label="Has Lot Option 3" data-ngf-type="text" data-ngf-section="ContactForm">{hasLotOptions[3]}</span>
        <span data-ngf-field="contactForm.options.timeline.0" data-ngf-label="Timeline Option 1" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[1]}</span>
        <span data-ngf-field="contactForm.options.timeline.1" data-ngf-label="Timeline Option 2" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[2]}</span>
        <span data-ngf-field="contactForm.options.timeline.2" data-ngf-label="Timeline Option 3" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[3]}</span>
        <span data-ngf-field="contactForm.options.timeline.3" data-ngf-label="Timeline Option 4" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[4]}</span>
        <span data-ngf-field="contactForm.options.timeline.4" data-ngf-label="Timeline Option 5" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[5]}</span>
        <span data-ngf-field="contactForm.options.timeline.5" data-ngf-label="Timeline Option 6" data-ngf-type="text" data-ngf-section="ContactForm">{timelineOptions[6]}</span>
        <span data-ngf-field="contactForm.options.homeType.0" data-ngf-label="Home Type Option 1" data-ngf-type="text" data-ngf-section="ContactForm">{homeTypeOptions[1]}</span>
        <span data-ngf-field="contactForm.options.homeType.1" data-ngf-label="Home Type Option 2" data-ngf-type="text" data-ngf-section="ContactForm">{homeTypeOptions[2]}</span>
        <span data-ngf-field="contactForm.options.homeType.2" data-ngf-label="Home Type Option 3" data-ngf-type="text" data-ngf-section="ContactForm">{homeTypeOptions[3]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.0" data-ngf-label="Budget Option 1" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[1]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.1" data-ngf-label="Budget Option 2" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[2]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.2" data-ngf-label="Budget Option 3" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[3]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.3" data-ngf-label="Budget Option 4" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[4]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.4" data-ngf-label="Budget Option 5" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[5]}</span>
        <span data-ngf-field="contactForm.options.idealBudget.5" data-ngf-label="Budget Option 6" data-ngf-type="text" data-ngf-section="ContactForm">{idealBudgetOptions[6]}</span>
      </div>
    </form>
  );
}
