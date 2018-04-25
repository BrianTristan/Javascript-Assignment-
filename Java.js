require(["esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/TileLayer",
    "esri/layers/MapImageLayer",
    "esri/PopupTemplate",
    "dojo/domReady!"],


    //link the module above
    function (
        Map,
        MapView,
        FeatureLayer,
        Legend,
        LayerList,
        Search,
        Locator,
        TileLayer,
        MapImageLayer,
        PopupTemplate
        )
    {


        //my code starts here

        var mapConfig = {
            basemap: "dark-gray"
        };

        var myMap = new Map(mapConfig);

        var mapView = new MapView({
            map: myMap,
            container: "viewDiv",
            center: [-87.7878, 41.8781],
            zoom: 12
        });


        var fwySym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#FF0000",
            width: 7,
            style: "solid"
        };
        // Symbol for U.S. Highways
        var hwySym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#005bef",
            width: 6,
            style: "solid"
        };
        // Symbol for other major highways
        var otherSym = {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: "#EBEBEB",
            width: 4,
            style: "short-dot"
        };
        var hwyRenderer = {
            type: "unique-value", // autocasts as new UniqueValueRenderer()
            defaultSymbol: otherSym,
            defaultLabel: "Other major roads",
            field: "CLASS",
            uniqueValueInfos: [
                { value: "I", symbol: fwySym, label: 'Interstates' },
                { value: "U", symbol: hwySym, label: 'US Highways' }
            ]
        };

        hwyRenderer.legendOptions = {
            title: "Name"
        };

        //add popup for major Highways
        var HighwayPopUp = {
            title: "Major Highways",
            content: "<p>{NUMBER}</p>",
        }

            //add popup for counties
            var countiesPopUp = {
                title: "counties",
                content: '<p>{NAME}</p>',
            }


        var dynamicRenderer = {
            type: "simple"

        };

        //adding the feature layer
        var myFeatureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
            popupTemplate: HighwayPopUp,
            renderer: hwyRenderer
        });

        //add feature layer
        myMap.add(myFeatureLayer);

        //adding a dynamic service for counties
        var ImageLayer = new MapImageLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Counties/FeatureServer",
            PopupTemplate:countiesPopUp,
            renderer: dynamicRenderer,
            sublayers:
       [
      {
       id: 3,
       visible: false
   }, {
       id: 2,
       visible: true
   }, {
       id: 1,
       visible: true
   }, {
       id: 0,
       visible: true,
       definitionExpression: "POP2010 > 100000"
   }
            ]
        });

        //add dynamic service layer
        myMap.add(ImageLayer);

        //adding the legend
        var legend = new Legend({
            view: mapView,
            layerInfos: [{
                layer:
              myFeatureLayer, title: 'Major Highways'
                
            }],

        });

        //add legend tp the map and where
        mapView.ui.add(legend, "bottom-left");

        //make a layer list
        var layerList = new LayerList({
            view: mapView
        });

        // Adds widget below other elements in the top left corner of the view
        mapView.ui.add(layerList, {
            position: "top-right"
        });


        //add a search widget to the map
        var searchWidget = new Search({
            view: mapView,
            sources: [
                {
                    locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                    singleLineFieldName: "SingleLine",
                    name: "Custom Geocoding Service",
                    localSearchOptions: {
                        minScale: 300000,
                        distance: 50000
                    },
                    placeholder: "Search Geocoder",
                    maxResults: 3,
                    maxSuggestions: 6,
                    suggestionsEnabled: false,
                    minSuggestCharacters: 0
                }, {
                    featureLayer: myFeatureLayer, 
                    searchFields: ['ROUTE_NUM'],
                    displayField: "ROUTE_NUM",
                    exactMatch: false,
                    outFields: ["*"],
                    name: "My Custum Search",
                    placeholder: "example: 95",
                    maxResults: 6,
                    maxSuggestions: 6,
                    suggestionsEnabled: true,
                    minSuggestCharacters: 0,
                },{
                    FeatureLayer: ImageLayer,
                    searchFields: ['NAME'],
                    displayField: "NAME",
                      exactMatch: false,
                    outFields: ["*"],
                    name: "My Custum Search",
                   placeholder: "example: Cook County",
                    maxResults: 6,
                   maxSuggestions: 6,
                  suggestionsEnabled: true,
                 minSuggestCharacters: 0,
                }
               
            ]
        });
        // Adds the search widget below other elements in
        // the top left corner of the view
        mapView.ui.add(searchWidget, {
            position: "top-left",
            index: 2
        });
        //my code ends here
    });