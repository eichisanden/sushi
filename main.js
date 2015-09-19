'use strict';
require('bootstrap-webpack!./bootstrap.config.js');
let $ = require('jquery');
require('./style.less');

let initMap = () => {
  let latlng = new google.maps.LatLng(35.687525, 139.703146),
    newType1Style = [{
      featureType: "road",
      stylers: [{
        visibility: "off"
      }]
    }, {
      "elementType": "geometry",
      "stylers": [{
        "lightness": -74
      }]
    }],
    newType2Style = [{
      featureType: "poi.business",
      stylers: [{
        visibility: "off"
      }]
    }, {
      "elementType": "geometry",
      "stylers": [{
        "lightness": -74
      }]
    }],
    newType1 = new google.maps.StyledMapType(newType1Style, {
      name: "road"
    }),
    newType2 = new google.maps.StyledMapType(newType2Style, {
      name: "business"
    }),
    opts = {
      zoom: 12,
      center: latlng,
      mapTypeControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
          'new_type1',
          'new_type2',
        ]
      }
    },
    map = new google.maps.Map(document.getElementById("map_canvas"), opts),
    infoWindow = new google.maps.InfoWindow();
  map.mapTypes.set('new_type1', newType1);
  map.mapTypes.set('new_type2', newType2);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    }, () => {
      console.log("navigator.geolocation not support");
    });
  }

  map.addListener('click', (e) => {
    let html = require('./views/parts/infoWindow.jade'),
        $html = $(html());
        console.log(html());
        console.log($html.html());
    $("#lat", $html).val(e.latLng.lat());
    $("#lng", $html).val(e.latLng.lng());
        console.log($html.html());
    infoWindow.setContent($html.html());
    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);
  });

  let placeMarkerAndPanTo = (latLng, map) => {
    let marker = new google.maps.Marker({
      position: latLng,
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: map
    });
    map.panTo(latLng);
  };
};

google.maps.event.addDomListener(window, 'load', initMap);

module.exports = initMap;
