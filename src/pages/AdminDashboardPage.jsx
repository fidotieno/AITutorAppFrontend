import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllStudents,
  updateStudentParents,
  getStudentFees,
  recordStudentFee,
  getPendingEnrollmentsForAdmin,
  getUnapprovedStudents,
  approveStudent,
  rejectStudent,
  approveEnrollment,
  rejectEnrollment,
} from "../api/AdminApis";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [parentEmails, setParentEmails] = useState({
    parentEmail1: "",
    parentEmail2: "",
  });
  const [feeRecords, setFeeRecords] = useState([]);
  const [newFee, setNewFee] = useState({
    amountPaid: "",
    term: "",
    isPaidInFull: false,
    paymentMethod: "Cash",
  });
  const [unapprovedStudents, setUnapprovedStudents] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const studentData = await getAllStudents(token);
        setStudents(studentData);

        const enrollments = await getPendingEnrollmentsForAdmin(token);
        setPendingEnrollments(enrollments);

        const unapproved = await getUnapprovedStudents(token);
        setUnapprovedStudents(unapproved);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchInitialData();
  }, [token]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setParentEmails({
      parentEmail1: student.parentEmail1 || "",
      parentEmail2: student.parentEmail2 || "",
    });
    fetchFeeData(student._id);
  };

  const fetchFeeData = async (studentId) => {
    try {
      const data = await getStudentFees(studentId, token);
      setFeeRecords(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateParents = async () => {
    try {
      await updateStudentParents(selectedStudent._id, parentEmails, token);
      toast.success("Parent emails updated.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRecordFee = async () => {
    try {
      await recordStudentFee(selectedStudent._id, newFee, token);
      toast.success("Fee recorded.");
      setNewFee({
        amountPaid: "",
        term: "",
        isPaidInFull: false,
        paymentMethod: "Cash",
      });
      fetchFeeData(selectedStudent._id);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApprove = async (courseId, studentId) => {
    try {
      await approveEnrollment(courseId, studentId, token);
      toast.success("Enrollment approved");
      const updated = await getPendingEnrollmentsForAdmin(token);
      setPendingEnrollments(updated);
    } catch (err) {
      console.log(err);
      toast.error("Failed to approve enrollment");
    }
  };

  const handleReject = async (courseId, studentId) => {
    try {
      await rejectEnrollment(courseId, studentId, token);
      toast.success("Enrollment rejected");
      const updated = await getPendingEnrollmentsForAdmin(token);
      setPendingEnrollments(updated);
    } catch (err) {
      console.log(err);
      toast.error("Failed to reject enrollment");
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      await approveStudent(studentId, token);
      toast.success("Student approved");
      const refreshed = await getUnapprovedStudents(token);
      setUnapprovedStudents(refreshed);
    } catch (err) {
      toast.error("Failed to approve student");
    }
  };

  const handleRejectStudent = async (studentId) => {
    try {
      await rejectStudent(studentId, token);
      toast.success("Student rejected and removed");
      const refreshed = await getUnapprovedStudents(token);
      setUnapprovedStudents(refreshed);
    } catch (err) {
      toast.error("Failed to reject student");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        📊 Admin Dashboard
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-6"
      />

      {/* Students */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {filteredStudents.map((student) => (
          <div
            key={student._id}
            onClick={() => handleSelectStudent(student)}
            className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50"
          >
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
        ))}
      </div>

      {/* Student Management */}
      {selectedStudent && (
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Manage: {selectedStudent.name}
          </h2>

          {/* Parent Emails */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Parent Emails</h3>
            <input
              type="email"
              placeholder="Parent Email 1"
              value={parentEmails.parentEmail1}
              onChange={(e) =>
                setParentEmails({
                  ...parentEmails,
                  parentEmail1: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Parent Email 2"
              value={parentEmails.parentEmail2}
              onChange={(e) =>
                setParentEmails({
                  ...parentEmails,
                  parentEmail2: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={handleUpdateParents}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Parent Emails
            </button>
          </div>

          {/* Fee Records */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Fee Records</h3>
            <ul className="mb-4 max-h-48 overflow-y-auto border rounded p-3 bg-gray-50">
              {feeRecords.length === 0 ? (
                <p className="text-sm text-gray-600">No records found.</p>
              ) : (
                feeRecords.map((fee) => (
                  <li key={fee._id} className="mb-2 text-sm border-b pb-1">
                    <p>
                      💰 KES {fee.amountPaid} - {fee.term}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fee.paymentMethod} |{" "}
                      {fee.isPaidInFull ? "✅ Paid in Full" : "❌ Partial"}
                    </p>
                  </li>
                ))
              )}
            </ul>

            {/* Add New Fee */}
            <input
              type="number"
              placeholder="Amount Paid"
              value={newFee.amountPaid}
              onChange={(e) =>
                setNewFee({ ...newFee, amountPaid: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Term (e.g. Term 1 - 2025)"
              value={newFee.term}
              onChange={(e) => setNewFee({ ...newFee, term: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <select
              value={newFee.paymentMethod}
              onChange={(e) =>
                setNewFee({ ...newFee, paymentMethod: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            >
              <option value="Cash">Cash</option>
              <option value="Mpesa">M-Pesa</option>
              <option value="Bank">Bank</option>
            </select>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={newFee.isPaidInFull}
                onChange={(e) =>
                  setNewFee({ ...newFee, isPaidInFull: e.target.checked })
                }
              />
              Paid in Full
            </label>
            <button
              onClick={handleRecordFee}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Record Fee
            </button>
          </div>
        </div>
      )}

      {/* Pending Course Approvals */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          📩 Pending Course Enrollments
        </h2>
        {pendingEnrollments.length === 0 ? (
          <p className="text-gray-600 italic">
            No pending enrollment requests.
          </p>
        ) : (
          <ul className="space-y-4">
            {pendingEnrollments.map((req) => (
              <li
                key={req._id}
                className="p-4 border rounded shadow bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p>
                    <strong>Student:</strong> {req.studentName || "Unknown"} (
                    {req.studentEmail})
                  </p>
                  <p>
                    <strong>Course:</strong> {req.courseTitle} ({req.courseCode}
                    )
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req.courseId, req.studentId)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.courseId, req.studentId)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Unapproved Students */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          ⏳ Unapproved Student Accounts
        </h2>
        {unapprovedStudents.length === 0 ? (
          <p className="text-gray-600 italic">All students are approved.</p>
        ) : (
          <ul className="space-y-4">
            {unapprovedStudents.map((student) => (
              <li
                key={student._id}
                className="p-4 border rounded shadow bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {student.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Registered on:{" "}
                    {new Date(student.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveStudent(student._id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectStudent(student._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
