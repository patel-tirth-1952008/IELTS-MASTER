export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <div className="page-wrap space-y-4 py-10">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="skeleton h-6 w-96 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
