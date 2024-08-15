import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type MusicItem = {
	musicItem: string;
	id: string;
	name: string;
	imageURL: string
}

type MusicItemProps = {
    musicItem: MusicItem;
}

const MusicItemComponent: React.FC<MusicItemProps> = ({ musicItem }) => {
    return <View style={styles.card}>
        <Image source={{ uri: musicItem.imageURL }} style={styles.image} />
        <Text style={styles.text}>{musicItem.name}</Text>
    </View>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1DB954",
        borderRadius: "25%",
        height: 96,
        width: "80%",
        margin: 16,
        display: "flex", flexDirection: "row", alignItems: "center"
    },
    image: { height: 64, width: 64, margin: 16 },
    text: {
        fontSize: 20
    }
});

export default MusicItemComponent;