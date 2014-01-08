"use strict";

// container function for playlist generator module
function PlaylistGenerator() {
	var list;
	var common = new Common();

	// include spotify api
	this.initialize = function () {
		require(['$api/models', '$views/list#List', '$api/library#Library'], createPlaylist);
	}
	
	// generate playlist from current user's library
	function createPlaylist(models, List, Library) {
		// connect events
		$('#playlist').change(function() { changePlaylist(models, List, Library); });
		$('#playlist-player').click(selectTrack);
		//$('#trackRating').change();
		
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
		var playlistIndex = $('#playlist').val();
		if (playlistIndex != 'select') {
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
	
	// TODO: callback for getTrackRating; puts rating on page
	function onGetTrackRating(response) {
		alert(response.result);
	}
}

window.onload = function () {
	var playlistGenerator = new PlaylistGenerator();
	playlistGenerator.initialize();
}






















