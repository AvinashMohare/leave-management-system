import { User, Mail, KeyRound } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] font-oxygen">
      <form action="">
        <fieldset>
          <legend className="text-center text-4xl font-bold mb-2">
            Signup
          </legend>
          <div className="flex flex-col justify-center text-2xl">
            <div className="flex flex-col justify-center my-2">
              <label>First Name</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <User />
                <input
                  type="text"
                  required
                  className="focus:outline-none m-[5px]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Second Name</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <User />
                <input type="text" className="focus:outline-none m-[5px]" />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Email</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <Mail />
                <input
                  type="email"
                  required
                  className="focus:outline-none m-[5px]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Create Password</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <KeyRound />
                <input
                  type="password"
                  required
                  className="focus:outline-none m-[5px]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <label>Confirm Password</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <KeyRound />
                <input
                  type="password"
                  required
                  className="focus:outline-none m-[5px]"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <label>
                <input type="radio" name="category" />
                Employee
              </label>
              <label>
                <input type="radio" name="category" />
                Manager
              </label>
            </div>
            <div className="flex align-center justify-center my-2">
              <input
                type="submit"
                value="Signup"
                className="cursor-pointer bg-[#C77DFF] p-[5px] rounded-[8px] w-[320px] "
              />
            </div>
            <div className="flex flex-row align-center justify-center text-lg my-2">
              Already have an account?{" "}
              <Link to="/Login" className="cursor-pointer text-[#d62828]">
                Login
              </Link>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Signup;
