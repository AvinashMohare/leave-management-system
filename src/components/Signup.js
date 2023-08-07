import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="container">
      <form action="">
        <fieldset>
          <legend>Signup</legend>
          <div className="content">
            <div className="fname">
              <label>First Name</label>
              <input type="text" required />
            </div>
            <div className="sname">
              <label>Second Name</label>
              <input type="text" />
            </div>
            <div className="email">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="password">
              <label>Create Password</label>
              <input type="password" required />
            </div>
            <div className="confirm-password">
              <label>Confirm Password</label>
              <input type="password" required />
            </div>
            <div className="submit">
              <input type="submit" />
            </div>
            <div className="login-redirect">
              Already have an account? <Link to="/Login">Login</Link>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Signup;
