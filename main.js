'use strict';
require('bootstrap-webpack!./bootstrap.config.js');
let $ = require('jquery');
require('./style.less');

let initMap = () => {
  let latlng = new google.maps.LatLng(35.687525, 139.703146);
  let opts = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  let map = new google.maps.Map(document.getElementById("map_canvas"), opts);
  let infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, () => {
      console.log("navigator.geolocation not support");
    });
  }

  map.addListener('click', (e) => {
    let infoWin = require('./views/parts/infoWindow.jade');
    let infoWindow = new google.maps.InfoWindow({
      content: infoWin()
    });
    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);
    placeMarkerAndPanTo(e.latLng, map);
  });

  let placeMarkerAndPanTo = (latLng, map) => {
    let marker = new google.maps.Marker({
      position: latLng,
      draggable: true,
      animation: google.maps.Animation.DROP,
      map: map
    });
    map.panTo(latLng);
  }
}

module.exports = initMap;
