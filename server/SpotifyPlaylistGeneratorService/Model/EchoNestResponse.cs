namespace SpotifyPlaylistGeneratorService.Model
{
    public class EchoNestResponse
    {
        public Response response { get; set; }
    }

    public class Response
    {
        public Status status { get; set; }
        public int start { get; set; }
        public int total { get; set; }
        public Song[] songs { get; set; }
    }

    public class Status
    {
        public string version { get; set; }
        public int code { get; set; }
        public string message { get; set; }
    }

    public class Song
    {
        public string id { get; set; }
        public string title { get; set; }
    }
}