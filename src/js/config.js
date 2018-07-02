/* ========================================================================
 * Maricopa Association of Governments
 * JavaScript file for MAG Wickenburg Zoning Map Viewer
 * @config.js
 * http://geo.azmag.gov/maps/wickenburg/
 * MAG Wickenburg Zoning Map Viewer
 * ==========================================================================
 * @Copyright 2017 MAG
 * @License MIT
 * ========================================================================== */

var appConfig = new function() {

    this.mainURL = "http://geo.azmag.gov/gismag/rest/services/maps/WickenburgData/MapServer";

    this.layerInfo = [{
        layerNum: 0,
        id: "wiZoning",
        url: this.mainURL + "/8",
        title: "Zoning",
        visible: false,
        opacity: 0.6,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Wickenburg Zoning",
        popupBody: "Zoning Code: ${CODE}" + "<br>Zoning Description: ${DESCRIPTION}",
        tocOrder: 1,
        legendOrder: 1,
        mapOrder: 11
    }, {
        layerNum: 1,
        id: "wiFlood",
        url: this.mainURL + "/5",
        title: "Flood Zone",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Flood Zone",
        popupBody: "Flood Zone: ${ZONE}",
        tocOrder: 7,
        legendOrder: 6,
        mapOrder: 6
    }, {
        layerNum: 2,
        id: "wiPendFlood",
        url: this.mainURL + "/6",
        title: "Flood Zone Pending",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Flood Zone Pending",
        popupBody: "Pending Flood Zone: ${FloodZone}",
        tocOrder: 6,
        legendOrder: 7,
        mapOrder: 5
    }, {
        layerNum: 3,
        id: "tParcels",
        url: this.mainURL + "/2",
        title: "Parcels",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Parcels",
        popupBody: "County: ${COUNTY}<br>" + "Parcel: ${PARCEL_APN_LABEL}<br>" + "Address: ${P_ADDRESS}",
        tocOrder: 4,
        legendOrder: 4,
        mapOrder: 4
    }, {
        layerNum: 4,
        id: "coBoundary",
        url: this.mainURL + "/4",
        title: "County Boundary",
        visible: true,
        opacity: 1,
        showLegend: true,
        showCheckBox: false,
        popupHeader: "",
        popupBody: "",
        legendOrder: 11,
        mapOrder: 10
    }, {
        layerNum: 5,
        id: "wiBoundary",
        url: this.mainURL + "/3",
        title: "Town Boundary",
        visible: true,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "",
        popupBody: "",
        tocOrder: 2,
        legendOrder: 8,
        mapOrder: 8
    }, {
        layerNum: 6,
        id: "wiMPA",
        url: this.mainURL + "/10",
        title: "Municipal Planning Area",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "",
        popupBody: "",
        tocOrder: 5,
        legendOrder: 9,
        mapOrder: 9
    }, {
        layerNum: 7,
        id: "wiBlockGroups",
        url: this.mainURL + "/9",
        title: "Block Groups",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Wickenburg Block Groups",
        popupBody: "<strong>GEOID:  ${GEOID10}</strong><br>" + "<b>Total Persons:</b>  ${LOWMODUNIV:NumberFormat}<br>" + "<b>Low Income:</b>  ${LOW:NumberFormat}<br>" + "<b>Low & Moderate Income:</b>  ${LOWMOD:NumberFormat}<br>" + "<b>Low, Moderate, & Medium Income:</b>  ${LMMI:NumberFormat}<br>" + "<b>% Low & Moderate Income:</b> ${LOWMOD_PCT:NumberFormat}%",
        tocOrder: 10,
        legendOrder: 10,
        mapOrder: 7
    }, {
        layerNum: 8,
        id: "wiEmployers",
        url: this.mainURL + "/1",
        title: "Employers, 5+ employees",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "Employers",
        popupBody: "<strong>${EmpName}</strong><hr class='pLine'>${Address}</br>" + "${Jurisdiction}, ${State} ${Zip}<br>" + "Type:  ${Cluster}",
        tocOrder: 8,
        legendOrder: 3,
        mapOrder: 2
    }, {
        layerNum: 9,
        id: "wiBLI",
        url: this.mainURL + "/0",
        title: "Building & Landmark Inventory",
        visible: true,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "${Name}",
        popupBody: "<hr class='pLine'> Category:  ${BLI_Cat}<br> Sub Category: ${SubCat}<br> Website: ${Website}",
        tocOrder: 9,
        legendOrder: 2,
        mapOrder: 1
    }, {
        layerNum: 10,
        id: "wiSubdivisions",
        url: this.mainURL + "/7",
        title: "Subdivisions",
        visible: false,
        opacity: 1,
        showLegend: true,
        showCheckBox: true,
        popupHeader: "${NAME}",
        popupBody: "<hr class='pLine'> MCR:  ${MCR}",
        tocOrder: 3,
        legendOrder: 5,
        mapOrder: 3
    }];

    this.streetsLayer = "http://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer";
    this.imageryLayer = "http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer";

    this.Version = "v3.8.0 | 2017-06-29";

    this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    this.MaricopaAssessor = "http://mcassessor.maricopa.gov/mcs.php?q=";
    this.YavapaiAssessor = "http://gis.yavapai.us/v4/print_parcel.aspx?qs=";

    this.MaricopaRecorder = "http://recorder.maricopa.gov/recdocdata/GetBookMap.aspx?docket=";

    // this.GeometryService = "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"; // Esri test service
    this.GeometryService = "http://geo.azmag.gov/gismag/rest/services/Utilities/Geometry/GeometryServer"; // MAGs service

    this.LocatorService = "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    this.printUrl = "http://geo.azmag.gov/gismag/rest/services/gp/Wickenburg_Print/GPServer/Export%20Web%20Map"; // MAG Wickenburg Print service
    // "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" // Esri test service

    // Demographic PDF report
    this.demService = "http://geo.azmag.gov/services/demographics2015/reports.html?city=Wickenburg";
    // Employment PDF report
    this.empService = "http://geo.azmag.gov/services/employment2016/reports.html?jurisdiction=Wickenburg";

    this.initExtent = {
        "xmin": -12570767,
        "ymin": 4018810,
        "xmax": -12534077,
        "ymax": 4037517,
        "spatialReference": {
            "wkid": 102100
        }
    };

    this.center = [-112.343, 33.285]; // center on Wickenburg

    // ------------------------------
    // MARKUP TOOL SETTINGS
    // ------------------------------

    // Specify the Markup / drawing tools.
    this.markupToolTreeNodes =
        [{
        id: 1,
        text: "Polygon",
        DisplayText: "Polygon",
        Type: "POLYGON"
    }, {
        id: 2,
        text: "Circle",
        DisplayText: "Circle",
        Type: "CIRCLE"
    }, {
        id: 3,
        text: "Arrow",
        DisplayText: "Arrow",
        Type: "ARROW"
    }, {
        id: 4,
        text: "Freehand",
        DisplayText: "Freehand Polygon",
        Type: "FREEHAND_POLYGON"
    }, {
        id: 5,
        text: "Text",
        DisplayText: "Text",
        Type: "POINT"
    }];

    this.fillColorOpacity = 0.75;

    this.textSymbolFontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 50];

    this.defaultOutlineColor = [0, 0, 0];

    this.defaultFillColor = [0, 0, 255];

}; //End Config
