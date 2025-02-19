import { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
const Complains = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp = JSON.parse(usr);
            setUser(tmp);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !desc.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        let req = await fetch(`${process.env.REACT_APP_API_URLS}/create-complain`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ userId: user._id, title, desc }),
        });

        let data = await req.json();
        alert(data.message);
        setTitle(""); // Clear input after submission
        setDesc("");
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="card shadow-lg p-4">
                    <h2 className="text-center text-primary">Submit a Complaint or Suggestion</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="What's the issue?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                placeholder="Provide a detailed description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Complains;
