"use strict";

// encapsulates calls to create and post ajax requests to echo nest web service
function SpotifyRequestBuilder() {
    if (window.RequestBuilder)
        return window.RequestBuilder;

    window.RequestBuilder = this;

    // build and send request 
    this.postRequest = function (url, callbackFunction, request) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: request,
            success: function (response) {
                var result = {
                    "result": response.d
                };
                callbackFunction(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var response = {
                    result: "error",
                    error: errorThrown,
                    errorText: textStatus
                };
                callbackFunction(response);
            }
        });
    }
}