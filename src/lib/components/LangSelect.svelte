<script lang="ts">
  export let onChange: () => void;
  export let value: string;
  export let languages: {
    code: string,
    name: string
  }[];

  import { onMount, tick } from 'svelte';
  import crownSvg from '$lib/img/crown.svg?raw';

  let helperElement: HTMLSpanElement;
  let offsetWidthStyle = '';
  let displaySelect = false;
  $: selectedLanguage = languages.find((l) => l.code === value)?.name;

  const setOffsetWidthStyle = async () => {
    await tick();

    if (!helperElement || !selectedLanguage) {
      offsetWidthStyle = '';
      return;
    }

    offsetWidthStyle = `--dynamic-size: ${helperElement.offsetWidth}px`;
  };

  // essentially an effect, used to update the width
  $: {
    if (value && languages) {
      setOffsetWidthStyle();
    }
  }

  const onSelectChange = () => {
    setOffsetWidthStyle();
    onChange();
  };

  onMount(async () => {
    setOffsetWidthStyle();
    displaySelect = true;
  });
</script>

<div class="select-wrapper" style={offsetWidthStyle} class:displaySelect>
  <span class="helper-element" aria-hidden="true" bind:this={helperElement}>{selectedLanguage}</span>
  <select bind:value={value} on:change={onSelectChange}>
    {#each languages as lang}
      <option value={lang.code} selected={value === lang.code}>
        {lang.name}
      </option>
    {/each}
  </select>
  {@html crownSvg}
</div>

<style>
  .select-wrapper {
    --dynamic-size: 45px;
    --arrow-size: 25px;
    --select-size: calc(var(--dynamic-size) + var(--arrow-size));

    display: flex;
    position: relative;
  }

  .select-wrapper :global(svg) {
    position: relative;
    left: calc(var(--arrow-size) * -1);
    pointer-events: none;
  }

  .select-wrapper:not(.displaySelect) {
    opacity: 0;
  }

  select {
    appearance: none;
    border: none;
    border-bottom: 1px solid var(--grey);
    width: var(--select-size);
  }

  select,
  .helper-element {
    font-size: .84rem;
  }

  .helper-element {
    position: absolute;
    left: -9999px;
    opacity: 0;
    width: max-content;
  }
</style>