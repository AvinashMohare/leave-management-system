import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { onValue, ref, update } from "firebase/database";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setManagerName(user.displayName);

        const leaveRequestsRef = ref(
          database,
          `leaveRequests/${auth.currentUser.uid}`
        );
        onValue(leaveRequestsRef, (snapshot) => {
          if (snapshot.exists()) {
            const leaveRequestsData = snapshot.val();
            const leaveRequestsArray = Object.values(leaveRequestsData)
              .map((req) => Object.values(req))
              .flat();
            setLeaveRequests(leaveRequestsArray);
          } else {
            setLeaveRequests([]);
          }
        });
      } else if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  //Approve request
  const approveRequest = (tempReqNanoid, tempEmployeeUid) => {
    //Getting current date
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    //Getting current time
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const approveRef = ref(
      database,
      `leaveRequests/${auth.currentUser.uid}/${tempEmployeeUid}/${tempReqNanoid}`
    );
    update(approveRef, {
      status: "approved",
      respondedOnDate: formattedDate,
      respondedAtTime: currentTime,
    });
  };

  //Reject request
  const rejectRequest = (tempReqNanoid, tempEmployeeUid) => {
    //Getting current date
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    //Getting current time
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;

    const rejectRef = ref(
      database,
      `leaveRequests/${auth.currentUser.uid}/${tempEmployeeUid}/${tempReqNanoid}`
    );
    update(rejectRef, {
      status: "rejected",
      respondedOnDate: formattedDate,
      respondedAtTime: currentTime,
    });
  };

  //Signing out user
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="w-[100%] h-[100vh] bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <div className="col-start-1 text-2xl">
          <p>Dashboard</p>
        </div>
        <div className="col-start-2 col-span-1 text-center text-2xl">
          <p>{managerName}</p>
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
        {/* Available Requests */}
        <div className="flex flex-col justify-center items-center my-2 mx-2 bg-[#4cc9f0] rounded-[5px]">
          <div className="text-center text-2xl font-bold mb-2 my-2">
            <p>Available Requests</p>
          </div>
          {/* Rendering available requests */}
          {leaveRequests.map((request) => {
            if (request.status === "pending") {
              return (
                <div
                  key={request.nanoid}
                  className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2"
                >
                  <div>
                    Period of leave: {request.startDate} - {request.endDate}
                  </div>
                  <p className="my-2">{request.reason}</p>
                  <div className="flex flex-row justify-between items-center w-[100%]">
                    <p>Requested on 12/09/2023</p>
                    <div className="flex flex-row justify-between items-center">
                      <div className="cursor-pointer bg-[#16E0BD] p-[5px] rounded-[5px] p-2 font-bold my-2 mx-2">
                        <button
                          onClick={() =>
                            approveRequest(request.nanoid, request.employeeUid)
                          }
                        >
                          Approve
                        </button>
                      </div>
                      <div className="cursor-pointer bg-[#FF4242] p-[5px] rounded-[5px] p-2 font-bold my-2 mx-2">
                        <button
                          onClick={() =>
                            rejectRequest(request.nanoid, request.employeeUid)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
          {/* Rendering available requests ends here*/}
        </div>
        {/* Request History */}
        <div className="flex flex-col justify-center items-center my-2 mx-2 bg-[#4cc9f0] rounded-[5px]">
          <div>
            <p className="text-center text-2xl font-bold mb-2 my-2">
              Request History
            </p>
          </div>
          {/* Rendering the request history */}
          {leaveRequests.map((request) => {
            if (
              request.status === "approved" ||
              request.status === "rejected"
            ) {
              return (
                <div
                  key={request.nanoid}
                  className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2"
                >
                  <div>
                    Period of leave: {request.startDate} - {request.endDate}
                  </div>
                  <p className="my-2">{request.reason}</p>
                  <div className="flex flex-row justify-between items-center w-[100%]">
                    <div>
                      <p>
                        Requested on {request.requestedOnDate} at{" "}
                        {request.requestedAtTime}
                      </p>
                      <p>
                        Responded on {request.respondedOnDate} at{" "}
                        {request.respondedAtTime}
                      </p>
                    </div>
                    <div>Status: {request.status}</div>
                  </div>
                </div>
              );
            }
            return null;
          })}
          {/* Rendering request history ends here */}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
