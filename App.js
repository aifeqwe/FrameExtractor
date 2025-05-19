import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import VideoPicker from './VideoPicker';
import FrameRangeSelector from './FrameRangeSelector';
import FrameExtractor from './FrameExtractor';
import LanguageSwitcher from './LanguageSwitcher';
import { pickSaveDirectory } from './fileUtils';
import { i18n, setI18nConfig } from './i18n';

export default function App() {
  const [videoUri, setVideoUri] = useState(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState(null);
  const [savePath, setSavePath] = useState(null);
  const [step, setStep] = useState(0);

  const handleVideoSelect = (uri) => {
    setVideoUri(uri);
    setStep(1);
    // TODO: Extract duration from video (can use react-native-video or ffprobe)
    setDuration(60); // Placeholder
  };

  const handleRangeSelect = (r) => {
    setRange(r);
    setStep(2);
  };

  const handleSavePath = async () => {
    const path = await pickSaveDirectory();
    if (path) {
      setSavePath(path);
      setStep(3);
    } else {
      Alert.alert(i18n.t('error'), 'No directory selected');
    }
  };

  const handleExtractionComplete = () => {
    setStep(0);
    setVideoUri(null);
    setRange(null);
    setSavePath(null);
  };

  return (
    <View style={styles.container}>
      <LanguageSwitcher onChange={setI18nConfig} />
      {step === 0 && <VideoPicker onSelect={handleVideoSelect} />}
      {step === 1 && videoUri && (
        <FrameRangeSelector videoUri={videoUri} duration={duration} onRangeChange={handleRangeSelect} />
      )}
      {step === 2 && (
        <View>
          <Text>{i18n.t('selectSavePath')}</Text>
          <Text onPress={handleSavePath} style={styles.link}>{i18n.t('selectSavePath')}</Text>
        </View>
      )}
      {step === 3 && videoUri && range && savePath && (
        <FrameExtractor
          videoUri={videoUri}
          range={range}
          savePath={savePath}
          onExtractionComplete={handleExtractionComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  link: { color: '#2196F3', textDecorationLine: 'underline', margin: 12, fontSize: 16 },
});