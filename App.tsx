import { StyleSheet, TextInput, View, TouchableOpacity, Linking } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import React, { useState } from "react";

export default function App() {
  const [url, setURL] = useState<string>("");
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} value={url} onChangeText={(term: string) => setURL(term)} />
      <TouchableOpacity style={styles.playButton} onPress={() => Linking.openURL(url)}>
        <FontAwesomeIcon icon={faPlay} size={48} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    height: 96,
    width: 96,
    backgroundColor: "#1DB954",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    width: "75%",
    height: 48,
    borderColor: "#1DB954",
    borderWidth: 1,
    borderRadius: 5, margin: 16
  }
});
