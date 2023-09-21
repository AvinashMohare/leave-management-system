import React, { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { auth, database } from "../firebase";
import { onValue, ref, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

const EmployeeDashboard = () => {
  const [reqStartDate, setReqStartDate] = useState("");
  const [reqEndDate, setReqEndDate] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [error, setError] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [managerUid, setManagerUid] = useState("");
  const [renderRequests, setRenderRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        //Getting employee's displayName
        setEmployeeName(user.displayName);

        //Getting employee's managerUid
        const getManagerUid = ref(database, `employees/${user.uid}`);
        onValue(getManagerUid, (snapshot) => {
          const data = snapshot.val();
          setManagerUid(data.managerUid);
        });
      } else if (!user) {
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (managerUid && auth.currentUser) {
        onValue(
          ref(database, `leaveRequests/${managerUid}/${auth.currentUser.uid}`),
          (snapshot) => {
            setRenderRequests([]);
            const data = snapshot.val();
            if (data != null) {
              Object.values(data).map((request) => {
                setRenderRequests((oldArray) => [...oldArray, request]);
              });
            }
          }
        );
      }
    });
  }, [managerUid]);

  //Logging out user
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //Creating a leave request
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reqStartDate || !reqEndDate || !reqReason) {
      setError("Please fill all the fields.");
    }

    const uid = auth.currentUser.uid;

    const leaveReqUID = nanoid();

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

    const leaveReqData = {
      name: auth.currentUser.displayName,
      employeeUid: uid,
      status: "pending",
      startDate: reqStartDate,
      endDate: reqEndDate,
      reason: reqReason,
      nanoid: leaveReqUID,
      requestedOnDate: formattedDate,
      requestedAtTime: currentTime,
    };

    const databasePath = ref(
      database,
      `leaveRequests/${managerUid}/${auth.currentUser.uid}/${leaveReqUID}`
    );

    set(databasePath, leaveReqData)
      .then((res) => {
        console.log(res);
        setReqStartDate("");
        setReqEndDate("");
        setReqReason("");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="w-[100%] h-[100vh] bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <div className="col-start-1 text-2xl">
          <p>Dashboard</p>
        </div>
        <div className="col-start-2 col-span-1 text-center text-2xl">
          <p>{employeeName}</p>
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
        <div className="flex flex-col justify-center items-center my-2 mx-2 bg-[#4cc9f0] rounded-[5px]">
          <form className="flex flex-col justify-center items-center">
            <fieldset>
              <legend className="text-center text-2xl font-bold mb-2 my-2">
                Create a request
              </legend>
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center my-2">
                  <div>
                    <label className="font-bold">Select period of leave</label>
                  </div>
                  <div className="text-[#F42C04] font-bold">{error}</div>
                  <div className="flex flex-row my-2">
                    <label className="cursor-pointer mx-2">
                      From:
                      <input
                        type="date"
                        className="rounded-[5px]"
                        onChange={(event) => {
                          const newDate = new Date(event.target.value);
                          setReqStartDate(newDate.toLocaleDateString("en-GB"));
                        }}
                      />
                    </label>
                    <label className="cursor-pointer mx-2">
                      To:
                      <input
                        type="date"
                        className="rounded-[5px]"
                        onChange={(event) => {
                          const newDate = new Date(event.target.value);
                          setReqEndDate(newDate.toLocaleDateString("en-GB"));
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="my-2">
                  <textarea
                    rows={5}
                    placeholder="Describe your reason..."
                    value={reqReason}
                    className="focus:outline-none resize-none w-[70vw] h-[30vh] p-2 rounded-[5px]"
                    onChange={(event) => setReqReason(event.target.value)}
                  />
                </div>
                <div className="cursor-pointer bg-[#fb5607] p-[5px] rounded-[5px] p-2 font-bold my-2">
                  <input
                    type="submit"
                    className="cursor-pointer"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="flex flex-col justify-center items-center my-2 mx-2 bg-[#4cc9f0] rounded-[5px]">
          <div>
            <p className="text-center text-2xl font-bold mb-2 my-2">
              Request History
            </p>
          </div>
          {/* Rendering the requests */}

          {renderRequests.map((request, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2"
              >
                <div>
                  Period of leave:{request.startDate} - {request.endDate}
                </div>
                <p className="my-2">{request.reason}</p>
                <div className="flex flex-row justify-between items-center w-[100%]">
                  {request.status === "pending" ? (
                    <div>
                      <p>
                        Requested on {request.requestedOnDate} at{" "}
                        {request.requestedAtTime}
                      </p>
                    </div>
                  ) : (
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
                  )}

                  <div>Status: {request.status}</div>
                </div>
              </div>
            );
          })}

          {/* Rendering requests ends here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
