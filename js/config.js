var appConfig = new function() {

    this.Version = "v3.5.1 | 03/20/2015";

    this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    this.mainURL = "http://geo.azmag.gov/gismag/rest/services/maps/WickenburgData/MapServer";

    this.MaricopaAssessor = "http://mcassessor.maricopa.gov/?s=";
    this.YavapaiAssessor = "http://gis.yavapai.us/v4/print_parcel.aspx?qs=";

    // this.GeometryService = "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"; // Esri test service
    this.GeometryService = "http://geo.azmag.gov/gismag/rest/services/Utilities/Geometry/GeometryServer"; // MAGs service

    this.printUrl = "http://geo.azmag.gov/gismag/rest/services/gp/Wickenburg_Print/GPServer/Export%20Web%20Map"; // MAG Wickenburg Print service
    // "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" // Esri test service


    this.initExtent = {
        "xmin": -12561509,
        "ymin": 4020496,
        "xmax": -12543164,
        "ymax": 4030003,
        "spatialReference": {
            "wkid": 102100
        }
    };

    this.center = [-112.343, 33.285]; // for Maricopa County
    //Lat, Long (33.969, -112.731) for wickenburg
    //Lat, Long (33.471, -112.115) for phoenix
}; //End Config