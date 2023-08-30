import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitButtonDisabled, setSubmitButtomDisabled] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      alert("Please fill in all the details.");
      return;
    }
    setSubmitButtomDisabled(true);
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async (res) => {
        setSubmitButtomDisabled(false);
        navigate("/");
        console.log(res);
      })
      .catch((err) => {
        setSubmitButtomDisabled(false);
        console.log("Error-", err);
      });
    console.log(values);
  };
  const toggleHandlePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-[100vh] font-oxygen">
      <form action="">
        <fieldset>
          <legend className="text-center text-4xl font-bold mb-2">Login</legend>
          <div className="flex flex-col justify-center text-2xl">
            <div className="flex flex-col justify-center my-2">
              <label htmlFor="email">Email</label>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <Mail />
                <input
                  type="email"
                  required
                  id="email"
                  className="focus:outline-none m-[5px]"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col justify-center my-2">
              <div className="flex flex-row justify-between items-center">
                <label htmlFor="password">Password</label>
                <div className="cursor-pointer" onClick={toggleHandlePassword}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>
              <div className="flex flex-row items-center justify-center border-[1px] border-black rounded-[5px]">
                <KeyRound />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  id="password"
                  className="focus:outline-none m-[5px]"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex align-center justify-center my-2">
              <input
                type="submit"
                value="Login"
                id="submit"
                className="cursor-pointer bg-[#C77DFF] p-[5px] rounded-[8px] w-[320px] "
                onClick={handleLogin}
                disabled={submitButtonDisabled}
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
