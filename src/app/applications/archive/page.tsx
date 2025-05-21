"use client";

import React, { useState, useEffect } from "react";
import { Application } from "@/app/types/modelTypes";
import { useAvailableStatuses } from "@/components/hooks/useAvailableStatuses.hook";
import { FaClock } from "react-icons/fa";
import { useApplicationHistory } from "@/components/hooks/useApplicationHistory.hook";
import HistoryModal from "@/components/HistoryModal";
import { useAuth } from "@/components/context/AuthContext";
import FiveLoadingPlaceholders from "@/components/FiveLoadingPlaceholders";
import Link from "next/link";

const ArchivePage = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const { statuses } = useAvailableStatuses();

  const {
    historyModalVersions,
    loadingHistory,
    setLoadingHistory,
    setShowingHistoryApplicationId,
  } = useApplicationHistory();

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    console.log('token', token);
    if (!token) return;

    fetch(`/api/applications/archived`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications || []);
        setLoadingApplications(false);
      });
  }, [token]);

  if (loadingApplications) return <FiveLoadingPlaceholders />;

  return (
    <>
      <main className="p-10">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">
            Your Archived Applications
          </h1>
          <Link
            href="/applications"
            className="rounded-sm h-9 px-3 py-1 bg-blue-500 text-white hover:bg-blue-700 border-black-100 border-1"
          >
            Back to your applications
          </Link>
        </div>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Position</th>
              <th className="p-2 border-b">Company</th>
              <th className="p-2 border-b">Notes</th>
              {/* <th className="p-2 border-b">Status</th> */}
              <th className="p-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr
                key={app.id}
                className={`border-t align-top h-10 ${index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-200 hover:bg-gray-100"}`}
              >
                <td className="p-2">{app.position_name}</td>
                <td className="p-2">{app.company}</td>
                <td className="p-2">{app.notes || "-"}</td>
                {/* <td className="p-2">
                  {statuses.find((stat) => stat.id === app.status_id)?.name}
                </td> */}
                <td className="h-10 flex justify-start align-bottom">
                  <button
                    onClick={() => {
                      setLoadingHistory(true);
                      setHistoryModalOpen(true);
                      setShowingHistoryApplicationId(app.id);
                    }}
                    className="my-1 text-white bg-blue-600 hover:bg-blue-800 px-3 py-1 cursor-pointer rounded text-sm flex items-center gap-1"
                    title="View History"
                  >
                    <FaClock />
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {historyModalOpen && (
        <HistoryModal
          onClose={() => setHistoryModalOpen(false)}
          loading={loadingHistory}
          historyModalVersions={historyModalVersions}
          statuses={statuses}
        />
      )}
    </>
  );
};

export default ArchivePage;
