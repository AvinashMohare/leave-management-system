import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, database } from "../firebase";
import { ref, onValue, update, get } from "firebase/database";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [compOffRequests, setCompOffRequests] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setManagerName(user.displayName);

        // Fetch leave requests for all employees
        const leaveRequestsRef = ref(database, `leaveRequests`);
        onValue(leaveRequestsRef, (snapshot) => {
          const leaveRequestsArray = [];
          if (snapshot.exists()) {
            const leaveRequestsData = snapshot.val();
            Object.entries(leaveRequestsData).forEach(
              ([employeeUid, requests]) => {
                Object.entries(requests).forEach(([requestId, requestData]) => {
                  leaveRequestsArray.push({
                    id: requestId,
                    employeeUid,
                    ...requestData,
                  });
                });
              }
            );
            setLeaveRequests(leaveRequestsArray);
            setFilteredRequests(
              leaveRequestsArray.filter(
                (request) => request.status === "pending"
              )
            );
          } else {
            setLeaveRequests([]);
            setFilteredRequests([]);
          }
        });

        // Fetch comp-off requests
        const compOffRequestsRef = ref(database, "compOffRequests");
        onValue(compOffRequestsRef, (snapshot) => {
          const compOffRequestsArray = [];
          if (snapshot.exists()) {
            const compOffRequestsData = snapshot.val();
            Object.entries(compOffRequestsData).forEach(
              ([employeeUid, requests]) => {
                Object.entries(requests).forEach(([requestId, requestData]) => {
                  if (
                    requestData.seniorApproval === "approved" &&
                    requestData.managerApproval === "pending"
                  ) {
                    compOffRequestsArray.push({
                      id: requestId,
                      employeeUid,
                      ...requestData,
                    });
                  }
                });
              }
            );
          }
          setCompOffRequests(compOffRequestsArray);
        });

        // Fetch employees
        const employeesRef = ref(database, "employees");
        onValue(employeesRef, (snapshot) => {
          if (snapshot.exists()) {
            const employeesData = snapshot.val();
            const employeesArray = Object.entries(employeesData).map(
              ([uuid, emp]) => ({
                uuid,
                ...emp,
              })
            );
            setEmployees(employeesArray);
          } else {
            setEmployees([]);
          }
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const deductLeave = async (employeeUid, leaveType, days) => {
    const employeeRef = ref(database, `employees/${employeeUid}`);
    const snapshot = await get(employeeRef);
    const employeeData = snapshot.val();

    if (employeeData) {
      let leaveBalance;
      switch (leaveType) {
        case "sickLeave":
          leaveBalance = "sickLeaves";
          break;
        case "compOffLeave":
          leaveBalance = "compOffs";
          break;
        default:
          leaveBalance = "leaves";
      }

      const currentLeaveCount = employeeData[leaveBalance] || 0;
      const newLeaveCount = Math.max(0, currentLeaveCount - days);

      await update(employeeRef, { [leaveBalance]: newLeaveCount });
    }
  };

  const approveRequest = async (request) => {
    const { id, employeeUid, leaveType, startDate, endDate } = request;
    const approveRef = ref(database, `leaveRequests/${employeeUid}/${id}`);

    const days = calculateLeaveDays(startDate, endDate);

    try {
      await update(approveRef, { status: "approved" });
      await deductLeave(employeeUid, leaveType, days);
      alert("Leave request approved and leave balance updated.");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error approving request. Please try again.");
    }
  };

  const rejectRequest = async (request) => {
    const { id, employeeUid } = request;
    const rejectRef = ref(database, `leaveRequests/${employeeUid}/${id}`);

    try {
      await update(rejectRef, { status: "rejected" });
      alert("Leave request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error rejecting request. Please try again.");
    }
  };

  const approveCompOffRequest = async (request) => {
    const { id, employeeUid } = request;
    const approveRef = ref(database, `compOffRequests/${employeeUid}/${id}`);
    const employeeRef = ref(database, `employees/${employeeUid}`);

    try {
      // Update the request status
      await update(approveRef, {
        managerApproval: "approved",
        managerApprovalTimestamp: Date.now(),
      });

      // Increase the employee's compOff balance
      const employeeSnapshot = await get(employeeRef);
      const employeeData = employeeSnapshot.val();
      const currentCompOffs = employeeData.compOffs || 0;
      await update(employeeRef, { compOffs: currentCompOffs + 1 });

      alert("Comp-off request approved and balance updated.");
    } catch (error) {
      console.error("Error approving comp-off request:", error);
      alert("Error approving comp-off request. Please try again.");
    }
  };

  const rejectCompOffRequest = async (request) => {
    const { id, employeeUid } = request;
    const rejectRef = ref(database, `compOffRequests/${employeeUid}/${id}`);

    try {
      await update(rejectRef, {
        managerApproval: "rejected",
        managerApprovalTimestamp: Date.now(),
      });
      alert("Comp-off request rejected.");
    } catch (error) {
      console.error("Error rejecting comp-off request:", error);
      alert("Error rejecting comp-off request. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((err) => console.error(err.message));
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-md">
        <div className="col-start-1 text-2xl">Manager Dashboard</div>
        <div className="col-start-2 text-center text-2xl">{managerName}</div>
        <div className="col-start-3 flex justify-end">
          <button
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={handleLogout}
          >
            Logout <LogOut className="inline" />
          </button>
        </div>
      </nav>

      <div className="flex flex-wrap">
        {/* Left Column: Employee List */}
        <div className="w-full md:w-1/3 p-4 bg-[#e4c1f9]">
          <h2 className="text-xl font-bold mb-4">Employees</h2>
          {employees.map((employee) => (
            <Link
              key={employee.uuid}
              to={`/employee/${employee.uuid}`}
              className="block my-2 p-2 bg-[#f0e68c] rounded hover:bg-[#d3d3d3]"
            >
              {employee.name} - Leaves: {employee.leaves}, Sick Leaves:{" "}
              {employee.sickLeaves}, Comp Offs: {employee.compOffs}
            </Link>
          ))}
        </div>

        {/* Right Column: Leave Requests */}
        <div className="w-full md:w-2/3 p-4 bg-[#4cc9f0]">
          <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const employee = employees.find(
                (emp) => emp.uuid === request.employeeUid
              );
              return (
                <div key={request.id} className="mb-4 p-4 bg-[#e4c1f9] rounded">
                  <p>
                    <strong>Employee:</strong>{" "}
                    {employee ? employee.name : "Unknown"}
                  </p>
                  <p>
                    <strong>Leave Type:</strong> {request.leaveType}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {request.startDate}
                  </p>
                  <p>
                    <strong>End Date:</strong> {request.endDate}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Status:</strong> {request.status}
                  </p>

                  <button
                    className="bg-green-500 p-2 rounded-md text-white mr-2 mt-2"
                    onClick={() => approveRequest(request)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 p-2 rounded-md text-white mt-2"
                    onClick={() => rejectRequest(request)}
                  >
                    Reject
                  </button>
                </div>
              );
            })
          ) : (
            <p>No leave requests available.</p>
          )}

          <h2 className="text-2xl font-bold mb-4 mt-8">Comp-Off Requests</h2>
          {compOffRequests.length > 0 ? (
            compOffRequests.map((request) => {
              const employee = employees.find(
                (emp) => emp.uuid === request.employeeUid
              );
              return (
                <div key={request.id} className="mb-4 p-4 bg-[#e4c1f9] rounded">
                  <p>
                    <strong>Employee:</strong>{" "}
                    {employee ? employee.name : "Unknown"}
                  </p>
                  <p>
                    <strong>Date:</strong> {request.date}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Half Day:</strong>{" "}
                    {request.isHalfDay ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Senior Approval:</strong> {request.seniorApproval}
                  </p>

                  <button
                    className="bg-green-500 p-2 rounded-md text-white mr-2 mt-2"
                    onClick={() => approveCompOffRequest(request)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 p-2 rounded-md text-white mt-2"
                    onClick={() => rejectCompOffRequest(request)}
                  >
                    Reject
                  </button>
                </div>
              );
            })
          ) : (
            <p>No comp-off requests available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
