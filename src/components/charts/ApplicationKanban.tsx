"use client";

import FiveLoadingPlaceholders from "../FiveLoadingPlaceholders";

export default function ApplicationKanban({
  data,
  loading,
}: {
  data: Record<string, { company: string; position: string }[]>;
  loading: boolean;
}) {
  const statuses = Object.keys(data);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Application Status Board</h2>
      {loading ? (
        <FiveLoadingPlaceholders />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
          {statuses.map((status) => (
            <div key={status} className="bg-gray-100 rounded-lg p-2">
              <h3 className="font-semibold text-center mb-2">{status}</h3>
              <div className="space-y-2">
                {data[status].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white shadow-sm rounded p-2 text-sm"
                  >
                    {item.company} – {item.position}
                  </div>
                ))}
                {data[status].length === 0 && (
                  <div className="text-gray-400 text-sm text-center">
                    No entries
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
