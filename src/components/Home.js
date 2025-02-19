import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

const Home = () => {
    const [loc, setLoc] = useState(null);
    const fixedLoc = useMemo(()=>[26.25219994915647, 68.3927160944268], []) ;
    const [distance, setDistance] = useState(100);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [projects, setProjects]=useState([]);
    const [selectedProject, setSelectedProject]=useState();
    const [works, setWorks]=useState();

    const markEntry = async () => {
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

    const markExit = async () => {
        if(!selectedProject || !works){
            return alert(`Please show you work `);
        }
        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/exit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id , projectId:selectedProject, works:works}),
            });
            const data = await req.json();
            Swal.fire("Exit Marked!", data.message, "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to mark exit. Please try again.", "error");
        }
    };

    const getProjects=async (userId)=>{
        if(!userId) return;
        let req=await fetch(`${process.env.REACT_APP_API_URLS}/get-my-projects`, {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({user: userId})
        })
        let data=await req.json();
        if(req.ok){
            setProjects(data);
        }
        else{
            alert(data.message);
        }
    }

    

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp=JSON.parse(usr)
            setUser(tmp);
            getProjects(tmp._id);
        }
       

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoc([latitude, longitude]);
                },
                (error) => console.error("Error getting location:", error)
            );
            if (loc) {
                const dist = L.latLng(fixedLoc).distanceTo(loc);
                setDistance(dist.toFixed(2));
            }
        }
    }, [navigate]);

    useEffect(()=>{
        if(user){
            getProjects();
        }
    }, [user])



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
                    {/* <p className="lead">
                        <strong>Distance:</strong> {distance ? `${distance} meters` : "Calculating..."}
                    </p> */}

                    {distance <= 50 ? (
                        <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
                            <h4 className="text-success">✅ You are at the required location</h4>
                            <div className="d-flex flex-column align-items-center gap-3 mt-3">
                                <button className="btn btn-success w-100" onClick={markEntry}>Commit Entry</button>
                                <select className="form-select w-100" onChange={(e)=>setSelectedProject(e.target.value)}>
                                    <option value="" >Select a project</option>
                                    {Array.isArray(projects.projects) && projects.projects.map((p) => (
                                        <option key={p._id} value={p._id}>{p.Title}</option>
                                    ))}
                                </select>
                                {/* {JSON.stringify(projects)} */}
                                <textarea className="form-control" placeholder="What did you do today?" rows="3" onChange={(e)=>setWorks(e.target.value)}></textarea>
                                <button className="btn btn-danger w-100" onClick={markExit}>Mark Exit</button>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-danger mt-3" role="alert">
                            ⚠️ Sorry, you are not at the required location.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
