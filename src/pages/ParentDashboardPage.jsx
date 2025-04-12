import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import AnalyticsDashboard from "./StudentAnalyticsDashboard"; // Import Student Dashboard

const ParentDashboard = () => {
  const auth = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    // Load children from localStorage or fetch from API
    const storedChildren = JSON.parse(localStorage.getItem("children"));
    if (storedChildren) {
      setChildren(storedChildren);
      setSelectedChild(storedChildren[0]); // Default to first child
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">
        🏡 Parent Dashboard
      </h1>

      {children.length > 0 ? (
        <div>
          <label className="block font-semibold mt-4">Select a Child:</label>
          <select
            onChange={(e) =>
              setSelectedChild(
                children.find((child) => child._id === e.target.value)
              )
            }
            className="border rounded p-2"
          >
            {children.map((child) => (
              <option key={child.id} value={child._id}>
                {child.name}
              </option>
            ))}
          </select>
          {selectedChild && (
            <AnalyticsDashboard studentCode={selectedChild._id} />
          )}{" "}
          {/* Render student dashboard */}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No linked students found.</p>
      )}
    </div>
  );
};

export default ParentDashboard;
