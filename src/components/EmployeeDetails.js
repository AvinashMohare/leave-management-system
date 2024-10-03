import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeaves, setNewLeaves] = useState("");
  const [newSickLeaves, setNewSickLeaves] = useState("");
  const [newCompOffs, setNewCompOffs] = useState("");

  useEffect(() => {
    const employeeRef = ref(database, `employees/${employeeId}`);
    onValue(employeeRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setEmployeeData(data);
        setNewLeaves(data.leaves || 0);
        setNewSickLeaves(data.sickLeaves || 0);
        setNewCompOffs(data.compOffs || 0);
      }
    });
  }, [employeeId]);

  useEffect(() => {
    const leaveRequestsRef = ref(database, `leaveRequests/${employeeId}`);
    onValue(leaveRequestsRef, (snapshot) => {
      if (snapshot.exists()) {
        const requests = snapshot.val();
        setLeaveRequests(Object.values(requests)); // Convert requests object to array
      } else {
        setLeaveRequests([]);
      }
    });
  }, [employeeId]);

  const handleUpdate = () => {
    const employeeRef = ref(database, `employees/${employeeId}`);
    update(employeeRef, {
      leaves: parseInt(newLeaves),
      sickLeaves: parseInt(newSickLeaves),
      compOffs: parseInt(newCompOffs),
    }).then(() => {
      alert("Leaves updated successfully!");
    });
  };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  // Filter leave requests for each type
  const leaveRequestsLeaves = leaveRequests.filter(
    (leave) => leave.leaveType === "casualLeave"
  );
  const leaveRequestsSickLeaves = leaveRequests.filter(
    (leave) => leave.leaveType === "sickLeave"
  );
  const leaveRequestsCompOffs = leaveRequests.filter(
    (leave) => leave.leaveType === "compOffLeave"
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Employee Details</h1>
      <p>
        <strong>Name:</strong> {employeeData.name}
      </p>
      <div className="mt-4">
        <label>
          <strong>Total Leaves Remaining:</strong>
          <input
            type="number"
            value={newLeaves}
            onChange={(e) => setNewLeaves(e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </label>
      </div>
      <div className="mt-4">
        <label>
          <strong>Sick Leaves Remaining:</strong>
          <input
            type="number"
            value={newSickLeaves}
            onChange={(e) => setNewSickLeaves(e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </label>
      </div>
      <div className="mt-4">
        <label>
          <strong>Comp Offs Remaining:</strong>
          <input
            type="number"
            value={newCompOffs}
            onChange={(e) => setNewCompOffs(e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </label>
      </div>
      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Update Leaves
      </button>

      <h2 className="text-xl font-bold mt-4">Leave History</h2>

      {/* Table for Leaves */}
      <h3 className="text-lg font-semibold">Leaves</h3>
      <table className="w-full border border-gray-300 mt-2 mb-4">
        <thead>
          <tr>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequestsLeaves.length > 0 ? (
            leaveRequestsLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">{leave.startDate}</td>
                <td className="border p-2">{leave.endDate}</td>
                <td className="border p-2">{leave.reason}</td>
                <td className="border p-2">{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-2 text-center">
                No leave requests
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Table for Sick Leaves */}
      <h3 className="text-lg font-semibold">Sick Leaves</h3>
      <table className="w-full border border-gray-300 mt-2 mb-4">
        <thead>
          <tr>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequestsSickLeaves.length > 0 ? (
            leaveRequestsSickLeaves.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">{leave.startDate}</td>
                <td className="border p-2">{leave.endDate}</td>
                <td className="border p-2">{leave.reason}</td>
                <td className="border p-2">{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-2 text-center">
                No sick leave requests
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Table for Comp Offs */}
      <h3 className="text-lg font-semibold">Comp Offs</h3>
      <table className="w-full border border-gray-300 mt-2 mb-4">
        <thead>
          <tr>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequestsCompOffs.length > 0 ? (
            leaveRequestsCompOffs.map((leave, index) => (
              <tr key={index}>
                <td className="border p-2">{leave.startDate}</td>
                <td className="border p-2">{leave.endDate}</td>
                <td className="border p-2">{leave.reason}</td>
                <td className="border p-2">{leave.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-2 text-center">
                No comp off requests
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetail;
