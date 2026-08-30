import type { PaginatedPosts } from "../../interfaces/interfaces";
type PaginationBtnProps = {
  page: number;
  setPage : (updater: (prev: number) => number)=> void ;
  data: PaginatedPosts;
};

export default function PaginationBtn({
  page,
  setPage,
  data,
}: PaginationBtnProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">

      <button
        disabled={!data.prev}
        onClick={() => setPage((prev) => prev - 1)}
        className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium
                   hover:bg-slate-700 transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <span className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold">
        Page {page} of {data.pages}
      </span>

      <button
        disabled={!data.next}
        onClick={() => setPage((prev) => prev + 1)}
        className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-medium
                   hover:bg-purple-600 transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>

    </div>
  );
}