"use strict";

// container function for playlist generator module
function PlaylistGenerator() {

	// include spotify api
	this.initialize = function () {
		require(['$api/models', '$views/list#List', '$api/library#Library'], createPlaylist);
	}
	
	// generate playlist from current user's library
	function createPlaylist(models, List, Library) {
		// get playlists in current user's library
		var userLib = Library.forCurrentUser();
		var playlist;
		userLib.playlists.snapshot().done(function (snapshot) {
			playlist = snapshot.get(1);
			var list = List.forPlaylist(playlist);
			document.getElementById('playlist-player').appendChild(list.node);
            list.init();
		});
	}
}

window.onload = function () {
	var playlistGenerator = new PlaylistGenerator();
	playlistGenerator.initialize();
}

