import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	Keyboard,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import Toast from "react-native-toast-message";
import MusicItemComponent from "./src/components/MusicItemComponent";
import { getMusicItemData } from "./src/services/spotifyService";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";

type MusicItem = {
	id: string;
	imageURL: string;
	musicItem: string;
	name: string;
	spotifyURI: string;
	spotifyURL: string;
};

const toastConfig = {
	duplicate: ({ text1 }) => (
		<View
			style={{
				borderColor: "#1DB954",
				borderWidth: 2,
				height: 48,
				width: "80%",
				backgroundColor: "#121212",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 5
			}}
		>
			<Text style={{ color: "#FCFCFC", fontSize: 20 }}>{text1}</Text>
		</View>
	),
	episode: ({ text1 }) => (
		<View
			style={{
				borderColor: "#1DB954",
				borderWidth: 2,
				height: 48,
				width: "80%",
				backgroundColor: "#121212",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 5
			}}
		>
			<Text style={{ color: "#FCFCFC", fontSize: 20 }}>{text1}</Text>
		</View>
	)
};

const App = () => {
	const [url, setURL] = useState<string>("");
	const [musicItems, setMusicItems] = useState<MusicItem[]>([]);

	const generateMusicItem = (spotifyURL: string): MusicItem => {
		const splitURL = spotifyURL.split("/");
		const musicItem = splitURL[3];
		const id = splitURL[4].split("?")[0];

		return { musicItem, id, name: "", imageURL: "", spotifyURI: "", spotifyURL };
	};

	const showDuplicationToast = () => {
		Toast.show({
			type: "duplicate",
			text1: "Music Item Already Exists in List",
			position: "bottom"
		});
	};

	const showEpisodeToast = () => {
		Toast.show({
			type: "episode",
			text1: "Sorry, can't add episodes right now.",
			position: "bottom"
		});
	};

	const addMusicItem = async () => {
		Keyboard.dismiss();

		const item = generateMusicItem(url);

		if (item.musicItem === "episode") {
			showEpisodeToast();
		}
		else {
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

			if (
				musicItems.find(
					(musicItem) =>
						updatedMusicItem.id === musicItem.id
				)
			) {
				updatedMusicItems = [...musicItems];
				showDuplicationToast();
			} else {
				updatedMusicItems = [
					...musicItems,
					updatedMusicItem
				];
			}

			setURL("");

			try {
				await AsyncStorage.setItem(
					"musicItems",
					JSON.stringify(updatedMusicItems)
				);
				setMusicItems(updatedMusicItems);
			} catch (error) {
				console.error(
					"Something went wrong adding music item:",
					error
				);
			}
		}
	}

	const getMusicItems = async () => {
		try {
			const storedMusicItems = await AsyncStorage.getItem("musicItems");

			if (storedMusicItems) {
				setMusicItems(JSON.parse(storedMusicItems));
			}
		} catch (error) {
			console.log("Something went wrong retrieving music items:", error);
		}
	};

	const handleDelete = async (index: number) => {
		const musicItemsCopy = [...musicItems];
		musicItemsCopy.splice(index, 1);

		try {
			await AsyncStorage.setItem(
				"musicItems",
				JSON.stringify(musicItemsCopy)
			);
			setMusicItems(musicItemsCopy);
		} catch (error) {
			console.error("Something went wrong deleting music item:", error);
		}
	};

	useEffect(() => {
		getMusicItems();
	}, []);

	return (
		<GestureHandlerRootView>
			<View style={styles.container}>
				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
						marginBottom: 8,
						marginTop: 64,
						width: "100%"
					}}
				>
					<TextInput
						onChangeText={(term: string) => setURL(term)}
						placeholder="Enter a Spotify URL"
						placeholderTextColor="#7D7D7D"
						selectionColor="#1DB954"
						style={styles.textInput}
						value={url}
						onEndEditing={addMusicItem}
					/>
					<TouchableOpacity
						onPress={addMusicItem}
						style={styles.addButton}
					>
						<FontAwesomeIcon
							icon={faPlus}
							size={24}
						/>
					</TouchableOpacity>
				</View>
				{musicItems ? (
					<FlatList
						data={musicItems}
						keyExtractor={(item) => item.id}
						style={{ width: "100%" }}
						renderItem={({ item, index }) => {
							return (
								<MusicItemComponent
									musicItem={item}
									handleDelete={() => handleDelete(index)}
								/>
							);
						}}
					/>
				) : null}
				<Toast config={toastConfig} />
			</View>
		</GestureHandlerRootView >
	);
};

const styles = StyleSheet.create({
	addButton: {
		alignItems: "center",
		backgroundColor: "#1DB954",
		borderRadius: 48,
		display: "flex",
		height: 48,
		justifyContent: "center",
		width: 48, marginRight: 16
	},
	container: {
		alignItems: "center",
		backgroundColor: "#121212",
		flex: 1,
		justifyContent: "center"
	},
	textInput: {
		borderColor: "#1DB954",
		borderRadius: 5,
		borderWidth: 1,
		color: "#FCFCFC",
		flex: 1,
		height: 48,
		marginHorizontal: 16,
		paddingHorizontal: 8
	}
});

export default App;
