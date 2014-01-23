"use strict";

function DataManager() {
	var common = new Common(); 				// common variables
	
	// called on change of track rating select option
	this.setTrackRating = function()  {
		// check that a track is selected
		if (!$('#trackName').is(':empty')) {
			// grab user rating and send ajax request to update in DB
			var rating = $('#trackRating').val();
			var trackURI = $('#trackName').text();
			
			// create request
			var request = {};
			request['TrackURI'] = trackURI;
			request['rating'] = rating;
			
			var requestBuilder = new SpotifyRequestBuilder();
			requestBuilder.postRequest(common.setTrackRatingURL, onSetTrackRating, JSON.stringify(request));
		}
	};
	
	// callback for setTrackRating; alerts user if anything went wrong
	function onSetTrackRating(response) {
		if (response.result == 'error')
			alert('Error sending request to set track rating.');
	}

}