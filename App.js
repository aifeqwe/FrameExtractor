import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VideoPicker from './VideoPicker';
import FrameExtractor from './FrameExtractor';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleExtractionStart = () => {
    setExtracting(true);
  };

  const handleExtractionComplete = () => {
    setExtracting(false);
    setSelectedVideo(null);
  };

  return (
    <View style={styles.container}>
      {!selectedVideo && <VideoPicker onSelect={handleVideoSelect} />}
      {selectedVideo && (
        <FrameExtractor
          video={selectedVideo}
          onExtractionStart={handleExtractionStart}
          onExtractionComplete={handleExtractionComplete}
        />
      )}
      {extracting && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Extracting frames...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.8,
    padding: 10,
  },
  progressText: {
    color: '#fff',
  },
});