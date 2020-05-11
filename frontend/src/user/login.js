import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login(props) {
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("mypass");
  const [error, setError] = useState(null);

  const loginUser = () => {
    axios
      .post("http://localhost:8080/users", {
        email,
        password,
      })
      .then(
        response => {
          toast("Logged in successfully!");
          props.onSuccess(response.data);
        },
        error => setError(error.response.data.message || error.message)
      );
  };

  return (
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <h1 class="title">Sign In</h1>
          <h2 class="subtitle">
            Don't have an account? <Link to="/register">Register</Link> for
            free!
          </h2>
          {error && (
            <article class="message is-danger">
              <div class="message-body">{error}</div>
            </article>
          )}
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="email"
                placeholder="john@doe.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span className="icon is-small is-left">
                <i class="fas fa-key"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                type="submit"
                onClick={loginUser}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <Link class="modal-close is-large" aria-label="close" to="/"></Link>
    </div>
  );
}

Login.defaultProps = {
  onSuccess: i => i,
};
