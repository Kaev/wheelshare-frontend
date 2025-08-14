<template>
  <div class="wheel-room-container" v-if="loaded">
    <h2>Wheel: {{ wheel?.id }}</h2>
    <WheelVisualizer
      v-if="wheel"
      :options="wheel.options"
      :spinning="spinning"
      :landingAngle="landingAngle"
      :spinTrigger="spinTrigger"
    />
    <div class="spin-section">
      <button :disabled="spinning" @click="spinWheel">Spin</button>
  <div v-if="resultIdx !== null && !spinning" class="result">
    Result: <b>{{ wheel.options[resultIdx] }}</b>
  </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script setup>
// Play win sound when spin completes
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import winSound from '../assets/win.mp3'
function playTada() {
  const audio = new Audio(winSound)
  audio.play()
}



import WheelVisualizer from './WheelVisualizer.vue'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const route = useRoute()
const wheel = ref(null)
const loaded = ref(false)
const error = ref('')

const spinning = ref(false)
const landingAngle = ref(null)
const resultIdx = ref(null)
const spinTrigger = ref(0)
let socket

onMounted(async () => {
  error.value = ''
  try {
    const res = await fetch(`${backendUrl}/api/wheels/${route.params.id}`)
    if (!res.ok) throw new Error('Wheel not found')
    wheel.value = await res.json()
    loaded.value = true
    // Connect to Socket.IO and join room
    socket = io(backendUrl)
    socket.emit('join-wheel', wheel.value.id)
    socket.on('spin-result', ({ landingAngle: backendLandingAngle, resultIdx: backendResultIdx }) => {
      console.log('spin-result received:', { backendLandingAngle, backendResultIdx });
      landingAngle.value = backendLandingAngle;
      resultIdx.value = backendResultIdx;
      spinTrigger.value++;
      spinning.value = true;
      setTimeout(() => {
        spinning.value = false;
        playTada();
      }, 5000);
    })
  } catch (e) {
    error.value = e.message
    loaded.value = true
  }
})

function spinWheel() {
  if (!wheel.value || spinning.value) return
  spinning.value = true
  resultIdx.value = null
  // Request spin from backend (no result or offset sent)
  socket.emit('spin', { wheelId: wheel.value.id })
}


</script>

<style scoped>
.wheel-room-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
}
.options-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem 0;
}
.options-list li {
  background: #f6f8fa;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
}
.spin-section {
  margin-top: 1.5rem;
}
button {
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.result {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #369870;
}
.error {
  color: #d33;
  margin-top: 1rem;
}
.loading {
  text-align: center;
  margin-top: 3rem;
  font-size: 1.2rem;
}
</style>
