mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [2.294289, 48.8583564], // starting position
    zoom: 15
});

map.addControl(new mapboxgl.NavigationControl());

const track =  new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});
map.addControl(track, 'top-left');

const popup = new mapboxgl.Popup({
    closeOnClick: true,
    closeButton: false,

}).setHTML(`<h3>Torre Eifel</h3> 
<a href="/">Ver Mapa</a> 
<a href="/points/"/points/>Buscar Lugares</a>`);

new mapboxgl.Marker({
    color: '#ff3a3a'
})
.setLngLat([2.294289, 48.8583564])
.setPopup(popup)
.addTo(map);