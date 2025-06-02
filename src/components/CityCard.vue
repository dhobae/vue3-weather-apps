<template>
  <div class="flex px-3 py-6 rounded-md shadow-md cursor-pointer bg-weather-secondary">
    <div class="flex flex-col flex-1">
      <h2 class="text-3xl">{{ city.city }}</h2>
      <h3>{{ city.state }}</h3>
    </div>

    <div class="flex flex-col gap-2">
      <p class="self-end text-3xl">
        {{ Math.round(city.weather.main.temp) }}&deg;
      </p>
      <div class="flex gap-2">
        <span class="text-xs">
          H:
          {{ city.weather.main.temp_max !== null ? Math.round(city.weather.main.temp_max) + '°' : 'N/A' }}
        </span>
        <span class="text-xs">
          L:
          {{ city.weather.main.temp_min !== null ? Math.round(city.weather.main.temp_min) + '°' : 'N/A' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    default: () => { },
  },
});
</script>
