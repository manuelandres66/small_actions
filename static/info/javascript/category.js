
const title = document.querySelector('h2').innerHTML.replace(/\s/g, '');
const mayor_category = (title == 'Donaciones') ? 'D' : 'V';

fetch('/info/api/category', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({'category': mayor_category})
})
.then(response => response.json())
.then(data => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

    const mapConfig = {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [data.longitude, data.latitude], // starting position
        zoom: data.zoom
    }
    
    const map = new mapboxgl.Map(mapConfig); 
    map.addControl(new mapboxgl.NavigationControl());

    const colors = ['#000BF0', '#1BF030', '#FCF000', '#FF6B00', '#FF1D00', '#FF00CA', '#B400FE', '#F2D378', '#FBA375', '#E575AC', '#A978FC', //Color for diferents Categories
                    '#61ACF2', '#9EC737', '#FFF59E', '#FFA900', '#A19F55', '#5E432E', '#AA998B', '#A73264', '#A41D19', '#711411', '#91BED4']
    
    map.on('load', () => {
        map.setLayoutProperty('country-label', 'text-field', ['get', "name_es"]);  //Changing Lenguage

        map.loadImage('/static/maps/images/point_black.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('pointer', image, {'sdf' : true}); //Colored Image

            data = data[mayor_category]
            let j = 0;

            for (const category in data) {
                const color = colors[j]; //Geting The color
                j++;

                for (const sub_category in data[category]) {
                    const helpdata = data[category][sub_category];
                    let features = []; //Creating Feature for Diferent Leayers
                    helpdata.forEach(point => {
                        features.push({
                            'type': 'Feature',
                            'geometry' : {
                                'type': 'Point',
                                'coordinates': point.coordinates,
                            },
                            'properties': {
                                'title': point.name,
                                'rute' : point.rute,
                                'uuid' : point.uuid
                            }
                        })
                    });

                    map.addSource(sub_category, { //Create the Source
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': features
                        }
                    });

                    map.addLayer({ //Create a Layer for each sub_category in order to can hidden or see a especficic sub_category
                        'id': sub_category,
                        'type': 'symbol',
                        'source': sub_category,
                        'layout': {
                            'visibility': 'none', //Not Visible
                            "icon-image": "pointer",
                            
                            'text-field': ['get', 'title'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.2],
                            'text-anchor': 'top'
                        },
                        'paint': {
                            'icon-color': color,
                            "icon-halo-color": "#fff",
                            "icon-halo-width": 2
                        },

                    });

                    //To Hidde or View Layers
                    const input_sub = document.querySelector(`input[value='${sub_category}']`);
                    input_sub.addEventListener('change', () => {
                        if (input_sub.checked) {
                            map.setLayoutProperty(sub_category, 'visibility', 'visible');
                        } else {
                            map.setLayoutProperty(sub_category, 'visibility', 'none');
                        }
                    })
        
                }; 


            };
        
        });
    });

    for (const category in data[mayor_category]) {

        const input_cate = document.querySelector(`input[value="${category}"]`); // If Catgeory is checked all subcategories will be checked
        input_cate.addEventListener('change', () => {
            const all_sub_inputs = document.querySelectorAll(`#${category} .check_sub`); //Get All Inputs of SubCategories in the Category Div

            all_sub_inputs.forEach(input => {
                if (input_cate.checked) {
                    map.setLayoutProperty(input.getAttribute('value'), 'visibility', 'visible');
                    input.checked = true;
                } else {
                    map.setLayoutProperty(input.getAttribute('value'), 'visibility', 'none');
                    input.checked = false;
                }
            });
        });
        
        for (const sub_category in data[mayor_category][category]) {

            map.on('click', sub_category, function (e) { // Pop up on Click
                const coordinates = e.features[0].geometry.coordinates.slice();
                const title = e.features[0].properties.title;
                const rute = e.features[0].properties.rute;
                const uuid = e.features[0].properties.uuid;
        
                 
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                 
                new mapboxgl.Popup()
                .setLngLat(coordinates) 
                .setHTML(`<h1 class='maps_title'>${title}<h1>
                <a href='${uuid}' class='maps_links'>Mas Info</a>
                <a href='${rute}' class='maps_links'>Ir ahi!</a>`)
                .addTo(map);
            });
                 
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', sub_category, function () {
                map.getCanvas().style.cursor = 'pointer';
            });
                
            // Change it back to a pointer when it leaves.
            map.on('mouseleave', sub_category, function () {
                map.getCanvas().style.cursor = '';
            });

        };
    };

});