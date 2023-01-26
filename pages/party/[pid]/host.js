import { useCallback } from "react";
import { SpotifyPlaybackPlayer } from "react-spotify-playback-player";
import {
    WebPlaybackSDK,
    usePlayerDevice,
    usePlaybackState,
    useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    runTransaction,
} from "firebase/database";
import axios from "axios";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function Host() {
    const [tracks, setTracks] = useState({});
    const [votes, setVotes] = useState({});
    const [cd, setCd] = useState("");
    // spotify sdk playback methods, you can get them any way you like

    // TODO: Replace the following with your app's Firebase project configuration
    // See: https://firebase.google.com/docs/web/learn-more#config-object
    const firebaseConfig = {
        // ...
        apiKey: "AIzaSyARJiKr_iPh7hiywZCWIo86al_WPfN6oH4",
        authDomain: "musaic1.firebaseapp.com",
        projectId: "musaic1",
        storageBucket: "musaic1.appspot.com",
        messagingSenderId: "62100760514",
        appId: "1:62100760514:web:ca4ab577d5c8aaa55fd85b",
        databaseURL: "https://musaic1-default-rtdb.firebaseio.com",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);

    const router = useRouter();

    useEffect(() => {
        const dbRef = ref(db, "pid/CUBE");
        onValue(dbRef, (snapshot) => {
            let data = snapshot.val();
            if (data != null) {
                console.log(data);
                setTracks(data);
            }
        });
    }, []);

    const token =
        "BQBCTxQFnAgswyM3yYEbdu8LspH1a0jefcE5Q6tsHotfYGUiX4gseVaP9ElVK_I2yOvGd28rpYwK-3qxjyP_sySSDj_e8lBq0dQbkjjnBwI3ycyfjx75V35qKt_SmWn8UjMgRpMVOfKQh9WNkSVoPLA5g8WQgi4tLP79ulUD8x7v6yreSCf8-qj3NCxffAqX7eIJvwWxAPN6R2uEiCghBPBZ";

    const getOAuthToken = useCallback(
        (callback) => callback(token?.replace("Bearer", "").trim()),
        [token]
    );

    function playSong(uri) {
        if (cd == "") {
            return;
        }

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
            `https://api.spotify.com/v1/me/player/play?device_id=${cd}`,
            data,
            config
        );
    }

    function Player() {
        const device = usePlayerDevice();
        const player = useSpotifyPlayer();
        const playback = usePlaybackState();
        if (device) {
            console.log(device.device_id);
            setCd(device.device_id);
        } else {
            console.log("no device");
        }

        const newTheme = {
            backgroundColor: "#840b96",
            disabledColor: "#888888",
            highLightColor: "#ffffff",
            primaryTextColor: "#f9fafb",
            secondaryBackgroundColor: "#1e293b",
            secondaryTextColor: "#cbd5e1",
            popOverColor: "#000000",
        };

        return (
            <>
                {/* <button
                    onClick={() =>
                        playSong("spotify:track:4iV5W9uYEdYUVa79Axb7Rh")
                    }>
                    Play
                </button> */}
                <SpotifyPlaybackPlayer
                    playback={playback || undefined}
                    player={player || undefined}
                    deviceIsReady={device?.status}
                    theme={newTheme}
                />
            </>
        );
    }

    return (
        <>
            {tracks != {} ? (
                <div className="">
                    <div className="topbar">
                        <div className="columns is-vcentered is-mobile">
                            <div className="column is-three-quarters">
                                <div className="topbar-title">
                                    Cube's Playlist
                                </div>
                            </div>
                            <div className="column topbar-right">
                                <div className="topbar-logo">
                                    <img src="/logo.svg" />
                                </div>
                                <div className="topbar-title topbar-logo-title">
                                    Musiac
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="list">
                        <div className="track-title columns is-vcentered is-mobile">
                            <div className="column is-one-half">
                                <div className="track-title-name">Track</div>
                            </div>
                            <div className="column is-one-quarter">
                                <div className="track-name">Album</div>
                            </div>
                            <div className="column">
                                <div className="track-name"> Pop.</div>
                            </div>
                        </div>

                        {Object.keys(tracks)
                            .sort((a, b) => tracks[b].pop - tracks[a].pop)
                            .map((key) => {
                                return (
                                    <>
                                        <div
                                            className="track columns is-vcentered is-mobile is-clickable"
                                            onClick={() => playSong(key)}>
                                            <img
                                                src={tracks[key].image}
                                                className="track-img"
                                            />

                                            <div className="column is-one-half">
                                                <div className="track-name">
                                                    {tracks[key].name}
                                                </div>
                                                <div className="track-artist">
                                                    {tracks[key].artist}
                                                </div>
                                            </div>
                                            <div className="column is-one-quarter track-album">
                                                {tracks[key].album}
                                            </div>
                                            <div className="column track-pop">
                                                <div className="columns is-mobile is-vcentered">
                                                    <div className="column">
                                                        {tracks[key].pop}
                                                    </div>
                                                    <div className="column">
                                                        <div className="columns is-vcentered">
                                                            <div className="column">
                                                                <span
                                                                    className={
                                                                        "hero-button-icon " +
                                                                        (Object.keys(
                                                                            votes
                                                                        ).includes(
                                                                            key
                                                                        ) &&
                                                                        votes[
                                                                            key
                                                                        ] == 1
                                                                            ? "upvoted"
                                                                            : "")
                                                                    }
                                                                    onClick={() => {
                                                                        runTransaction(
                                                                            ref(
                                                                                db,
                                                                                "pid/CUBE/" +
                                                                                    key +
                                                                                    "/pop"
                                                                            ),
                                                                            (
                                                                                currentPop
                                                                            ) => {
                                                                                if (
                                                                                    currentPop ===
                                                                                    null
                                                                                ) {
                                                                                    return 1;
                                                                                } else {
                                                                                    if (
                                                                                        !Object.keys(
                                                                                            votes
                                                                                        ).includes(
                                                                                            key
                                                                                        ) ||
                                                                                        votes[
                                                                                            key
                                                                                        ] ==
                                                                                            0
                                                                                    ) {
                                                                                        setVotes(
                                                                                            {
                                                                                                ...votes,
                                                                                                [key]: 1,
                                                                                            }
                                                                                        );
                                                                                        return (
                                                                                            currentPop +
                                                                                            1
                                                                                        );
                                                                                    } else {
                                                                                        if (
                                                                                            votes[
                                                                                                key
                                                                                            ] ==
                                                                                            1
                                                                                        ) {
                                                                                            setVotes(
                                                                                                {
                                                                                                    ...votes,
                                                                                                    [key]: 0,
                                                                                                }
                                                                                            );
                                                                                            return (
                                                                                                currentPop -
                                                                                                1
                                                                                            );
                                                                                        } else {
                                                                                            setVotes(
                                                                                                {
                                                                                                    ...votes,
                                                                                                    [key]: 1,
                                                                                                }
                                                                                            );
                                                                                            return (
                                                                                                currentPop +
                                                                                                2
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        );
                                                                    }}>
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faArrowUp
                                                                        }></FontAwesomeIcon>
                                                                </span>
                                                            </div>
                                                            <div className="column">
                                                                <span
                                                                    className={
                                                                        "hero-button-icon " +
                                                                        (Object.keys(
                                                                            votes
                                                                        ).includes(
                                                                            key
                                                                        ) &&
                                                                        votes[
                                                                            key
                                                                        ] == -1
                                                                            ? "downvoted"
                                                                            : "")
                                                                    }
                                                                    onClick={() => {
                                                                        runTransaction(
                                                                            ref(
                                                                                db,
                                                                                "pid/CUBE/" +
                                                                                    key +
                                                                                    "/pop"
                                                                            ),
                                                                            (
                                                                                currentPop
                                                                            ) => {
                                                                                if (
                                                                                    currentPop ===
                                                                                    null
                                                                                ) {
                                                                                    return -1;
                                                                                }
                                                                                if (
                                                                                    !Object.keys(
                                                                                        votes
                                                                                    ).includes(
                                                                                        key
                                                                                    ) ||
                                                                                    votes[
                                                                                        key
                                                                                    ] ==
                                                                                        0
                                                                                ) {
                                                                                    setVotes(
                                                                                        {
                                                                                            ...votes,
                                                                                            [key]: -1,
                                                                                        }
                                                                                    );
                                                                                    return (
                                                                                        currentPop -
                                                                                        1
                                                                                    );
                                                                                }
                                                                                if (
                                                                                    votes[
                                                                                        key
                                                                                    ] ==
                                                                                    -1
                                                                                ) {
                                                                                    setVotes(
                                                                                        {
                                                                                            ...votes,
                                                                                            [key]: 0,
                                                                                        }
                                                                                    );
                                                                                    return (
                                                                                        currentPop +
                                                                                        1
                                                                                    );
                                                                                }
                                                                                if (
                                                                                    votes[
                                                                                        key
                                                                                    ] ==
                                                                                    1
                                                                                ) {
                                                                                    setVotes(
                                                                                        {
                                                                                            ...votes,
                                                                                            [key]: -1,
                                                                                        }
                                                                                    );
                                                                                    return (
                                                                                        currentPop -
                                                                                        2
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }}>
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faArrowDown
                                                                        }></FontAwesomeIcon>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
            ) : (
                <></>
            )}
            <WebPlaybackSDK
                initialDeviceName="Spotify example"
                getOAuthToken={getOAuthToken}
                initialVolume={1.0}>
                <Player />
            </WebPlaybackSDK>
        </>
    );
}
