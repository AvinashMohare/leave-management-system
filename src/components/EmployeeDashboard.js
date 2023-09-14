import React, { useState } from "react";
import { LogOut } from "lucide-react";

const EmployeeDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmmit = (e) => {
    e.preventDefault();
    console.log(startDate, endDate, reason);
  };

  return (
    <div className="w-[100%] h-[100vh] bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <div className="col-start-1 text-2xl">
          <p>Dashboard</p>
        </div>
        <div className="col-start-2 col-span-1 text-center text-2xl">
          <p>Employee Name</p>
        </div>
        <div className="col-start-3 flex justify-end">
          <div className="border-[1px] border-black rounded-[5px] bg-[#F42C04]">
            <button className="flex flex-row justify-center items-center mx-1 my-1">
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
                  <div className="flex flex-row my-2">
                    <label className="cursor-pointer mx-2">
                      From:
                      <input
                        type="date"
                        className="rounded-[5px]"
                        onChange={(event) => {
                          const newDate = new Date(event.target.value);
                          setStartDate(newDate.toLocaleDateString("en-GB"));
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
                          setEndDate(newDate.toLocaleDateString("en-GB"));
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="my-2">
                  <textarea
                    rows={5}
                    placeholder="Describe your reason..."
                    value={reason}
                    className="focus:outline-none resize-none w-[70vw] h-[30vh] p-2 rounded-[5px]"
                    onChange={(event) => setReason(event.target.value)}
                  />
                </div>
                <div className="cursor-pointer bg-[#fb5607] p-[5px] rounded-[5px] p-2 font-bold my-2">
                  <input
                    type="submit"
                    className="cursor-pointer"
                    onClick={handleSubmmit}
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
          <div className="flex flex-col justify-center items-center bg-[#e4c1f9] rounded-[5px] w-[70vw] my-2 p-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
