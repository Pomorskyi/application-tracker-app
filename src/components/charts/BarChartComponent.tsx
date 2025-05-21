"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import FiveLoadingPlaceholders from "../FiveLoadingPlaceholders";

interface CompanyApplication {
  company: string;
  applications: number;
}

export default function CompanyApplicationsBarChart({
  data,
  loading,
}: {
  data: CompanyApplication[];
  loading: boolean;
}) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Applications per Company</h2>
      {loading ? (
        <FiveLoadingPlaceholders />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="company" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
