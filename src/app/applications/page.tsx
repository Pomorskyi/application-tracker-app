"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect, useState } from "react";
import { FaClock, FaFile } from "react-icons/fa";
import { Application } from "../types/modelTypes";
import FiveLoadingPlaceholders from "@/components/FiveLoadingPlaceholders";
import { useAvailableStatuses } from "@/components/hooks/useAvailableStatuses.hook";
import Link from "next/link";
import HistoryModal from "@/components/HistoryModal";
import { useApplicationHistory } from "@/components/hooks/useApplicationHistory.hook";

export default function Applications() {
  const { token } = useAuth();
  const { statuses } = useAvailableStatuses();
  const {
    historyModalVersions,
    loadingHistory,
    setLoadingHistory,
    setShowingHistoryApplicationId,
  } = useApplicationHistory();

  const [editingApplicationId, setEditingApplicationId] = useState<
    number | null
  >(null);

  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState<boolean>(true);

  const [newApplication, setNewApplication] = useState({
    position_name: "",
    company: "",
    notes: "",
    status_id: 1,
  });

  useEffect(() => {
    if (!token) return;
    
    fetch(`/api/applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications || []);
        setLoadingApplications(false);
      });
  }, [token]);

  const handleStartEditing = async (app: Application) => {
    setEditingApplicationId(app.id);
    setEditingApplication(app);
  };

  const handleStatusChange = async (id: number, newStatusId: number) => {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ statusId: newStatusId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setApplications((apps) =>
      apps.map((app) =>
        app.id === id
          ? {
              ...app,
              status_id: newStatusId,
              status: statuses.find((s) => s.id === newStatusId)!,
            }
          : app
      )
    );
  };

  const handleCreate = async () => {
    if (!newApplication.position_name || !newApplication.company) return;

    const res = await fetch("/api/applications", {
      method: "POST",
      body: JSON.stringify({ ...newApplication }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    setApplications([...applications, data.application]);
    setNewApplication({
      position_name: "",
      company: "",
      notes: "",
      status_id: 1,
    });
  };

  const handleRemove = async (applicationId: number) => {
    const res = await fetch("/api/applications", {
      method: "DELETE",
      body: JSON.stringify({
        applicationId: applicationId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await res.json();

    setApplications((prev) => [
      ...prev.filter((app) => app.id !== applicationId),
    ]);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/applications/${editingApplicationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        positionName: editingApplication?.position_name,
        notes: editingApplication?.notes,
        company: editingApplication?.company,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    await res.json();

    setApplications((apps) =>
      apps.map((app) =>
        app.id === editingApplicationId && editingApplication !== null
          ? {
              ...app,
              position_name: editingApplication.position_name ?? "",
              notes: editingApplication.notes ?? "",
              company: editingApplication.company ?? "",
            }
          : app
      )
    );

    setEditingApplicationId(null);
    setEditingApplication(null);
  };

  if (loadingApplications) return <FiveLoadingPlaceholders />;

  return (
    <>
      <main className="p-10">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
          <Link
            href="/applications/archive"
            className="rounded-sm h-9 px-3 py-1 bg-blue-500 text-white hover:bg-blue-700 border-black-100 border-1"
          >
            Archive
          </Link>
        </div>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Position</th>
              <th className="p-2 border-b">Company</th>
              <th className="p-2 border-b">Notes</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr
                key={app.id}
                className={`border-t align-top ${index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-200 hover:bg-gray-100"}`}
              >
                <td className="p-2">
                  {editingApplicationId !== null &&
                  editingApplicationId === app.id ? (
                    <input
                      type="text"
                      value={editingApplication?.position_name}
                      onChange={(e) =>
                        setEditingApplication((prev) => {
                          if (prev === null) return null;
                          return { ...prev, position_name: e.target.value };
                        })
                      }
                      className="w-full border border-gray-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    app.position_name
                  )}
                </td>
                <td className="p-2">
                  {editingApplicationId !== null &&
                  editingApplicationId === app.id ? (
                    <input
                      type="text"
                      value={editingApplication?.company}
                      onChange={(e) =>
                        setEditingApplication((prev) => {
                          if (prev === null) return null;
                          return { ...prev, company: e.target.value };
                        })
                      }
                      className="w-full border border-gray-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    app.company
                  )}
                </td>
                <td className="p-2">
                  {editingApplicationId !== null &&
                  editingApplicationId === app.id ? (
                    <textarea
                      value={editingApplication?.notes}
                      onChange={(e) =>
                        setEditingApplication((prev) => {
                          if (prev === null) return null;
                          return { ...prev, notes: e.target.value };
                        })
                      }
                      className="w-full min-h-[60px] resize-y border border-gray-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    app.notes || "-"
                  )}
                </td>
                <td className="p-2">
                  {editingApplicationId === app.id ||
                  editingApplicationId === null ? (
                    <select
                      className="border bg-white p-1 rounded cursor-pointer"
                      value={app.status_id}
                      onChange={(e) =>
                        handleStatusChange(app.id, Number(e.target.value))
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {statuses.find((stat) => stat.id === app.status_id)?.name}
                    </>
                  )}
                </td>
                <td className="p-2 flex items-center gap-2">
                  {editingApplicationId === app.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit()}
                        className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1 cursor-pointer rounded text-sm flex items-center gap-1"
                        title="Save Application"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingApplicationId(null)}
                        className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-red-700"
                        title="Cancel Application"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    editingApplicationId === null && (
                      <>
                        <button
                          onClick={() => handleStartEditing(app)}
                          className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1 cursor-pointer rounded text-sm flex items-center gap-1"
                          title="Edit Application"
                        >
                          <FaFile />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setLoadingHistory(true);
                            setHistoryModalOpen(true);
                            setShowingHistoryApplicationId(app.id);
                          }}
                          className="text-white bg-blue-600 hover:bg-blue-800 px-3 py-1 cursor-pointer rounded text-sm flex items-center gap-1"
                          title="View History"
                        >
                          <FaClock />
                          History
                        </button>
                        <button
                          onClick={() => handleRemove(app.id)}
                          className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </>
                    )
                  )}
                </td>
              </tr>
            ))}

            {editingApplicationId === null && (
              <tr className="border-t bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Position"
                    className="border p-1 w-full rounded"
                    value={newApplication.position_name}
                    onChange={(e) =>
                      setNewApplication({
                        ...newApplication,
                        position_name: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Company"
                    className="border p-1 w-full rounded"
                    value={newApplication.company}
                    onChange={(e) =>
                      setNewApplication({
                        ...newApplication,
                        company: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Notes"
                    className="border p-1 w-full rounded"
                    value={newApplication.notes}
                    onChange={(e) =>
                      setNewApplication({
                        ...newApplication,
                        notes: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="p-2 flex gap-2 items-center">
                  <select
                    className="border p-1 rounded cursor-pointer"
                    value={newApplication.status_id}
                    onChange={(e) =>
                      setNewApplication({
                        ...newApplication,
                        status_id: Number(e.target.value),
                      })
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </td>
              </tr>
            )}
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
}
