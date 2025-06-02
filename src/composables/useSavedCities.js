import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const savedCities = ref(JSON.parse(localStorage.getItem("savedCities")) || []);

export function useSavedCities() {
    const route = useRoute();

    const isAlreadySaved = computed(() => {
        return savedCities.value.some(
            (city) =>
            city.city.toLowerCase() === route.params.city?.toLowerCase() &&
            city.state.toLowerCase() === route.params.state?.toLowerCase()
        );
    });

    const addCity = (cityData) => {
        if (isAlreadySaved.value) return;

        savedCities.value.push(cityData);
        localStorage.setItem("savedCities", JSON.stringify(savedCities.value));
    };

    return {
        savedCities,
        isAlreadySaved,
        addCity,
    };
}