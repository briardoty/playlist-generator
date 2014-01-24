namespace SpotifyPlaylistGeneratorService.Model
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Class generates playlists.
    /// </summary>
    public class PlaylistGenerator
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="artistPool">Array of Spotify artist URIs</param>
        /// <returns></returns>
        public string[] GetTracks(string[] artistPool)
        {
            string[] result = {"test", "Briar"};
            return result;
        }
    }
}