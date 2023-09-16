import React, { useState } from "react";

const Details = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [managerUid, setManagerUid] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      (role === "Employee" && !managerUid)
    ) {
      setError("Pleasse fill all the details.");
      return;
    }
    console.log(firstName, lastName, email, role, managerUid);
  };

  return (
    <div className="flex items-center justify-center h-[100vh] font-oxygen">
      <form>
        <fieldset>
          <legend className="text-center text-4xl font-bold mb-2">
            Details
          </legend>
          <div className="flex flex-col justify-center text-2xl">
            <div className="flex flex-col justify-center my-2">
              <label>First Name</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <input
                  type="text"
                  required
                  className="focus:outline-none m-[5px]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Last Name</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <input
                  type="text"
                  required
                  className="focus:outline-none m-[5px]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Email</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <input
                  type="email"
                  required
                  className="focus:outline-none m-[5px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    onClick={() => setRole("Employee")}
                  />
                  Employee
                </label>
              </div>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    onClick={() => setRole("Manager")}
                  />
                  Manager
                </label>
              </div>
            </div>
            {role === "Employee" ? (
              <div className="flex flex-col justify-center my-2">
                <label>Manager UID</label>
                <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                  <input
                    type="text"
                    required
                    className="focus:outline-none m-[5px]"
                    value={managerUid}
                    onChange={(e) => setManagerUid(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
            <div className="flex align-center justify-center my-2 text-[#ff0e0e] text-lg">
              {error}
            </div>
            <div className="flex align-center justify-center my-2">
              <input
                type="submit"
                className="cursor-pointer bg-[#C77DFF] p-[5px] rounded-[8px] w-[320px] "
                onClick={handleSubmit}
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Details;
