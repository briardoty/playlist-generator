"use strict";

// container function for playlist generator module
function PlaylistGenerator() {
	var list; // list of tracks currently displayed on page
	var common = new Common(); // common variables

	// include spotify framework
	this.initialize = function () {
		require(['$api/models', '$views/list#List', '$api/library#Library'], createPlaylist);
	}
	
	// generate playlist from current user's library
	function createPlaylist(models, List, Library) {
		// connect events
		$('#playlist').change(function() { changePlaylist(models, List, Library); });
		$('#playlist-player').click(selectTrack);
		$('#trackRating').change(setTrackRating);
		
		// get playlists in current user's library
		loadPlaylistData(Library);
	}
	
	// clear and reload playlist dropdown
	function loadPlaylistData(Library) {
		// clear any old info
		$('#playlist')
			.empty()
            .append('<option value="select">(Select a playlist)</option>')
            .val('select');
	
		// populate playlist dropdown
		var userLib = Library.forCurrentUser();
		var playlist;
		userLib.playlists.snapshot().done(function (snapshot) {
			var l = snapshot.length;
			for (var i = 0; i < l; i++) {
				playlist = snapshot.get(i);
				$('#playlist').append($('<option />').val(i).text(playlist.name));
			}
		});
	}
	
	// called on change of playlist select element
	function changePlaylist(models, List, Library) {
		// clear track specific data
		$('#trackName').empty();
		$('#trackRating').val('(Rate track)');
	
		var playlistIndex = $('#playlist').val();
		if (playlistIndex == 'select') {
			$('#playlist-player').empty();
		} else {
			// load selected playlist on page
			var userLib = Library.forCurrentUser();
			userLib.playlists.snapshot().done(function (snapshot) {
				var playlist = snapshot.get(playlistIndex);
				list = List.forPlaylist(playlist);
				$('#playlist-player')
					.empty()
					.append(list.node);
				list.init();
			});
		}
	}
	
	// called on click in player area, displays selected track information
	function selectTrack() {
		// get selected track
		var selection = list.getSelection();
		var trackURI = selection.uris;
		
		// display track info
		$('#trackName')
			.empty()
			.append(trackURI[0]);

		// pull track rating from DB
		var request = {};
		request['TrackURI'] = trackURI[0];
		
		var requestBuilder = new SpotifyRequestBuilder();
		requestBuilder.postRequest(common.getTrackRatingURL, onGetTrackRating, JSON.stringify(request));
	}
	
	// called on change of track rating select option
	function setTrackRating() {
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
	}
	
	// callback for getTrackRating; puts rating on page
	function onGetTrackRating(response) {
		if (response.result == '0') {
			$('#trackRating').val('(Rate track)');
		} else {
			$('#trackRating').val(response.result);
		}
	}
	
	// callback for setTrackRating; alerts user if anything went wrong
	function onSetTrackRating(response) {
		if (response.result == 'error')
			alert('Error sending request to set track rating.');
	}
}

window.onload = function () {
	var playlistGenerator = new PlaylistGenerator();
	playlistGenerator.initialize();
}






















