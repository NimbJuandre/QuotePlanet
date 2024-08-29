<template>
  <div ref="globeContainer" class="globe-container"></div>
  <v-fab-transition>
    <v-fab v-if="globeLoaded" class="fab" color="primary" icon="mdi-plus" location="bottom right" size="40" absolute
      offset @click="dialog = !dialog"></v-fab>
  </v-fab-transition>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-text-field v-model="author" label="Author"></v-text-field>
        <v-text-field v-model="quote" counter max="100" label="Quote"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="submit()">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const globeContainer = ref(null);
const globeLoaded = ref(false);
const dialog = ref(false);
const author = ref();
const quote = ref();
var globe = null;
var pointsData = [];
const position = ref({});

onMounted(() => {
  globe = Globe()(globeContainer.value)
    .width(window.innerWidth)
    .height(window.innerHeight)
    .backgroundColor('#000')
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

  globeLoaded.value = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      position.value = pos.coords;
      globe
        //.pointsData([{ lat: latitude, lng: longitude, id: 1 }])
        .pointAltitude(0)
        .pointRadius(0.2)        
        .pointLabel(p => `${p.author}: ${p.quote}`)
        .pointOfView({ lat: position.value.latitude, lng: position.value.longitude }, 0);

      globe.onPointClick((point) => {

      });
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

const submit = () => {
  pointsData.push({ lat: position.value.latitude, lng: position.value.longitude, author: author.value, quote: quote.value, id: 1 });
  globe.pointsData(pointsData);
  dialog.value = false;
  author.value = "";
  quote.value = "";
}
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

.fab {
  bottom: 35px;
  right: 10px;
}

.quote-card {
  top: 1px
}

.quote-text textarea {
  height: 80px;
}
</style> 
