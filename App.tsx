import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Text
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { getMusicItemData } from "./src/services/spotifyService";

type MusicItemData = {
	musicItem: string;
	id: string;
}

export default function App() {
	const [url, setURL] = useState<string>("");
	const [musicItemData, setMusicItemData] = useState<MusicItemData>();

	const generateSpotifyURI = (spotifyURL: string) => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return `spotify:${musicItem}:${id}`;
	}

	const generateMusicItemData = (spotifyURL: string): MusicItemData => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return { musicItem, id };
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.textInput}
				value={url}
				onChangeText={(term: string) => setURL(term)}
			/>
			<TouchableOpacity
				style={styles.playButton}
				onPress={async () => {
					const itemData = generateMusicItemData(url);
					setMusicItemData(itemData)
					await getMusicItemData(itemData)
				}}
			>
				<FontAwesomeIcon
					icon={faPlay}
					size={48}
				/>
			</TouchableOpacity>
			{musicItemData ? (<View><Text>{musicItemData.musicItem}</Text><Text>{musicItemData.id}</Text></View>) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
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
		borderRadius: 5,
		margin: 16
	}
});
