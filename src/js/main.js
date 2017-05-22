/*! main.js | Wickenburg Zoning Website @ MAG */
var map, toolbar;
var graphicsCollection = [];
var fillColorSelection = {
    r: 0,
    g: 0,
    b: 255
};
var outlineColorSelection = {
    r: 0,
    g: 0,
    b: 0
};
require([
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/dom-style",
        "esri/toolbars/draw",
        "esri/toolbars/edit",
        "dojo/on",
        "dojo/parser",
        "dojo/_base/connect",
        "dojo/query",
        "dojo/keys",
        "esri/sniff",
        "esri/map",
        "esri/dijit/Measurement",
        "esri/dijit/Scalebar",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/graphic",
        "esri/geometry/Extent",
        "esri/geometry/Multipoint",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/TextSymbol",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/dijit/Popup",
        "dojo/_base/array",
        "dojo/_base/Color",
        "dojo/_base/event",
        "esri/layers/LayerDrawingOptions",
        "esri/renderers/SimpleRenderer",

        "esri/layers/ImageParameters",
        "esri/dijit/Search",
        "esri/tasks/locator",
        "esri/dijit/Legend",
        "dijit/form/CheckBox",
        "dijit/form/HorizontalSlider",
        "dijit/form/HorizontalRule",
        "dijit/form/HorizontalRuleLabels",

        "esri/dijit/BasemapToggle",

        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/dijit/PopupTemplate",
        "esri/InfoTemplate",
        "esri/symbols/SimpleMarkerSymbol",

        "esri/dijit/Print",
        "esri/tasks/PrintTemplate",
        "esri/request",
        "esri/config",


        "js/vendor/bootstrapmap.min.js",
        "dojo/domReady!"
    ],

    function(dc, dom, domStyle, Draw, Edit, on, parser, connect, query, keys, has, Map, Measurement, Scalebar, HomeButton, LocateButton,
        Graphic, Extent, Multipoint, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, TextSymbol, IdentifyTask, IdentifyParameters, Popup, arrayUtils, Color, event, LayerDrawingOptions, SimpleRenderer, ImageParameters, Search, Locator, Legend, CheckBox, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, BasemapToggle, FeatureLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, PopupTemplate, InfoTemplate, SimpleMarkerSymbol, Print, PrintTemplate, esriRequest, esriConfig, BootstrapMap) {

        parser.parse();

        esri.config.defaults.io.proxyUrl = "proxy/proxy.ashx";
        esri.config.defaults.io.alwaysUseProxy = false;

        // add version and date to about.html, changed in config.js
        dom.byId("version").innerHTML = appConfig.Version;

        // add pdf links to window
        dom.byId("demLink").setAttribute("href", appConfig.demService);
        dom.byId("empLink").setAttribute("href", appConfig.empService);

        var multiple = false;

        // var identifyParams;
        var tocLayers = [];
        var legendLayers = [];

        var newOP = 1;

        // line set up for measurement tool
        var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 128, 255]), 3), null);

        // create a popup to replace the map's info window
        var fillSymbol3 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 255, 255]), 2), new Color([0, 255, 255, 0.25]));

        var pointSymbol = new SimpleMarkerSymbol("circle", 26, null,
            new Color([0, 0, 0, 0.25]));

        var popup = new Popup({
            fillSymbol: fillSymbol3,
            markerSymbol: pointSymbol,
            visibleWhenEmpty: false,
            keepHighlightOnHide: false,
            hideDelay: -1
        }, dc.create("div"));
        popup.on("show", highlightMultipleParcels); //back here;
        popup.on("hide", highlightMultipleParcels); //back here;

        // create the map and specify the custom info window as the info window that will be used by the map
        // <!-- Get a reference to the ArcGIS Map class -->
        map = BootstrapMap.create("mapDiv", {
            extent: new Extent(appConfig.initExtent),
            basemap: "streets",
            minZoom: 11,
            maxZoom: 19,
            showAttribution: false,
            logo: false,
            infoWindow: popup,
            sliderPosition: "top-right",
            scrollWheelZoom: true
        });
        // console.log(map.getLayer(map.basemapLayerIds).opacity);

        var search = new Search({
            map: map,
            sources: [{
                locator: new Locator(appConfig.LocatorService),
                singleLineFieldName: "SingleLine",
                autoNavigate: true,
                enableInfoWindow: true,
                enableHighlight: false,
                autoSelect: false,
                showInfoWindowOnSelect: true,
                name: "Address",
                searchExtent: new Extent(appConfig.initExtent),
                placeholder: "21 North Frontier Street"
            }]
        }, "search");
        search.startup();

        var newpopup;
        connect.connect(popup, "onClearFeatures", function() {
            newpopup = popup;
        });

        map.on("load", mapReady);

        $("#highlight").hide();

        $("#multiple").click(function() {
            $(this).data("clicked", true);
            multiple = true;
        });

        var single = $("#single");

        single.click(function() {
            multiple = false;
        });

        $("#clearHighlights").click(function() {
            multiple = false;
            map.graphics.clear();

            for (var i = 0; i < graphicsCollection.length; i++) {
                map.graphics.add(graphicsCollection[i]);
            }

            // map.graphics.add(graphicsCollection);
            $(single).prop("checked", true);

        });

        // remove event listener on map close
        // map.on("unload", executeIdentifyTask);

        var scalebar = new Scalebar({
            map: map,
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
            visible: true,
        }, dc.create("div", {
            id: "LocateButton"
        }, "mapDiv", "last"));

        geoLocateButton.on("locate", function(evt) {
            disablepopup();
        });
        geoLocateButton.startup();

        // var toggleBasemap = new BasemapToggle({
        //     // theme: "basemapToggle",
        //     map: map,
        //     visible: true,
        //     basemap: "satellite"
        // }, dc.create("div", {
        //     id: "BasemapToggle"
        // }, "mapDiv", "last"));
        // toggleBasemap.startup();

        // toggleBasemap.on("toggle", function(evt) {
        //     if (evt.currentBasemap === "streets") {
        //         domStyle.set(dom.byId("worldImg"), "display", "none");
        //         domStyle.set(dom.byId("worldStr"), "display", "list-item");
        //         newOP = 0;
        //         value4 = 1
        //     }
        //     if (evt.currentBasemap === "satellite") {
        //         domStyle.set(dom.byId("worldStr"), "display", "none");
        //         domStyle.set(dom.byId("worldImg"), "display", "list-item");
        //         newOP = 1;
        //         value4 = 0;
        //     }
        // });


        // Print Functions for Print dijit
        //=================================================================================>
        // get print templates from the export web map task
        var printInfo = esriRequest({
            "url": appConfig.printUrl,
            "content": {
                "f": "json"
            }
        });
        printInfo.then(handlePrintInfo, handleError);

        function handlePrintInfo(resp) {
            var layoutTemplate, templateNames, mapOnlyIndex, templates;

            layoutTemplate = arrayUtils.filter(resp.parameters, function(param, idx) {
                return param.name === "Layout_Template";
            });

            if (layoutTemplate.length === 0) {
                console.log("print service parameters name for templates must be \"Layout_Template\"");
                return;
            }
            templateNames = layoutTemplate[0].choiceList;

            // remove the MAP_ONLY template from the dropdown list
            mapOnlyRemove = arrayUtils.indexOf(templateNames, "MAP_ONLY");
            if (mapOnlyRemove > -1) {
                templateNames.splice(mapOnlyRemove, mapOnlyRemove);
            }

            // create a print template for each choice
            templates = arrayUtils.map(templateNames, function(ch) {
                var plate = new PrintTemplate();
                plate.layout = plate.label = ch;
                plate.format = "PDF";
                plate.layoutOptions = {
                    "titleText": "Wickenburg Zoning"
                };
                return plate;
            });

            // create the print dijit
            printer = new Print({
                "map": map,
                "templates": templates,
                url: appConfig.printUrl
            }, dom.byId("printButton"));
            printer.startup();
        }

        function handleError(err) {
            console.log("Something broke: ", err);
        }

        //=================================================================================>
        // add layers to map

        appConfig.layerInfo.sort(dynamicSort("-mapOrder"));
        for (var i = 0; i < appConfig.layerInfo.length; i++) {
            var configItem = appConfig.layerInfo[i];
            var popupBox = "";

            if (configItem.popupHeader !== "" && configItem.popupBody !== "") {
                popupBox = new InfoTemplate(configItem.popupHeader, configItem.popupBody);
            }
            var layer = new FeatureLayer(configItem.url, {
                id: configItem.id,
                mode: FeatureLayer.MODE_ONDEMAND,
                visible: configItem.visible,
                infoTemplate: popupBox,
                opacity: configItem.opacity,
                outFields: ["*"]
            });
            map.addLayer(layer);
            if (configItem.showLegend === true) {
                legendLayers.push({
                    layer: map.getLayer(configItem.id),
                    id: configItem.id,
                    title: configItem.title,
                    legendOrder: configItem.legendOrder
                });
            }
            if (configItem.showCheckBox === true) {
                tocLayers.push({
                    layer: map.getLayer(configItem.id),
                    id: configItem.id,
                    title: configItem.title,
                    tocOrder: configItem.tocOrder
                });
            }
        }

        tocLayers.sort(dynamicSort("-tocOrder"));
        legendLayers.sort(dynamicSort("-legendOrder"));

        // added for transparency slider option
        // World Imagery
        var imgBasemapI = new ArcGISTiledMapServiceLayer(appConfig.imageryLayer, {
            visible: false
        });
        map.addLayer(imgBasemapI);
        // World Street Map
        // var imgBasemapS = new ArcGISTiledMapServiceLayer(appConfig.streetsLayer, {
        //     visible: false
        // });
        // map.addLayer(imgBasemapS);


        // Measurement Tool
        //=================================================================================>

        var measurement = new Measurement({
            map: map,
            lineSymbol: sfs
        }, dom.byId("measurementDiv"));
        measurement.on("measure-start", function(evt) {
            map.setInfoWindowOnClick(false);
            //disablepopup();
        });
        measurement.on("measure-end", function(evt) {
            map.setInfoWindowOnClick(true);
        });
        measurement.startup();

        function killPopUp() {
            var toolName = this.dojoAttachPoint;
            var activeTool = measurement[toolName].checked;
            if (activeTool === true) {
                // kill the popup
            }
            if (activeTool !== true) {
                // turn popups back on
            }
        }

        function highlightMultipleParcels(e) {
            if ($("#multiple").is(":checked")) {
                disablepopup();
                if (e.target.features[0]._layer.id === "tParcels") {
                    var graphic = new Graphic(e.target._highlighted.geometry, e.target._highlighted.symbol);
                    map.graphics.add(graphic);
                }
            } else {
                //map.graphics.clear();
                for (var i = 0; i < graphicsCollection.length; i++) {
                    map.graphics.add(graphicsCollection[i]);
                }
            }
        }

        // create legend dijit
        var legend = new Legend({
            map: map,
            layerInfos: legendLayers
        }, "legendDiv");
        legend.startup();

        //add check boxes
        arrayUtils.forEach(tocLayers, function(layer) {
            var layerName = layer.title;
            var checkBox = new CheckBox({
                name: "checkBox" + layer.layer.id,
                value: layer.layer.id,
                checked: layer.layer.visible,
                onChange: function() {
                    var clayer = map.getLayer(this.value);
                    clayer.setVisibility(!clayer.visible);
                    if (this.value === "tParcels") {
                        if (this.checked) {
                            clayer.visible;
                            showSlider(1);
                            $("#highlight").fadeIn();
                        } else {
                            $("#highlight").fadeOut();
                            showSlider(0);
                        }
                    }
                    if (this.value === "wiZoning") {
                        if (this.checked) {
                            $("#zoneDefinitionsLink").show();
                        } else {
                            $("#zoneDefinitionsLink").hide();
                        }
                    }
                    if (this.value === "wiFlood" || this.value === "wiPendFlood") {
                        if (map.getLayer("wiFlood").visible || map.getLayer("wiPendFlood").visible) {
                            $("#floodZoneDefinitionsLink").show();
                        } else {
                            $("#floodZoneDefinitionsLink").hide();
                        }
                    }
                }
            }); //end CheckBox

            //add the check box and label to the toc
            dc.place(checkBox.domNode, dom.byId("toggleDiv"));
            var checkLabel = dc.create("label", {
                "for": checkBox.name,
                innerHTML: "&nbsp;&nbsp;" + layerName
            }, checkBox.domNode, "after");
            dc.place("<br>", checkLabel, "after");
        });

        // wiFlood Transparency Slider
        var slider1 = new HorizontalSlider({
            name: "slider1",
            value: map.getLayer("wiFlood").opacity,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            discreteValues: 11,
            style: "width:250px;",
            onChange: function(value1) {
                map.getLayer("wiFlood").setOpacity(value1);
            }
        }, "slider1");

        // wiZoning Transparency Slider
        var slider2 = new HorizontalSlider({
            name: "slider2",
            value: map.getLayer("wiZoning").opacity,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            discreteValues: 11,
            style: "width:250px;",
            onChange: function(value2) {
                map.getLayer("wiZoning").setOpacity(value2);
            }
        }, "slider2");

        // basemap Transparency Slider
        var slider4 = new HorizontalSlider({
            name: "slider4",
            value: map.getLayer(map.basemapLayerIds).opacity,
            minimum: 0,
            maximum: 1,
            intermediateChanges: true,
            discreteValues: 11,
            style: "width:250px;",
            onChange: function(value4) {
                // console.log("value4: " + value4);
                // console.log(map.getLayer(map.basemapLayerIds).layerInfos[0].name);
                var baseLayerName = map.getLayer(map.basemapLayerIds).layerInfos[0].name;
                // console.log(baseLayerName);
                newOP = 1 - value4;
                // console.log("newOP: " + newOP);

                // if (baseLayerName === "World Street Map") {
                //     imgBasemapI.show();
                //     map.getLayer(map.basemapLayerIds).setOpacity(value4);
                //     imgBasemapI.setOpacity(newOP);

                //     if (newOP === 0) {
                //         imgBasemapI.hide();
                //     }
                // }
                // if (baseLayerName === "World Imagery") {
                //     imgBasemapS.show();
                //     map.getLayer(map.basemapLayerIds).setOpacity(value4);
                //     imgBasemapS.setOpacity(newOP);

                //     if (newOP === 0) {
                //         imgBasemapS.hide();
                //     }
                // }

                imgBasemapI.show();
                map.getLayer(map.basemapLayerIds).setOpacity(value4);
                imgBasemapI.setOpacity(newOP);

                if (newOP === 0) {
                    imgBasemapI.hide();
                }
                // console.log("newOP: " + newOP);
                // console.log("image: " + imgBasemap.opacity);
                // console.log("streets: " + map.getLayer(map.basemapLayerIds).opacity);
            }
        }, "slider4");

        // parcel line thickness Slider
        var slider3 = new HorizontalSlider({
            name: "slider3",
            value: 0.5,
            minimum: 1,
            maximum: 5,
            intermediateChanges: true,
            discreteValues: 11,
            style: "width:250px;",
            onChange: function(value3) {
                updateParcelThickness(value3);
            }
        }, "slider3");

        function updateParcelThickness(value) {
            var parcelLayer = map.getLayer("tParcels");

            var sls = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 170, 0]),
                1
            );
            sls.setWidth(value);
            var renderer = new SimpleRenderer(sls);
            parcelLayer.setRenderer(renderer);
            parcelLayer.refresh();
        }

        function showSlider(value) {
            if (value === 1) {
                //Show Slider Div
                $("#ThicknessSlider").fadeIn();
            } else {
                //Hide Slider Div
                $("#ThicknessSlider").fadeOut();
            }
        }

        //create a link in the popup window.
        var alink = dc.create("a", {
            "class": "action",
            "id": "aInfoLink",
            "innerHTML": "Assessor Info", //text that appears in the popup for the link
            "href": "javascript: void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        on(alink, "click", function() {
            var feature = map.infoWindow.getSelectedFeature();
            console.log(feature);
            var url = window.location;

            var alink = "";
            if (feature.attributes.COUNTYFP10 === "013") {
                alink = appConfig.MaricopaAssessor + feature.attributes.PARCEL_APN;
                window.open(alink);
            } else if (feature.attributes.COUNTYFP10 === "025") {
                alink = appConfig.YavapaiAssessor + feature.attributes.PARCEL_APN;
                window.open(alink);
            }
        });

        //create a link in the popup window.
        var rlink = dc.create("a", {
            "class": "action",
            "id": "rInfoLink",
            "innerHTML": "Recorder Info", //text that appears in the popup for the link
            "href": "javascript: void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        on(rlink, "click", function() {
            var feature = map.infoWindow.getSelectedFeature();
            console.log(feature);
            var url = window.location;

            var rlink = appConfig.MaricopaRecorder + feature.attributes.MCR_BOOK + "&page=" + feature.attributes.MCR_PAGE;
            window.open(rlink);
        });

        /**
         * Determines what shows up in the action link section of the popup
         * @param  {[type]} ) {var graphic [description]
         * @return {[type]}   returns action link in popup
         */
        connect.connect(popup, "onSelectionChange", function() {
            var graphic = popup.getSelectedFeature();
            // console.log(graphic);
            if (graphic) {
                // console.log(graphic);
                if (graphic.attributes.PARCEL_APN) {
                    $("#aInfoLink").show();
                    $("#rInfoLink").hide();
                } else if (graphic.attributes.MCR) {
                    $("#rInfoLink").show();
                    $("#aInfoLink").hide();
                } else {
                    $("#aInfoLink").hide();
                    $("#rInfoLink").hide();
                }
            }
        });

        // Identify Features
        //=================================================================================>

        function mapReady() {
            $(".esriSimpleSliderDecrementButton").addClass("esriSimpleSliderDisabledButton");
            createToolbar();
            createEditToolbar();
            $("#btnUndo").click(undoGraphic);
            $("#btnAdd").click(addBtnClick);
            $("#markupDropdown").change(dropdownChanged);
            $(".color").colorPicker({
                renderCallback: function($elm, toggled) {
                    if (toggled === false) {
                        if (editToolbar._graphic) {
                            if ($elm[0].id === "picker1") {
                                onFillColorPaletteSelection($elm[0].value);
                            } else if ($elm[0].id === "picker2") {
                                onOutlineColorPaletteSelection($elm[0].value);
                            }
                        }
                    }
                }
            });

            $("body").on("mousemove", function(e) {
                $("#tail").css({
                    left: e.pageX + 20,
                    top: e.pageY
                });
            });

            $("#tail").hide();


            $("#fillTransparencySlider").slider({
                min: 0,
                max: 1,
                step: 0.1,
                value: appConfig.fillColorOpacity
            });
        } // end mapReady

        function createToolbar(themap) {
            toolbar = new Draw(map);
            toolbar.on("draw-end", addToMap);
        }

        function activateTool() {
            var tool = $("#markupDropdown").val();
            toolbar.activate(Draw[tool]);
            map.setInfoWindowOnClick(false);
            $("#tail").show();
            disablepopup();
            map.hideZoomSlider();
        }

        function createEditToolbar() {
            editToolbar = new Edit(map);

            //Activate the toolbar when you click on a graphic
            map.graphics.on("click", function(evt) {

                if ($("#btnEdit").hasClass("btn-primary")) {
                    event.stop(evt);
                    activateEditToolbar(evt.graphic);
                    $(".editMarkupBtns button").removeClass("btn-primary");
                } else if ($("#btnErase").hasClass("btn-primary")) {
                    map.graphics.remove(evt.graphic);
                    $(".editMarkupBtns button").removeClass("btn-primary");
                }
            });
            //deactivate the toolbar when you click outside a graphic
            map.on("click", function(evt) {
                editToolbar.deactivate();
            });
        }

        function activateEditToolbar(graphic) {
            var tool = 0;
            tool = tool | Edit.MOVE;
            tool = tool | Edit.EDIT_VERTICES;
            tool = tool | Edit.SCALE;
            tool = tool | Edit.ROTATE;
            // enable text editing if a graphic uses a text symbol
            if (graphic.symbol.declaredClass === "esri.symbol.TextSymbol") {
                tool = tool | Edit.EDIT_TEXT;
            }
            //specify toolbar options
            var options = {
                allowAddVertices: true,
                allowDeleteVertices: true,
                uniformScaling: true
            };
            editToolbar.activate(tool, graphic, options);
        }

        function undoGraphic() {

            var graphicsToRemove = graphicsCollection.pop();
            map.graphics.remove(graphicsToRemove);

            $(".editMarkupBtns button").removeClass("btn-primary");

        }

        function disablepopup() {
            map.infoWindow.hide();
        }

        function addToMap(evt) {
            map.setInfoWindowOnClick(true);
            var symbol;
            $("#tail").hide();
            toolbar.deactivate();
            map.showZoomSlider();
            var outlineColor = $("#outlineColor :first-child").css("background-color");
            var transparencyValue = $("#fillTransparencySlider").slider("option", "value");
            var fillColor = $("#fillColor :first-child").css("background-color");
            fillColor = fillColor.slice(0, -1) + ", " + transparencyValue + ")";
            var fontSize = $("#textDropdown").val();
            var text = $("#inputText").val();
            switch (evt.geometry.type) {
                case "point":
                    symbol = new TextSymbol();
                    symbol.setText(text);
                    var font = new esri.symbol.Font();
                    font.setSize(fontSize);
                    var color = new Color();
                    color.setColor(fillColor);
                    symbol.setFont(font);
                    symbol.setColor(color);
                    break;
                case "multipoint":
                    symbol = new SimpleMarkerSymbol();
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol();
                    break;
                default:
                    symbol = new SimpleFillSymbol(
                        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, outlineColor, 3),
                        fillColor
                    );
                    break;
            }

            var graphic = new Graphic(evt.geometry, symbol);
            graphicsCollection.push(graphic);
            map.graphics.add(graphic);
            $("#btnAdd").removeClass("btn-primary");
            $("*").css("cursor", "default");
        }

        function addBtnClick() {
            var selection = $("#markupDropdown").val();
            var textSettings = $("#textSettings");
            var outlineDiv = $("#outlineColor");
            var textBox = $("#inputText");

            $(".editMarkupBtns button").removeClass("btn-primary");

            activateTool();
            $("#btnAdd").addClass("btn-primary");
            $("*").css("cursor", "crosshair");

            switch (selection) {
                case "POINT":
                    var value = $(textBox).val();
                    if (value === "") {
                        $(textBox).css("border", "2px solid red");
                        $("*").css("cursor", "default");
                        $(".editMarkupBtns button").removeClass("btn-primary");
                        alert("Please enter a text value before trying to add a label.");
                    }
                    break;
                case "POLYGON":
                    break;
                case "CIRCLE":
                    break;
                case "ARROW":
                    break;
                case "FREEHAND_POLYGON":
                    break;
            }
        }

        function dropdownChanged(e) {
            if (e.target.value === "POINT") {
                $("#textSettings").show();
                $("#outlineColor").hide();
            } else {
                $("#textSettings").hide();
                $("#outlineColor").show();
            }
        }

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function onFillColorPaletteSelection(e) {
            var value = hexToRgb(e);
            fillColorSelection = value;
            if (editToolbar._vertexEditor !== null && editToolbar._graphic !== null) {
                updateGraphicSymbol();
            } else {
                updateTextSymbol();
            }

        }

        function onOutlineColorPaletteSelection(e) {
            var value = e;
            outlineColorSelection = value;
            if (editToolbar._graphic !== null) {
                updateGraphicSymbol();
            }
        }

        function updateGraphicSymbol() {
            var fill = fillColorSelection;
            var outline = outlineColorSelection;
            var fillColorOpacity = $("#fillTransparencySlider").slider("option", "value");

            var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color(outline), 3), new Color([fill.r, fill.g, fill.b, fillColorOpacity]));

            editToolbar._graphic.setSymbol(symbol);
        }

        function updateTextSymbol() {
            var fill = fillColorSelection;

            var textSymbol = new TextSymbol(self.textInput()).setColor(new Color([fill.r, fill.g, fill.b, 1]));
            var font = new Font();
            font.setSize(self.fontSize.toString() + "pt");
            textSymbol.setFont(font);
            editToolbar._graphic.setSymbol(textSymbol);
        }

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function(a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            };
        }

    }); // end Main Function

