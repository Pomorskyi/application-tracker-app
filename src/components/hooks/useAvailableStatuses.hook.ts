import { ApplicationStatus } from "@/app/types/modelTypes";
import { useEffect, useState } from "react";


export const useAvailableStatuses = () => {
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch("/api/statuses");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setStatuses(data.statuses || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loading, error };
};
