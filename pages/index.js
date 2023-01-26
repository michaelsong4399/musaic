import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    function handleClick() {
        var client_id = "a9c70b25de314478a9a92f9cc63a0a35";
        // var redirect_uri = "http://localhost:3000/join";
        var redirect_uri = "https://musaicduke.vercel.app/join";
        var scope =
            "user-read-private user-read-email playlist-read-private user-library-read";

        var url = "https://accounts.spotify.com/authorize";
        url += "?response_type=token";
        url += "&client_id=" + encodeURIComponent(client_id);
        url += "&scope=" + encodeURIComponent(scope);
        url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
        url += "&state=CUBE";
        console.log(url);
        router.push(url);
    }
    return (
        <>
            <div className="error-page">
                <img className="error-logo" src="/logo.svg"></img>
                <div className="error-text">Cube's Party</div>
                <div
                    className="error-text start-button"
                    onClick={() => {
                        handleClick();
                    }}>
                    Join
                </div>
            </div>
        </>
    );
}
