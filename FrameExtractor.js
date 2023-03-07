import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import ProgressBar from './ProgressBar';

const FrameExtractor = ({ videoUrl, frameRate, onStartExtract, onProgress, onFinishExtract, onError }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [totalFrames, setTotalFrames] = useState(null);
  const [extractedFrames, setExtractedFrames] = useState(0);

  useEffect(() => {
    if (videoUrl) {
      RNFS.stat(videoUrl)
        .then((result) => {
          const { size } = result;
          const fps = frameRate || 1;
          const totalSeconds = Math.floor(duration);
          const totalFrames = Math.floor(totalSeconds * fps);
          const chunkSize = Math.ceil(size / totalFrames);

          setTotalFrames(totalFrames);
          setProgress(0);

          const framesPath = RNFS.DocumentDirectoryPath + '/frames';
          RNFS.exists(framesPath).then((exists) => {
            if (exists) {
              RNFS.unlink(framesPath)
                .then(() => {
                  RNFS.mkdir(framesPath).then(() => {
                    setIsExtracting(true);
                    onStartExtract();
                    extractFrames(chunkSize, fps);
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              RNFS.mkdir(framesPath).then(() => {
                setIsExtracting(true);
                onStartExtract();
                extractFrames(chunkSize, fps);
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          setIsExtracting(false);
          onError(err.message);
        });
    }
  }, [videoUrl]);

  const extractFrames = (chunkSize, fps) => {
    const framesPath = RNFS.DocumentDirectoryPath + '/frames';
    const interval = 1 / fps;
    let nextTime = interval;

    const extractFrame = async (time) => {
      if (time > duration) {
        setIsExtracting(false);
        onFinishExtract(framesPath);
        return;
      }

      try {
        const filePath = `${framesPath}/${Math.round(time * fps)}.png`;
        await RNFS.copyFile(videoUrl, filePath, chunkSize);
        setExtractedFrames((prevFrames) => prevFrames + 1);
        const progress = Math.floor((extractedFrames / totalFrames) * 100);
        setProgress(progress);
        onProgress(progress);
        setCurrentTime(time);
        setTimeout(() => {
          extractFrame(nextTime);
          nextTime += interval;
        }, 0);
      } catch (err) {
        console.log(err);
        setIsExtracting(false);
        onError(err.message);
      }
    };

    extractFrame(0);
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressBarIndicator, { width: progress }]} />
      </View>
    );
  };
  
  const FrameExtractor = ({ videoUri, onProgress, onFinish }) => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    const [isExtracting, setIsExtracting] = useState(false);
  
    const extractFrames = async (videoUri) => {
      setIsExtracting(true);
  
      try {
        const { fps, duration } = await VideoMetaData.get(videoUri);
        const numberOfFrames = Math.floor(fps * duration);
  
        for (let i = 0; i < numberOfFrames; i++) {
          const time = i / fps;
          const imageUri = await VideoThumbnails.getThumbnail(videoUri, { time });
  
          setProgress((i / numberOfFrames) * 100);
          onProgress(i + 1, numberOfFrames, imageUri);
        }
  
        onFinish();
      } catch (error) {
        console.error(error);
      }
  
      setIsExtracting(false);
    };
  
    const handleExtractFrames = async () => {
      await extractFrames(videoUri);
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.extractButton}
          onPress={handleExtractFrames}
          disabled={isExtracting}
        >
          <Text style={styles.extractButtonText}>{isExtracting ? 'Extracting...' : 'Extract Frames'}</Text>
        </TouchableOpacity>
  
        {renderProgressBar()}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    extractButton: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: '#2E2E2E',
    },
    extractButtonText: {
      color: '#FFFFFF',
    },
    progressBar: {
      width: '100%',
      height: 8,
      marginTop: 16,
      backgroundColor: '#EFEFEF',
      borderRadius: 8,
      overflow: 'hidden',
    },
    progressBarIndicator: {
      height: '100%',
      backgroundColor: '#2E2E2E',
    },
  });
   }
  
  export default FrameExtractor;