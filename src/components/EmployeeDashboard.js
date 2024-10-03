import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { auth, database } from "../firebase";
import { onValue, ref, push, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CompOffRequestForm from "./CompOffRequestForm";
import PendingApprovals from "./PendingApprovals";

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState("");
  const [isLeaveFormVisible, setIsLeaveFormVisible] = useState(false);
  const [reqStartDate, setReqStartDate] = useState("");
  const [reqEndDate, setReqEndDate] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [reqLeaveType, setReqLeaveType] = useState("casualLeave");
  const [formError, setFormError] = useState("");
  const [isCompOffFormVisible, setIsCompOffFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const employeeRef = ref(database, `employees/${user.uid}`);
      onValue(employeeRef, (snapshot) => {
        const data = snapshot.val();
        setEmployeeData(data);
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const validateForm = () => {
    if (!reqLeaveType || !reqStartDate || !reqEndDate || !reqReason.trim()) {
      setFormError("Please fill in all fields");
      return false;
    }
    if (new Date(reqEndDate) < new Date(reqStartDate)) {
      setFormError("End date cannot be earlier than start date");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user = auth.currentUser;

    if (user) {
      const leaveRequest = {
        leaveType: reqLeaveType,
        startDate: reqStartDate,
        endDate: reqEndDate,
        reason: reqReason.trim(),
        status: "pending",
        timestamp: Date.now(),
      };

      const newLeaveRequestRef = push(
        ref(database, `leaveRequests/${user.uid}`)
      );

      set(newLeaveRequestRef, leaveRequest)
        .then(() => {
          alert("Leave request submitted successfully!");
          setIsLeaveFormVisible(false);
          setReqLeaveType("casualLeave");
          setReqStartDate("");
          setReqEndDate("");
          setReqReason("");
          setFormError("");
        })
        .catch((error) => {
          console.error("Error submitting leave request:", error);
          setFormError("Failed to submit leave request. Please try again.");
        });
    }
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    setReqStartDate(newStartDate);

    // If end date is earlier than new start date, reset end date
    if (reqEndDate && new Date(reqEndDate) < new Date(newStartDate)) {
      setReqEndDate("");
    }
  };

  return (
    <div className="w-full h-screen bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <div className="col-start-1 text-2xl">
          <p>Dashboard</p>
        </div>
        <div className="col-start-2 col-span-1 text-center text-2xl">
          <p>{employeeData.name}</p>
        </div>
        <div className="col-start-3 flex justify-end">
          <div className="border-[1px] border-black rounded-[5px] bg-[#F42C04]">
            <button
              className="flex flex-row justify-center items-center mx-1 my-1"
              onClick={handleLogout}
            >
              Logout
              <LogOut className="mx-1" />
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <h2 className="text-center text-2xl font-bold mb-2 my-2">
          Leave Balance
        </h2>
        <p>Total Leaves Remaining: {employeeData.leaves || 0}</p>
        <p>Sick Leaves Remaining: {employeeData.sickLeaves || 0}</p>
        <p>Comp Offs Remaining: {employeeData.compOffs || 0}</p>
      </div>

      <div className="mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px] flex justify-around">
        <button
          className="cursor-pointer bg-[#fb5607] p-[5px] rounded-[5px] p-2 font-bold my-2"
          onClick={() => setIsLeaveFormVisible(true)}
        >
          Ask for a Leave
        </button>
        <button
          className="cursor-pointer bg-[#4cc9f0] p-[5px] rounded-[5px] p-2 font-bold my-2"
          onClick={() => setIsCompOffFormVisible(true)}
        >
          Ask for a Comp Off
        </button>
      </div>

      {isLeaveFormVisible && (
        <div className="flex flex-col justify-center items-center my-2 mx-2 bg-[#4cc9f0] rounded-[5px]">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <fieldset>
              <legend className="text-center text-2xl font-bold mb-2 my-2">
                Create a Leave Request
              </legend>

              {formError && (
                <div className="text-red-500 font-bold mb-2">{formError}</div>
              )}

              <div className="my-2">
                <label>Type of Leave: </label>
                <select
                  className="rounded-[5px] mx-2"
                  value={reqLeaveType}
                  onChange={(event) => setReqLeaveType(event.target.value)}
                  required
                >
                  <option value="casualLeave">Casual Leave</option>
                  <option value="sickLeave">Sick Leave</option>
                  <option value="compOffLeave">Comp Off Leave</option>
                </select>
              </div>

              <div className="flex flex-row my-2">
                <label>
                  From:
                  <input
                    type="date"
                    className="rounded-[5px] mx-2"
                    value={reqStartDate}
                    onChange={handleStartDateChange}
                    required
                  />
                </label>
                <label>
                  To:
                  <input
                    type="date"
                    className="rounded-[5px] mx-2"
                    value={reqEndDate}
                    onChange={(event) => setReqEndDate(event.target.value)}
                    min={reqStartDate} // Prevent selecting dates before start date
                    required
                  />
                </label>
              </div>

              <textarea
                rows={5}
                placeholder="Describe your reason..."
                value={reqReason}
                className="resize-none w-[70vw] h-[30vh] p-2 rounded-[5px]"
                onChange={(event) => setReqReason(event.target.value)}
                required
              />
              <button
                className="cursor-pointer bg-[#fb5607] p-[5px] rounded-[5px] p-2 font-bold my-2"
                type="submit"
              >
                Submit Leave Request
              </button>
            </fieldset>
          </form>
        </div>
      )}

      {isCompOffFormVisible && (
        <CompOffRequestForm
          currentUserId={auth.currentUser.uid}
          onRequestSubmitted={() => setIsCompOffFormVisible(false)}
        />
      )}
      <PendingApprovals currentUserId={auth.currentUser.uid} />
    </div>
  );
};

export default EmployeeDashboard;
