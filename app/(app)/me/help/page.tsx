export default function HelpPage() {
  return (
    <div className="pb-dock mx-auto max-w-lg px-5 pt-8 md:px-0">
      <h1 className="text-2xl font-semibold">Help Center</h1>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>Post a task with a cash amount in ؋.</li>
        <li>Helpers nearby send offers.</li>
        <li>Select a helper — chat opens, and they can see the exact address.</li>
        <li>Pay in cash when the job is done. Then review each other.</li>
      </ol>
      <section id="support" className="mt-8 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-semibold">Contact Support</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Email support@neartask.local with the task title and what went wrong. English only for MVP.
        </p>
      </section>
    </div>
  );
}
