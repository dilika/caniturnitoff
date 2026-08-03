import fs from "node:fs";
import path from "node:path";
import { entrySchema } from "../src/lib/schema";

const dir = path.join(process.cwd(), "content", "entries");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

let failed = 0;
const slugs = new Set<string>();

for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const parsed = entrySchema.safeParse(raw);

  if (!parsed.success) {
    failed += 1;
    console.error(`✗ ${file}`);
    for (const issue of parsed.error.issues) {
      console.error(`    ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    continue;
  }

  const expected = `${parsed.data.slug}.json`;
  if (expected !== file) {
    failed += 1;
    console.error(`✗ ${file}: slug is "${parsed.data.slug}", filename must be ${expected}`);
    continue;
  }

  if (slugs.has(parsed.data.slug)) {
    failed += 1;
    console.error(`✗ ${file}: duplicate slug`);
    continue;
  }
  slugs.add(parsed.data.slug);
}

// second pass: relatedSlugs must resolve
for (const file of files) {
  const raw = entrySchema.safeParse(
    JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")),
  );
  if (!raw.success) continue;
  for (const rel of raw.data.relatedSlugs) {
    if (!slugs.has(rel)) {
      failed += 1;
      console.error(`✗ ${file}: relatedSlugs points at unknown entry "${rel}"`);
    }
  }
}

if (failed) {
  console.error(`\n${failed} problem(s) in ${files.length} entries.`);
  process.exit(1);
}

console.log(`✓ ${files.length} entries valid.`);
