import { useEffect, useState } from "react";
import Swal from "sweetalert2";



const CreateProject = () => {
    const [title, setTitle]=useState("");
    const [type, setType]=useState("");
    const [desc, setDesc]=useState("");
    const [is_active, setIsActive]=useState(false);
    
    const [team, setTeam] = useState([]);
    const [deadline, setDeadline]=useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [users, setUsers]=useState([]);




    const getUsers=async()=>{
        let req=await fetch(`${process.env.REACT_APP_API_URLS}/getAllUsers`);
        if(req.ok){
            let data=await req.json();
            setUsers(data);
        }
    }

    const handleRequest=async ()=>{
        let req= await fetch(`${process.env.REACT_APP_API_URLS}/create-project`, {
            method:"POST",
            headers:{
                "Content-type": "application/json",
            },
            body:JSON.stringify({
                title: title,
                type: type,
                desc: desc, 
                deadline: deadline,
                team: team,
                is_active: is_active,
            })
        });
        let data=await req.json();
        if(req.ok){
            Swal.fire({
                title: "Successfully!",
                text: data.message,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
        }
        else{
            Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Close",
            });
        }
    }

    // Add member to team
    const handleAddMember = () => {
        if (!selectedUser) return;
        const userToAdd = users.find((user) => user._id === (selectedUser));

        // Avoid duplicates
        if (userToAdd && !team.some((member) => member._id === userToAdd._id)) {
            setTeam([...team, userToAdd]);
        }
    };

    // Remove member from team
    const handleRemoveMember = (id) => {
        setTeam(team.filter((member) => member._id !== id));
    };


    useEffect(()=>{
        getUsers();
    }, [])

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Initialize Project</h2>

                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input type="text" className="form-control" placeholder="Enter project name" onChange={(e)=>setTitle(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Project Type</label>
                    <select className="form-select" onChange={(e)=>setType(e.target.value)}>
                        <option>Mobile Application</option>
                        <option>Web Application</option>
                        <option>Graphic Designing</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" placeholder="Enter project description" onChange={(e)=>setDesc(e.target.value)}></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Project Deadline</label>
                    <input
                        type="date"
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().split("T")[0]} // Prevents past dates
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Add Team Members</label>
                    <div className="input-group">
                        <select className="form-select" onChange={(e) => setSelectedUser(e.target.value)}>
                            <option value="">Select a team member</option>
                            {users.map((usr) => (
                                <option key={usr._id} value={usr._id}>
                                    {usr.Name}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-primary" onClick={handleAddMember}>
                            Add
                        </button>
                    </div>
                </div>

                <h4 className="mt-4">Team Members</h4>
                <div className="mt-2">
                    {team.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {team.map((member) => (
                                <span key={member._id} className="badge bg-info p-2 m-1">
                                    {member.Name}{" "}
                                    <button
                                        className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleRemoveMember(member._id)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No team members added</p>
                    )}
                </div>
                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="is_admin" checked={is_active} onChange={(e) => setIsActive(e.target.checked)} />
                    <label className="form-check-label" htmlFor="is_admin">Activate it</label>
                </div>
                <div className="mt-4 text-center">
                    <button className="btn btn-success" onClick={handleRequest}>Create Project</button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
