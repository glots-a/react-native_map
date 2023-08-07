import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { AntDesign } from '@expo/vector-icons';

const GOOGLE_API_KEY = 'AIzaSyCMrMUK13u0JzReaVOmnLXLhrpv9FWxp8o';

type Props = {
  label: string;
  isInputValue: boolean;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
  onReset: () => void;
};

interface AutocompleteProps {
  setAddressText: (value: string) => void;
}

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
  isInputValue,
  onReset,
}: Props) {
  let autocompleteRef: AutocompleteProps | null = null;

  const handleClearButtonPress = () => {
    if (autocompleteRef) {
      autocompleteRef.setAddressText(''); // Set the value of the input to an empty string
    }
    onReset();
  };

  return (
    <View style={styles.subcomtainer}>
      <Text style={styles.labelText}>{label}</Text>
      <GooglePlacesAutocomplete
        ref={(ref) => (autocompleteRef = ref)}
        minLength={2}
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ''}
        fetchDetails
        onPress={(_, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'ua',
        }}
      />
      {isInputValue && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearButtonPress}
        >
          <AntDesign name="closecircleo" size={22} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2B2B2B',

    color: 'white',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 29,
  },
  labelText: {
    color: 'white',
  },
  subcomtainer: {
    position: 'relative',
  },
});

export default InputAutocomplete;
