import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import "./assets/styles/_main.scss";
import "primevue/resources/themes/nova-vue/theme.css";
import "primevue/resources/primevue.min.css";

const app = createApp(App);

app.use(PrimeVue);

app.mount("#app");
