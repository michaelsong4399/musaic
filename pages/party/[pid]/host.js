import { useCallback } from "react";
import { SpotifyPlaybackPlayer } from "react-spotify-playback-player";
import {
    WebPlaybackSDK,
    usePlayerDevice,
    usePlaybackState,
    useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import axios from "axios";

export default function Host() {
    // spotify sdk playback methods, you can get them any way you like

    const token =
        "BQB6He0dMuWYliiZvaNEotgBODgNCfMXoAdNxEh3TkHFxVtUjA3wIPzDvNEELimCGiNQUjEbEIbgJg0bKWqEsJ13mO3q7-3FIP0XipTRLnybH-KkWIHvsykJTHJDoCQK8UOIwGe-Pus5WP4K3yntUp1LdAJPT9Vevmtkd32ko9t-Yw97U37UmRZLDvN1lNXL2EHYbILl1PBGoVNvGDlGy3Wt";

    const getOAuthToken = useCallback(
        (callback) => callback(token?.replace("Bearer", "").trim()),
        [token]
    );

    function Player() {
        const device = usePlayerDevice();
        const player = useSpotifyPlayer();
        const playback = usePlaybackState();
        device ? console.log(device.device_id) : console.log("no device");

        function playSong(uri) {
            if (!device) {
                return;
            }

            // const uri = "spotify:track:4iV5W9uYEdYUVa79Axb7Rh";

            // send a post request
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            };

            const data = {
                uris: [uri],
                position_ms: 0,
            };

            axios.put(
                `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
                data,
                config
            );
        }

        return (
            <>
                <button
                    onClick={() =>
                        playSong("spotify:track:4iV5W9uYEdYUVa79Axb7Rh")
                    }>
                    Play
                </button>
                <SpotifyPlaybackPlayer
                    playback={playback || undefined}
                    player={player || undefined}
                    deviceIsReady={device?.status}
                />
            </>
        );
    }

    return (
        <>
            <h1>Host</h1>
            <p>Party ID: CUBE</p>
            <p>Party Name: CUBE</p>
            <p>Party Description: CUBE</p>
            <WebPlaybackSDK
                initialDeviceName="Spotify example"
                getOAuthToken={getOAuthToken}
                initialVolume={0.5}>
                <Player />
            </WebPlaybackSDK>
        </>
    );
}
