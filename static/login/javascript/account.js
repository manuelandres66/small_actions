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


//Change to inputs

let countClick = 0;

const title = document.querySelector('h1');
const email = document.querySelector('h4');
const latitudeObject = document.getElementById('latitude');
const longitudeObject = document.getElementById('longitude');
let inArray = [title, email, latitudeObject, longitudeObject];
console.log(inArray)
const changeLink = document.querySelector('#change');

const inputs = document.querySelectorAll('input');
inputs.forEach(input => input.style.display = 'none');

changeLink.addEventListener('click', () => {
    if (countClick % 2 == 0) {
        //Change link iner html
        changeLink.innerHTML = 'Submit Changes';
        for (let i = 1; i < inputs.length - 1; i++) {
            inputs[i].setAttribute('value', inArray[i-1].innerHTML);
        };

        inArray.forEach(title => title.style.display = 'none');
        inputs.forEach(input => input.style.display = 'inline-block');

    } else {
        document.querySelector('form').submit();
    }

    countClick++;
})