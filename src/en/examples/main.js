import 'ol/ol.css';
import ImageLayer from 'ol/layer/image';
import Map from 'ol/map';
import RasterSource from 'ol/source/raster';
import TileLayer from 'ol/layer/tile';
import View from 'ol/view';
import XYZSource from 'ol/source/xyz';
import proj from 'ol/proj';

const key = 'pk.eyJ1IjoidHNjaGF1YiIsImEiOiJjaW5zYW5lNHkxMTNmdWttM3JyOHZtMmNtIn0.CDIBD8H-G2Gf-cPkIuWtRg';
const elevation = new XYZSource({
  url: 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + key,
  crossOrigin: 'anonymous'
});

function flood(pixels, data) {
  var pixel = pixels[0];
  if (pixel[3]) {
    var height = -10000 + ((pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.1);
    if (height <= data.level) {
      pixel[0] = 145;
      pixel[1] = 175;
      pixel[2] = 186;
      pixel[3] = 255;
    } else {
      pixel[3] = 0;
    }
  }
  return pixel;
}

const raster = new RasterSource({
  sources: [elevation],
  operation: flood
});

const control = document.getElementById('level');
const output = document.getElementById('output');
control.addEventListener('input', function() {
  output.innerText = control.value;
  raster.changed();
});
output.innerText = control.value;

raster.on('beforeoperations', function(event) {
  event.data.level = control.value;
});

new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
      })
    }),
    new ImageLayer({
      opacity: 0.8,
      source: raster
    })
  ],
  view: new View({
    center: proj.fromLonLat([-71.06, 42.37]),
    zoom: 12
  })
});
