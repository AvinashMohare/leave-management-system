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

        //Rendering leave requests
        // onValue(
        //   ref(database, `leaveRequests/${managerUid}/${auth.currentUser.uid}`),
        //   (snapshot) => {
        //     setRenderRequests([]);
        //     const data = snapshot.val();
        //     if (data != null) {
        //       Object.values(data).map((request) => {
        //         setRenderRequests((oldArray) => [...oldArray, request]);
        //       });
        //     }
        //   }
        // );
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

    const leaveReqData = {
      employeeUid: uid,
      status: "pending",
      startDate: reqStartDate,
      endDate: reqEndDate,
      reason: reqReason,
    };

    const leaveReqUID = nanoid();

    const databasePath = ref(
      database,
      `leaveRequests/${managerUid}/${auth.currentUser.uid}/${leaveReqUID}`
    );

    set(databasePath, leaveReqData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.message));

    console.log(reqStartDate, reqEndDate, reqReason);
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
          {/* <div className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2">
            <div>Period of leave: 13/09/2023 - 20/09/2023</div>
            <p className="my-2">
              Generating random paragraphs can be an excellent way for writers
              to get their creative flow going at the beginning of the day. The
              writer has no idea what topic the random paragraph will be about
              when it appears. This forces the writer to use creativity to
              complete one of three common writing challenges. The writer can
              use the paragraph as the first one of a short story and build upon
              it. A second option is to use the random paragraph somewhere in a
              short story they create. The third option is to have the random
              paragraph be the ending paragraph in a short story. No matter
              which of these challenges is undertaken, the writer is forced to
              use creativity on incorporate the paragraph into their writing.
            </p>
            <div className="flex flex-row justify-between items-center w-[100%]">
              <p>Requested on 12/09/2023</p>
              <div>Status: Pending</div>
            </div>
          </div> */}
          {/* Rendering the requests */}

          {renderRequests.map((request, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2"
            >
              <div>
                Period of leave:{request.startDate} - {request.endDate}
              </div>
              <p className="my-2">{request.reason}</p>
              <div className="flex flex-row justify-between items-center w-[100%]">
                <p></p>
                <div>Status: {request.status}</div>
              </div>
            </div>
          ))}

          {/* Rendering requests ends here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
