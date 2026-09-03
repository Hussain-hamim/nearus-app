export default function PrivacyPage() {
  return (
    <div className="pb-dock mx-auto max-w-lg px-5 pt-8 md:px-0">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Public task cards show your area, locality, city, and distance in km. Your exact street
          address is stored separately and only shown to you and the helper you select.
        </p>
        <p>
          You can report or block someone from a task page. Blocked people will not appear in
          nearby results.
        </p>
        <p>Payments stay between you and the helper, in cash. We never store card numbers.</p>
      </div>
    </div>
  );
}
