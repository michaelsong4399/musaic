var scopes = ["playlist-read-private", "user-read-email"],
    redirectUri = "https://example.com/callback",
    clientId = "a9c70b25de314478a9a92f9cc63a0a35",
    state = "some-state-of-my-choice",
    showDialog = true,
    responseType = "token";

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(
    scopes,
    state,
    showDialog,
    responseType
);

// https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=token&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true
console.log(authorizeURL);
