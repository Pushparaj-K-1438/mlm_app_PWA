import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";

/**
 * Video Player Test Component
 * Use this to test if ReactPlayer works in your environment
 */
export default function VideoPlayerTest() {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  // Test video URLs - replace with your actual URLs
  const testVideos = {
    direct: "https://www.w3schools.com/html/mov_bbb.mp4", // Public test video
    youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll (safe test)
  };

  const [currentVideo, setCurrentVideo] = useState<string>(testVideos.direct);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>ReactPlayer Test Component</h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>Select Test Video:</h3>
        <button onClick={() => setCurrentVideo(testVideos.direct)}>
          Test Direct Video (mp4)
        </button>
        <button onClick={() => setCurrentVideo(testVideos.youtube)} style={{ marginLeft: "10px" }}>
          Test YouTube Video
        </button>
      </div>

      <div style={{ background: "#000", borderRadius: "8px", overflow: "hidden" }}>
        <ReactPlayer
          ref={playerRef}
          url={currentVideo}
          width="100%"
          height="auto"
          playing={playing}
          controls={true}
          playsinline={true}
          onReady={() => console.log("TEST: Player ready")}
          onStart={() => console.log("TEST: Video started")}
          onPlay={() => console.log("TEST: onPlay fired")}
          onPause={() => console.log("TEST: onPause fired")}
          onEnded={() => console.log("TEST: Video ended")}
          onError={(e: any) => console.error("TEST: Error:", e)}
          style={{ maxHeight: "80vh" }}
        />
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPlaying(!playing)}>
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => {
            console.log("=== PLAYER STATE ===");
            console.log("playing:", playing);
            console.log("playerRef.current:", playerRef.current);
            console.log("url:", currentVideo);

            const internal = playerRef.current?.getInternalPlayer?.();
            console.log("internalPlayer:", internal);
            console.log("has playVideo:", typeof internal?.playVideo === "function");
            console.log("has play:", typeof internal?.play === "function");

            alert(
              `Playing: ${playing}\n` +
              `Player Ref: ${playerRef.current ? "EXISTS" : "NULL"}\n` +
              `Internal: ${internal ? "EXISTS" : "NULL"}\n` +
              `Has playVideo: ${typeof internal?.playVideo === "function"}\n` +
              `Has play: ${typeof internal?.play === "function"}`
            );
          }}
        >
          Show Player State
        </button>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", background: "#f0f0f0", borderRadius: "8px" }}>
        <h3>Test Instructions:</h3>
        <ol>
          <li>Select a test video (direct mp4 or YouTube)</li>
          <li>Click Play button</li>
          <li>Check browser console for logs</li>
          <li>Click "Show Player State" to see player info</li>
          <li>Try both video types</li>
        </ol>

        <h4>Expected Results:</h4>
        <ul>
          <li>✅ Console shows "TEST: Player ready"</li>
          <li>✅ Console shows "TEST: Video started" when playing</li>
          <li>✅ Video plays smoothly with audio</li>
          <li>✅ Controls (play/pause/seek) work</li>
        </ul>

        <h4>If It Fails:</h4>
        <ul>
          <li>❌ If console shows errors: Video format not supported</li>
          <li>❌ If no console logs: ReactPlayer not loading</li>
          <li>❌ If player state is NULL: ReactPlayer didn't initialize</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
        <h3>Current Status:</h3>
        <p><strong>Video Type:</strong> {currentVideo.includes("youtube") ? "YouTube" : "Direct MP4"}</p>
        <p><strong>Playing:</strong> {playing ? "YES" : "NO"}</p>
        <p><strong>Player Ref:</strong> {playerRef.current ? "EXISTS" : "NULL"}</p>
        <p><strong>URL:</strong> {currentVideo.substring(0, 60)}...</p>
      </div>
    </div>
  );
}
