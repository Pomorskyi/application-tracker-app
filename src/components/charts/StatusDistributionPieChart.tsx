"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import FiveLoadingPlaceholders from "../FiveLoadingPlaceholders";

const STATUS_COLORS = ["#3b82f6", "#10b981", "#facc15", "#ef4444"];

export default function StatusDistributionPieChart({
  data,
  loading,
}: {
  data: { status: string; value: number }[];
  loading: boolean;
}) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Status Distribution</h2>
      <div className="h-80">
        {loading ? (
          <FiveLoadingPlaceholders />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
