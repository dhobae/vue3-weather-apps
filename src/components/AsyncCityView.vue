<template>
  <div class="flex flex-col items-center flex-1">
    <!-- Banner -->
    <div v-if="route.query.preview === 'true' && !isAlreadySaved"
      class="w-full p-4 text-center text-white bg-weather-secondary">
      <p>
        You are currently previewing this city, click the "+" icon to start tracking this city.
      </p>
    </div>

    <!-- Weather Overview -->
    <div class="flex flex-col items-center py-12 text-white">
      <h1 class="mb-2 text-4xl">{{ route.params.city }}</h1>
      <p class="mb-12 text-sm">
        {{
          new Date().toLocaleDateString(
            "en-us",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )
        }}
        {{
          new Date().toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            }
          )
        }}
      </p>
      <p class="mb-8 text-8xl">
        {{ Math.round(weatherData.current.temperature_2m) }}&deg;
      </p>
      <p>
        Feels like
        {{ Math.round(weatherData.current.apparent_temperature) }} &deg;
      </p>
      <p class="capitalize">
        {{ getWeatherDescription(weatherData.current.weather_code) }}
      </p>
      <div class="w-[150px] h-[150px] flex items-center justify-center text-6xl">
        {{ getWeatherIcon(weatherData.current.weather_code) }}
      </div>
    </div>

    <hr class="w-full border border-white border-opacity-10" />

    <!-- Hourly Weather -->
    <div class="w-full max-w-screen-md py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div v-for="(hourData, index) in weatherData.hourly.time.slice(0, 24)" :key="index"
            class="flex flex-col items-center gap-4 mb-5">
            <p class="whitespace-nowrap text-md">
              {{
                new Date(hourData).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <div class="text-2xl">
              {{ getWeatherIcon(weatherData.hourly.weather_code[index]) }}
            </div>
            <p class="text-xl">
              {{ Math.round(weatherData.hourly.temperature_2m[index]) }}&deg;
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr class="w-full border border-white border-opacity-10" />

    <!-- Weekly Weather -->
    <div class="w-full max-w-screen-md py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">7 Day Forecast</h2>
        <div v-for="(day, index) in weatherData.daily.time" :key="index" class="flex items-center mb-4">
          <p class="flex-1">
            {{
              new Date(day).toLocaleDateString(
                "en-us",
                {
                  weekday: "long",
                }
              )
            }}
          </p>
          <div class="mx-4 text-3xl">
            {{ getWeatherIcon(weatherData.daily.weather_code[index]) }}
          </div>
          <div class="flex justify-end flex-1 gap-2">
            <p>H: {{ Math.round(weatherData.daily.temperature_2m_max[index]) }}&deg;</p>
            <p>L: {{ Math.round(weatherData.daily.temperature_2m_min[index]) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 py-12 text-white duration-150 cursor-pointer hover:text-red-500"
      @click="removeCity">
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useSavedCities } from "@/composables/useSavedCities";

const { isAlreadySaved } = useSavedCities();
const route = useRoute();

// Function to get weather code description
const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return weatherCodes[code] || "Unknown";
};

// Function to get weather icon emoji
const getWeatherIcon = (code) => {
  const weatherIcons = {
    0: "☀️",  // Clear sky
    1: "🌤️",  // Mainly clear
    2: "⛅",  // Partly cloudy
    3: "☁️",  // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Light drizzle
    53: "🌦️", // Moderate drizzle
    55: "🌧️", // Dense drizzle
    56: "🌧️", // Light freezing drizzle
    57: "🌧️", // Dense freezing drizzle
    61: "🌧️", // Slight rain
    63: "🌧️", // Moderate rain
    65: "🌧️", // Heavy rain
    66: "🌧️", // Light freezing rain
    67: "🌧️", // Heavy freezing rain
    71: "❄️", // Slight snow fall
    73: "❄️", // Moderate snow fall
    75: "❄️", // Heavy snow fall
    77: "❄️", // Snow grains
    80: "🌦️", // Slight rain showers
    81: "🌦️", // Moderate rain showers
    82: "🌧️", // Violent rain showers
    85: "🌨️", // Slight snow showers
    86: "🌨️", // Heavy snow showers
    95: "⛈️", // Thunderstorm
    96: "⛈️", // Thunderstorm with slight hail
    99: "⛈️"  // Thunderstorm with heavy hail
  };
  return weatherIcons[code] || "🌤️";
};

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${route.query.lat}&longitude=${route.query.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto`
    );


    return weatherData.data;
  } catch (err) {
    console.log(err);
  }
};

const weatherData = await getWeatherData();

const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter(
    (city) => city.id !== route.query.id
  );
  localStorage.setItem(
    "savedCities",
    JSON.stringify(updatedCities)
  );
  router.push({
    name: "home",
  });
};
</script>