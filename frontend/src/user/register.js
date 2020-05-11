import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Register(props) {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("mypass");
  const [error, setError] = useState(null);

  const registerUser = () => {
    axios
      .put("http://138.197.199.81:8080/users", {
        name,
        email,
        password,
      })
      .then(
        response => {
          toast("Account created!");
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
          <h1 class="title">Register</h1>
          <h2 class="subtitle">
            Already have an account? <Link to="/login">Login</Link> for all
            benefits!
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
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </p>
          </div>
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
                onClick={registerUser}>
                Sign up!
              </button>
            </div>
          </div>
        </div>
      </div>
      <Link class="modal-close is-large" aria-label="close" to="/"></Link>
    </div>
  );
}

Register.defaultProps = {
  onSuccess: i => i,
};
