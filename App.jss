import React, { useState, useRef } from "react";
import VideoSelector from "./VideoSelector";
import FrameSelector from "./FrameSelector";
import ProgressBar from "./ProgressBar";
import FrameExtractor from "./FrameExtractor";
import Notification from "./Notification";
import Settings from "./Settings";
import { getFramesFromVideo } from "./utils";

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [settings, setSettings] = useState({
    outputFormat: "jpeg",
    frameRate: 1,
    quality: 0.92,
  });

  const videoRef = useRef(null);

  const handleVideoSelect = (videoFile) => {
    setSelectedVideo(videoFile);
    setSelectedFrame(null);
    setNotification(null);
  };

  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleStartProcessing = () => {
    setProcessing(true);

    getFramesFromVideo(selectedVideo, settings)
      .then((frames) => {
        setProcessing(false);
        setSelectedFrame(frames[0]);
        setNotification(`Successfully extracted ${frames.length} frames.`);
      })
      .catch((error) => {
        setProcessing(false);
        setNotification(`Error: ${error.message}`);
      });
  };

  return (
    <div className="app">
      <h1>Video Frame Extractor</h1>
      <VideoSelector onVideoSelect={handleVideoSelect} />
      <FrameSelector
        selectedFrame={selectedFrame}
        onSelect={handleFrameSelect}
        videoRef={videoRef}
      />
      <Settings settings={settings} onChange={handleSettingsChange} />
      <button
        className="button"
        onClick={handleStartProcessing}
        disabled={!selectedVideo || processing}
      >
        {processing ? "Processing..." : "Extract Frames"}
      </button>
      <ProgressBar />
      {notification && <Notification message={notification} />}
      <FrameExtractor
        videoFile={selectedVideo}
        videoRef={videoRef}
        settings={settings}
        onFrameExtracted={(frame) => {
          setNotification("Frame extracted successfully!");
          setSelectedFrame(frame);
        }}
        onExtractionError={(error) => {
          setNotification(`Error: ${error.message}`);
        }}
      />
    </div>
  );
}

export default App;