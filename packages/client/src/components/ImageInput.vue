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
const isError = ref(false);

function handleNewFile(file) {
  if (!isValidFile(file)) {
    isError.value = true;
    if (props.modelValue) {
      setTimeout(() => {
        isError.value = false;
      }, 3000);
    }
    return;
  }

  isError.value = false;
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
      <div class="form-control w-full">
        <label class="label" :for="id">
          <span class="label-text choose-file__label-text">Pick a file</span>
        </label>
        <input
          type="file"
          :id="id"
          class="file-input file-input-bordered w-full choose-file__input"
          :accept="accept"
          :name="name"
          autocomplete="off"
          :aria-describedby="errorId"
          @input="handleInput"
        />
      </div>
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
  row-gap: 1.4rem;
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
  display: grid;
  justify-items: start;
  row-gap: 1rem;

  &__label-text {
    font-size: var(--font-size--default);
  }

  &__input {
    font-size: var(--font-size--default);
    height: 3.6rem;

    &::file-selector-button {
      font-size: 1.2rem;
      height: 3.6rem;
    }
  }
}

.error {
  color: var(--color-alert);
  width: max-content;
}

.btn-remove {
  width: 100%;
  height: 3.6rem;
  font-size: var(--font-size--default);
}
</style>
