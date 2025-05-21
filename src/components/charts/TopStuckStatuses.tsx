"use client";

import FiveLoadingPlaceholders from "../FiveLoadingPlaceholders";

const TopStuckStatuses = ({
  stuckStatuses,
  loading,
}: {
  stuckStatuses: { status: string; avg: number }[];
  loading: boolean;
}) => {
  return (
    <div className="md:col-span-2 lg:col-span-3 bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Top 3 Stuck Statuses</h2>
      {loading ? (
        <FiveLoadingPlaceholders />
      ) : (
        <ul className="list-disc list-inside text-gray-700">
          {stuckStatuses.map((item, index) => (
            <li key={index}>
              {`${item.status} - avg. ${item.avg} days`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopStuckStatuses;
