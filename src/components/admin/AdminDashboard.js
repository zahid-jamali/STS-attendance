import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import CreateUser from "./CreateUser";
import DashboardOverview from "./DashboardOverview";
import CreateProject from "./CreateProject";
import ManageLeaves from "./ManageLeaves";
import ManageProjects from "./ManageProjects";
import ManageComplains from "./ManageComplains";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    let usr = JSON.parse(localStorage.getItem("user"));
    if (!usr) {
      navigate("/login");
    } else if (!usr.is_Admin) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <button className="btn btn-light mb-3" onClick={() => setSidebarOpen(false)}>Close</button>
          <h2 className="text-white">Admin Menu</h2>
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink to="/admin/" className="nav-link text-white">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/create-project" className="nav-link text-white">Create Project</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/manage-projects" className="nav-link text-white">Track Projects</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/create-user" className="nav-link text-white">Add User</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/" className="nav-link text-white">Manage Users</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/manage-leaves" className="nav-link text-white">Holidays & Leaves</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/" className="nav-link text-white">Manage Learnings</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/admin/manage-complains" className="nav-link text-white"> Complains & Suggestions</NavLink>
            </li>

            <li className="nav-item">
              <button className="nav-link text-white" onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ border: "1px solid #ccc", padding: "10px" }}>
        {/* Navbar */}
        <nav className="navbar navbar-light bg-light d-flex justify-content-between">
          {!sidebarOpen && (
            <button className="btn btn-primary" onClick={() => setSidebarOpen(true)}>Menu</button>
          )}
          <span className="navbar-brand mb-0 h1">Sindh Tech Solutions</span>
        </nav>

        {/* Dynamic Content Area */}
        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/manage-leaves" element={<ManageLeaves />} />
            <Route path="/manage-projects" element={<ManageProjects />} />
            <Route path="/manage-complains" element={<ManageComplains />} />
            {/* Default Route */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



// const data = [
//   { name: "Jan", users: 400, sales: 240 },
//   { name: "Feb", users: 300, sales: 139 },
//   { name: "Mar", users: 200, sales: 980 },
//   { name: "Apr", users: 278, sales: 390 },
//   { name: "May", users: 189, sales: 480 },
//   { name: "Jun", users: 239, sales: 380 },
//   { name: "Jul", users: 349, sales: 430 },
// ];
{/* <div className="row">
  <div className="col-md-6">
    <div className="card p-3 shadow-sm">
      <h3 className="card-title">User Growth</h3>
      <LineChart width={400} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
      </LineChart>
    </div>
  </div>
  <div className="col-md-6">
    <div className="card p-3 shadow-sm">
      <h3 className="card-title">Sales Report</h3>
      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </div>
  </div>
</div> */}