import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    runTransaction,
} from "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function Guest() {
    const [tracks, setTracks] = useState({});
    const [votes, setVotes] = useState({});
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
                                        <div className="track columns is-vcentered is-mobile">
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
        </>
    );
}
