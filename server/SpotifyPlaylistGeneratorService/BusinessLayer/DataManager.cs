namespace SpotifyPlaylistGeneratorService.BusinessLayer
{
    public class DataManager
    {
        /// <summary>
        /// DataProvider object performs DB calls.
        /// </summary>
        private DataAccessLayer.DataProvider dataProvider;

        /// <summary>
        /// PlaylistGenerator processes artist/track information to create playlists.
        /// </summary>
        private Model.PlaylistGenerator playlistGenerator;

        /// <summary>
        /// Initializes new instance of DataManager class.
        /// </summary>
        public DataManager()
        {
            this.dataProvider = new DataAccessLayer.DataProvider();
            this.playlistGenerator = new Model.PlaylistGenerator();
        }

        /// <summary>
        /// Get track rating for the given track.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <returns></returns>
        public int GetTrackRating(string TrackURI)
        {
            return this.dataProvider.GetTrackRating(TrackURI);
        }

        /// <summary>
        /// Sets the rating for the given track.
        /// </summary>
        /// <param name="TrackURI"></param>
        /// <param name="rating"></param>
        public void SetTrackRating(string TrackURI, int rating)
        {
            this.dataProvider.SetTrackRating(TrackURI, rating);
        }

        /// <summary>
        /// Calls method to create and return list of tracks based on given artist pool and user data.
        /// </summary>
        /// <param name="artistPool">Array of Spotify artist URIs</param>
        /// <returns></returns>
        public string[] GeneratePlaylist(string[] artistPool)
        {
            return this.playlistGenerator.GetTracks(artistPool);
        }
    }
}