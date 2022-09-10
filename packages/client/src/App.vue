<script setup>
import { reactive } from "vue";
import { saveAs } from "file-saver";
import axios from "axios";
import JSZip from "jszip";

const generatedIcons = reactive({
  zip: null,
  files: [],
});

const form = reactive({
  file: null,
  prefix: "favicon",
  colorsPaletteSize: 64,
  include16: false,
});

function saveFile(file, filename) {
  saveAs(file, filename);
}

function submitForm() {
  if (!form.file) {
    alert("no file is given!");
  }

  const payload = new FormData();
  payload.append("file", form.file);
  payload.append("prefix", form.prefix);
  payload.append("colorsPaletteSize", form.colorsPaletteSize);
  payload.append("include16", form.include16);

  return axios
    .post("/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "arraybuffer",
    })
    .then(async (res) => {
      const zip = await JSZip.loadAsync(res.data);
      generatedIcons.zip = await zip.generateAsync({ type: "blob" });
      generatedIcons.files = await Promise.all(
        Object.values(zip.files).map(async (file) => {
          return {
            name: file.name,
            url: await file
              .async("blob")
              .then((blob) => URL.createObjectURL(blob)),
          };
        }),
      );
    });
}

function handleSelectedFile(e) {
  [form.file] = e.files;
}

function handleRemovedFile() {
  form.file = null;
}
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
          @select="handleSelectedFile"
          @remove="handleRemovedFile"
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
        <PrimeKnob :min="1" :max="256" v-model="form.colorsPaletteSize" />
      </div>
      <div class="field field--checkbox">
        <label for="input-prefix">Produce 16 &times; 16 .ico</label>
        <PrimeCheckbox :binary="true" v-model="form.include16" />
      </div>
      <PrimeButton label="Generate" @click="submitForm" />
    </form>

    <section v-if="generatedIcons.files.length">
      <h2>Generated icons</h2>
      <section>
        <section v-for="icon in generatedIcons.files" :key="icon.name">
          <PrimeImage :src="icon.url" width="32" preview />
          <p>{{ icon.name }}</p>
          <PrimeButton
            label="Download"
            @click="() => saveFile(icon.url, icon.name)"
          />
        </section>
      </section>
      <PrimeButton
        label="Download all"
        @click="() => saveFile(generatedIcons.zip, 'favicons.zip')"
      />
    </section>
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
