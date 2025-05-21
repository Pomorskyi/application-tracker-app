"use client";

import React from "react";
import FiveLoadingPlaceholders from "./FiveLoadingPlaceholders";
import { ApplicationStatus, JobApplication } from "@/app/types/modelTypes";

interface HistoryModalProps {
  onClose: () => void;
  loading: boolean;
  historyModalVersions: JobApplication[];
  statuses: ApplicationStatus[];
}

const HistoryModal = (props: HistoryModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white w-full max-w-4xl max-h-[80vh] rounded shadow-lg p-6 overflow-y-auto flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold mb-2">Versions Details</h2>
          <button
            onClick={props.onClose}
            className="cursor-pointer text-gray-700 hover:text-black text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {props.loading ? (
          <FiveLoadingPlaceholders />
        ) : (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Change date</th>
                <th className="p-2 border-b">Position</th>
                <th className="p-2 border-b">Company</th>
                <th className="p-2 border-b">Notes</th>
                <th className="p-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {props.historyModalVersions.map((version, index) => (
                <tr
                  key={`${version.id}-${version.version}-${version.created_at}`}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                >
                  <td className="p-2">
                    {new Date(version.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">{version.position_name}</td>
                  <td className="p-2">{version.company}</td>
                  <td className="p-2">{version.notes || "-"}</td>
                  <td className="p-2">
                    {
                      props.statuses.find(
                        (stat) => stat.id === version.status_id
                      )?.name
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
