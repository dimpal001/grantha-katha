<script lang="ts">
  import Icon from '@iconify/svelte'

  const socialLinks = [
    {
      icon: 'mdi:linkedin',
      href: 'https://www.linkedin.com/company/granthakatha/',
    },
    {
      icon: 'mdi:facebook',
      href: 'https://www.facebook.com/share/1EZuPbQGqd/',
    },
    {
      icon: 'mdi:twitter',
      href: 'https://x.com/GranthaKatha',
    },
    {
      icon: 'mdi:instagram',
      href: 'https://www.instagram.com/granthakatha?utm_source=qr&igsh=MWN0cnZ2N3IxbWI4eQ==',
    },
  ]
</script>

<div
  class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
>
  <h2 class=" font-semibold text-gray-800 dark:text-white mb-4">
    Connect with us
  </h2>
  <div class="flex justify-evenly gap-4">
    {#each socialLinks as link}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      >
        <Icon icon={link.icon} class="w-10 h-10" />
      </a>
    {/each}
  </div>
</div>
