import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import FileUpload from "primevue/fileupload";
import InputText from "primevue/inputtext";
import Knob from "primevue/knob";
import Image from "primevue/image";
import App from "./App.vue";
import "./assets/styles/_main.scss";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue);
app.component("PrimeButton", Button);
app.component("PrimeCheckbox", Checkbox);
app.component("PrimeFileUpload", FileUpload);
app.component("PrimeInputText", InputText);
app.component("PrimeKnob", Knob);
app.component("PrimeImage", Image);

app.mount("#app");
