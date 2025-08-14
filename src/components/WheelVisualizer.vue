<template>
  <div class="wheel-visualizer">
  <svg :width="svgSize" :height="svgSize" :viewBox="`0 0 ${svgSize} ${svgSize}`" class="wheel-svg">
      <g
        :style="{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: spinningTransition }"
        @transitionend="onTransitionEnd"
      >
        <template v-for="(option, idx) in options" :key="idx">
          <path
            :d="describeArc(svgSize/2, svgSize/2, wheelRadius, anglePer * idx, anglePer * (idx+1))"
            :fill="colors[idx % colors.length]"
            stroke="#fff"
            stroke-width="2"
          />
          <g :transform="`translate(${getTextPos(idx).x},${getTextPos(idx).y}) rotate(${anglePer*idx + anglePer/2})`">
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="20"
              fill="#222"
              :style="{ writingMode: 'tb', glyphOrientationVertical: 'auto', letterSpacing: '2px', fontWeight: 600, userSelect: 'none' }"
            >
              {{ getTruncatedOption(option, idx) }}
            </text>
          </g>
        </template>
      </g>
      <!-- Pointer -->
      <polygon :points="pointerPoints" fill="#d33" />
    </svg>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue'
// Track if a spin is in progress
const isSpinning = ref(false)
const spinningTransition = computed(() => isSpinning.value ? 'transform 5s cubic-bezier(0.33,1,0.68,1)' : 'none')

const props = defineProps({
  options: Array,
  spinning: Boolean,
  landingAngle: Number,
  spinTrigger: Number // incremented to trigger spin
})

// Make the wheel 75% of the screen size while maintaining aspect ratio
const svgSize = Math.min(window.innerWidth, window.innerHeight) * 0.75;
const wheelRadius = svgSize / 2 - 20;
const anglePer = 360 / props.options.length
const colors = ['#f6d365', '#fda085', '#a1c4fd', '#c2e9fb', '#fbc2eb', '#fdcbf1', '#b2fefa', '#f5f7fa']
const pointerPoints = `${svgSize/2-20},20 ${svgSize/2+20},20 ${svgSize/2},60`

const rotation = ref(0)
let spinningTimeout = null

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ')
}
function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle-90) * Math.PI / 180.0
  return {
    x: cx + (r * Math.cos(rad)),
    y: cy + (r * Math.sin(rad))
  }
}
function getTextPos(idx) {
  const angle = anglePer * idx + anglePer/2
  const rad = (angle-90) * Math.PI / 180.0
  return {
    x: svgSize/2 + (wheelRadius-60) * Math.cos(rad),
    y: svgSize/2 + (wheelRadius-60) * Math.sin(rad)
  }
}

// Truncate option text if it won't fit vertically in the slice
function getTruncatedOption(option, idx) {
  // Estimate max chars: slice arc length / font size
  const arcLength = (Math.PI * wheelRadius * anglePer) / 180;
  const maxChars = Math.floor((arcLength / 20) * 1.2); // fudge factor for vertical
  if (option.length > maxChars) {
    return option.slice(0, maxChars - 1) + '…';
  }
  return option;
}

// Store the backend-provided landingAngle for the current spin
let currentLandingAngle = 0;
watch(() => props.spinTrigger, (newVal, oldVal) => {
  if (props.spinning && typeof props.landingAngle === 'number') {
    const spins = 8;
    currentLandingAngle = props.landingAngle;
    // Animate to the landing angle (pointer at 9 o'clock)
    const finalAngle = 360 * spins - currentLandingAngle;
    if (spinningTimeout) clearTimeout(spinningTimeout);
    isSpinning.value = true;
    setTimeout(() => {
      rotation.value = finalAngle;
    }, 20);
  }
});

function onTransitionEnd() {
  // After spin, reset rotation to the minimal equivalent angle for next spin
  if (isSpinning.value) {
    const minimalAngle = (360 - currentLandingAngle) % 360;
    rotation.value = minimalAngle;
    isSpinning.value = false;
  }
}
</script>

<style scoped>
.wheel-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75vh;
  margin: 0;
  padding: 0;
}
.wheel-svg {
  border-radius: 50%;
  width: 75vmin;
  height: 75vmin;
  min-width: 500px;
  min-height: 500px;
  background: none;
  box-shadow: none;
  display: block;
}
</style>
