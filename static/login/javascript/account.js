mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

let longitude = document.querySelector('#longitude').innerHTML;
let latitude = document.querySelector('#latitude').innerHTML;

if (longitude == 'None' || latitude == 'None') {
    longitude = -78;
    latitude = -0;
}


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude, latitude], // starting position
    zoom: 10, // starting zoom
});

const track =  new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(track, 'top-left');