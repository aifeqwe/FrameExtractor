import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { i18n } from './i18n';

const VideoPicker = ({ onSelect }) => {
  const selectVideo = () => {
    const options = {
      title: i18n.t('selectVideo'),
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'frame-extract',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        Alert.alert(i18n.t('error'), 'Could not select video');
      } else {
        onSelect && onSelect(response.uri || response.path);
      }
    });
  };

  return (
    <View>
      <Button title={i18n.t('selectVideo')} onPress={selectVideo} />
    </View>
  );
};

export default VideoPicker;