// contents open
//=================================================================================>
function toggleContent() {
    if ($("#legend").is(":hidden")) {
        $("#legend").fadeIn();
        $("#legend").draggable({
            containment: "#mapDiv"
        });
        $("#contentsOpen");
    } else {
        $("#legend").fadeOut();
        $("#contentsOpen");
    }
}

$(document).ready(function() {
    $("#contentsOpen").fadeTo("slow");
    $("#legend").fadeTo("slow");
    $("#legend").draggable({
        containment: "#mapDiv"
    });
    contentsOpen = $("#contentsOpen").height();
    $("#legend").css("top", "55px");
    $("#contentsOpen").click(function() {
        toggleContent();
    });
});

//sets original position of dropdown
// $(document).ready(function() {
//     $("#legend").hide();
// });

// Measurement Tool open
//=================================================================================>
function toggleMTool() {
    if ($("#mTool").is(":hidden")) {
        $("#mTool").fadeIn();
        $("#mTool").draggable({
            containment: "#mapDiv"
        });
        $("#measureOpen");
    } else {
        $("#mTool").fadeOut();
        $("#measureOpen");
    }
}

$(document).ready(function() {
    $("#measureOpen").fadeTo("slow");
    $("#mTool").fadeTo("slow");
    measureOpen = $("#measureOpen").height();
    $("#mTool").css("top", "55px");
    $("#measureOpen").click(function() {
        toggleMTool();
    });
});

