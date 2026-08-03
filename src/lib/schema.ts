import { z } from "zod";
import { VERDICTS } from "./verdicts";
import { categories } from "./site";

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];

export const stepSchema = z.object({
  platform: z.string().min(1),
  path: z.string().min(1),
  kind: z.enum(["setting", "flag", "registry", "cli", "config", "admin"]).default("setting"),
  code: z.string().optional(),
});

export const sourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["vendor", "press", "community"]).default("vendor"),
});

export const changelogSchema = z.object({
  date: z.string().min(8),
  note: z.string().min(1),
  verdictBefore: z.enum(VERDICTS).optional(),
  verdictAfter: z.enum(VERDICTS).optional(),
});

export const alternativeSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  why: z.string().min(1),
  affiliate: z.boolean().default(false),
});

export const entrySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  app: z.string().min(1),
  feature: z.string().min(1),
  vendor: z.string().min(1),
  category: z.enum(categorySlugs),
  platforms: z.array(z.string().min(1)).min(1),

  verdict: z.enum(VERDICTS),
  onByDefault: z.boolean(),
  comesBack: z.boolean().default(false),
  enterpriseOnly: z.boolean().default(false),
  difficulty: z.number().int().min(1).max(5),

  summary: z.string().min(10).max(400),
  steps: z.array(stepSchema).default([]),
  collateral: z.array(z.string().min(1)).default([]),
  regionNotes: z.string().optional(),
  whyTheyDidIt: z.string().min(1),

  sources: z.array(sourceSchema).min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  changelog: z.array(changelogSchema).default([]),

  alternatives: z.array(alternativeSchema).default([]),
  relatedSlugs: z.array(z.string()).default([]),
});

export type Entry = z.output<typeof entrySchema>;
export type EntryStep = z.output<typeof stepSchema>;
export type EntryAlternative = z.output<typeof alternativeSchema>;

export const sponsorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  pitch: z.string().min(1).max(120),
  emoji: z.string().optional(),
});

export type Sponsor = z.output<typeof sponsorSchema>;
