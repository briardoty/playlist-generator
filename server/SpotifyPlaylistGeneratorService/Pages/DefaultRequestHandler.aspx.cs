namespace SpotifyPlaylistGeneratorService
{
    using System;
    using System.Web.Script.Serialization;
    using System.Web.Services;

    public partial class DefaultRequestHandler : System.Web.UI.Page
    {
        /// <summary>
        /// Webservice returns JSON object containing track rating.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <returns></returns>
        [WebMethod]
        public static string GetTrackRating(string TrackURI)
        {
            try
            {
                BusinessLayer.DataManager dataManager = new BusinessLayer.DataManager();
                string result = new JavaScriptSerializer().Serialize(dataManager.GetTrackRating(TrackURI));
                return result;
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        /// <summary>
        /// Sends a rating for the given track to the database.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <returns></returns>
        [WebMethod]
        public static string SetTrackRating(string TrackURI, int rating)
        {
            try
            {
                BusinessLayer.DataManager dataManager = new BusinessLayer.DataManager();
                dataManager.SetTrackRating(TrackURI, rating);
                return new JavaScriptSerializer().Serialize("Successfully set track " + TrackURI + "'s rating to " + rating.ToString());
            }
            catch (Exception e)
            {
                return "Error sending request to set track rating: " + e.Message;
            }
        }

        /// <summary>
        /// Generates playlist and returns list of track URIs to the client.
        /// </summary>
        /// <param name="artistPool">Array of Spotify artist URIs</param>
        /// <returns></returns>
        [WebMethod]
        public static string GeneratePlaylist(string[] artistPool)
        {
            try
            {
                BusinessLayer.DataManager dataManager = new BusinessLayer.DataManager();
                string[] playlist = dataManager.GeneratePlaylist(artistPool);
                return new JavaScriptSerializer().Serialize(playlist);
            }
            catch (Exception e)
            {
                return "Error generating playlist: " + e.Message;
            }
        }
    }
}