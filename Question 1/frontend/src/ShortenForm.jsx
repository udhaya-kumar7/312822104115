import React, { useState } from "react";

export default function ShortenForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // your actual token

    try {
      const response = await fetch("http://localhost:5000/api/url/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: originalUrl }), // ✅ FIXED HERE
      });

      const data = await response.json();
      setShortUrl(data.shortUrl || "Error creating short URL.");
    } catch (error) {
      setShortUrl("Error connecting to server.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="Enter URL to shorten"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        required
      />
      <button type="submit">Shorten</button>
      {shortUrl && (
        <p className="result">
          Short URL: <a href={shortUrl} target="_blank">{shortUrl}</a>
        </p>
      )}
    </form>
  );
}
