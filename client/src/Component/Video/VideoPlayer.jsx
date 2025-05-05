import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
  faCog,
  faTrashAlt, // Added trash icon for delete
} from "@fortawesome/free-solid-svg-icons";
import "./VideoPlayer.css";
import { deletevideo } from "../../Api";

const qualityOptions = ["1080p", "720p", "480p", "320p"];

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const [quality, setQuality] = useState("720p");
  const [videoSrc, setVideoSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    setVideoSrc(`/uploads/qualities/${videoId}-${quality}.mp4`);
  }, [quality, videoId]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleProgressBarChange = (e) => {
    const newTime = e.target.value;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleQualityChange = (selectedQuality) => {
    const wasPlaying = isPlaying;
    const time = videoRef.current.currentTime;

    setQuality(selectedQuality);

    // Wait until video src updates, then resume at the correct time
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        if (wasPlaying) {
          videoRef.current.play();
        }
      }
    }, 200);

    setShowQualityMenu(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (confirmDelete) {
      try {
        await deletevideo(videoId); // Call the delete video API
        alert("Video deleted successfully.");
        // Redirect or update the UI to reflect the deletion
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete the video.");
      }
    }
  };

  return (
    <div className="video-player-wrapper">
      <video
        ref={videoRef}
        src={videoSrc}
        controls={false}
        className="video-player"
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="custom-video-controls">
        {/* Left Side - Playback Controls */}
        <div className="controls-left">
          <div className="playback-controls">
            <button className="play-pause-btn" onClick={handlePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <input
              type="range"
              value={currentTime}
              min="0"
              max={videoRef.current?.duration || 100}
              onChange={handleProgressBarChange}
              className="progress-bar"
            />
          </div>
        </div>

        {/* Right Side - Volume, Quality, Fullscreen, Delete */}
        <div className="controls-right">
          <div className="volume-controls">
            <button
              className="volume-btn"
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
            >
              <FontAwesomeIcon
                icon={volume === 0 ? faVolumeMute : faVolumeUp}
              />
            </button>
            <input
              type="range"
              value={volume}
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
              className="volume-bar"
            />
          </div>

          <div className="quality-popup-wrapper">
    <button
        className="settings-btn"
        onClick={() => setShowQualityMenu(!showQualityMenu)}
    >
        <FontAwesomeIcon icon={faCog} />
    </button>

    {showQualityMenu && (
        <div className="quality-popup">
            {qualityOptions.map((q) => (
                <div
                    key={q}
                    className={`quality-option ${q === quality ? 'selected' : ''}`}
                    onClick={() => handleQualityChange(q)}
                >
                    {q}
                </div>
            ))}

            <div className="dropdown-divider" />

            <div
                className="quality-option delete-option"
                onClick={handleDelete}
            >
                <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "8px" }} />
                
            </div>
        </div>
    )}
</div>


          <div className="fullscreen-btn">
            <button onClick={handleFullscreen}>
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
