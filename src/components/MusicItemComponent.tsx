import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {
	Image,
	ImageStyle,
	Linking,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";

type MusicItem = {
	id: string;
	imageURL: string;
	musicItem: string;
	name: string;
	spotifyURI: string;
};

type MusicItemProps = {
	handleDelete: (a: number) => void;
	musicItem: MusicItem;
};

const MusicItemComponent: React.FC<MusicItemProps> = ({
	handleDelete,
	musicItem
}) => {
	const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

	const renderLeft = (progress: SharedValue<number>, dragX: SharedValue<number>) => {
		const animatedStyle = useAnimatedStyle(() => ({
			transform: [
			  {
				translateX: interpolate(
				  dragX.value,
				  [0, 50, 100],
				  [-100, -50, 0],
				  Extrapolation.CLAMP
				),
			  },
			],
		  }));
		return (
			<AnimatedTouchableOpacity
				onPress={handleDelete}
				style={[
					{
						backgroundColor: "#BC4749",
						width: 100,
						justifyContent: "center",
						alignItems: "center"
					}, animatedStyle]
				}
			>
				<Text style={styles.text}>Delete</Text>
			</AnimatedTouchableOpacity>
		);
	};

	const renderRight = () => {};
	
	return (
		<Swipeable
			renderLeftActions={renderLeft}
			renderRightActions={renderRight}
			overshootLeft={false}
		>
			<View style={styles.card}>
				<Image
					source={{ uri: musicItem.imageURL }}
					style={styles.image}
				/>
				<View
					style={{ flex: 1, padding: 16, justifyContent: "center" }}
				>
					<Text style={styles.text}>{musicItem.name}</Text>
					<Text style={{ color: "#7D7D7D", paddingTop: 4 }}>
						{musicItem.musicItem}
					</Text>
				</View>
				<TouchableOpacity
					style={styles.playButton}
					onPress={async () => Linking.openURL(musicItem.spotifyURI)}
				>
					<FontAwesomeIcon
						icon={faPlay}
						size={24}
					/>
				</TouchableOpacity>
			</View>
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	card: {
		height: 96,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	image: {
		height: 64,
		width: 64,
		margin: 1,
		marginLeft: 16,
		borderRadius: 5
	} as ImageStyle,
	text: {
		fontSize: 20,
		color: "#FCFCFC"
	},
	playButton: {
		height: 48,
		width: 48,
		backgroundColor: "#1DB954",
		borderRadius: 24,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default MusicItemComponent;
