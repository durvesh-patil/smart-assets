// pages/auth.js
import React, { useState } from "react";
import Login from "./Login"; // Import the Login component
import Register from "./Register"; // Import the Register component

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true); // State to toggle between login and register

  return (
    <div>
      {/* Toggle between Login and Register based on isLogin state */}
      {isLogin ? (
        <>
          {/* <h1>Login Page</h1> */}
          <Login />
        </>
      ) : (
        <>
          <h1>Register Page</h1>
          <Register />
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => setIsLogin(true)}>
              Login here
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default Auth;
