/**
 * contains geocode information
 *
 * @class geocode vm
 */

(function () {

    "use strict";

    define([
        "dojo/dom-construct",
        "dojo/topic",
        "dojo/dom",
        "dojo/on",
        "esri/dijit/Geocoder",
        "app/model/main.js",
        "esri/graphic",
        "esri/geometry/Multipoint",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
        "dojo/parser",
        "dojo/domReady!"

    ],
        function (dc, tp, dom, on, Geocoder, mapModel, Graphic, Multipoint, PictureMarkerSymbol, InfoTemplate, Popup, parser) {

            var geoCodeVM = new function () {

                /**
                 * Store reference to module this object.
                 *
                 * @property self
                 * @type {*}
                 */
                var self = this;


                /**
                 * Initialize the class.
                 *
                 * @method init
                 */
                self.init = function () {

                    // create geosearch widget
                    var geocoder = new Geocoder({
                        value: '',
                        maxLocations: 10,
                        autoComplete: true,
                        arcgisGeocoder: true,
                        map: mapModel.map
                    }, "geosearch");
                    geocoder.startup();
                    geocoder.on("select", geocodeSelect);
                    geocoder.on("findResults", geocodeResults);
                    geocoder.on("clear", clearFindGraphics);

                } // end init
//****************************************************************

                self.geosearch = function () {
                    var def = geocoder.find();
                    def.then(function(res) {
                        geocodeResults(res);
                    });
                }

                self.geocodeSelect = function (item) {
                    var g = (item.graphic ? item.graphic : item.result.feature);
                    g.setSymbol(sym);
                    addPlaceGraphic(item.result, g.symbol);
                }

                self.geocodeResults = function (places){
                    places = places.results;
                    if (places.length > 0) {
                        clearFindGraphics();
                        var symbol = sym;
                        // Create and add graphics with pop-ups
                        for (var i = 0; i < places.length; i++) {
                            addPlaceGraphic(places[i], symbol);
                        }
                        zoomToPlaces(places);
                    } else {
                        alert("Sorry, address or place not found.");
                    }
                }

                self.addPlacesGraphic = function (item, symbol) {
                    var place = {};
                    var attributes, infoTemplate, pt, graphic;
                    pt = item.feature.geometry;
                    place.address = item.name;
                    place.score = item.feature.attributes.Score;
                    // Graphic components
                    attributes = {
                        address: place.address,
                        score: place.score,
                        lat: pt.getLatitude().toFixed(2),
                        lon: pt.getLongitude().toFixed(2)
                    };
                    infoTemplate = new InfoTemplate("${address}", "Latitude: ${lat}<br/>Longitude: ${lon}<br/>Score: ${score}");
                    graphic = new Graphic(pt, symbol, attributes, infoTemplate);
                    // Add to map
                    mapModel.map.graphics.add(graphic);
                }

                self.zoomToPlaces = function (places) {
                    var multiPoint = new Multipoint(mapModel.map.spatialReference);
                    for (var i = 0; i < places.length; i++) {
                        //multiPoint.addPoint(places[i].location);
                        multiPoint.addPoint(places[i].feature.geometry);
                    }
                    mapModel.map.setExtent(multiPoint.getExtent().expand(2.0));
                }

                self.clearFindGraphics = function () {
                    mapModel.map.infoWindow.hide();
                    mapModel.map.graphics.clear();
                }

                self.createPictureSymbol = function (url, xOffset, yOffset) {
                    return new PictureMarkerSymbol({
                        "angle": 0,
                        "xoffset": xOffset,
                        "yoffset": yOffset,
                        "type": "esriPMS",
                        "url": url,
                        "contentType": "image/png",
                        "width": 12,
                        "height": 24
                    });
                }
                var sym = self.createPictureSymbol("img/blue-pin.png", 0, 12, 35);


            }; // end geoCodeVM

            return geoCodeVM;

      } // end function
    )
} ());