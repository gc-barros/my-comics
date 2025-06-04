export function EmptyComicCollection() {
  return (
    <div className="w-full max-w-2xl p-6 bg-primary rounded-xl shadow-xl border border-accent/10">
      <div className="text-center space-y-4">
        <p className="text-surface/80">
          Your collection is empty. Add your first comic to get started!
        </p>
      </div>
    </div>
  );
}
