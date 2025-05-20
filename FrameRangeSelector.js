import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import { i18n } from './i18n';

const FrameRangeSelector = ({ videoUri, duration, onRangeChange }) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(duration || 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{i18n.t('selectRange')}</Text>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        paused={true}
        resizeMode="contain"
      />
      <Text>Start: {start.toFixed(1)}s</Text>
      <Slider
        minimumValue={0}
        maximumValue={end}
        value={start}
        onValueChange={setStart}
        step={0.1}
      />
      <Text>End: {end.toFixed(1)}s</Text>
      <Slider
        minimumValue={start}
        maximumValue={duration}
        value={end}
        onValueChange={setEnd}
        step={0.1}
      />
      <Button title={i18n.t('selectRange')} onPress={() => onRangeChange({ start, end })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 12, alignItems: 'center' },
  label: { fontWeight: 'bold', marginBottom: 8 },
  video: { width: 240, height: 120, marginBottom: 8 },
});

export default FrameRangeSelector;
