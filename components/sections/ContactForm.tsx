"use client";

import { useState } from "react";

const hasLotOptions = ["", "Yes", "No", "In Progress"];
const timelineOptions = ["", "As soon as possible", "3–6 months", "6–12 months", "1–2 years", "2+ years", "Just exploring"];
const homeTypeOptions = ["", "Ranch", "Two Story", "Not Sure Yet"];
const bedroomOptions = ["", "2", "3", "4", "5", "5+"];
const bathroomOptions = ["", "1", "1.5", "2", "2.5", "3", "3.5", "4+"];
const idealBudgetOptions = ["", "$400k - $500k", "$500k - $600k", "$600k - $700k", "$700k - $800k", "$800k - $900k", "$900k+"];

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

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
      setMessage("Thanks! We received your request and will follow up soon.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="card-soft !p-4 sm:!p-6 grid gap-4 text-center sm:text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Name
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
          Email
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
          Phone
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
          Do you have a lot?
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
          Timeline
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
          Home Type
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
          Bedrooms
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
          Bathrooms
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
        Ideal Budget
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
        Message
        <textarea
          required
          value={form.message}
          onChange={(event) => setForm((previous) => ({ ...previous, message: event.target.value }))}
          className="min-h-32 rounded-xl border border-black/10 px-4 py-3 outline-none ring-brand transition focus:ring-2"
          name="message"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-brand mx-auto disabled:cursor-not-allowed disabled:opacity-70 sm:mx-0" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Submit Inquiry"}
        </button>
        <p className={`text-sm ${status === "error" ? "text-red-600" : "text-foreground/70"}`}>{message}</p>
      </div>
    </form>
  );
}
