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
import MusicItemComponent from "./src/components/MusicItemComponent";

type MusicItem = {
	musicItem: string;
	id: string;
	name: string;
	imageURL: string
}

export default function App() {
	const [url, setURL] = useState<string>("");
	const [musicItem, setMusicItem] = useState<MusicItem>();

	const generateMusicItem = (spotifyURL: string): MusicItem => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return { musicItem, id, name: "", imageURL: "" };
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
					const item = generateMusicItem(url);
					setMusicItem(item);

					const itemData = await getMusicItemData(item);
					console.log(itemData)
					const images = musicItem?.musicItem === "track" ? itemData.album.images : itemData.images;
					const updatedMusicItem = {...item, name: itemData.name, imageURL: images[0].url};
					setMusicItem(updatedMusicItem);
				}}
			>
				<FontAwesomeIcon
					icon={faPlay}
					size={48}
				/>
			</TouchableOpacity>
			{musicItem ? <MusicItemComponent musicItem={musicItem} /> : null}
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
