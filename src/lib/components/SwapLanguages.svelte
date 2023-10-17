<script lang="ts">
  export let onClick: () => void;
  export let disabled: boolean;
  export let loadingPromise: Promise<void> | Promise<TranslateApiResponse>;

  import switchSvg from '$lib/img/switch.svg?raw';
  import type { TranslateApiResponse } from '$lib/types.js';

  let isLoading = false;
  let rotation = 0;

  const clickHandler = () => {
    if (disabled || isLoading) {
      return;
    }
    rotation = rotation === 180 ? 0 : 180;
    onClick();
  };

  $: {
    isLoading = true;
    loadingPromise.finally(() => {
      isLoading = false
    });
  }

</script>

<button
  on:click={clickHandler}
  disabled={disabled || isLoading}
  title="Swap Languages"
  aria-label="Swap Languages"
  style="transform: rotateZ({rotation}deg)"
>
  {@html switchSvg}
</button>

<style>
  button {
    border: none;
    border-radius: 50%;
    background: #fff;
    height: 2rem;
    width: 2rem;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, .2);
    position: absolute;
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  button[disabled] {
    cursor: default;
  }

  button[disabled] :global(path) {
    transition: .3s ease;
    fill: var(--grey);
  }

  button :global(svg) {
    width: 1.2rem;
    height: 1.2rem;
  }
</style>