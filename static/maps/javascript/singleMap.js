mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';
 

let longitude = document.querySelector('#longitude').innerHTML.replace(',', '.');
let latitude = document.querySelector('#latitude').innerHTML.replace(',', '.');

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude, latitude], // starting position
    zoom: 13, // starting zoom
});


map.addControl(new mapboxgl.NavigationControl());

const parameters = {
    closeOnClick: true,
    closeButton: false,
};

let title = document.querySelector('#all_info h1').innerHTML;

const popup = new mapboxgl.Popup(parameters).setHTML(`<h3>${title}</h3>`);

new mapboxgl.Marker({
    color: '#ff3a3a'
})
.setLngLat([longitude, latitude])
.setPopup(popup)
.addTo(map);

