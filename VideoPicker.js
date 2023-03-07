import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const VideoPicker = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const selectVideo = () => {
    const options = {
      title: 'Select a video',
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'frame extractors',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('VideoPicker Error: ', response.error);
        Alert.alert('Error', 'Could not select video');
      } else {
        setSelectedVideo(response);
      }
    });
  };

  return (
    <View>
      <Button title="Select Video" onPress={selectVideo} />
      {selectedVideo && (
        <View>
          <Text>Title: {selectedVideo.fileName}</Text>
          <Text>Duration: {selectedVideo.duration} seconds</Text>
          <Text>Format: {selectedVideo.type}</Text>
          <Text>Codec: {selectedVideo.codec}</Text>
          <Text>Frames per second: {selectedVideo.frameRate}</Text>
          <Text>Number of frames: {selectedVideo.frameCount}</Text>
        </View>
      )}
    </View>
  );
};

export default VideoPicker;
