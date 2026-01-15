import { useRef, useState } from "react";
import "../styles/avatar-upload.css";
import avatarPlaceholder from "../assets/avatar-placeholder.png";

export default function AvatarUpload({ size = "md", onFileSelect }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    if (typeof onFileSelect === "function") {
      onFileSelect(file);
    }
  };

  const sizeClass =
    size === "sm" ? "avatar-sm" : size === "lg" ? "avatar-lg" : "";

  return (
    <label className={`avatar-upload ${sizeClass}`}>
      {preview ? (
        <img src={preview} alt="Avatar preview" />
      ) : (
        <div className="avatar-placeholder">
          <img
            src={avatarPlaceholder}
            alt="Profile placeholder"
            className="avatar-upload img avatar-placeholder-img"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </label>
  );
}
