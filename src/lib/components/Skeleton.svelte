<script lang="ts">
  export let width: string;
  export let height: string;
</script>

<span style="width: {width}; height: {height};"></span>

<style>
  span {
    display: inline-block;
    position: relative;
    overflow: hidden;
    background-color: #DDDBDD;
  }

  span::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
    animation: shimmer 1s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
</style>