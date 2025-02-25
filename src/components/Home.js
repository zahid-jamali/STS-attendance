import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

const Home = () => {
    const [loc, setLoc] = useState(null);
    const fixedLoc = useMemo(() => [26.25219994915647, 68.3927160944268], []);
    const [distance, setDistance] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [works, setWorks] = useState("");

    // Function to get user's projects
    const getProjects = async (userId) => {
        if (!userId) return;
        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/get-my-projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userId }),
            });
            const data = await req.json();
            if (req.ok) {
                setProjects(data.projects || []);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // Function to mark entry
    const markEntry = async () => {
        if (!user) return;
        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/entry`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id }),
            });
            const data = await req.json();
            Swal.fire("Entry Marked!", data.message, "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to mark entry. Please try again.", "error");
        }
    };

    // Function to mark exit
    const markExit = async () => {
        if (!selectedProject || !works) {
            return Swal.fire("Warning", "Please select a project and describe your work.", "warning");
        }
        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/exit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, projectId: selectedProject, works }),
            });
            const data = await req.json();
            Swal.fire("Exit Marked!", data.message, "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to mark exit. Please try again.", "error");
        }
    };

    // Effect to handle user authentication and fetch projects
    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            const tmp = JSON.parse(usr);
            setUser(tmp);
            getProjects(tmp._id);
        }
    }, [navigate]);

    // Effect to track location updates and update state
    useEffect(() => {
        if (navigator.geolocation) {
            const geoWatch = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoc([latitude, longitude]);
                },
                (error) => console.error("Error getting location:", error),
                {
                    enableHighAccuracy: true, // Enable high accuracy
                    timeout: 5000, // Maximum time to wait for a location
                    maximumAge: 0, // Do not use a cached position
                }
            );
            return () => navigator.geolocation.clearWatch(geoWatch);
        }
    }, []);

    // Effect to update distance when location changes
    useEffect(() => {
        if (loc) {
            const dist = L.latLng(fixedLoc).distanceTo(loc);
            setDistance(dist.toFixed(2));
        }
    }, [loc, fixedLoc]);

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2 className="text-center mb-4">📍 Attendance Manager</h2>

                {loc && (
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-6">
                            <div className="map-container rounded shadow" style={{ overflow: "hidden", borderRadius: "10px" }}>
                                <MapContainer center={loc} zoom={13} style={{ width: "100%", height: "400px" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                                    <Marker position={fixedLoc}>
                                        <Popup>Fixed Position</Popup>
                                    </Marker>
                                    <Circle center={loc} radius={20} color="blue" />
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center">
                    {distance <= 50 ? (
                        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
                            <h4 className="text-success">✅ You are at the required location</h4>
                            <div className="d-flex flex-column align-items-center gap-3 mt-3">
                                <button className="btn btn-success w-100" onClick={markEntry}>Commit Entry</button>
                                <select className="form-select w-100" onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                                    <option value="">Select a project</option>
                                    {Array.isArray(projects) && projects.map((p) => (
                                        <option key={p._id} value={p._id}>{p.Title}</option>
                                    ))}
                                </select>
                                <textarea className="form-control" placeholder="What did you do today?" rows="3" onChange={(e) => setWorks(e.target.value)} value={works}></textarea>
                                <button className="btn btn-danger w-100" onClick={markExit}>Mark Exit</button>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-danger mt-3" role="alert">
                            ⚠️ Sorry, you are not at the required location. {distance}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;