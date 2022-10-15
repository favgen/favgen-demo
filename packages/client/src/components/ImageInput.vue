<script setup lang="ts">
import { ref, computed } from "vue";
import { useDropZone } from "@vueuse/core";

const props = defineProps([
  "id",
  "title",
  "accept",
  "name",
  "modelValue",
  "errorMsg",
  "removeMsg",
  "validateFn",
]);
const errorId = computed(() => `${props.id}_error`);
const emit = defineEmits(["update:modelValue"]);
const dropZoneRef = ref(null);

function isValidFile(file) {
  return Boolean(file && props.validateFn && props.validateFn(file));
}
const isError = computed(
  () => props.modelValue && !isValidFile(props.modelValue.file),
);

function handleNewFile(file) {
  if (!isValidFile(file)) return;

  emit("update:modelValue", { file, url: URL.createObjectURL(file) });
}

function handleInput(e) {
  if (!(e.target instanceof HTMLInputElement)) return;

  const file = e.target.files?.[0];
  handleNewFile(file);
}

function handleDrop(files) {
  if (!files || !files.length) return;

  const file = files[0];
  handleNewFile(file);
}

const { isOverDropZone } = useDropZone(dropZoneRef, handleDrop);
</script>

<template>
  <section class="wrapper">
    <section
      ref="dropZoneRef"
      class="dropzone"
      :class="{ 'dropzone--active': isOverDropZone }"
      aria-hidden="true"
    >
      <img
        v-if="modelValue"
        :src="modelValue.url"
        :title="modelValue.file.name"
        :alt="modelValue.file.name"
        class="dropzone__preview"
      />
      <div class="dropzone__text-hints">
        <p v-if="modelValue" class="dropzone__image-name">
          {{ modelValue.file.name }}
        </p>
        <p class="dropzone__action">
          {{ isOverDropZone ? "Drop your image here" : "Drag your image here" }}
        </p>
      </div>
    </section>

    <section class="choose-file">
      <label v-if="!modelValue" :for="id" class="file-field">
        <span class="btn file-btn">Choose a file</span>
        <input
          :id="id"
          type="file"
          :accept="accept"
          :name="name"
          autocomplete="off"
          class="file-input"
          :aria-describedby="errorId"
          @input="handleInput"
        />
      </label>
      <span v-if="isError" :id="errorId" class="error" aria-live="assertive">
        {{ errorMsg }}
      </span>
      <button
        v-if="modelValue"
        class="btn btn-remove"
        @click="() => emit('update:modelValue', null)"
      >
        {{ removeMsg }}
      </button>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: 100%;
  row-gap: 1.2rem;
}

.dropzone {
  outline: 1px dashed currentcolor;
  display: grid;
  grid-template-columns: 100%;
  justify-items: center;
  padding: 0.8rem;
  min-height: 18rem;

  &--active {
    outline-width: 0.3rem;
    outline-style: solid;
  }

  &__preview {
    width: 85%;
    object-fit: cover;
    object-position: center;
    border-radius: 0.8rem;
  }

  &__text-hints {
    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
    align-content: end;
    text-align: center;
    padding-bottom: 1.2rem;
  }

  &__image-name {
    margin-bottom: 1.5rem;
  }

  &__action {
    color: var(--color-grey-light);
  }
}

.choose-file {
  --button-height: 4rem;

  display: grid;
  grid-template: var(--button-height) / 100%;
  justify-items: start;
  row-gap: 1rem;
}

.file-input {
  width: 100%;
  height: 100%;
  grid-row: 1;
  grid-column: 1;
  opacity: 0;
  overflow: hidden;
}

.file-btn {
  width: 100%;
  height: 100%;
  grid-row: 1;
  grid-column: 1;
  display: grid;
  place-content: center;
  font-size: 1.6rem;
  line-height: 0;
  cursor: pointer;
  z-index: 1; /* this will make cursor: pointer for the whole area */

  .file-field:focus-within & {
    outline: 0.25rem solid var(--color-dark);
  }

  .file-field:hover & {
    transform: scale(1.05);
  }
}

.error {
  color: var(--color-alert);
  width: max-content;
}

.btn-remove {
  width: 100%;
  height: var(--button-height);
  font-size: 1.6rem;

  &:focus {
    outline: 0.2rem solid var(--color-dark);
  }
}
</style>
