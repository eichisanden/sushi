'use strict';
require('bootstrap-webpack!./bootstrap.config.js');
let $ = require('jquery');
require('./style.less');

let initMap = () => {
  let defaultLatlng = new google.maps.LatLng(35.687509, 139.703345),
    newTypeStyle = [{
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [{
        "color": "#f7f1df"
      }]
    }, {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{
        "color": "#d0e3b4"
      }]
    }, {
      "featureType": "landscape.natural.terrain",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi.business",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.medical",
      "elementType": "geometry",
      "stylers": [{
        "color": "#fbd3da"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{
        "color": "#bde6ab"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#ffe15f"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#efd151"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "black"
      }]
    }, {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#cfb2db"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#a2daf2"
      }]
    }],
    newType = new google.maps.StyledMapType(newTypeStyle, {
      name: "newType"
    }),
    opts = {
      zoom: 15,
      center: defaultLatlng,
      mapTypeControl: false,
      mapTypeId: 'new_type'
    },
    map = new google.maps.Map(document.getElementById("map_canvas"), opts),
    markers = [],
    infoWindow = new google.maps.InfoWindow();
  map.mapTypes.set('new_type', newType);

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     var pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //     map.setCenter(pos);
  //   }, () => {
  //     console.log("navigator.geolocation not support");
  //   });
  // }

  map.addListener('click', (e) => {
    let html = require('./views/parts/infoWindow.jade'),
      $html = $(html());
    $("#lat", $html).val(e.latLng.lat());
    $("#lng", $html).val(e.latLng.lng());
    infoWindow.setContent($html.html());
    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);
  });

  let detailShow = (data) => {
    let info = data.row,
      latLng = new google.maps.LatLng(info.lat, info.lng);
    infoWindow.setContent(info.name);
    infoWindow.setPosition(latLng);
    infoWindow.open(map);
  };

  let getDetailInfo = (id) => {
    $.ajax({
      url: '/detail',
      dataType: 'json',
      data: {
        id: id
      },
      type: 'GET'
    }).done(detailShow);
  };

  let placeMarker = (id, info) => {
    let position = new google.maps.LatLng(info.lat, info.lng),
      marker = new google.maps.Marker({
        position: position,
        map: map
      });
    google.maps.event.addListener(marker, 'click', () => {
      getDetailInfo(id);
    })
    marker[id] = marker;
  };

  let listAll = (data) => {
    let id, i, newLen,
      shops = [],
      newStore = [];

    shops = data.rows;
    newLen = shops.length;

    for (i = 0; i < newLen; i++) {
      id = shops[i].id;
      newStore[id] = 1;
    }

    for (id in markers) {
      if (!newStore[id]) {
        markers[id].setMap(null);
        delete markers[id];
      }
    }

    for (i = 0; i < newLen; i++) {
      id = shops[i].id;
      if (!markers[id]) {
        placeMarker(id, shops[i]);
      }
    }
  };

  let getTarget = () => {
    let latLngBounds = map.getBounds(),
      northEast = latLngBounds.getNorthEast(),
      southWest = latLngBounds.getSouthWest();
    $.ajax({
      url: "/listAll",
      dataType: "json",
      data: {
        neLat: northEast.lat(),
        neLng: northEast.lng(),
        swLat: southWest.lat(),
        swLng: southWest.lng()
      },
      type: "GET"
    }).done(listAll);
  };

  google.maps.event.addListener(map, 'idle', getTarget);
};

google.maps.event.addDomListener(window, 'load', initMap);

module.exports = initMap;
