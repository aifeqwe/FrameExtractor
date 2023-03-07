import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const VideoSelector = ({ setVideo }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      setSelectedFile(result);
      setVideo(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('No file selected');
      } else {
        Alert.alert('Error selecting file');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={selectFile}>
        <Text style={styles.text}>Select Video</Text>
      </TouchableOpacity>
      {selectedFile && (
        <Text style={styles.fileInfo}>
          Selected File: {selectedFile.name} ({selectedFile.size / 1000000} MB)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#008CBA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  fileInfo: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default VideoSelector;