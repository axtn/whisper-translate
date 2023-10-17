<script>
  import { Toaster } from 'svelte-french-toast';
</script>

<span>
  <Toaster />
</span>

<style>
  span :global(.toaster) {
    --default-offset: 70px;
  }
</style>