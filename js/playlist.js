"use strict";

// container function for playlist generator module
require(["$api/models", "$views/list#List", "$api/library#Library"], function(models, List, Library) {
	var list; 														// list of tracks currently displayed on page
	var artistPool = [];											// list of artists from which to generate playlists
	var common = new Common(); 					// common variables
	initialize();													// init app
	
	// generate playlist from current user"s library
	function initialize() {
		// connect events
		$("#playlist").change(changePlaylist);
		$("#playlistPlayer").click(selectTrack);
		$("#trackRating").change(setTrackRating);
		$("#clearArtistButton").click(clearArtistPool);
		$("#playlistButton").click(createPlaylist);
		
		var dropBox = document.querySelector("#artistDrop");

        dropBox.addEventListener("dragstart", function(e){
            e.dataTransfer.setData("text/html", this.innerHTML);
            e.dataTransfer.effectAllowed = "copy";
        });

        dropBox.addEventListener("dragenter", function(e){
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            this.classList.add("over");
        });

        dropBox.addEventListener("dragover", function(e){
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        });

        dropBox.addEventListener("dragleave", function(e){
            e.preventDefault();
            this.classList.remove("over");
        });

        dropBox.addEventListener("drop", function(e){
            e.preventDefault();
            var artist = models.Artist.fromURI(e.dataTransfer.getData("text"));
			this.classList.remove("over");
			
			artist.load("name","uri").done(function(artist){
				$("#artistDrop").append("<p>" + artist.name + "</p>");
				artistPool.push(artist.uri);
			});
        });
		
		// get playlists in current user"s library
		loadPlaylistData();
	}
	
	// clear and reload playlist dropdown
	function loadPlaylistData() {
		// clear any old info
		$("#playlist")
			.empty()
            .append("<option value='select'>(Select playlist)</option>")
            .val("select");
	
		// populate playlist dropdown
		var userLib = Library.forCurrentUser();
		userLib.playlists.snapshot().done(function (snapshot) {
			var l = snapshot.length;
			for (var i = 0; i < l; i++) {
				var playlist = snapshot.get(i);
				$("#playlist").append($("<option />").val(i).text(playlist.name));
			}
		});
	}
	
	// called on change of playlist select element
	function changePlaylist() {
		// clear track specific data
		$("#trackName").empty();
		$("#trackRating").val("(Rate track)");
	
		var playlistIndex = $("#playlist").val();
		if (playlistIndex == "select") {
			$("#playlistPlayer").empty();
		} else {
			// load selected playlist on page
			var userLib = Library.forCurrentUser();
			userLib.playlists.snapshot().done(function (snapshot) {
				var playlist = snapshot.get(playlistIndex);
				list = List.forPlaylist(playlist);
				$("#playlistPlayer")
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
		$("#trackName")
			.empty()
			.append(trackURI[0]);

		// pull track rating from DB
		var request = {};
		request["TrackURI"] = trackURI[0];
		
		var requestBuilder = new SpotifyRequestBuilder();
		requestBuilder.postRequest(common.getTrackRatingURL, onGetTrackRating, JSON.stringify(request));
	}
	
	// callback for getTrackRating; puts rating on page
	function onGetTrackRating(response) {
		if (response.result == "0") {
			$("#trackRating").val("(Rate track)");
		} else {
			$("#trackRating").val(response.result);
		}
	}
	
	// called on select of new rating in track rating drop down
	function setTrackRating() {
		// check that a track is selected
		if (!$("#trackName").is(":empty")) {
			// grab user rating and send ajax request to update in DB
			var rating = $("#trackRating").val();
			var trackURI = $("#trackName").text();
			
			// create request
			var request = {};
			request["TrackURI"] = trackURI;
			request["rating"] = rating;
			
			var requestBuilder = new SpotifyRequestBuilder();
			requestBuilder.postRequest(common.setTrackRatingURL, onSetTrackRating, JSON.stringify(request));
		}
	}
	
	// setTrackRating callback
	function onSetTrackRating(response) {
		if (response.result == "error")
			alert("Error sending request to set track rating.");
	}
	
	// clears artists in pool for playlist generator
	function clearArtistPool() {
		$("#artistDrop")
			.find("p")
			.remove()
			.end();
		artistPool = [];
	}
	
	// called on click of create playlist button
	function createPlaylist() {
		// create request
		var request = {};
		request["artistPool"] = artistPool;
		
		var requestBuilder = new SpotifyRequestBuilder();
		requestBuilder.postRequest(common.generatePlaylistURL, onCreatePlaylist, JSON.stringify(request));
	}
	
	// createPlaylist callback processes new playlist response
	function onCreatePlaylist(response) {
		alert(response.result + response.error + response.errorText);
	}
});
























