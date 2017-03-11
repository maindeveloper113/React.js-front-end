import * as React from 'react';
import { browserHistory } from 'react-router';

import { PropertiesStore } from '../stores/PropertiesStore.jsx';
import { PropertyStore } from '../stores/PropertyStore.jsx';
import { MapStore } from '../stores/MapStore.jsx';

var wNumb = require('wnumb');

window.upreal = {};
window.upreal.map = false;
window.upreal.idle = false;
window.upreal.markers = [];
window.upreal.infoWindow = false;
window.upreal.items = PropertiesStore.items;
window.upreal.item = PropertyStore.item;

window.upreal.format = wNumb({
    decimals: 0,
    thousand: ','
});

window.upreal.init = function(){
    console.log("map init");
    var mapOptions = {
        zoom: 13,
        center: { lat: 40.001, lng: 40.520 },
        scrollwheel: true,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        styles : [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    };
    window.upreal.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    window.upreal.infoWindow = new google.maps.InfoWindow();
}

window.upreal.clearMarkers = function(){
    for (var i = 0; i < window.upreal.markers.length; i++) {
        window.upreal.markers[i].setMap(null);
    }
    window.upreal.markers = [];
}

window.upreal.createMarkers = function(){
    console.log("map markers");

    window.upreal.clearMarkers();

    if(window.upreal.items.length == 0)
        return;

    var image = {
        url: "/assets/i/origin/map-marker.png",
        size: new google.maps.Size(50, 66),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 66)
    };
    window.upreal.items.forEach(function(element, index, array) {
        var markerLocation = {lat:parseFloat(element.lat), lng: parseFloat(element.lng)};
        var marker = new google.maps.Marker({
            position: markerLocation,
            map: window.upreal.map,
            icon: image
        });
        google.maps.event.addListener(marker,'mouseover',function(){
            window.upreal.createInfoWindow(element, marker);
        });
        google.maps.event.addListener(marker,'mouseout',function(){
            window.upreal.infoWindow.close();
        });
        google.maps.event.addListener(marker,'click',function(){
            browserHistory.push("/property/"+element.id);
        });

        window.upreal.markers.push(marker);
    });
    if(window.upreal.idle == false){
        window.upreal.idle = true;
        window.upreal.map.addListener('idle', function(){
            console.log("idle");
            var loc = browserHistory.getCurrentLocation();
            if(loc.pathname == "/properties"){
                var c = window.upreal.map.getCenter();
                loc.query.lng = c.lng();
                loc.query.lat = c.lat();
                browserHistory.push(loc);
                PropertiesStore.query_last = loc;
            }
        });
    }
    // var loc = browserHistory.getCurrentLocation();
    // if(loc.query.lat){
    //     window.upreal.map.setCenter({
    //         lat: parseFloat(loc.query.lat),
    //         lng: parseFloat(loc.query.lng)
    //     });
    // }else{
        window.upreal.map.setCenter({
            lat: parseFloat(window.upreal.items[0].lat),
            lng: parseFloat(window.upreal.items[0].lng) - 0.015
        });
    // }

    // window.upreal.map.setZoom(14);
    var clusterOptions = [{
        url: '/assets/i/cluster-icon-google.png',
        anchor: [0,0],
        iconAnchor: [50, 66],
        height: '52',
        width: '52',
        textColor: '#fff',
        textSize: '14'
    }];
    var markerCluster = new MarkerClusterer(window.upreal.map, window.upreal.markers);
    markerCluster.setStyles(clusterOptions);
}

