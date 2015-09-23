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
    markers = [],
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
        marker = new google.maps.Marker({position: position, map: map});
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
