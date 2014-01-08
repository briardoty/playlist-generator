namespace SpotifyPlaylistGeneratorService.DataAccessLayer
{
    using System.Web.Configuration;
    using System.Data.SqlClient;
    using System.Data;

    /// <summary>
    /// Class performs DB calls.
    /// </summary>
    public class DataProvider
    {
        /// <summary>
        /// Connection string to local DB storing Spotify track info.
        /// </summary>
        private string spotifyDB = WebConfigurationManager.ConnectionStrings["SpotifyDB"].ConnectionString.ToString();

        /// <summary>
        /// Gets rating for the given track.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <returns></returns>
        public int GetTrackRating(string TrackURI)
        {
            var parameters = new IDbDataParameter[]
            {
                new SqlParameter("@TrackURI", TrackURI)
            };
            return DBAccessUtility.GetScalar("[dbo].[usp_GetTrackRating]", parameters, this.spotifyDB);
        }

        /// <summary>
        /// Sets rating for the given track.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <param name="rating"></param>
        public void SetTrackRating(string TrackURI, int rating)
        {
            var parameters = new IDbDataParameter[]
            {
                new SqlParameter("@TrackURI", TrackURI),
                new SqlParameter("@Rating", rating)
            };
            DBAccessUtility.ExecuteStoredProc("[dbo].[usp_SetTrackRating]", parameters, this.spotifyDB);
        }
    }
}