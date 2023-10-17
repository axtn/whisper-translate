<script lang="ts">
  export let data;

  import { onMount } from 'svelte';

  import LangSelect from '$lib/components/LangSelect.svelte';
  import Skeleton from '$lib/components/Skeleton.svelte';
  import SwapLanguages from '$lib/components/SwapLanguages.svelte';
  import toast from '$lib/toast.js';
  import { maxTranslationLength } from '$lib/config.js';
  import type { TranslateApiResponse } from '$lib/types.js';

  import debounce from '$lib/debounce.js';
  import copySvg from '$lib/img/copy.svg?raw';
  import lockLogoSvg from '$lib/img/lockLogo.svg?raw';

  let abortController = new AbortController();
  let text = '';
  let translation = '';
  let source = 'auto';
  let target = 'en';
  let detectedSource = '';
  let currentRequest: Promise<void> | Promise<TranslateApiResponse> = Promise.resolve();

  $: detectedSourceLanguage = detectedSource ? data.languages.find((l) => l.code === detectedSource)?.name : '';
  $: sourceLanguages = [
    {
      code: 'auto',
      name: detectedSource ? `${detectedSourceLanguage} - Detected` : 'Auto Detect'
    },
    ...data.languages.filter((l) => l.code !== target)
  ];
  $: targetLanguages = data.languages.filter((l) => l.code !== source);
  $: isSwapDisabled = (source === 'auto' && !detectedSource) || detectedSource === target;

  $: {
    if (source !== 'auto') {
      detectedSource = '';
    }
  }

  const getTranslation = async () => {
    try {
      abortController.abort();
      abortController = new AbortController();

      translation = '';

      if (text === '') {
        detectedSource = '';
        currentRequest = Promise.resolve();
        return;
      }

      const requestPromise = fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text, source, target }),
        signal: abortController.signal
      });
      const jsonPromise: Promise<TranslateApiResponse> = requestPromise.then((res) => res.json());

      currentRequest = jsonPromise;

      const [request, json] = await Promise.all([requestPromise, jsonPromise]);

      if (!request.ok) {
        throw new Error(json.message);
      }

      translation = json.translation;
      detectedSource = json.detectedLanguageCode ?? '';
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      toast.danger(err.message ?? 'Server error');
    }
  };

  const setLocalStorage = () => {
    window.localStorage.setItem('source', source);
    window.localStorage.setItem('target', target);
  };

  const onLanguageChange = () => {
    setLocalStorage();
    getTranslation();
  };

  const onInput = debounce(getTranslation, 650);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(translation);
    toast.success('Translation copied');
  };

  const swapLanguages = async () => {
    let tempSource = source;
    let tempTarget = target;

    text = translation;
    translation = '';

    source = tempTarget;
    if (detectedSource) {
      target = detectedSource;
      detectedSource = '';
    } else {
      target = tempSource;
    }

    onLanguageChange();
  };

  onMount(() => {
    target = window.localStorage.getItem('target') ?? target;
    source = window.localStorage.getItem('source') ?? source;
  });
</script>

<div class="wrapper">
  <h1 aria-label="Whisper">
    {@html lockLogoSvg}
    Whisper
  </h1>

  <div class="translation-zone">
    <div class="source">
      <div class="language-display language-display-source">
        <LangSelect languages={sourceLanguages} onChange={onLanguageChange} bind:value={source} />
        <span>{text.length.toLocaleString()} / {maxTranslationLength.toLocaleString()}</span>
      </div>

      <textarea bind:value={text} on:input={onInput} maxlength="{maxTranslationLength}" placeholder="Enter text" />
    </div>

    <div class="divider">
      <SwapLanguages onClick={swapLanguages} disabled={isSwapDisabled} loadingPromise={currentRequest} />
    </div>

    <div class="target">
      <div class="language-display language-display-target">
        <LangSelect languages={targetLanguages} onChange={onLanguageChange} bind:value={target} />
        {#if translation.length}
        <button on:click={copyToClipboard} title="Copy Translation" aria-label="Copy Translation">
          {@html copySvg}
        </button>
        {/if}
      </div>

      <div class="output">
        {#await currentRequest}
          <Skeleton height="1.3em" width="18em" />
        {:then _}
          {#if translation}
            {translation}
          {:else}
            Type in text above to translate
          {/if}
        {:catch}
          {#if text}
            Translation error.
            <button class="retry" on:click={getTranslation}>Try Again</button>
          {/if}
        {/await}
      </div>
    </div>
  </div>

  <p class="policy">
    This website uses Google Translate API which operates under a different data privacy policy than translate.google.com, read it <a href="https://cloud.google.com/translate/data-usage" target="_blank">here</a>. No translation data is stored either by this website or the Google service used to provide the translation.
  </p>

</div>

<style>
  h1 {
    margin: 0.3em 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
  }

  .wrapper {
    padding: 1px;
    height: calc(100vh - 16px);
    display: flex;
    flex-direction: column;
  }

  .translation-zone {
    width: 100%;
    background: white;
    border-radius: 11px;
    padding: 0.8em;
    height: 60vh;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  textarea {
    width: 100%;
    border: none;
    flex-grow: 1;
    font-size: 1.1rem;
    resize: none;
  }

  .policy {
    color: var(--dark-grey);
    font-size: .8rem;
    text-align: center;
    margin: 8px 0 0;
  }

  .language-display {
    font-size: .84rem;
  }

  .language-display-source {
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
  }

  .language-display-source span {
    color: var(--dark-grey);
  }

  .language-display-target {
    display: flex;
    justify-content: space-between;
    margin: .5rem 0 0.7rem;
  }

  .language-display-target button {
    background: none;
    border: none;
    display: flex;
    align-items: center;
  }

  .divider {
    height: 1px;
    background-color: var(--grey);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .source,
  .target {
    height: calc(50% - 1px);
    display: flex;
    flex-direction: column;
  }

  .source {
    padding-bottom: 1rem;
  }

  .output {
    flex-grow: 1;
    overflow: auto;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  a:visited {
    color: inherit;
  }

  .retry {
    background: none;
    border: none;
    text-decoration: underline;
    font-size: 1rem;
    padding: 0;
  }
</style>