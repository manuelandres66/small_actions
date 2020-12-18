mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

const longitude = document.querySelector('#longitude').innerHTML;
const latitude = document.querySelector('#latitude').innerHTML;

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

window.addEventListener('load', () => {
    // Animations
    const rect = document.querySelector('#organization_info img').getBoundingClientRect();
    console.log(rect)


    // init part, set your own values
    var sat = {
        elt: null,
        a: 0,         // in radian,
        r: 110,        // radius
        da: 0.1,     // in radian
        x: 0,
        y: 0,

        center: { x: ((rect.left + rect.right) / 2), y: ((rect.top + rect.bottom) / 2) - 5}
    }

    sat.move = function(){
        // each modification
        this.a += this.da
        this.x = this.center.x + (this.r * Math.sin(this.a));
        this.y = this.center.y + (this.r * Math.cos(this.a));
        //console.log(this.x, this.y);
        this.elt.style.top = this.y + "px";
        this.elt.style.left = this.x + "px";

    }

    sat.elt = document.querySelector('#frist');
    var loopTimer = setInterval(function(){
        sat.move();
    }, 50);

});