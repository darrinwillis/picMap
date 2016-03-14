"use strict"

$(function() {

    var picGetter = (function() {

        var inputItem = $('#uploadInput');

        var strRepToNum = function(strRep) {
            var degrees = strRep[0];
            var minutes = strRep[1];
            var seconds = strRep[2];
            return degrees + (minutes + (seconds / 60)) / 60;
        }

        var convertToLatLng = function(lat, latRef, lng, lngRef) {
            var rawLat = strRepToNum(lat);
            var rawLng = strRepToNum(lng);
            if (latRef === ("S")) {
                rawLat *= -1;
            }
            if (lngRef === ("W")) {
                rawLng *= -1;
            }
            return {
                lat: rawLat,
                lng: rawLng
            };
        }

        var handleUpload = function(e) {
            console.log("uploaded");
            var numFiles = e.target.files.length;
            var latlongs = [];
            for (var i = 0; i < numFiles; ++i) {
                console.log("pic " + i);
                EXIF.getData(e.target.files[i], function() {
                    var lat = EXIF.getTag(this, "GPSLatitude");
                    var latRef = EXIF.getTag(this, "GPSLatitudeRef");
                    var lng = EXIF.getTag(this, "GPSLongitude");
                    var lngRef = EXIF.getTag(this, "GPSLongitudeRef");
                    if (lat != null && lng != null) {
                        var latLng = convertToLatLng(lat, latRef, lng, lngRef);
                        latlongs[i] = "(" + lat + "," + lng + ")";
                        console.log("pic at (" + lat + ", " + lng + ")");
                        mapHandler.addMarker(latLng, "pic");
                        mapHandler.setMapOnAll();
                    } else {
                        console.log("pic loc was unavailable");
                    }
                });
            }
        };

        inputItem.on("change", handleUpload);
    })();

    var mapHandler = (function() {
        var map;
        var markers = [];
        var initMap = function() {
            var myLatLng = {lat: -25.363, lng: 131.044};
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
        };

        var addMarker = function(latLng, title) {
            var marker = new google.maps.Marker({
                    map: map,
                    position: latLng,
                    title: title
            });
            markers.push(marker);
        };

        var setMapOnAll = function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        initMap();

        return {
            addMarker: addMarker,
            setMapOnAll: setMapOnAll,
        }
    })();

});
