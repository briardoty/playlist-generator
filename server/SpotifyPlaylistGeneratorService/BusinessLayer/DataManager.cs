namespace SpotifyPlaylistGeneratorService.BusinessLayer
{
    public class DataManager
    {
        /// <summary>
        /// DataProvider object performs DB calls.
        /// </summary>
        private DataAccessLayer.DataProvider dataProvider;

        /// <summary>
        /// Initializes new instance of DataManager class.
        /// </summary>
        public DataManager()
        {
            this.dataProvider = new DataAccessLayer.DataProvider();
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
    }
}