//sets original position of dropdown for measurement tool
$(document).ready(function() {
    $("#mTool").hide();
});

// Print Tool open
//=================================================================================>
function togglePrint() {
    if ($("#printTool").is(":hidden")) {
        $("#printTool").fadeIn();
        $("#printTool").draggable({
            containment: "#mapDiv"
        });
        $("#printOpen");
    } else {
        $("#printTool").fadeOut();
        $("#printOpen");
    }
}
// Report Window open
//=================================================================================>
function toggleReportWindow() {
    if ($("#reportTool").is(":hidden")) {
        $("#reportTool").fadeIn();
        $("#reportTool").draggable({
            containment: "#mapDiv"
        });
    } else {
        $("#reportTool").fadeOut();
        $("#reportOpen");
    }
}

$(document).ready(function() {
    $("#printOpen").fadeTo("slow");
    $("#printTool").fadeTo("slow");
    printOpen = $("#printOpen").height();
    $("#printTool").css("top", "55px");
    $("#printOpen").click(function() {
        togglePrint();
    });
    $("#reportOpen").fadeTo("slow");
    $("#reportTool").fadeTo("slow");
    reportOpen = $("#reportOpen").height();
    $("#reportOpen").click(function() {
        toggleReportWindow();
    });

});

// Markup Tools open
//=================================================================================>
function toggleMarkupTools() {
    if ($("#markupTool").is(":hidden")) {
        $("#markupTool").fadeIn();
        $("#markupTool").draggable({
            containment: "#mapDiv"
        });
    } else {
        $("#markupTool").fadeOut();
    }
    $("#textSettings").hide();
}

