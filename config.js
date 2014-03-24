

var appConfig = new function() {

        this.jasonemail = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

        //  layers
        this.wiBoundaryURL = "http://geo.azmag.gov/gismag/rest/services/maps/WI_Incorporated_Area/MapServer";
        this.coBoundaryURL = "http://geo.azmag.gov/GISMAG/rest/services/maps/MaricopaCountyBoundary/MapServer";
        this.wiFloodURL = "http://geo.azmag.gov/gismag/rest/services/maps/WI_Floodways/MapServer";
        this.wiZoningURL = "http://geo.azmag.gov/gismag/rest/services/maps/WI_Zoning/MapServer";
        this.mParcelsURL = "http://gis.mcassessor.maricopa.gov/ArcGIS/rest/services/Parcels/MapServer";
        this.yParcelsURL = "http://gis.yavapai.us/arcgis/rest/services/Property/MapServer/6";
        // total parcels a subset of Maricopa and Yavapi parcels
        // this.tParcelsURL = "http://geo.azmag.gov/gismag/rest/services/maps/WI_Parcels/MapServer";
        this.aerialURL = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
        this.streetsURL = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";

        this.MaricopaAssessor = "http://mcassessor.maricopa.gov/?s=";
        this.YavapaiAssessor = "http://gis.yavapai.us/v4/print_parcel.aspx?qs=";

        //levels of detail
        this.lods = [{
            "level": 9,
            "resolution": 305.748113140558,
            "scale": 1155581.108577
        }, {
            "level": 10,
            "resolution": 152.874056570411,
            "scale": 577790.554289
        }, {
            "level": 11,
            "resolution": 76.4370282850732,
            "scale": 288895.277144
        }, {
            "level": 12,
            "resolution": 38.2185141425366,
            "scale": 144447.638572
        }, {
            "level": 13,
            "resolution": 19.1092570712683,
            "scale": 72223.819286
        }, {
            "level": 14,
            "resolution": 9.55462853563415,
            "scale": 36111.909643
        }, {
            "level": 15,
            "resolution": 4.77731426794937,
            "scale": 18055.954822
        }, {
            "level": 16,
            "resolution": 2.38865713397468,
            "scale": 9027.977411
        }, {
            "level": 17,
            "resolution": 1.19432856685505,
            "scale": 4513.988705
        }, {
            "level": 18,
            "resolution": 0.597164283559817,
            "scale": 2256.994353
        }, {
            "level": 19,
            "resolution": 0.298582141647617,
            "scale": 1128.497176
        }];

        this.initExtent = {
            "xmin": -12561509,
            "ymin": 4020496,
            "xmax": -12543164,
            "ymax": 4030003,
            "spatialReference": {
                "wkid": 102100
            }
        };

        //Lat, Long (33.969, -112.731) for wickenburg
        //Lat, Long (33.471, -112.115) for phoenix
    }; //End Config

