<template>
  <div ref="globeContainer" class="globe-container"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling

const globeContainer = ref(null);

onMounted(() => {
  const globe = Globe()(globeContainer.value)
    .width(window.innerWidth)
    .height(window.innerHeight)
    .backgroundColor('#000')
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      globe.pointsData([{ lat: latitude, lng: longitude, id: 1 }]);

      globe.onPointClick((point) => {
        tippy(globeContainer.value, {
          content: `Location: (${point.lat}, ${point.lng})`,
          placement: 'right',
          trigger: 'manual',
        }).show();
      });
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});
</script>


<!-- <template>
  <div id="globeViz"></div>
  <v-card class="quote-card ma-5" max-width="500" position="absolute" elevation="5">
    <v-card-title>Add a quote</v-card-title>
    <v-card-text>
      <v-form>
        <v-textarea class="quote-text" label="Label"></v-textarea>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn text="Add"></v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue"

const globeViz = ref(null);
const location = ref(null);
const error = ref(null);

onMounted(() => {
  getLocation()
  setupGlobe()
});

const setupGlobe = async () => {
  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
    .domain([0, 1e7]);

  const world = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .hexAltitude(d => d.sumWeight * 6e-8)
    .hexBinResolution(4)
    .hexBinMerge(true)
    .enablePointerInteraction(false); // performance improvement

  fetch('/src/assets/world_population.csv').then(res => res.text())
    .then(csv => d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop })))
    .then(data => world.hexBinPointsData(data));
}
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      },
      (err) => {
        error.value = "Error: " + err.message;
      }
    );
  } else {
    error.value = "Geolocation is not supported by this browser.";
  }
};
</script>
<style>
#app {
  height: inherit;
  width: inherit;
  max-width: max-content;
  max-height: max-content;
  margin: 0px;
  padding: 0px;
}

.quote-card {
  top: 1px
}

.quote-text textarea {
  height: 80px;
}
</style> -->
