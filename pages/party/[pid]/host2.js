import React, { useState, useEffect } from "react";
import SpotifyWebPlaybackSDK from "@spotify/web-playback-sdk";

export default function Host2() {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        // Initialize the SDK
        SpotifyWebPlaybackSDK.initialize({
            token: "YOUR_SPOTIFY_ACCESS_TOKEN",
            name: "My React App",
        });

        // Connect to the Spotify player
        SpotifyWebPlaybackSDK.connect().then((sdkPlayer) => {
            setPlayer(sdkPlayer);
        });

        return () => {
            // Clean up the SDK connection when the component unmounts
            SpotifyWebPlaybackSDK.disconnect();
        };
    }, []);

    const handlePlay = () => {
        if (!player) {
            return;
        }

        // Play the song "Natural" by Imagine Dragons
        player.play({
            context_uri: "spotify:album:4MVwVQYlQcqvqkcC5cEQgZ",
            uris: ["spotify:track:7BKLCZ1jbUBVqRi2FVlTVw"],
        });
    };

    return (
        <div>
            <button onClick={handlePlay}>Play "Natural"</button>
        </div>
    );
}
