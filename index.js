import { AppRegistry } from 'react-native';
import App from './App';
import ImagePicker from 'react-native-image-picker';

AppRegistry.registerComponent('FrameExtractor', () => App);

ImagePicker.launchImageLibrary({}, (response) => {
  console.log('Response = ', response);
 
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else {
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
 
    this.setState({
      imageSource: source,
    });
  }
});