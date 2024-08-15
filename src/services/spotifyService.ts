import axios from "axios";
import qs from "qs";
import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} from "@env";

type MusicItemData = {
	musicItem: string;
	id: string;
}

const getAuth = async () => {
	const clientID = SPOTIFY_CLIENT_ID;
	const clientSecret = SPOTIFY_CLIENT_SECRET;

	const headers = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		auth: {
			username: clientID,
			password: clientSecret
		}
	};

	const data = {
		grant_type: "client_credentials"
	};

    try{
        const response = await axios.post("https://accounts.spotify.com/api/token", qs.stringify(data), headers);

        return response.data.access_token;
    }
    catch(error){
        console.log(error)
    }
};

export const getMusicItemData = async (musicItem: MusicItemData) => {
    const baseURL = "https://api.spotify.com/v1";

    try{
        const token = await getAuth();

        if(!token){
            console.log("No token");
        }

        const response = await axios.get(`${baseURL}/${musicItem.musicItem}s/${musicItem.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }
    catch(error){
        console.log(error)
    }
}