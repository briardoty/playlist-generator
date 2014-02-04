namespace SpotifyPlaylistGeneratorService.DataAccessLayer
{
    using System.Net;
    using System.IO;
    using System.Text;
    using System.Collections.Generic;

    public class WebServiceAccessUtility
    {
        /// <summary>
        /// Sends web request to given URL with given query string arguments.
        /// </summary>
        /// <param name="baseURL"></param>
        /// <param name="args">Dictionary of query string arguments.</param>
        /// <returns></returns>
        internal static string GetResultPage(string baseURL, Dictionary<string, string> args)
        {
            string result;
            string url = baseURL + "?";

            // add args to query string
            foreach (KeyValuePair<string, string> kvp in args)
            {
                url += kvp.Key + "=" + kvp.Value + "&";
            }

            // make and send request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            try
            {
                WebResponse response = request.GetResponse();
                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    result = reader.ReadToEnd();
                }
            }
            catch (WebException ex)
            {
                WebResponse errorResponse = ex.Response;
                using (Stream responseStream = errorResponse.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    string errorText = reader.ReadToEnd();
                    result = errorText;
                }
            }
            return result;
        }
    }
}