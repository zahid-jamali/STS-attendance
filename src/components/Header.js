import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    setLoggedIn(!!user); // Convert to boolean
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="container-fluid">
        {/* Brand Name (Left Side) */}
        <a className="navbar-brand h1 mb-0" href="#">
          Sindh Tech Solutions
        </a>

        {/* Show Menu Only If Logged In */}
        {loggedIn && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menu Items (Right Side) */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myprojects">Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notification">Notifications</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/attendance">Attendance</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaves">Leaves</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/manage-my-profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/learnings">Learnings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/complains-and-suggestions">Suggestion & Complains</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
