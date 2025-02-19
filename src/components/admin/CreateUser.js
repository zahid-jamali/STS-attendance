import React, { useState } from "react";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [roll, setRoll] = useState("");
  const [is_active, setIsActive] = useState(false);
  const [is_admin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const userData = { name, email, phone, bio, roll, is_active, is_admin, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URLS}/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message || "User created successfully!" });
        setName("");
        setEmail("");
        setPhone("");
        setBio("");
        setRoll("");
        setIsActive(false);
        setIsAdmin(false);
        setPassword("");
      } else {
        setMessage({ type: "danger", text: result.message || "Error creating user!" });
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center text-primary">Create User</h2>
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Roll</label>
            <input type="text" className="form-control" value={roll} onChange={(e) => setRoll(e.target.value)} required/>
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="is_active" checked={is_active} onChange={(e) => setIsActive(e.target.checked)} />
            <label className="form-check-label" htmlFor="is_active">Active</label>
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="is_admin" checked={is_admin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <label className="form-check-label" htmlFor="is_admin">Admin</label>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
