import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarUpload from "../components/AvatarUpload";
import "../styles/auth.css";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile); // MUST MATCH multer
      }

      // DEBUG — TEMPORARY
      for (let pair of formData.entries()) {
        console.log("FORMDATA:", pair[0], pair[1]);
      }

      await api.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-split">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        
        <div className="profile-picture-wrapper">
          <label className="profile-picture-label">Profile Picture</label>
          <AvatarUpload size="sm" onFileSelect={setProfilePhotoFile} />
        </div>

        {error && <div className="error">{error}</div>}

        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
