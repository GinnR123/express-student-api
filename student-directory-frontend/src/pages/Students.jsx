import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useAuth } from "../hooks/useAuth";

export default function Students() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        const res = await fetch(`${API_URL}/api/students`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        // Expired or invalid token: clear the session. ProtectedRoute then
        // sends the user to /login.
        if (res.status === 401) {
          logout();
          return;
        }

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load students");
        }
        setStudents(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadStudents();
    return () => controller.abort();
  }, [token, logout]);

  return (
    <div className="card wide">
      <div className="header">
        <h1>Students</h1>
        <button type="button" onClick={logout}>Logout</button>
      </div>

      {loading && <p>Loading students...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && students.length === 0 && <p>No students yet.</p>}

      <ul className="students">
        {students.map((s) => (
          <li key={s._id}>
            <strong>{s.name}</strong>
            <span>{s.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