window.upreal.createInfoWindow = function(item, marker){
    var props = 'Beds: '+item.bed+', Baths: '+item.bath+', Sq Ft:'+item.sqft;
    var contentString =
        '<div href="#" class="infowindow">' +
            '<div class="infowindow__image-wrap">' +
                '<img src="http://idsrealty-api.fgeekdemos.org' + item.photo + '" class="infowindow__image"/>' +
                '<span class="infowindow__price">$' + window.upreal.format.to(parseInt(item.price)) + '</span>' +
                '<span class="infowindow__price infowindow__price__sqft">$' + window.upreal.format.to(parseInt(parseInt(item.price)/parseInt(item.sqft))) + '/Sqft</span>' +
            '</div>' +
            '<div class="infowindow__title">' + item.title + '</div>' +
            '<div class="infowindow__address">' + item.subtitle + '</div>' +
            '<div class="infowindow__props">' + props + '</div>' +
            '<div class="infowindow__type">' + item.type_name + '</div>' +
        '</div>';

    window.upreal.infoWindow.setContent(contentString);
    window.upreal.infoWindow.open(window.upreal.map, marker);

    var $gmStyle = $('.gm-style-iw'); //infowindow wrapper
    $gmStyle.prev().remove(); //remove arrow
    $gmStyle.next().css({top: '39px', right: '31px'}); //move close icon
    $gmStyle.css({top: '35px', left: '25px', overflow: 'visible'}); // move wrapper
    $gmStyle.children().css('overflow', 'visible'); //set overflow to show shadow-box
    $gmStyle.children().children().css('overflow', 'visible');
}

window.upreal.detailMarker = function(){

    if(window.upreal.item.lat == 0)
        return;

    console.log("map detail marker");

    if(window.upreal.items.length == 0){
        var markerLocation = {
            lat:parseFloat(window.upreal.item.lat),
            lng: parseFloat(window.upreal.item.lng)
        };
        var marker = new google.maps.Marker({
            position: markerLocation,
            map: window.upreal.map,
            icon: "/assets/i/origin/map-marker.png"
        });
        google.maps.event.addListener(marker,'mouseover',function(){
            window.upreal.createInfoWindow(window.upreal.item, marker);
        });
        google.maps.event.addListener(marker,'mouseout',function(){
            window.upreal.infoWindow.close();
        });
        window.upreal.markers.push(marker);
    }
    if(window.upreal.map != false){
        window.upreal.map.setCenter({
            lat: parseFloat(window.upreal.item.lat),
            lng: parseFloat(window.upreal.item.lng) - 0.005
        });
    }
}
export const MapGoogle = React.createClass({
    componentDidMount() {
        MapStore.bind(MapStore.events.map.updated, this.mapUpdated);
        PropertiesStore.bind(PropertiesStore.events.items.update, this.propertiesUpdated);
        PropertyStore.bind(PropertyStore.events.item.update, this.propertyUpdated);

        window.upreal.items = PropertiesStore.items;
        window.upreal.item = PropertyStore.item;

        this.mapUpdated();
    },
    componentWillUnmount() {
        MapStore.unbind(MapStore.events.map.updated, this.mapUpdated);
        PropertiesStore.unbind(PropertiesStore.events.items.update, this.propertiesUpdated);
        PropertyStore.unbind(PropertyStore.events.item.update, this.propertyUpdated);
    },
    shouldComponentUpdate(nextProps, nextState){
        return false;
    },
    mapUpdated(){
        if(MapStore.visible){
            $(".map").show();
            if(window.upreal.map == false){
                window.upreal.init();
                window.upreal.createMarkers();
                window.upreal.detailMarker();
            }
        }else{
            $(".map").hide();
        }
    },
    propertiesUpdated(){
        if(JSON.stringify(window.upreal.items) != JSON.stringify(PropertiesStore.items)){
            window.upreal.item = { lat: 0 };
            window.upreal.items = PropertiesStore.items;
            window.upreal.createMarkers();
        }
    },
    propertyUpdated(){
        if(JSON.stringify(window.upreal.item) != JSON.stringify(PropertyStore.item)){
            window.upreal.item = PropertyStore.item;
            window.upreal.detailMarker();
        }
    },
    zoom(type){
        if(type == 'in'){
            var zoom = window.upreal.map.getZoom();
            console.log(zoom);
            zoom++;
            window.upreal.map.setZoom(zoom);
        }else{
            var zoom = window.upreal.map.getZoom();
            zoom--;
            window.upreal.map.setZoom(zoom);
        }
    },
    render() {
        console.log("render map");
        return (
            <div className="map">
                <div className="map__body" id="map"></div>
                <div className="map__btns">
                    <div className="map__zoom" onClick={ (e) => this.zoom('in') }>zoom in</div>
                    <div className="map__zoom" onClick={ (e) => this.zoom('out') }>zoom out</div>
                </div>
            </div>
        );
    }
})
