mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

const lat = parseFloat(document.querySelector('#latitude').innerHTML);
const long = parseFloat(document.querySelector('#longitude').innerHTML);

let userLat = document.querySelector('#user_latitude').innerHTML;
let userLong = document.querySelector('#user_longitude').innerHTML;


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [long, lat],
    zoom: 13
});


let directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    language: 'es',
    interactive: false,
    placeholderOrigin: 'Elije un origen',
    controls: {
        instructions: false
    }
});

map.on('load', function () {
    // Estableciendo destino
    directions.setDestination([long, lat]);

    new mapboxgl.Marker({
        color: '#ff3a3a'
    })
    .setLngLat([long, lat])
    .addTo(map);

    //Si el usuario tiene cordenadas, las ponemos de origen
    if (userLat != '' & userLong != '') {
        userLat = parseFloat(userLat);
        userLong = parseFloat(userLong);
        directions.setOrigin([userLong, userLat]);
    };
})

map.addControl(directions, 'top-left');

