import { useState, useRef, useCallback, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]); //IT IS BEING USED

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case "email":
        setEmail(event.target.value);

        break;

      case "password":
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");

    const loginAttempts = [
      { url: "/admin/login", role: "admin", successRoute: "/main/movies" },
      { url: "/user/login", role: "user", successRoute: "/" },
    ];

    for (const attempt of loginAttempts) {
      try {
        const response = await axios.post(attempt.url, data, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("userRole", attempt.role);
        navigate(attempt.successRoute);
        setStatus("idle");
        return;
      } catch (error) {
        console.log(`${attempt.role} login failed`);
        continue;
      }
    }

    setError("Invalid credentials");
    setStatus("idle");
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        <form>
          <div className="form-container">
            <h3>Lumina</h3>
            <h3>Login</h3>

            {error && <span className="login errors">{error}</span>}
            <div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="text"
                  name="email"
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, "email")}
                />
              </div>
              {debounceState && isFieldsDirty && email == "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, "password")}
                />
              </div>
              {debounceState && isFieldsDirty && password == "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? "Hide" : "Show"} Password
            </div>

            <div className="submit-container">
              <button
                type="button"
                disabled={status === "loading"}
                onClick={() => {
                  if (status === "loading") {
                    return;
                  }
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email == "") {
                      emailRef.current.focus();
                    }

                    if (password == "") {
                      passwordRef.current.focus();
                    }
                  }
                }}
              >
                {status === "idle" ? "Login" : "Loading"}
              </button>
            </div>
            <div className="register-container">
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
        <div>
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
