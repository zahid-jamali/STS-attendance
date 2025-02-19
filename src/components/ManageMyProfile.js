import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ManageMyProfile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp = JSON.parse(usr);
            setUser(tmp);
            setName(tmp.Name || "");
            setEmail(tmp.Email || "");
            setPhone(tmp.Phone || "");
            setBio(tmp.Bio || "");
        }
    }, [navigate]);

    const updateProfile = async (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            return alert("Passwords do not match!");
        }

        const updatedUser = {
            userId: user._id,
            name,
            email,
            phone,
            bio,
            newPassword: newPassword || undefined,
            oldPassword: newPassword ? oldPassword : undefined,
        };

        let req = await fetch(`${process.env.REACT_APP_API_URLS}/updateUser`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
        });

        if (req.ok) {
            const updatedData = { ...user, Name : name, Email: email, Phone: phone, Bio: bio };
            localStorage.setItem("user", JSON.stringify(updatedData));
            setUser(localStorage);
            setNewPassword(""); setOldPassword(""); setConfirmPassword("");
            alert("Profile updated successfully!");
            navigate("/manage-my-profile")
            
        } else {
            alert("Failed to update the profile.");
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2 className="text-center">Edit Profile</h2>
                <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
                    <form onSubmit={updateProfile}>
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone:</label>
                            <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Biography:</label>
                            <textarea className="form-control" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} required />
                        </div>

                        <hr />
                        <p className="text-muted">To change password, fill the fields below:</p>

                        <div className="mb-3">
                            <label className="form-label">Old Password:</label>
                            <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Password:</label>
                            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password:</label>
                            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ManageMyProfile;
