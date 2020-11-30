const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiY3lib3JnNzQ1OSIsImEiOiJja2k0OGxmaTgwbXUzMzBxc29rcmp1amJwIn0.xRBe1Au0g7-JgXQHHq2Sfw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});