<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="SpotifyPlaylistGeneratorService.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="../Static/JS/jquery-2.0.3.min.js"></script>
    <script src="../Static/JS/Common.js"></script>
    <script src="../Static/JS/RequestBuilder.js"></script>
    <script src="../Static/JS/SpotifyTest.js"></script>

    <title></title>
</head>
<body>
    <form>
        <input id="TrackURI" type="text" />
        <input id="searchButton" value="Search Rating" type="button" /> <br/>
        <select id="TrackRating">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
        <input id="setButton" value="Set Rating" type="button" />
    </form>
</body>
</html>
