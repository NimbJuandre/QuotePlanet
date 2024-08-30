<template>
  <div ref="globeContainer" class="globe-container"></div>
  <div class="randomCoords">
    <button @click="generateRandomCoordinates">Get Random Coordinates</button>
  </div>
  <div>
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
  </div>
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
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const globeContainer = ref(null);
const globeLoaded = ref(false);
const dialog = ref(false);
const author = ref();
const quote = ref();
var globe = null;
var pointsData = [];
var position = ref({});

// Function to generate random latitude and longitude
function generateRandomCoordinates() {
  position.value.latitude = (Math.random() * 180 - 90).toFixed(6); // Random latitude between -90 and 90
  position.value.longitude = (Math.random() * 360 - 180).toFixed(6); // Random longitude between -180 and 180
  alert("Coordinates randomized")
}

onMounted(() => {
  setupFirestoreQuoteCallback()
  setupGlobe()
});

const setupFirestoreQuoteCallback = () => {
  onSnapshot(collection(db, "quotes"), (snapshot) => {
    pointsData = snapshot.docs.map(doc => doc.data());
    globe.pointsData(pointsData);
  });
}

const setupGlobe = () => {
  globe = Globe()(globeContainer.value)
    .width(window.innerWidth)
    .height(window.innerHeight)
    .backgroundColor('#000')
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

  globeLoaded.value = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      position.value = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      globe
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
}

const submit = async () => {
  try {
    if (!position.value.latitude || !position.value.longitude) {
      alert('Please give location permitions or press the "Get Randome Coordinates" button')
      return
    }

    if (!author.value || !quote.value)
      return;

    addDoc(collection(db, "quotes"), {
      lat: position.value.latitude,
      lng: position.value.longitude,
      author: author.value,
      quote: quote.value,
      timestamp: new Date(),
    });

    globe.pointOfView({ lat: position.value.latitude, lng: position.value.longitude }, 0);
    dialog.value = false;
    author.value = "";
    quote.value = "";
  } catch (error) {
    console.error("Error adding document: ", error);
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

.randomCoords {
  position: absolute;
  left: 10px;
  top: 10px;
  opacity: 0.7;
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
