"use strict";

// Common URLs and strings used throughout app
function Common() {
    this.getTrackRatingURL = "http://localhost:8080/DefaultRequestHandler.aspx/GetTrackRating";
    this.setTrackRatingURL = "http://localhost:8080/DefaultRequestHandler.aspx/SetTrackRating";
	this.wsSpotifyURL = "http://ws.spotify.com/search/1";
	this.echoNestURL = "http://developer.echonest.com/api/v4";
	this.apiKey = "YCCWMXIPWV1SIY5OV";
}