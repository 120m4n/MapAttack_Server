var wkx = require('wkx');
//var geometry = wkx.Geometry.parse('POLYGON((-73.12298282568942 7.129884670440433,-73.11745315918574 7.129884670440433,-73.11745315918574 7.133383796493078,-73.12298282568942 7.133383796493078,-73.12298282568942 7.129884670440433))');
const check_point_1 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              -73.12215092540336,
              7.130092459914181
            ],
            [
              -73.12215092540336,
              7.129987479307076
            ],
            [
              -73.1220451266543,
              7.129987479307076
            ],
            [
              -73.1220451266543,
              7.130092459914181
            ],
            [
              -73.12215092540336,
              7.130092459914181
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};

const check_point_2 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              -73.12183106888303,
              7.130138846568727
            ],
            [
              -73.12183106888303,
              7.1300485144288075
            ],
            [
              -73.12172034926125,
              7.1300485144288075
            ],
            [
              -73.12172034926125,
              7.130138846568727
            ],
            [
              -73.12183106888303,
              7.130138846568727
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};

const check_point_3 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              -73.12136604647331,
              7.130243827141115
            ],
            [
              -73.12136604647331,
              7.130148612204167
            ],
            [
              -73.12125286641594,
              7.130148612204167
            ],
            [
              -73.12125286641594,
              7.130243827141115
            ],
            [
              -73.12136604647331,
              7.130243827141115
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};

const check_point_4 = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              -73.12215955926165,
              7.130368140330802
            ],
            [
              -73.1213895173166,
              7.130536895635217
            ],
            [
              -73.12149817354187,
              7.131015035329156
            ],
            [
              -73.12225876711939,
              7.130855655486613
            ],
            [
              -73.12215955926165,
              7.130368140330802
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
};

const list_check_points = [check_point_1, check_point_2, check_point_3, check_point_4];

//generate a value into [1,13]
function generateRandomValue() {
  return Math.floor(Math.random() * 13) + 1;
}


// function to extract a wkx geometry from a geojson element in a list of objects
function extractWkxGeometry(list_objects) {
  const list_wkx_geometry = [];
  let point = 0;
  for (const object of list_objects) {
    point = point + 1;
    const label = 'check_point_' + point;
    const geometry = wkx.Geometry.parseGeoJSON(object.features[0].geometry);
    list_wkx_geometry.push(
      {
        points: generateRandomValue(),
        fenceId: label,
        geoData: geometry.toWkt()
      });
  }
  return list_wkx_geometry;
}

// execute the function
const list_wkx_geometry = extractWkxGeometry(list_check_points);
// console.log(list_wkx_geometry);



// create a post request to http://192.168.1.7:3000/fence/set for each element in the list using axios
const axios = require('axios');
const url = 'http://192.168.1.7:3000/fence/set';
for (const wkx_geometry of list_wkx_geometry) {
  axios.post(url, wkx_geometry)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}