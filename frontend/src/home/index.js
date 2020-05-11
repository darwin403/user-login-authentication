import React, { useState, userEffect, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  Redirect,
} from "react-router-dom";

import "./index.scss";

import Login from "../user/login";
import Register from "../user/register";

function Index() {
  const [user, setUser] = useState(null);
  const isAuthenticated = user && user.token;
  const [allPosts, setAllPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    if (user && user.token) {
      Cookies.set("token", user.token, { domain: "localhost" });
    }
  }, [user]);

  useEffect(() => {
    // load all posts on mount
    axios.get("/posts").then(
      posts => {
        setAllPosts(posts.data);
      },
      error => {
        console.log(error);
      }
    );

    // load previous user session
    const token = Cookies.get("token");
    if (!token) return;
    axios.get(`/users/${token}`).then(
      user => {
        setUser(user.data);
      },
      error => {
        console.log(error);
      }
    );
  }, []);

  let history = useHistory();

  // handle user
  const handleUser = user => {
    setUser(user);
    history.push("/");
  };

  // load user post
  const fetchUserPosts = () => {
    axios
      .post("/posts", {
        token: user && user.token,
      })
      .then(
        posts => {
          setUserPosts(posts.data);
        },
        error => {
          console.log(error);
        }
      );
  };

  // create post
  const createPost = () => {
    axios
      .put("/posts", {
        title: postTitle,
        content: postContent,
        token: user && user.token,
      })
      .then(
        () => {
          toast("Post created! Redirecting ...");
          setTimeout(function () {
            window.location.href = "/";
          }, 1000);
        },
        error => {
          console.log(error);
        }
      );
  };

  return (
    <div class="page-home">
      <section class="hero is-primary is-bold">
        <div class="hero-body" style={{ paddingBottom: 0 }}>
          <div class="container">
            <h1 class="title">Brand.</h1>
            <h2 class="subtitle">My awesome store</h2>
            <div class="columns" style={{ marginTop: "4em" }}>
              <div class="column">
                <div class="tabs is-boxed is-left">
                  <ul>
                    <li class="is-active">
                      <Link to="/">
                        <span class="icon is-small">
                          <i class="fas fa-image" aria-hidden="true"></i>
                        </span>
                        <span>Posts</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/music">
                        <span class="icon is-small">
                          <i class="fas fa-music" aria-hidden="true"></i>
                        </span>
                        <span>Music</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="column">
                <div class="tabs is-right">
                  <ul>
                    <li class="is-active">
                      <Link to="/create">
                        <span class="icon is-small">
                          <i class="fas fa-pencil-alt"></i>
                        </span>
                        <span>Create Post</span>
                      </Link>
                    </li>
                    <ProtectedItem isAuthenticated={!isAuthenticated}>
                      <li>
                        <Link to="/login">
                          <span class="icon is-small">
                            <i class="fas fa-sign-in-alt"></i>
                          </span>
                          <span>Login</span>
                        </Link>
                      </li>
                    </ProtectedItem>
                    <ProtectedItem isAuthenticated={isAuthenticated}>
                      <li>
                        <Link to="/dashboard" onClick={fetchUserPosts}>
                          <span class="icon is-small">
                            <i class="fas fa-tachometer-alt"></i>
                          </span>
                          <span>Dashboard</span>
                        </Link>
                      </li>
                    </ProtectedItem>
                    <ProtectedItem isAuthenticated={isAuthenticated}>
                      <li>
                        <Link
                          to="/"
                          onClick={e => {
                            setUser(null);
                            Cookies.remove("token", user.token, {
                              domain: "localhost",
                            });
                            toast("User logged out!");
                          }}>
                          <span class="icon is-small">
                            <i class="fas fa-sign-in-alt"></i>
                          </span>
                          <span>Logout</span>
                        </Link>
                      </li>
                    </ProtectedItem>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Switch>
        <Route path="/music">
          <section className="section">
            <div class="container">This is dummy category.</div>
          </section>
        </Route>
        <ProtectedRoute path="/create" isAuthenticated={isAuthenticated}>
          <section className="section">
            <div class="container">
              <div class="row">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">Author</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          value={user && user.name}
                          disabled
                        />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Title</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Looking for scraping jobs"
                          value={postTitle}
                          onChange={e => setPostTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div class="field">
                      <label class="label">Content</label>
                      <div class="control">
                        <textarea
                          class="textarea"
                          placeholder="Description of service"
                          value={postContent}
                          onChange={e =>
                            setPostContent(e.target.value)
                          }></textarea>
                      </div>
                    </div>

                    <div class="field is-grouped">
                      <div class="control" onClick={createPost}>
                        <button class="button is-link">Submit</button>
                      </div>
                      <div class="control">
                        <Link class="button is-link is-light" to="/">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ProtectedRoute>
        <Route path="/dashboard">
          <section className="section">
            <div className="container">
              <div class="row">
                <div class="columns">
                  <div class="column">
                    {userPosts.map((i, index) => (
                      <div class="card" style={{ margin: "2em 0" }}>
                        <div class="card-content">
                          <div class="media">
                            <div class="media-content">
                              <p class="title is-4">
                                <a href="#">{i.title}</a>
                              </p>
                              <p class="subtitle is-6">{i.belong_to}</p>
                            </div>
                          </div>

                          <div
                            class="content"
                            dangerouslySetInnerHTML={{
                              __html: i.content,
                            }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Route>
        <Route path="/">
          <section className="section">
            <div className="container">
              <div class="row">
                <div class="columns">
                  <div class="column">
                    {allPosts.map((i, index) => (
                      <div class="card" style={{ margin: "2em 0" }}>
                        <div class="card-content">
                          <div class="media">
                            <div class="media-content">
                              <p class="title is-4">
                                <a href="#">{i.title}</a>
                              </p>
                              <p class="subtitle is-6">{i.belong_to}</p>
                            </div>
                          </div>

                          <div
                            class="content"
                            dangerouslySetInnerHTML={{
                              __html: i.content,
                            }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Route>
      </Switch>

      <Switch>
        <Route path="/login">
          <Login onSuccess={handleUser} />
        </Route>
        <Route path="/register">
          <Register onSuccess={handleUser} />
        </Route>
      </Switch>
      <ToastContainer />
    </div>
  );
}

function ProtectedItem(props) {
  if (!props.isAuthenticated) return null;

  return props.children;
}

function ProtectedRoute(props) {
  if (!props.isAuthenticated) return <Redirect to="/login" />;

  return <Route path={props.path}>{props.children}</Route>;
}

export default Index;
