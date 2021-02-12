mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

let longitude = document.querySelector('#longitude').innerHTML.replace(',', '.');
let latitude = document.querySelector('#latitude').innerHTML.replace(',', '.');

if (longitude == 'None' || latitude == 'None') {
    longitude = -78;
    latitude = -0;
}


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude, latitude], // starting position
    zoom: 3, // starting zoom
});

const track =  new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(track, 'top-left');

const parameters = {
    closeOnClick: true,
    closeButton: false,
};

fetch('/account/api/account')  
.then(response => response.json())
.then(data => {
    data.places.forEach(place => {
        const popup = new mapboxgl.Popup(parameters).setHTML(`<h4>${place.name}</h4>
        <a href="${place.url}">Visitar el lugar</a>`);
        new mapboxgl.Marker({
            color: '#ff3a3a'
        })
        .setLngLat([place.longitude, place.latitude])
        .setPopup(popup)
        .addTo(map);
    })
});



//Change to inputs

let countClick = 0;

const title = document.querySelector('h1');
const email = document.querySelector('h4');
const latitudeObject = document.getElementById('latitude');
const longitudeObject = document.getElementById('longitude');
let inArray = [title, email, latitudeObject, longitudeObject]; 
const changeLink = document.querySelector('#change');

const inputs = document.querySelectorAll('input');
inputs.forEach(input => input.style.display = 'none');

changeLink.addEventListener('click', () => {
    if (countClick % 2 == 0) {
        //Change link iner html
        changeLink.innerHTML = 'Guardar Cambios';
        for (let i = 1; i < inputs.length - 1; i++) {
            inputs[i].setAttribute('value', inArray[i-1].innerHTML.replace(',', '.'));
        };

        inArray.forEach(title => title.style.display = 'none');
        inputs.forEach(input => input.style.display = 'inline-block');

    } else {
        document.querySelector('form').submit();
    }

    countClick++;
})




//Dark mode
const darkContainer = document.querySelector('#dark_mode');
const darkCircle = document.querySelector('#dark_circle');
let translateLigth = '0.2vw';
let translateDark = '-2.6vw';

const mediaQuery = window.matchMedia('(max-width: 1300px)');
if (mediaQuery.matches) {
    translateLigth = '-8vw, -0.3vh';
    translateDark = '7vw, -0.3vh'
};

document.addEventListener('DOMContentLoaded', () => {
    let htmlContainer = document.querySelector('html');
    let counter = 0;

    console.log(htmlContainer.getAttribute('theme'))
    if (htmlContainer.getAttribute('theme') == 'dark-mode') {
        darkCircle.style.transform = `translate(${translateLigth})`; 
        counter = 1;
    };

    darkContainer.addEventListener('click', () => {
        if (counter % 2 == 0) {
            htmlContainer.setAttribute('theme', 'dark-mode');
            darkCircle.style.transform = `translate(${translateLigth})`;
            fetch('/account/api/dark'); 
        } else {
            htmlContainer.setAttribute('theme', '');
            darkCircle.style.transform = `translate(${translateDark})`; 
            fetch('/account/api/dark'); 
        };
        counter++;
    });
});

// Achivments

const progress = document.querySelectorAll('.progress');
progress.forEach(progre => {
    const type = progre.getAttribute('data-type');
    const data_related = document.querySelector(`#${type}`).innerHTML;
    const parent = progre.parentNode;

    if (type == 'pr') {
        if (data_related != '') {
            parent.setAttribute('class', 'bar completed');
        }
    } else {
        const total_data = progre.getAttribute('data-quantity');
        const relation = ((parseFloat(data_related) / parseFloat(total_data)) * 100).toFixed(2);
        
        if (relation >= 100) {
            parent.setAttribute('class', 'bar completed');
        };

        progre.style.width = `${relation}%`;
        parent.childNodes[3].innerHTML = `${data_related}/${total_data}` //Show current progress

    };

})
