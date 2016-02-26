CHANGELOG Wickenburg Zoning Website
===================================

[![Semver](http://img.shields.io/SemVer/2.0.0.png)](http://semver.org/spec/v2.0.0.html)

`Major/Minor/Patch 0.0.0`

### Outstanding Items
* zoom issue with geocoder
* turn off measurement tool when window closes

### Version 3.7.5 (02/26/2016)

* added basemap transparency slider
* disabled basemaptoggle button
* updated to latest arcgis javascript api version
* upgraded "geocoder" widget to newer "search" widget
* updated the way layers are added and simplified popup handling
* added new layers (BLI and Subdivisions)
* added markup tools
* make popup title smaller or something so it doesn't run into the buttons
* subdivisions layer remove acres/sq mi
* add info link to parcel
* reorder legend layers to have zoning at the top
* fix parcel highlighting
* reordered layer options alphabetically
* added link to Maricopa County Recorders office for MCR docs

### Version 3.7.4 (02/08/2016)

* updated PDF reports URL for employment
* moved reports URL's from view to config
* updated grunt files

### Version 3.7.3 (01/08/2016)

* changed the title on the reports window to `Wickenburg`

### Version 3.7.2 (01/08/2015)

* Changed multiple parcel selection feature
* updated Employers to 2014 MAG employees from MAG employment database, +5 employees

### Version 3.7.1 (10/27/2015)

* fixed popup link so it shows only on parcels popup
* added MPA boundary to map, layers and TOC
* added ability to change parcel border thickness.
* added ability to highlight multiple parcels.
* moved zoning definitions from main navbar to contents panel.
* added Flood Zone Definitions link to contents window when floodzone layer is chosen.
* added reports button next to print button that links to wickenburg demographic and employment reporting.
* upgrade modernizr to `v2.8.3` via CDN - [modernizr] (http://cdnjs.com/libraries/modernizr)
* upgrade html5shiv to `v3.7.3` via CDN - [html5shiv] (https://cdnjs.com/libraries/html5shiv)
* upgrade respond.js to `v1.4.2` via CDN - [respond.js] (https://cdnjs.com/libraries/respond.js)

### Version 3.7.0 (08/03/2015)

* added block group layer
* added popup for block group layer

### Version 3.6.0 (07/29/2015)

* add pending floodplain data
* fix flood zone TOC label
* add popup for pending floodplain data

### Version 3.5.1 (03/20/2015)

* update of parcel layer
* update of Zoning Layer

### Version 3.5.0 (03/05/2015)

* added code to hide popup when info not found
* made changes to definitions table
* made changes to popup style
* updated MXD
* updates to data - Zoning Info

### Version 3.4.0 (07/22/2014)

* changed size of search box (reduced)
* changed lods to minZoom & maxZoom
* fixed layer options to only display popup when layer is visible

### Version 3.3.0 (06/30/2014)

* changed size and location of basemap toggle
* added version number and date to about.html - configurable in appConfig file
* added print button
* added print functionality
* changed the style of panels and modals to dark
* added source reference to employer data
* made print legend static graphic to fit to size

### Version 3.2.1 (06/04/2014)

* added Wickenburg Employers, 5+ employees as a feature layer
* added Google Analytics code to index files `UA-40006601-1`
* added Google Webmaster Tools `google14c4dad344d14f91.html` file to root directory

### Version 3.2.0 (05/27/2014)

* moved `About` modal from index.html to views `about.html`
* moved `Measurement` html from index.html to views `measureTool.html`
* moved `Content` html from index.html to views `contents.html`

### Version 3.1.0 (05/12/2014)

* made changes to boundary and zoning

### Version 3.0.0 (05/09/2014)

* updating zoning - new annexation area
* updating boundary - new annexation area
* reordered zoning layer
* use `<!doctype html>` instead of `<!DOCTYPE html>`
* remove IE conditional classes per HTML5 Boilerplate
* update to [HTML5 Boilerplate v4.3.0] (https://github.com/h5bp/html5-boilerplate) features
* update to [Normalize.css v3.0.1] (https://github.com/h5bp/html5-boilerplate) per HTML5bp
* update the [HTML5 Shiv] (https://github.com/aFarkas/html5shiv)
* update the [respond.min.js] (https://github.com/scottjehl/Respond)
* update to [jquery-1.11.0] (http://jquery.com/)
* update to [Modernizr v2.7.1] (http://modernizr.com/)
* changed file structure
* fixed scrollwheel issue - `https://github.com/Esri/bootstrap-map-js/issues/3`
* changed title css to static color
* changed style color of `HomeButton` `LocateButton` `esriSimpleSlider` - `color: #fff` `background-color: #5b5b5`
* removed 2 LOD levels to restrict zoom out

### Version 2.4.0 (04/21/2014)

* added measurement tool
* added function to prevent popups when measure tool is active
* added help menu for measurement tool
* renamed help content
* help button not working in IE or Firefox - fix by changing from <button></button> to <a></a> - http://stackoverflow.com/questions/13074693/
* made changes to all html files added tags <html></html>, <head></head>, <body></body>
* switched geometry services from ESRI test to MAGs service
* changed the default color of drop-down arrow in measurement tool

### Version 2.3.0 (04/08/2014)

* updated to ArcGIS JavaScript API 3.9
* updated to jQuery 1.11.0
* added basemap toggle to fix aerial image issue

### Version 2.2.4 (04/04/2014)

* fixed some css issues with popup
* added bootstrapmap.css to concat.min.css
* cleaned up some issues in index.html

### Version 2.2.3 (03/24/2014)

* removed Yavapi parcels rest end point
* removed Maricopa parcels rest end point
* combined Yavapi and Maricopa Parcels to one rest end point
* fixed Gruntfiles
* fixed spelling errors in html files
* changed contacts window to be open on load
* minified normalize and main css files
* concatenated normalize and main css files
* minified main js file

### Version 2.2.2 (03/19/2014)

* linted index.html file and fixed errors
* changed body background color
* added README.md file
* added CHANGELOG.md file
* added Gruntfile.js file - Grunt
* added package.json file - Grunt
* added .gitattributes file - Git
* added .gitignore file - Git

### Version 2.2.1 (03/07/2014)

* changed maps extent
* updated About menu items
* added transparency sliders for flood and zoning layers
* changed the mxd's colors for the zoning
* added definitions modal window
* eliminated null values from popup definitions
* added footer to about modal window
* added legal disclaimer modal window
* added placeholder text to geocoder
* fixed link to assessors office
* added a help button to the contents menu
* added a help model window

### Version 2.2.0 (01/30/2014)

* major change to bootstrap layout
* added modal about window
* added bootstap panel for legend div
* added legend dijit
* added homebutton dijit
* added geolocation button dijit

### Version 2.0.0 (01/08/2014)

* major change to format - change to kendo layout
* update ESRI javascript API to version 3.8

### Version 1.2.1 (12/05/2013)

* added humans.txt file (html5 boilerplate)
* added robots.txt file (html5 boilerplate)
* added 404.html file (html5 boilerplate)
* added modernizer-2.6.2.min (html5 boilerplate)
* added crossdomian.xml (html5 boilerplate)
* added HTML5 enabling script (Remy Sharp)
* added normalize.css (html5 boilerplate)
* updated url's for MAG services
* updated url's for Yavapai services
* updated ESRI javascript API from 3.4 to 3.7
* updated jquery libary from 1.9.1 to 1.10.2

### Version 1.2.0 (04/08/2013)

* Added Google Analytics code ###(Wickenburg Zoning Viewer)-UA-40006601-1
* Updated ESRI Javascript API from 3.2 to 3.4
	* <script type="text/javascript" src="http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/"></script>
* Updated jquery from 1.8.3 to 1.9.1
	* <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

### Version 1.0.0 (04/01/2013)

* Posted to geo.azmag server
* Used basic frame work from MAG EXLU Viewer

## Resources / Examples

- ***identifyParms Issue ***

    * [Link] (https://geonet.esri.com/thread/44797)
    * [Example] (https://developers.arcgis.com/javascript/jssamples/map_explicitlayerlist.html)
    * [Link] (http://forums.esri.com/Thread.asp?c=158&f=2396&t=261892)
    * [fiddle] (http://jsfiddle.net/blordcastillo/mULcz/)



- ***TOC Examples***

    * https://developers.arcgis.com/javascript/jssamples/map_explicitlayerlist.html
    * http://www.roktech.net/_blog/ROK_Blog/post/ArcGIS_Server_JS_API_-_Table_of_Contents_%28TOC%29_Example/
    * http://maps.roktech.net/demo/toc_example/index.htm

- ***Sample Examples***

    * http://help.arcgis.com/en/webapi/javascript/arcgis/jssamples/find_popup.html
    * https://developers.arcgis.com/javascript/jssamples/fl_ondemand.html
    * http://jsfiddle.net/blordcastillo/mULcz/

- ***Links to Assessors Sites***

    * http://mcassessor.maricopa.gov/?s=111-42-094
    * http://gis.yavapai.us/v4/print_parcel.aspx?qs=20111002b
    * http://apps.yavapai.us/taxinquiry/
    * http://gis.yavapai.us/v4/search.aspx
    * http://gis.yavapai.us/v4/map.aspx?search=201-10-023

- ***Find Extent Tool***

    * http://psstl.esri.com/apps/extenthelper/

- ***Measurement Tool***

    * https://developers.arcgis.com/javascript/jssamples/widget_measurement.html
    * http://developers.arcgis.com/javascript/samples/util_distance/