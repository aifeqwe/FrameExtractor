import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import ProgressBar from './ProgressBar';
import { i18n } from './i18n';

const FrameExtractor = ({ videoUri, range, savePath, onExtractionStart, onExtractionComplete }) => {
  const [progress, setProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);

  const handleExtractFrames = async () => {
    setExtracting(true);
    onExtractionStart && onExtractionStart();
    setProgress(0);
    try {
      const { start, end } = range;
      // ffmpeg command to extract frames in range
      const cmd = `-ss ${start} -to ${end} -i "${videoUri}" -vf fps=1 "${savePath}/frame_%04d.png"`;
      await FFmpegKit.executeAsync(cmd, async (session) => {
        const returnCode = await session.getReturnCode();
        setExtracting(false);
        if (returnCode.isValueSuccess()) {
          Alert.alert(i18n.t('success'));
          onExtractionComplete && onExtractionComplete();
        } else {
          Alert.alert(i18n.t('error'));
        }
      }, (log) => {}, (stat) => {
        if (stat && stat.time) {
          setProgress(Math.min(100, (stat.time / (end - start)) * 100));
        }
      });
    } catch (e) {
      setExtracting(false);
      Alert.alert(i18n.t('error'), e.message);
    }
  };

  return (
    <View>
      <Button title={i18n.t('extractFrames')} onPress={handleExtractFrames} disabled={extracting} />
      {extracting && <ProgressBar progress={progress} />}
    </View>
  );
};

export default FrameExtractor;