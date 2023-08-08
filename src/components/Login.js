import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] font-oxygen">
      <form action="">
        <fieldset>
          <legend className="text-center text-4xl font-bold mb-2">Login</legend>
          <div className="flex flex-col justify-center text-2xl">
            <div className="flex flex-col justify-center my-2">
              <label htmlFor="email">Email</label>
              <input type="email" required id="email" className="border-2" />
            </div>
            <div className="flex flex-col justify-center my-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                id="password"
                className="border-2"
              />
            </div>
            <div className="flex align-center justify-center my-2">
              <input
                type="submit"
                value="Login"
                id="submit"
                className="cursor-pointer bg-[#d62828] p-[5px] rounded-[8px] h-[32px] w-[320px] "
              />
            </div>
            <div className="flex flex-row align-center justify-center text-lg">
              <p>Don't have an account?</p>
              <Link to="/Signup" className="cursor-pointer text-[#d62828]">
                {" "}
                Signup
              </Link>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
