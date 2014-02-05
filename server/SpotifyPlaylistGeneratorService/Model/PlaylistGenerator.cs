namespace SpotifyPlaylistGeneratorService.Model
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Script.Serialization;
    using System.Xml;
    using System.Xml.XPath;

    /// <summary>
    /// Class generates playlists.
    /// </summary>
    public class PlaylistGenerator
    {
        /// <summary>
        /// Webservice URL to search Echo Nest for artist tracks.
        /// </summary>
        private string echoNestTrackURL = "http://developer.echonest.com/api/v4/artist/songs";
        private string wsSpotifyURL = "http://ws.spotify.com/search/1/track";
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
                string artistName = getArtistName(artist);
                List<string> trackList = getDiscography(artistURI, artistName);
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
        /// Converts given Spotify artist URI to just the artist name.
        /// </summary>
        /// <param name="artist"></param>
        /// <returns></returns>
        private string getArtistName(string artist)
        {
            char[] delimiter = { '/' };
            string[] tokens = artist.Split(delimiter);
            string artistName = tokens[0];
            return artistName;
        }

        /// <summary>
        /// Pulls and creates list of tracks by given artist from EchoNest webservice.
        /// </summary>
        /// <param name="artistURI"></param>
        /// <returns></returns>
        private List<string> getDiscography(string artistURI, string artistName)
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
            EchoNestTrackResponse deserializedResponse = new EchoNestTrackResponse();
            deserializedResponse = deserializer.Deserialize<EchoNestTrackResponse>(response);
            foreach (Model.Song song in deserializedResponse.response.songs)
            {
                // get that song's spotify uri and append to result
                string trackURI = getTrackURI(artistName, song.title);
                result.Add(trackURI);
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
                deserializedResponse = deserializer.Deserialize<EchoNestTrackResponse>(response);
                foreach (Model.Song song in deserializedResponse.response.songs)
                {
                    result.Add(song.title);
                }
            }

            return result;
        }

        /// <summary>
        /// Calls functions to look up track URI using spotify web service search with given params.
        /// </summary>
        /// <param name="artistName"></param>
        /// <param name="trackName"></param>
        /// <returns></returns>
        private string getTrackURI(string artistName, string trackName)
        {
            try
            {
                // make and send request
                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("q", "artist:" + artistName + " title:" + trackName);
                string response = DataAccessLayer.WebServiceAccessUtility.GetResultPage(this.wsSpotifyURL, args);

                // extract track URI from XML response
                XmlDocument xml = new XmlDocument();
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xml.NameTable);
                nsmgr.AddNamespace("ns", "http://www.spotify.com/ns/music/1");
                xml.LoadXml(response);
                XmlNode node = xml.SelectSingleNode("/ns:tracks/ns:track[1]", nsmgr);
                string trackURI = node.Attributes["href"].InnerText;
                return trackURI;
            }
            catch (Exception e)
            {
                return "";
            }
        }
    }
}