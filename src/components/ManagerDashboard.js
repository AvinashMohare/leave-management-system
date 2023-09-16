import React from "react";
import { LogOut } from "lucide-react";

const ManagerDashboard = () => {
  return (
    <div className="w-[100%] h-[100vh] bg-[#F0F7F4] font-oxygen">
      <nav className="grid grid-cols-3 mx-1 my-1 bg-[#e4c1f9] p-2 rounded-[5px]">
        <div className="col-start-1 text-2xl">
          <p>Dashboard</p>
        </div>
        <div className="col-start-2 col-span-1 text-center text-2xl">
          <p>Manager Name</p>
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
          <div className="text-center text-2xl font-bold mb-2 my-2">
            <p>Available Requests</p>
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
              <div className="flex flex-row justify-between items-center">
                <div className="cursor-pointer bg-[#16E0BD] p-[5px] rounded-[5px] p-2 font-bold my-2 mx-2">
                  <button>Approve</button>
                </div>
                <div className="cursor-pointer bg-[#FF4242] p-[5px] rounded-[5px] p-2 font-bold my-2 mx-2">
                  <button>Reject</button>
                </div>
              </div>
            </div>
          </div>
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

export default ManagerDashboard;
