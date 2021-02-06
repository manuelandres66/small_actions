mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

fetch('/info/api/orgpoints', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    },
    body: JSON.stringify({'id': document.querySelector('#org_id').innerHTML})
})
.then(response => response.json())
.then(data => {
    console.log(data);

    const mapConfig = {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [data.longitude, data.latitude], // starting position
        zoom: data.zoom
    }

    const map = new mapboxgl.Map(mapConfig);
    map.addControl(new mapboxgl.NavigationControl());
    
    let features = [];
    data.points.forEach(point => {
        let newPoint = {
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
        };  
        features.push(newPoint);  
    });


    map.on('load', () => {
        map.setLayoutProperty('country-label', 'text-field', [
            'get',
            "name_es"
        ]);

        map.loadImage('/static/maps/images/point.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('pointer', image);
    
            map.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': features
                }
            });

            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'icon-image': 'pointer',
                    'icon-size': 1,
    
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 1.2],
                    'text-anchor': 'top'
                }
            });

        });


    });


    map.on('click', 'points', function (e) {
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
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
        
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
    map.getCanvas().style.cursor = '';
    });
        

});

    
    


