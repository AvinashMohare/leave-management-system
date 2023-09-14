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
    </div>
  );
};

export default ManagerDashboard;
