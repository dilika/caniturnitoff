import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">404 — no verdict here (yet)</h1>
      <p className="mt-2 text-sm text-muted">
        that feature is not tracked. it probably still cannot be turned off.
      </p>
      <Link href="/" className="chip mt-4 inline-flex hover:border-acid/60 hover:text-acid">
        back to the offender list
      </Link>
    </div>
  );
}
