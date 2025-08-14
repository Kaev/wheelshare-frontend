<template>
  <div class="wheelshare-container">
    <h1>Wheelshare</h1>
    <form @submit.prevent="createWheel">
      <label>Wheel Options (one per line):</label>
      <textarea v-model="optionsText" rows="6" placeholder="Enter options..."></textarea>
      <button type="submit">Create Wheel</button>
    </form>
    <div v-if="wheelId" class="share-section">
      <p>Share this link:</p>
      <input :value="shareLink" readonly @focus="$event.target.select()" />
      <button @click="copyLink">Copy</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>

const optionsText = ref('')
const wheelId = ref('')
const error = ref('')
const shareLink = ref('')
const backendUrl = import.meta.env.VITE_BACKEND_URL

async function createWheel() {
  error.value = ''
  const options = optionsText.value.split('\n').map(o => o.trim()).filter(Boolean)
  if (options.length < 2) {
    error.value = 'Please enter at least 2 options.'
    return
  }
  try {
    const res = await fetch(`${backendUrl}/api/wheels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options })
    })
    if (!res.ok) throw new Error('Failed to create wheel')
    const data = await res.json()
    wheelId.value = data.id
    shareLink.value = `${window.location.origin}/wheel/${data.id}`
  } catch (e) {
    error.value = e.message
  }
}

function copyLink() {
  navigator.clipboard.writeText(shareLink.value)
}
</script>

<style scoped>
.wheelshare-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h1 {
  text-align: center;
}
textarea {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 1rem;
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
button:hover {
  background: #369870;
}
.share-section {
  margin-top: 1.5rem;
  text-align: center;
}
input[readonly] {
  width: 80%;
  margin-bottom: 0.5rem;
  padding: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.error {
  color: #d33;
  margin-top: 1rem;
  text-align: center;
}
</style>
