<script setup>
import { reactive } from "vue";

const form = reactive({
  image: null,
  prefix: "favicon",
  paletteSize: 64,
  include16: false,
});
</script>

<template>
  <main>
    <h1>favgen demo</h1>
    <form>
      <div class="field">
        <label for="input-file">Upload image</label>
        <PrimeFileUpload
          id="input-file"
          accept="image/*"
          :file-limit="1"
          :show-upload-button="false"
          :show-cancel-button="false"
          :preview-width="32"
        />
      </div>
      <div class="field">
        <label for="input-prefix">Favicon prefix</label>
        <PrimeInputText
          id="input-prefix"
          placeholder="favicon"
          v-model="form.prefix"
        />
      </div>
      <div class="field">
        <label for="input-prefix">Colors palette size</label>
        <PrimeKnob :min="1" :max="256" v-model="form.paletteSize" />
      </div>
      <div class="field field--checkbox">
        <label for="input-prefix">Produce 16 &times; 16 .ico</label>
        <PrimeCheckbox :binary="true" v-model="form.include16" />
      </div>
      <PrimeButton label="Generate" />
    </form>
  </main>
</template>

<style lang="scss" scoped>
main {
  padding: 2.4rem 5vw;
}

form {
  display: grid;
  row-gap: 1rem;
  width: 66%;
  justify-content: start;
}

.field {
  display: grid;
  row-gap: 0.4rem;

  &--checkbox {
    align-self: start;
    display: flex;
    flex-direction: row-reverse;
    column-gap: 0.4rem;
  }
}
</style>
