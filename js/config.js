var appConfig = new function() {

        this.mainURL = "http://geo.azmag.gov/gismag/rest/services/maps/WickenburgData2016/MapServer";

        this.layerInfo = [
        {
            id: "wiZoning",
            url: this.mainURL + "/8",
            title: "Zoning",
            visible: true,
            opacity: .6,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Wickenburg Zoning",
            popupBody: "Zoning Code: ${CODE}" + "<br>Zoning Description: ${DESCRIPTION}"
        },{
            id: "wiFlood",
            url: this.mainURL + "/5",
            title: "Flood Zone",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Flood Zone",
            popupBody: "Flood Zone: ${ZONE}"
        },{
            id: "wiPendFlood",
            url: this.mainURL + "/6",
            title: "Pending Flood Zone",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Pending Flood Zone",
            popupBody: "Pending Flood Zone: ${FloodZone}"
        },{
            id: "tParcels",
            url: this.mainURL + "/2",
            title: "Parcels",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Parcels",
            popupBody: "County: ${COUNTY}<br>" + "Parcel: ${PARCEL_APN_LABEL}<br>" + "Address: ${P_ADDRESS}"
        },{
            id: "coBoundary",
            url: this.mainURL + "/4",
            title: "County Boundary",
            visible: true,
            opacity: 1,
            showLegend: true,
            showCheckBox: false,
            popupHeader: "",
            popupBody: ""
        },{
            id: "wiBoundary",
            url: this.mainURL + "/3",
            title: "Town Boundary",
            visible: true,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "",
            popupBody: ""
        },{
            id: "wiMPA",
            url: this.mainURL + "/10",
            title: "Municipal Planning Area",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "",
            popupBody: ""
        },{
            id: "wiBlockGroups",
            url: this.mainURL + "/9",
            title: "Block Groups",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Wickenburg Block Groups",
            popupBody: "<strong>GEOID:  ${GEOID10}</strong><br>" + "<b>Total Persons:</b>  ${LOWMODUNIV:NumberFormat}<br>" + "<b>Low Income:</b>  ${LOW:NumberFormat}<br>" + "<b>Low & Moderate Income:</b>  ${LOWMOD:NumberFormat}<br>" + "<b>Low, Moderate, & Medium Income:</b>  ${LMMI:NumberFormat}<br>" + "<b>% Low & Moderate Income:</b> ${LOWMOD_PCT}%"
        },{
            id: "wiEmployers",
            url: this.mainURL + "/1",
            title: "Employers, 5+ employees",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "Employers",
            popupBody: "<strong>${EmpName}</strong><hr class='pLine'>${Address}</br>" + "${Jurisdiction}, ${State} ${Zip}<br>" + "Type:  ${Cluster}"
        },{
            id: "wiBLI",
            url: this.mainURL + "/0",
            title: "Building / Landmark Inventory",
            visible: true,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "${NAME}",
            popupBody: "<hr class='pLine'> Category:  ${BLI_CAT}<br> Sub Category: ${BLI_SUBCAT}<br> Website: ${WEBSITE} <br> APN: ${APN}"
        },{
            id: "wiSubdivisions",
            url: this.mainURL + "/7",
            title: "Subdivisions",
            visible: false,
            opacity: 1,
            showLegend: true,
            showCheckBox: true,
            popupHeader: "${NAME}",
            popupBody: "<hr class='pLine'> MCR:  ${MCR}<br> Square Miles: ${SQMI}<br> Acres: ${ACRES}"
        }
    ];

    this.Version = "v3.7.4 | 02/08/2016";

    this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    this.MaricopaAssessor = "http://mcassessor.maricopa.gov/?s=";
    this.YavapaiAssessor = "http://gis.yavapai.us/v4/print_parcel.aspx?qs=";

    // this.GeometryService = "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"; // Esri test service
    this.GeometryService = "http://geo.azmag.gov/gismag/rest/services/Utilities/Geometry/GeometryServer"; // MAGs service

    this.printUrl = "http://geo.azmag.gov/gismag/rest/services/gp/Wickenburg_Print/GPServer/Export%20Web%20Map"; // MAG Wickenburg Print service
    // "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" // Esri test service

    // Demographic PDF report
    this.demService = "http://geo.azmag.gov/services/Demographics/reports.html?city=Wickenburg";
    // Employment PDF report
    this.empService = "http://geo.azmag.gov/services/employment2014/reports.html?city=Wickenburg";

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
                            [{ id: 1, text: "Polygon", DisplayText: "Polygon", Type: "POLYGON"},
                            { id: 2, text: "Circle", DisplayText: "Circle", Type: "CIRCLE" },
                            { id: 3, text: "Arrow", DisplayText: "Arrow", Type: "ARROW" },
                            { id: 4, text: "Freehand", DisplayText: "Freehand Polygon", Type: "FREEHAND_POLYGON" },
                            { id: 5, text: "Text", DisplayText: "Text", Type: "POINT" }];

    this.fillColorOpacity = 0.75;

    this.textSymbolFontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 50];

    this.defaultOutlineColor = [0,0,0];

    this.defaultFillColor = [0,0,255];

}; //End Config