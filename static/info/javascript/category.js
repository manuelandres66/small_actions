mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

const mapConfig = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: ['42', '-42'], // starting position
    zoom: 1
}

const map = new mapboxgl.Map(mapConfig);
map.addControl(new mapboxgl.NavigationControl());