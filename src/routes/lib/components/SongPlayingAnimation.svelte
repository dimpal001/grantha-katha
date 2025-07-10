<script>
  export let barCount = 5
  export let colors = ['#ff5f6d', '#ffc371', '#47e5bc', '#5f72be', '#9b59b6']
</script>

<div class="container">
  {#each Array(barCount) as _, i}
    <div
      class="bar"
      style="
          --i: {i};
          background: {colors[i % colors.length]};
          animation-delay: {i * 0.15}s;
          animation-duration: {1 + (i % 3) * 0.2}s;
        "
    />
  {/each}
</div>

<style>
  .container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 30px;
    width: fit-content;
  }

  .bar {
    width: 6px;
    border-radius: 4px;
    animation: bounce 1s infinite ease-in-out;
    animation-delay: calc(var(--i) * 0.1s);
  }

  @keyframes bounce {
    0%,
    100% {
      height: 10%;
    }
    50% {
      height: 100%;
    }
  }
</style>
