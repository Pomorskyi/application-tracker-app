'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { FaClock } from 'react-icons/fa'
import { JobApplication } from '../types/modelTypes'

type Status = {
  id: number
  name: string
}

type Application = {
  id: number
  position_name: string
  company: string
  notes?: string
  status_id: number
  status: Status
}

export default function Applications() {
  const {currentUserId} = useAuth();

  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historyModalVersions, setHistoryModalVersions] = useState<JobApplication[]>([])

  const [applications, setApplications] = useState<Application[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [newApplication, setNewApplication] = useState({
    position_name: '',
    company: '',
    notes: '',
    status_id: 1,
  })

  useEffect(() => {
    fetch('/api/statuses')
      .then((res) => res.json())
      .then((data) => setStatuses(data.statuses || []))

    fetch(`/api/applications?currentUserId=${currentUserId}`, {
      method: 'GET',
    })
    .then((res) => res.json())
    .then((data) => setApplications(data.applications || []));

  }, [])

  const handleShowHistory = async (appId: number) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'GET',
    })
    const data = await res.json()
    setHistoryModalVersions(data.versions || [])
    setHistoryModalOpen(true)
  }

  const handleStatusChange = async (id: number, newStatusId: number) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status_id: newStatusId }),
      headers: { 'Content-Type': 'application/json' },
    })

    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, status_id: newStatusId, status: statuses.find(s => s.id === newStatusId)! } : app
      )
    )
  }

  const handleCreate = async () => {
    if (!newApplication.position_name || !newApplication.company) return

    const res = await fetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify({...newApplication, currentUserId: currentUserId}),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    setApplications([...applications, data.application])
    setNewApplication({ position_name: '', company: '', notes: '', status_id: 1 })
  }

  const handleRemove = async (applicationId: number) => {

    const res = await fetch('/api/applications', {
      method: 'DELETE',
      body: JSON.stringify({applicationId: applicationId, currentUserId: currentUserId}),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    setApplications(prev => ([...prev.filter(app => app.id !== applicationId)]))
  }

  return (
    <><main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">Position</th>
            <th className="p-2 border-b">Company</th>
            <th className="p-2 border-b">Notes</th>
            <th className="p-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{app.position_name}</td>
              <td className="p-2">{app.company}</td>
              <td className="p-2">{app.notes || '-'}</td>
              <td className="p-2">
                <select
                  className="border p-1 rounded cursor-pointer"
                  value={app.status_id}
                  onChange={(e) => handleStatusChange(app.id, Number(e.target.value))}
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 flex items-center gap-2">
                <button
                  onClick={() => handleShowHistory(app.id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View History"
                >
                  <FaClock />
                </button>
                <button
                onClick={() => handleRemove(app.id)}
                className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-red-700"
              >
                Remove
              </button>
              </td>
            </tr>
          ))}

          <tr className="border-t bg-gray-50">
            <td className="p-2">
              <input
                type="text"
                placeholder="Position"
                className="border p-1 w-full rounded"
                value={newApplication.position_name}
                onChange={(e) => setNewApplication({ ...newApplication, position_name: e.target.value })}
              />
            </td>
            <td className="p-2">
              <input
                type="text"
                placeholder="Company"
                className="border p-1 w-full rounded"
                value={newApplication.company}
                onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
              />
            </td>
            <td className="p-2">
              <input
                type="text"
                placeholder="Notes"
                className="border p-1 w-full rounded"
                value={newApplication.notes}
                onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
              />
            </td>
            <td className="p-2 flex gap-2 items-center">
              <select
                className="border p-1 rounded cursor-pointer"
                value={newApplication.status_id}
                onChange={(e) => setNewApplication({ ...newApplication, status_id: Number(e.target.value) })}
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
        </tbody>
      </table>
    </main>
    {historyModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded shadow-lg p-6 overflow-y-auto flex gap-4">
      
      <div className="w-3/4 overflow-y-auto">
        <h2 className="font-semibold mb-2">Versions Details</h2>
        {historyModalVersions.map(version => (
          <table className="text-sm w-full" key={`version-${version.id}`}>
          <tbody>
            <tr><td className="font-bold pr-2">Position:</td><td>{version.position_name}</td></tr>
            <tr><td className="font-bold pr-2">Company:</td><td>{version.company}</td></tr>
            <tr><td className="font-bold pr-2">Notes:</td><td>{version.notes || '-'}</td></tr>
            <tr><td className="font-bold pr-2">Status:</td><td>{version.status.name}</td></tr>
            <tr><td className="font-bold pr-2">Created At:</td><td>{new Date(version.created_at).toLocaleString()}</td></tr>
          </tbody>
        </table>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={() => setHistoryModalOpen(false)}
        className="absolute top-4 right-6 text-gray-700 hover:text-black text-xl font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}
    </>
  )
}
