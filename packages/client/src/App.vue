<script setup>
import { reactive } from "vue";
import { saveAs } from "file-saver";
import axios from "axios";
import JSZip from "jszip";
import ImageInput from "./components/ImageInput.vue";

const generatedIcons = reactive({
  zip: null,
  files: [],
});

const form = reactive({
  image: null,
  prefix: "favicon",
  colorsPaletteSize: 64,
  include16: false,
});

function saveFile(file, filename) {
  saveAs(file, filename);
}

function submitForm() {
  if (!form.image) {
    alert("no file is given!");
    return;
  }

  const payload = new FormData();
  payload.append("file", form.image.file);
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
            url: await file.async("blob").then((blob) => {
              // If there is no type on svg blob, then it is rendered incorrectly
              const finalBlob =
                !blob.type && file.name.endsWith(".svg")
                  ? blob.slice(0, blob.size, "image/svg+xml")
                  : blob;

              return URL.createObjectURL(finalBlob);
            }),
          };
        }),
      );
    });
}
</script>

<template>
  <main>
    <h1>favgen: demo</h1>

    <form class="mb-16">
      <h2>Fill the form and generate favicons</h2>

      <section class="fields w-96">
        <ImageInput
          id="input-file"
          title="title"
          accept="image/*"
          name="input-file"
          v-model="form.image"
          errorMsg="error"
          removeMsg="remove"
          :validateFn="() => true"
        />

        <div class="form-control">
          <label class="label" for="input-prefix">
            <span class="label-text">Favicon prefix</span>
          </label>
          <input
            type="text"
            id="input-prefix"
            v-model="form.prefix"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control">
          <label class="label" for="input-colors-size">
            <span class="label-text">Colors palette size</span>
          </label>
          <input
            type="number"
            min="1"
            max="256"
            id="input-colors-size"
            v-model="form.colorsPaletteSize"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-fit">
          <label class="label cursor-pointer" for="input-include16">
            <input
              type="checkbox"
              id="input-include16"
              v-model="form.include16"
              class="checkbox"
            />
            <span class="label-text">Produce 16&times;16 .ico</span>
          </label>
        </div>
      </section>

      <button class="btn" @click.prevent="submitForm">Generate</button>
    </form>

    <section v-if="generatedIcons.files.length">
      <h2>Generated icons</h2>

      <section class="w-max grid gap-y-3 mb-6">
        <section
          v-for="icon in generatedIcons.files"
          :key="icon.name"
          class="generated-icon-cell"
        >
          <div class="mr-2.5">
            <div class="w-8 rounded">
              <img :src="icon.url" />
            </div>
          </div>

          <p class="mr-8">{{ icon.name }}</p>

          <button
            @click="() => saveFile(icon.url, icon.name)"
            class="btn generated-icon-cell__btn"
          >
            Download
          </button>
        </section>
      </section>

      <button
        @click="() => saveFile(generatedIcons.zip, 'favicons.zip')"
        class="btn w-max"
      >
        Download all
      </button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  padding: 2.4rem 12vw;
}

h1 {
  font-size: 4.8rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
}

h2 {
  font-size: 3.2rem;
  margin-bottom: 1.2rem;
}

form {
  width: 66%;
}

.fields {
  display: grid;
  row-gap: 1.8rem;
  margin-bottom: 1.8rem;
}

.label-text,
.input {
  font-size: 1.6rem;
}

.field {
  display: grid;
  row-gap: 0.4rem;

  &--checkbox {
    justify-self: start;
    display: flex;
    flex-direction: row-reverse;
    column-gap: 0.4rem;
  }
}

.checkbox {
  margin-inline-end: 0.4rem;
}

.btn {
  height: 4rem;
  font-size: 1.6rem;
}

.generated-icon-cell {
  display: grid;
  grid-template-columns: repeat(2, max-content) 1fr;
  align-items: center;

  &__btn {
    height: 3.6rem;
    font-size: 1.2rem;
    margin-left: auto;
  }
}
</style>
