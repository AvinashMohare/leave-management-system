import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container">
      <form action="">
        <fieldset>
          <legend>Login</legend>
          <div className="content">
            <div className="email">
              <label htmlFor="email">Email</label>
              <input type="email" required id="email" />
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input type="password" required id="password" />
            </div>
            <div className="submit">
              <input type="submit" id="submit" />
            </div>
            <div className="signup-redirect">
              <p>Don't have an account?</p>
              <Link to="/Signup">Signup</Link>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
