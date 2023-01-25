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

export default function Join() {
    const { asPath } = useRouter();
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
        // The value of `databaseURL` depends on the location of the database
        databaseURL: "https://musaic1-default-rtdb.firebaseio.com",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);

    let access_token;
    let state;
    const router = useRouter();

    useEffect(() => {
        let hash = asPath.split("#")[1];
        let args = hash.split("&");
        console.log(args);

        access_token = args[0].split("=")[1];
        state = args[3].split("=")[1];

        console.log(access_token);
        console.log(state);
        getTracks();
    }, []);

    function getTracks() {
        axios
            .get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            })
            .then((name) => {
                console.log(name.data.display_name);
                let user = name.data.display_name;
                axios
                    .get("https://api.spotify.com/v1/me/playlists", {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    })
                    .then((res) => {
                        console.log(res);
                        // Get liked songs
                        [
                            0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500,
                        ].forEach((offset) => {
                            axios
                                .get(
                                    "https://api.spotify.com/v1/me/tracks&limit=50&offset=" +
                                        offset,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${access_token}`,
                                        },
                                    }
                                )
                                .then((res) => {
                                    console.log(res);
                                    res.data.items.forEach((item) => {
                                        runTransaction(
                                            ref(
                                                db,
                                                "pid/" +
                                                    state +
                                                    "/" +
                                                    item.track.uri
                                            ),
                                            (currentData) => {
                                                if (currentData === null) {
                                                    return {
                                                        name: item.track.name,
                                                        user: [user],
                                                        pop: 1,
                                                    };
                                                }
                                                if (
                                                    currentData.user.includes(
                                                        user
                                                    )
                                                ) {
                                                    return; // Abort the transaction.
                                                }
                                                currentData.pop += 1;
                                                currentData.user.push(user);
                                                return currentData;
                                            }
                                        );
                                    });
                                });
                        });

                        // Get songs in each playlist
                        res.data.items.forEach((playlist) => {
                            if (playlist.owner.display_name != user) return;
                            axios
                                .get(playlist.tracks.href, {
                                    headers: {
                                        Authorization: `Bearer ${access_token}`,
                                    },
                                })
                                .then((res) => {
                                    console.log(res);
                                    res.data.items.forEach((item) => {
                                        runTransaction(
                                            ref(
                                                db,
                                                "pid/" +
                                                    state +
                                                    "/" +
                                                    item.track.uri
                                            ),
                                            (currentData) => {
                                                if (currentData === null) {
                                                    return {
                                                        name: item.track.name,
                                                        user: [user],
                                                        pop: 1,
                                                    };
                                                }
                                                if (
                                                    currentData.user.includes(
                                                        user
                                                    )
                                                ) {
                                                    return; // Abort the transaction.
                                                }
                                                currentData.pop += 1;
                                                currentData.user.push(user);
                                                return currentData;
                                            }
                                        );
                                    });
                                });
                        });
                    });
            });
        router.push("/party/" + state + "/guest");
    }

    // Use access token to make API calls to get playlist

    // Use playlist to get songs
    // Store songs in firebase db
    // Redirect to /party with party id

    return (
        <>
            <div
                onClick={() => {
                    getTracks();
                }}>
                Callback
            </div>
        </>
    );
}
