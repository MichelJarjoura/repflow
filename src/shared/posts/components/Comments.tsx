export function Comments() {
  return (
    <div className="bg-zinc-900/50 border-t border-border p-4">
      <p className="text-sm text-muted-foreground font-medium mb-4">Comments</p>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
          <div className="flex-1">
            <div className="bg-zinc-800/50 rounded-2xl px-4 py-2">
              <p className="text-sm font-semibold">User Name</p>
              <p className="text-sm text-zinc-300">Great work! Keep it up! 💪</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
