import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            const data = await req.json();

            if (req.status === 200) {
                localStorage.setItem("user", JSON.stringify(data.usr)); // Ensure consistent key
                navigate(data.usr?.is_Admin ? "/admin" : "/");
            } else {
                alert(data.msg || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user"); // Use localStorage (same as login)
        if (storedUser) {
            const user = JSON.parse(storedUser);
            navigate(user.is_Admin ? "/admin" : "/");
        }
    }, [navigate]); // Only run once on component mount

    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <form onSubmit={handleSubmit} className="bg-white border p-4 rounded shadow" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Login</h2>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </>
    );
};

export default Index;
