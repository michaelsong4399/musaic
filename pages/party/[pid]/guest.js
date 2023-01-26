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

export default function Guest() {
    const [tracks, setTracks] = useState({});
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

    // function Track(name, pop) {
    //     return (

    //     );
    // }

    return (
        <>
            {tracks != {} ? (
                <div className="">
                    <div className="topbar">
                        <div className="columns">
                            <div className="column ">
                                <div className="topbar-title">
                                    Cube's Playlist
                                </div>
                            </div>
                            <div className="column"></div>
                        </div>
                    </div>
                    <div className="container">
                        {Object.keys(tracks)
                            .sort((a, b) => tracks[b].pop - tracks[a].pop)
                            .map((key) => {
                                return (
                                    <div className="track columns is-vcentered is-mobile">
                                        <div className="column">
                                            {tracks[key].name}
                                        </div>
                                        <div className="column is-one-fifth">
                                            {tracks[key].pop}
                                        </div>
                                    </div>
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
