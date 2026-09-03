export default function NotificationSettingsPage() {
  return (
    <div className="pb-dock mx-auto max-w-lg px-5 pt-8 md:px-0">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You get in-app alerts for new offers, helper selection, messages, and reviews.
        Push notifications will come later.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {[
          "New offer on a task you posted",
          "You were selected as a helper",
          "New chat message",
          "New review",
        ].map((item) => (
          <li key={item} className="rounded-2xl border border-border bg-white px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
