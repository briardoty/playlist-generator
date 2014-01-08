"use strict";

// container function for all echo nest call functionality
function SpotifyTest() {
    var common = new Common();

    // connect events
    this.initialize = function () {
        $('#searchButton').click(getTrackRating);
        $('#setButton').click(setTrackRating);
    }

    // create JSON request for local user track rating
    function getTrackRating() {
        var trackURI = $('#TrackURI').val();
        var url = common.trackRatingURL;

        var request = {};
        request['TrackURI'] = trackURI;

        var requestBuilder = new SpotifyRequestBuilder();
        requestBuilder.postRequest(url, onGetTrackRating, JSON.stringify(request));
    }

    // create JSON request to set user track rating
    function setTrackRating() {
        var trackURI = $('#TrackURI').val();
        var rating = $('#TrackRating option:selected').text();
        var url = common.setTrackRatingURL;

        var request = {};
        request['TrackURI'] = trackURI;
        request['rating'] = rating;

        var requestBuilder = new SpotifyRequestBuilder();
        requestBuilder.postRequest(url, onSetTrackRating, JSON.stringify(request));
    }

    // called on completion of getTrackRating
    function onGetTrackRating(response) {
        // clear any old data
        alert(response.result);
    }

    // called on completion of setTrackRating
    function onSetTrackRating(response) {
        alert(response.result);
    }
}

window.onload = function () {
    var echoNestTest = new SpotifyTest();
    echoNestTest.initialize();
}