"use strict";

// container function for playlist generator module
require(["$api/models", "$views/list#List", "$api/library#Library"], function(models, List, Library) {
	var list; 														// list of tracks currently displayed on page
	var common = new Common(); 					// common variables
	var dataManager = new DataManager(); 	// data manager module
	initialize();													// init app
	
	// generate playlist from current user"s library
	function initialize() {
		// connect events
		$("#playlist").change(changePlaylist);
		$("#playlistPlayer").click(selectTrack);
		$("#trackRating").change(dataManager.setTrackRating);
		$("#clearArtistButton").click(clearArtists);
		$("#playlistButton").click(onCreatePlaylistClick);
		
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
			
			artist.load("name").done(function(artist){
				$("#artistDrop").append("<p>" + artist.name + "</p>");
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
	
	// clears artists in pool for playlist generator
	function clearArtists() {
		$("#artistDrop")
			.find("p")
			.remove()
			.end()
	}
	
	// called on click of make playlist button, checks if all artists in library are in DB
	function onCreatePlaylistClick() {
		// get artists in user library
		Library.forCurrentUser().load("artists").done(function(userLib) {
			userLib.artists.snapshot().done(function(snapshot) {
				// compare to artists in user DB
			});
		});
		
		// compare to artists in user DB
	
		//Library.forCurrentUser().load("artists").done(cllbk);
		models.Artist.fromURI("spotify:artist:1YK8JdPbiaMSnf4hrlBkGT").load("albums").done(cllbk);
	}
	
	//
	function cllbk(artist) {
		artist.albums.snapshot().done(function(snapshot) {
			for (var i = 0; i < snapshot.length; i++) {
				var albumGroup = snapshot.get(i);
				$("#testText").append(album.name);
			}
		});
	}
	
	// called on click of create playlist button; dynamically generates playlist
	function makePlaylist2() {
		// get artists in user library
		var userLib = Library.forCurrentUser();
		userLib.artists.snapshot().done(function (snapshot) {
			var l = snapshot.length;
			for (var i = 0; i < 2; i++) {
				var artist = snapshot.get(i);
				$("#testText").append(artist.name);
				artist.load("albums").done(function(artist) {
					artist.albums.snapshot().done(function (snapshot) {
						for (var j = 0; j < 2; j++) {
							var album = snapshot.get(j);
							$("#testText").append(album.name);
							album.load("tracks").done(function(album) {
								album.tracks.snapshot().done(function(snapshot) {
									for (var k = 0; k < 2; k++) {
										var track = snapshot.get(k);
										$("#testText").append(track.name);
									}
								});
							});
						}
					});
				});
				//$("#testText").append(artist.name);
			}	
			// TODO: get track URIs of artists in user library
		
			// make playlist with some of these songs
		});
	}
});
























