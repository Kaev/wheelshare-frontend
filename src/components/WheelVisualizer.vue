<template>
  <div class="wheel-visualizer">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="wheel-svg">
      <g :style="{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }">
        <template v-for="(option, idx) in options">
          <path
            :key="idx"
            :d="describeArc(size/2, size/2, size/2-10, anglePer * idx, anglePer * (idx+1))"
            :fill="colors[idx % colors.length]"
            stroke="#fff"
            stroke-width="2"
          />
          <text
            :key="'text-' + idx"
            :x="getTextPos(idx).x"
            :y="getTextPos(idx).y"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="16"
            fill="#222"
            :transform="`rotate(${anglePer*idx+anglePer/2} ${size/2} ${size/2})`"
          >
            {{ option }}
          </text>
        </template>
      </g>
      <!-- Pointer -->
      <polygon :points="pointerPoints" fill="#d33" />
    </svg>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  options: Array,
  spinning: Boolean,
  result: Number,
  spinTrigger: Number // incremented to trigger spin
})

const size = 320
const anglePer = 360 / props.options.length
const colors = ['#f6d365', '#fda085', '#a1c4fd', '#c2e9fb', '#fbc2eb', '#fdcbf1', '#b2fefa', '#f5f7fa']
const pointerPoints = `${size/2-10},10 ${size/2+10},10 ${size/2},40`

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
    x: size/2 + (size/2-50) * Math.cos(rad),
    y: size/2 + (size/2-50) * Math.sin(rad)
  }
}

watch(() => props.spinTrigger, (newVal, oldVal) => {
  if (props.spinning && typeof props.result === 'number') {
    // Animate spin
    const spins = 6
    const finalAngle = 360 * spins - anglePer * props.result - anglePer/2
    rotation.value = 0
    if (spinningTimeout) clearTimeout(spinningTimeout)
    setTimeout(() => {
      rotation.value = finalAngle
    }, 20)
  }
})
</script>

<style scoped>
.wheel-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}
.wheel-svg {
  background: #f6f8fa;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
</style>
