require([
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/query",
        "esri/map",
        "esri/dijit/Scalebar",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Geocoder",
        "esri/InfoTemplate",
        "esri/graphic",
        "esri/geometry/Multipoint",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/dijit/Popup",
        "dojo/_base/array",
        "dojo/_base/Color",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/dijit/Legend",
        "dijit/form/CheckBox",
        "dijit/form/HorizontalSlider",
        "dijit/form/HorizontalRule",
        "dijit/form/HorizontalRuleLabels",
        "vendor/bootstrapmap.js",
        "dojo/domReady!"
    ],

    function(dc, dom, on, parser, query, Map, Scalebar, HomeButton, LocateButton, Geocoder, InfoTemplate,
        Graphic, Multipoint, PictureMarkerSymbol, SimpleFillSymbol,
        SimpleLineSymbol, IdentifyTask, IdentifyParameters, Popup, arrayUtils, Color, ArcGISDynamicMapServiceLayer,
        FeatureLayer, Legend, CheckBox, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, BootstrapMap) {

        parser.parse();

         var identifyParams;
         var tocLayers = [];
         var legendLayers = [];

        //create a popup to replace the map's info window
        var fillSymbol3 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([0, 255, 255]), 2), new Color([0, 255, 255, 0.25]));
        var popup = new Popup({
            fillSymbol: fillSymbol3
        }, dc.create("div"));

        // create the map and specify the custom info window as the info window that will be used by the map
        // <!-- Get a reference to the ArcGIS Map class -->
        var map = BootstrapMap.create("mapDiv", {
            extent: new esri.geometry.Extent(appConfig.initExtent),
            lods: appConfig.lods,
            basemap: "streets",
            showAttribution: false,
            logo: false,
            infoWindow: popup,
            sliderPosition: "top-right"
        });

        map.on("load", mapReady);

        var scalebar = new Scalebar({
            map: map,
            // scalebarUnit: "dual"
            scalebarUnit: "english"
        });

        // create div for homebutton
        var homeButton = new HomeButton({
            map: map,
            visible: true //show the button
        }, dc.create("div", {
            id: "HomeButton"
        }, "mapDiv", "last"));
        homeButton._homeNode.title = "Original Extent";
        homeButton.startup();

        // create div for geolocatebutton
        var geoLocateButton = new LocateButton({
            map: map,
            visible: true
        }, dc.create("div", {
            id: "LocateButton"
        }, "mapDiv", "last"));
        geoLocateButton.startup();

        // create geosearch widget
        var geocoder = new Geocoder({
            value: "",
            maxLocations: 10,
            autoComplete: true,
            // arcgisGeocoder: true,
            arcgisGeocoder: {
                sourceCountry: "USA",
                placeholder: "155 N Tegner St, Wickenburg, AZ"
            },
            map: map
        }, "geosearch");
        geocoder.startup();
        geocoder.on("select", geocodeSelect);
        geocoder.on("findResults", geocodeResults);
        geocoder.on("clear", clearFindGraphics);

        //=================================================================================>
        // add layers to map

        var aerialURL = appConfig.aerialURL;
        var aerial = map.addLayer(new ArcGISDynamicMapServiceLayer(aerialURL, {
            id: "aerial",
            visible: false,
            opacity: "1"
        }));

        var wiZoningURL = appConfig.wiZoningURL;
        var wiZoning = map.addLayer(new ArcGISDynamicMapServiceLayer(wiZoningURL, {
          id: "wiZoning",
          visible: true,
          opacity: ".65"
           }));

        var wiFloodURL = appConfig.wiFloodURL;
        var wiFlood = map.addLayer(new ArcGISDynamicMapServiceLayer(wiFloodURL, {
            id: "wiFlood",
            visible: false,
            opacity: ".65"
        }));

         var tParcelsURL = appConfig.tParcelsURL;
        var tParcels = map.addLayer(new ArcGISDynamicMapServiceLayer(tParcelsURL, {
          id: "tParcels",
          visible: false,
          opacity: "1"
         }));

        // var mParcelsURL = appConfig.mParcelsURL;
        // var mParcels = map.addLayer(new ArcGISDynamicMapServiceLayer(mParcelsURL, {
        //   id: "mParcels",
        //   visible: false,
        //   opacity: "1"
         // }));

       // var content1 = ("Parcel ID: ${PARLABEL}<br>" +
       //                  "Address: ${ADDRESS}<br>" +
       //                  "City: ${CITY}<br>" +
       //                  "State: ${STATE}<br>" +
       //                  "Zip: ${ZIP}"
       //  );
       //  var infoTemplate1 = new InfoTemplate("Yavapai Assessor Info", content1);
       //  var yParcelsURL = appConfig.yParcelsURL;
       //  var yParcels = new FeatureLayer(yParcelsURL, {
       //      id: "yParcels",
       //      visible: false,
       //      opacity: "1",
       //      mode: FeatureLayer.MODE_ONDEMAND,
       //      outFields: ["*"],
       //      infoTemplate: infoTemplate1
       //  });
       //  map.addLayer(yParcels);

        var coBoundaryURL = appConfig.coBoundaryURL;
        var coBoundary = map.addLayer(new ArcGISDynamicMapServiceLayer(coBoundaryURL, {
            id: "coBoundary",
            visible: true,
            opacity: "1"
        }));

        var wiBoundaryURL = appConfig.wiBoundaryURL;
        var wiBoundary = map.addLayer(new ArcGISDynamicMapServiceLayer(wiBoundaryURL, {
            id: "wiBoundary",
            visible: true,
            opacity: "1"
        }));

        //TOC Layers
        tocLayers.push({layer: aerial, title: "Aerial Imagery"});
        // tocLayers.push({layer: yParcels, title: "Yavapai County Parcels"});
        // tocLayers.push({layer: mParcels, title: "Maricopa County Parcels"});
        tocLayers.push({layer: tParcels, title: "County Parcels"});
        tocLayers.push({layer: wiBoundary, title: "Wickenburg Boundary"});
        tocLayers.push({layer: wiFlood, title: "Wickenburg Flood Zone"});
        tocLayers.push({layer: wiZoning, title: "Wickenburg Zoning"});

        // Legend Layers
        // legendLayers.push({layer: yParcels, title: "Yavapai County Parcels"});
        // legendLayers.push({layer: mParcels, title: "Maricopa County Parcels"});
        legendLayers.push({layer: tParcels, title: "County Parcels"});
        legendLayers.push({layer: coBoundary, title: "Maricopa County Boundary"});
        legendLayers.push({layer: wiBoundary, title: "Wickenburg Town Boundary"});
        legendLayers.push({layer: wiFlood, title: "Wickenburg Flood Zone"});
        legendLayers.push({layer: wiZoning, title: "Wickenburg Zoning"});

        // create legend dijit
        var legend = new Legend({
            map: map,
            layerInfos: legendLayers
        }, "legendDiv");
        legend.startup();

        //add check boxes
        arrayUtils.forEach(tocLayers, function (layer) {
            var layerName = layer.title;
            var checkBox = new CheckBox({
                name    : "checkBox" + layer.layer.id,
                value   : layer.layer.id,
                checked : layer.layer.visible,
                onChange:function () {
                    var clayer = map.getLayer(this.value);
                    clayer.setVisibility(!clayer.visible);
                    this.checked = clayer.visible;
                }
            });

            //add the check box and label to the toc
            dc.place(checkBox.domNode, dom.byId("toggleDiv"));
            var checkLabel = dc.create("label", {
                "for":checkBox.name,
                innerHTML:"&nbsp;&nbsp;" + layerName
            }, checkBox.domNode, "after");
            dc.place("<br>", checkLabel, "after");

        });

        // wiFlood Transparency Slider
        var slider1 = new HorizontalSlider({
            name: "slider1",
            value: wiFlood.opacity,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            discreteValues:11,
            style: "width:250px;",
            onChange: function(value1){
                wiFlood.setOpacity(value1);
            }
        }, "slider1");

        // wiZoning Transparency Slider
        var slider2 = new HorizontalSlider({
            name: "slider2",
            value: wiZoning.opacity,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            discreteValues:11,
            style: "width:250px;",
            onChange: function(value2){
                wiZoning.setOpacity(value2);
            }
        }, "slider2");

        //=================================================================================>
        // Start Geocode Section

        function geosearch() {
            var def = geocoder.find();
            def.then(function(res) {
                geocodeResults(res);
            });
        }

        function geocodeSelect(item) {
            var g = (item.graphic ? item.graphic : item.result.feature);
            g.setSymbol(sym);
            addPlaceGraphic(item.result, g.symbol);
        }

        function geocodeResults(places) {
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

        function addPlaceGraphic(item, symbol) {
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
            map.graphics.add(graphic);
        }

        function zoomToPlaces(places) {
            var multiPoint = new Multipoint(map.spatialReference);
            for (var i = 0; i < places.length; i++) {
                //multiPoint.addPoint(places[i].location);
                multiPoint.addPoint(places[i].feature.geometry);
            }
            map.setExtent(multiPoint.getExtent().expand(2.0));
        }

        function clearFindGraphics() {
            map.infoWindow.hide();
            map.graphics.clear();
        }

        function createPictureSymbol(url, xOffset, yOffset) {
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

        var sym = createPictureSymbol("app/resources/img/blue-pin.png", 0, 12, 35);

        // End Geocode Section

//=================================================================================>
//create a link in the popup window.
//
        var link = dc.create("a", {
            "class": "action",
            "id": "statsLink",
            "innerHTML": "Assessor Info", //text that appears in the popup for the link
            "href": "javascript: void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        on(link, "click", function() {
            var feature = map.infoWindow.getSelectedFeature();
            // console.log(feature.attributes);
            var url = "";
            var link = "";
            if (feature.attributes.layerName === "Parcels") {
                url = window.location;
                link = appConfig.MaricopaAssessor + feature.attributes.APN;
                window.open(link);
            }
            if (feature.attributes.COUNTY === "13") {
                url = window.location;
                link = appConfig.YavapaiAssessor + feature.attributes.PARNUMASR;
                window.open(link);
            }
            else {
                // *** do nothing ***
            }

        });

// Identify Features
//=================================================================================>
function mapReady () {
    map.on("click", executeIdentifyTask);
    //create identify tasks and setup parameters
    identifyTask1 = new IdentifyTask(wiZoningURL);
    identifyTask2 = new IdentifyTask(yParcelsURL);
    identifyTask3 = new IdentifyTask(wiFloodURL);

    identifyParams = new IdentifyParameters();
    identifyParams.tolerance = 3;
    identifyParams.returnGeometry = true;
    identifyParams.layerIds = [0];
    identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
    identifyParams.width = map.width;
    identifyParams.height = map.height;

} // end mapReady

function executeIdentifyTask (event) {
    identifyParams.geometry = event.mapPoint;
    identifyParams.mapExtent = map.extent;

    var deferred1 = identifyTask1
    .execute(identifyParams)
    .addCallback(function (response) {
      // response is an array of identify result objects
      // Let's return an array of features.
      return arrayUtils.map(response, function (result) {
        var feature = result.feature;
        feature.attributes.layerName = result.layerName;

       if (feature.attributes.OBJECTID !== 0) {
            var template = new InfoTemplate();

            //wickenburg zoning
            template.setTitle("Wickenburg Zoning");
            template.setContent("Zoning Code: ${CODE}" +
                                "<br>Zoning Description: ${Description}"
             );
        feature.setInfoTemplate(template);

        } // end if
        return feature;
      });
    }); //end addCallback

    var deferred2 = identifyTask2
    .execute(identifyParams)
    .addCallback(function (response) {
      // response is an array of identify result objects
      // Let's return an array of features.
      return arrayUtils.map(response, function (result) {
        var feature = result.feature;
        feature.attributes.layerName = result.layerName;

       if (feature.attributes.OBJECTID !== 0) {
            // looking for nulls in data fields if found they are removed from content string
            var parcelsContent = "";
            if(dojo.trim(feature.attributes["PHYSICAL_STREET_NUM"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_STREET_NUM"]) !== ""){
                parcelsContent += "<br>Address: " + feature.attributes["PHYSICAL_STREET_NUM"] + " ";
            }
            if(dojo.trim(feature.attributes["PHYSICAL_STREET_DIR"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_STREET_DIR"]) !== ""){
                parcelsContent += feature.attributes["PHYSICAL_STREET_DIR"] + " ";
            }
            if(dojo.trim(feature.attributes["PHYSICAL_STREET_NAME"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_STREET_NAME"]) !== ""){
                parcelsContent += feature.attributes["PHYSICAL_STREET_NAME"] + " ";
            }
            if(dojo.trim(feature.attributes["PHYSICAL_STREET_TYPE"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_STREET_TYPE"]) !== ""){
                parcelsContent += feature.attributes["PHYSICAL_STREET_TYPE"];
            }
            if(dojo.trim(feature.attributes["PHYSICAL_CITY"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_CITY"]) !== ""){
                parcelsContent += "<br>City: " + feature.attributes["PHYSICAL_CITY"];
            }
            if(dojo.trim(feature.attributes["PHYSICAL_ZIP"]) !== "Null" && dojo.trim(feature.attributes["PHYSICAL_ZIP"]) !== ""){
                parcelsContent += "<br>Zip: " + feature.attributes["PHYSICAL_ZIP"];
            }
            //Maricopa parcels
            var template = new InfoTemplate();
            template.setTitle("County Parcels");
            template.setContent("Parcel APN: ${APN}" + parcelsContent);

        feature.setInfoTemplate(template);

        } // end if
        return feature;
      });
    }); //end addCallback

    var deferred3 = identifyTask3
    .execute(identifyParams)
    .addCallback(function (response) {
      // response is an array of identify result objects
      // Let's return an array of features.
      return arrayUtils.map(response, function (result) {
        var feature = result.feature;
        feature.attributes.layerName = result.layerName;

       if (feature.attributes.OBJECTID !== 0) {
            var template = new InfoTemplate();

            // Wickenburg zoning
            template.setTitle("Flood Zone");
            template.setContent("Flood Zone: ${ZONE}");
        feature.setInfoTemplate(template);
        }// end if
        return feature;
      });
    }); //end addCallback

    // InfoWindow expects an array of features from each deferred
    // object that you pass. If the response from the task execution
    // above is not an array of features, then you need to add a callback
    // like the one above to post-process the response and return an
    // array of features.
    map.infoWindow.setFeatures([deferred1, deferred2, deferred3]);
    map.infoWindow.show(event.mapPoint);

}  // end executeIdentifyTask



    }); // end Main Function

// contents open
//=================================================================================>

function toggleContent() {
    if ($("#legend").is(":hidden")) {
        $("#legend").slideDown();
        $("#legend").draggable({
            containment: "#mapDiv"
        });
        $("#contentsOpen");
    } else {
        $("#legend").slideUp();
        $("#contentsOpen");
    }
}

$(document).ready(function() {
    $("#contentsOpen").fadeTo("slow");
    $("#legend").fadeTo("slow");
    contentsOpen = $("#contentsOpen").height();
    $("#legend").css("top", contentsOpen);
    $("#contentsOpen").click(function() {
        toggleContent();
    });
});

//sets original position of dropdown
$(document).ready(function() {
    $("#legend").hide();
});

//*** Legal Disclaimer modal binding
 $(document).ready(function() {
     $("#legalDisclaimer").load("app/views/legalDisclaimer.html");
 });

 //*** Definitions modal binding
 $(document).ready(function() {
     $("#definitions").load("app/views/definitions.html");
 });

 //*** Help modal binding
 $(document).ready(function() {
     $("#helpCont").load("app/views/help.html");
 });
