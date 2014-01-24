"use strict";

// Common URLs and strings used throughout app
function Common() {
    this.getTrackRatingURL = "http://localhost:8080/DefaultRequestHandler.aspx/GetTrackRating";
    this.setTrackRatingURL = "http://localhost:8080/DefaultRequestHandler.aspx/SetTrackRating";
	this.generatePlaylistURL = "http://localhost:8080/DefaultRequestHandler.aspx/GeneratePlaylist";
	this.wsSpotifyURL = "http://ws.spotify.com/search/1";
	this.echoNestURL = "http://developer.echonest.com/api/v4";
}