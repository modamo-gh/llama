import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	FlatList
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
	imageURL: string;
	spotifyURI: string;
}

export default function App() {
	const [url, setURL] = useState<string>("");
	const [musicItems, setMusicItems] = useState<MusicItem[]>([]);

	const generateMusicItem = (spotifyURL: string): MusicItem => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return { musicItem, id, name: "", imageURL: "", spotifyURI: "" };
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
					const itemData = await getMusicItemData(item);
					console.log(itemData)
					const images = item?.musicItem === "track" ? itemData.album.images : itemData.images;
					const imageURL = images && images.length > 0 ? images[images.length - 1].url : null;
					const updatedMusicItem = { ...item, name: itemData.name, imageURL: imageURL, spotifyURI: itemData.uri };
					const updatedMusicItems = [...musicItems, updatedMusicItem];
					setMusicItems(updatedMusicItems);
				}}
			>
				<FontAwesomeIcon
					icon={faPlay}
					size={48}
				/>
			</TouchableOpacity>
			{musicItems ? (<FlatList style={{ width: "100%" }} data={musicItems} keyExtractor={item => item.id} renderItem={({ item }) => { return <MusicItemComponent musicItem={item} /> }} />) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
		justifyContent: "center"
	},
	playButton: {
		height: 96,
		width: 96,
		backgroundColor: "#1DB954",
		borderRadius: 48,
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
		marginHorizontal: 16,
		marginTop: 64
	}
});
