import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const MyProjects = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    const getProjects = async (userId) => {
        if (!userId) return;
        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-my-projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userId }),
            });
            let data = await req.json();
            if (req.ok) {
                setProjects(data.projects || []);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert("Failed to fetch projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp = JSON.parse(usr);
            setUser(tmp);
            getProjects(tmp._id);
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2 className="text-center">📌 My Projects</h2>

                {loading ? (
                    <div className="text-center mt-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Active Projects */}
                        <div className="mt-4">
                            <h4>📌 Active Projects</h4>
                            {projects.some((p) => p.is_Active) ? (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-primary">
                                            <tr>
                                                <th>Title</th>
                                                <th>Type</th>
                                                <th>Deadline</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects
                                                .filter((p) => p.is_Active)
                                                .map((p) => (
                                                    <tr key={p._id} onClick={() => setSelectedProject(p)} data-bs-toggle="modal" data-bs-target="#projectModal" className="clickable-row">
                                                        <td>{p.Title}</td>
                                                        <td>{p.ProjectType}</td>
                                                        <td>{p.Deadline}</td>
                                                        <td><span className="badge bg-warning text-dark">Pending</span></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">No active projects found.</p>
                            )}
                        </div>

                        {/* Closed Projects */}
                        <div className="mt-5">
                            <h4>✅ Closed Projects</h4>
                            {projects.some((p) => !p.is_Active) ? (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Title</th>
                                                <th>Type</th>
                                                <th>Deadline</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects
                                                .filter((p) => !p.is_Active)
                                                .map((p) => (
                                                    <tr key={p._id} onClick={() => setSelectedProject(p)} data-bs-toggle="modal" data-bs-target="#projectModal" className="clickable-row">
                                                        <td>{p.Title}</td>
                                                        <td>{p.ProjectType}</td>
                                                        <td>{p.Deadline}</td>
                                                        <td><span className="badge bg-danger">Closed</span></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">No closed projects found.</p>
                            )}
                        </div>
                    </>
                )}

                {/* Bootstrap Modal (Without react-bootstrap) */}
                <div className="modal fade" id="projectModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">📌 {selectedProject?.Title || "Project Details"}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Type:</strong> {selectedProject?.ProjectType || "N/A"}</p>
                                <p><strong>Deadline:</strong> {selectedProject?.Deadline || "N/A"}</p>
                                <p><strong>Status:</strong> {selectedProject?.is_Active ? <span className="badge bg-warning text-dark">Pending</span> : <span className="badge bg-danger">Closed</span>}</p>
                                <p><strong>Description:</strong> {selectedProject?.Description || "No description available."}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Style for Clickable Rows */}
            <style>
                {`
                .clickable-row {
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .clickable-row:hover {
                    background: #f1f1f1;
                }
                `}
            </style>
        </>
    );
};

export default MyProjects;
