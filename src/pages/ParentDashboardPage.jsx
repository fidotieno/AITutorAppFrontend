import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import AnalyticsDashboard from "./StudentAnalyticsDashboard"; // Import Student Dashboard

const ParentDashboard = () => {
  const auth = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

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
          {selectedChild && (
            <div className="mt-6 p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-4">
                💰 Pay Fees via M-Pesa
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await initiateStkPush({
                    phone,
                    amount,
                    studentId: selectedChild._id,
                    token: auth.token,
                  });

                  if (res.success) {
                    alert("Payment initiated! Please check your phone.");
                  } else {
                    alert("Payment failed. Try again.");
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Safaricom Phone (e.g. 2547... )"
                  className="block w-full p-2 border rounded mb-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="block w-full p-2 border rounded mb-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Pay Now
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No linked students found.</p>
      )}
    </div>
  );
};

export default ParentDashboard;
