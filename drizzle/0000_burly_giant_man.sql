CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"has_lot" text DEFAULT '' NOT NULL,
	"timeline" text DEFAULT '' NOT NULL,
	"home_type" text DEFAULT '' NOT NULL,
	"bedrooms" text DEFAULT '' NOT NULL,
	"bathrooms" text DEFAULT '' NOT NULL,
	"ideal_budget" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
