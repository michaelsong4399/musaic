import { useRouter } from "next/router";

export default function Test() {
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
    }
    return (
        <>
            <a onClick={handleClick}>hi</a>
        </>
    );
}
