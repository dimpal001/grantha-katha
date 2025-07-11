<script>
  // @ts-nocheck
  import { onDestroy, onMount } from 'svelte'

  let images = ['/data/banner/Banner-3.jpg', '/data/banner/Banner-4.jpg']
  let currentIndex = 0
  let interval
  const slideInterval = 4000

  onMount(() => {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length
    }, slideInterval)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<div class="relative w-full h-full overflow-hidden">
  <div
    class="flex transition-transform duration-1000 ease-in-out w-full h-full"
    style="transform: translateX(-{currentIndex * 100}%)"
  >
    {#each images as img}
      <img src={img} alt="" class="w-full h-auto rounded" />
    {/each}
  </div>
</div>
