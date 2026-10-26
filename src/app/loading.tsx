export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-page px-5 py-16 md:px-8" aria-busy>
      <div className="mb-10 h-10 w-64 animate-pulse rounded-xl bg-sand" />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-2xl bg-sand" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-sand" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-sand" />
          </div>
        ))}
      </div>
    </div>
  );
}