function toggleSelectedButton(sender) {
    $(".btn-primary").removeClass("btn-primary");
    $("#" + sender).addClass("btn-primary");
}

$(document).ready(function() {

    $("#markupOpen").fadeTo("slow");
    $("#markupTool").fadeTo("slow");
    $("#markupTool").css("top", "55px");
    $("#markupOpen").click(function() {
        toggleMarkupTools();
        $("#picker1").css("background-color", appConfig.defaultFillColor); //set default fill color
        $("#picker2").css("background-color", appConfig.defaultOutlineColor); //set default outline color
    });

});

//sets original position of dropdown for Print and Report tools
$(document).ready(function() {
    $("#printTool").hide();
    $("#reportTool").hide();
    $("#markupTool").hide();
});
// Bindings
//=================================================================================>
//
$(document).ready(function() {
    //*** Content binding
    $("#legend").load("views/contents.html");
    //*** Content Help modal binding
    $("#helpContent").load("views/helpContent.html");
    //*** About modal binding
    $("#aboutInfo").load("views/about.html");
    //*** Legal Disclaimer modal binding
    $("#legalDisclaimer").load("views/legalDisclaimer.html");
    //*** Definitions modal binding
    $("#definitions").load("views/definitions.html");
    //*** Definitions modal binding
    $("#floodDefinitions").load("views/floodDefinitions.html");
    //*** Measurement Tool binding
    $("#mTool").load("views/measureTool.html");
    //*** Measurement Tool Help modal binding
    $("#helpTool").load("views/helpTool.html");
    // *** Print Tool modal binding
    $("#printTool").load("views/printTool.html");
    //*** Print Tool Help modal binding
    $("#helpPrint").load("views/helpPrint.html");
    //*** Report Window modal binding
    $("#reportTool").load("views/reportWindow.html");
    //*** Markup Tool modal binding
    $("#markupTool").load("views/markupTool.html");
    //*** Markup Tool Help modal binding
    $("#helpMarkup").load("views/helpMarkup.html");
});