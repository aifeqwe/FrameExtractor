import DocumentPicker from 'react-native-document-picker';

export const pickSaveDirectory = async () => {
  try {
    const res = await DocumentPicker.pickDirectory();
    return res.uri || res.fileCopyUri || res;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return null;
    }
    throw err;
  }
};
