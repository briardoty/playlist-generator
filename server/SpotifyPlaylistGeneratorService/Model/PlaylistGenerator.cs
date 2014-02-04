namespace SpotifyPlaylistGeneratorService.Model
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Script.Serialization;

    /// <summary>
    /// Class generates playlists.
    /// </summary>
    public class PlaylistGenerator
    {
        /// <summary>
        /// Webservice URL to search Echo Nest for artist tracks.
        /// </summary>
        private string echoNestTrackURL = "http://developer.echonest.com/api/v4/artist/songs";
        private string apiKey = "YCCWMXIPWV1SIY5OV";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="artistPool">Array of Spotify artist URIs</param>
        /// <returns></returns>
        public string[] GetTracks(string[] artistPool)
        {
            List<string> result = new List<string>();
            // loop through artists pulling discographies
            foreach (string artist in artistPool)
            {
                string artistURI = getArtistURI(artist);
                List<string> trackList = getDiscography(artistURI);
                result.AddRange(trackList);
            }
            return result.ToArray();
        }

        /// <summary>
        /// Converts given Spotify artist URI to one recognizable by EchoNest project Rosetta Stone.
        /// </summary>
        /// <param name="artist"></param>
        /// <returns></returns>
        private string getArtistURI(string artist)
        {
            char[] delimiter = { '/' };
            string[] tokens = artist.Split(delimiter);
            string artistID = tokens[tokens.Length - 1];
            string artistURI = "spotify-WW:artist:" + artistID;
            return artistURI;
        }

        /// <summary>
        /// Pulls and creates list of tracks by given artist from EchoNest webservice.
        /// </summary>
        /// <param name="artistURI"></param>
        /// <returns></returns>
        private List<string> getDiscography(string artistURI)
        {
            List<string> result = new List<string>();

            // send request for one page of results
            int start = 0;
            Dictionary<string, string> args = new Dictionary<string,string>();
            args.Add("api_key", this.apiKey);
            args.Add("id", artistURI);
            args.Add("results", "100");
            args.Add("start", start.ToString());
            string response = DataAccessLayer.WebServiceAccessUtility.GetResultPage(this.echoNestTrackURL, args);

            // process response
            JavaScriptSerializer deserializer = new JavaScriptSerializer();
            EchoNestResponse deserializedResponse = new EchoNestResponse();
            deserializedResponse = deserializer.Deserialize<EchoNestResponse>(response);
            foreach (Model.Song song in deserializedResponse.response.songs)
            {
                result.Add(song.title);
            }

            // potentially get remaining pages of results
            while (start < deserializedResponse.response.total) {
                // send another request
                start += 100;
                args = new Dictionary<string, string>();
                args.Add("api_key", this.apiKey);
                args.Add("id", artistURI);
                args.Add("results", "100");
                args.Add("start", start.ToString());
                response = DataAccessLayer.WebServiceAccessUtility.GetResultPage(this.echoNestTrackURL, args);

                // process
                deserializedResponse = deserializer.Deserialize<EchoNestResponse>(response);
                foreach (Model.Song song in deserializedResponse.response.songs)
                {
                    result.Add(song.title);
                }
            }

            return result;
        }
    }
}