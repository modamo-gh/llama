import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	FlatList
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { getMusicItemData } from "./src/services/spotifyService";
import MusicItemComponent from "./src/components/MusicItemComponent";
import Toast from "react-native-toast-message";

type MusicItem = {
	musicItem: string;
	id: string;
	name: string;
	imageURL: string;
	spotifyURI: string;
};

export default function App() {
	const [url, setURL] = useState<string>("");
	const [musicItems, setMusicItems] = useState<MusicItem[]>([]);

	const generateMusicItem = (spotifyURL: string): MusicItem => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return { musicItem, id, name: "", imageURL: "", spotifyURI: "" };
	};

	const showDuplicationToast = () => {
		Toast.show({
			type: "error",
			text1: "Music Item Already Exists in List",
			position: "bottom"
		})
	}

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginTop: 64}}>
				<TextInput
					style={styles.textInput}
					value={url}
					onChangeText={(term: string) => setURL(term)}
					placeholder="Enter a Spotify URL"
					placeholderTextColor="#7D7D7D"
					selectionColor="#1DB954"
				/>
				<TouchableOpacity
					style={styles.addButton}
					onPress={async () => {
						const item = generateMusicItem(url);
						const itemData = await getMusicItemData(item);
						const images =
							item?.musicItem === "track"
								? itemData.album.images
								: itemData.images;
						const imageURL =
							images && images.length > 0
								? images[images.length - 1].url
								: null;
						const updatedMusicItem = {
							...item,
							name: itemData.name,
							imageURL: imageURL,
							spotifyURI: itemData.uri
						};

						let updatedMusicItems;

						if (musicItems.find(
							(musicItem) => updatedMusicItem.id === musicItem.id
						)) { updatedMusicItems = [...musicItems]; showDuplicationToast() }
						else {
							updatedMusicItems = [
								...musicItems,
								updatedMusicItem
							]
						}

						setMusicItems(updatedMusicItems);
					}}
				>
					<FontAwesomeIcon
						icon={faPlus}
						size={24}
					/>
				</TouchableOpacity></View>
			{musicItems ? (
				<FlatList
					style={{ width: "100%" }}
					data={musicItems}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => {
						return <MusicItemComponent musicItem={item} />;
					}}
				/>
			) : null}
			<Toast />
		</View>
	);
}

const styles = StyleSheet.create({
	addButton: {
		height: 48,
		width: 48,
		backgroundColor: "#1DB954",
		borderRadius: 48,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
		justifyContent: "center"
	},
	textInput: {
		flex: 1,
		marginHorizontal: 16,
		height: 48,
		borderColor: "#1DB954",
		borderWidth: 1,
		borderRadius: 5,
		color: "#FCFCFC",
		paddingHorizontal: 8
	}
});
