import { useState, useRef } from "react";
import axios from "axios";
import api from "../services/api";

const STEPS = ["Preparing", "Uploading Audio", "Uploading Cover", "Saving Metadata"];

function UploadSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [audioDrag, setAudioDrag] = useState(false);
  const [coverDrag, setCoverDrag] = useState(false);
  const audioRef = useRef();
  const coverRef = useRef();

  // Helper function to upload file directly to Cloudinary
  const uploadToCloudinaryDirect = async (file, folder, resourceType, onProgress) => {
    const token = localStorage.getItem("token");
    
    // 1. Get secure signature from backend
    const { data: sigData } = await api.get(`/songs/signature?folder=${folder}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { signature, timestamp, cloudName, apiKey } = sigData;

    // 2. Prepare Form Data for Cloudinary (Signed Upload)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    // 3. Post to Cloudinary direct upload endpoint
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) { setError("Please select an audio file."); return; }
    if (!title.trim()) { setError("Title is required."); return; }

    setError("");
    setUploading(true);
    setProgress(0);
    setStepIndex(0);
    setSuccess(false);

    try {
      // Step 0: Preparing
      setStepIndex(0);
      setProgress(5);

      // Step 1: Uploading Audio
      setStepIndex(1);
      const audioUrl = await uploadToCloudinaryDirect(
        audioFile,
        "songs",
        "video", // Cloudinary treats MP3s as "video" or "auto"
        (pct) => setProgress(pct)
      );

      // Step 2: Uploading Cover (if exists)
      let coverImagePct = 0;
      let coverUrl = "";
      if (coverImage) {
        setStepIndex(2);
        setProgress(0);
        coverUrl = await uploadToCloudinaryDirect(
          coverImage,
          "covers",
          "image",
          (pct) => setProgress(pct)
        );
      }

      // Step 3: Saving Metadata to local MongoDB
      setStepIndex(3);
      setProgress(95);

      const token = localStorage.getItem("token");
      await api.post("/songs", {
        title,
        artist,
        audioUrl,
        coverImage: coverUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProgress(100);
      setSuccess(true);
      setUploading(false);

      // Reset form fields
      setTimeout(() => {
        setTitle(""); setArtist("");
        setAudioFile(null); setCoverImage(null);
        setProgress(0); setStepIndex(0); setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error(err);
      setUploading(false);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Upload failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-card-header">
          <h1 className="upload-card-title">Direct Upload Song ⚡</h1>
          <p className="upload-card-subtitle">Uploads directly to Cloudinary (no server double-upload!)</p>
        </div>

        {success ? (
          <div className="upload-success fade-in">
            <div className="upload-success-icon">🎉</div>
            <div className="upload-success-title">Upload Complete!</div>
            <div className="upload-success-sub">Your song is now live in the library</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error" style={{ marginBottom: 18 }}>{error}</div>}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Song Title *</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Artist */}
            <div className="form-group">
              <label className="form-label">Artist Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Audio File */}
            <div className="form-group">
              <label className="form-label">Audio File * (MP3, WAV, up to 50 MB)</label>
              <div
                className={`file-drop-zone ${audioDrag ? "dragging" : ""} ${audioFile ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setAudioDrag(true); }}
                onDragLeave={() => setAudioDrag(false)}
                onDrop={(e) => {
                  e.preventDefault(); setAudioDrag(false);
                  const f = e.dataTransfer.files[0];
                  if (f && f.type.startsWith("audio/")) setAudioFile(f);
                }}
              >
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  disabled={uploading}
                />
                <div className="file-drop-icon">🎵</div>
                <div className="file-drop-label">
                  {audioFile ? "Audio selected" : "Drop audio file here"}
                </div>
                {audioFile ? (
                  <div className="file-drop-name">
                    {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(1)} MB)
                  </div>
                ) : (
                  <div className="file-drop-hint">or click to browse</div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="form-group">
              <label className="form-label">Cover Image (optional)</label>
              <div
                className={`file-drop-zone ${coverDrag ? "dragging" : ""} ${coverImage ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setCoverDrag(true); }}
                onDragLeave={() => setCoverDrag(false)}
                onDrop={(e) => {
                  e.preventDefault(); setCoverDrag(false);
                  const f = e.dataTransfer.files[0];
                  if (f && f.type.startsWith("image/")) setCoverImage(f);
                }}
              >
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  disabled={uploading}
                />
                <div className="file-drop-icon">🖼️</div>
                <div className="file-drop-label">
                  {coverImage ? "Cover selected" : "Drop cover image here"}
                </div>
                {coverImage ? (
                  <div className="file-drop-name">{coverImage.name}</div>
                ) : (
                  <div className="file-drop-hint">JPG, PNG, WEBP supported</div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="progress-wrapper">
                <div className="progress-header">
                  <span className="progress-label">
                    {STEPS[stepIndex]}…
                  </span>
                  <span className="progress-pct">{progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-steps">
                  {STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={`progress-step ${i === stepIndex ? "active" : ""} ${i < stepIndex ? "done" : ""}`}
                    >
                      <span className="progress-step-dot" />
                      {i < stepIndex ? "✓ " : ""}{step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={uploading || !audioFile}
              style={{ marginTop: uploading ? 20 : 28 }}
            >
              {uploading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                  Uploading…
                </span>
              ) : "Upload Song"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UploadSong;