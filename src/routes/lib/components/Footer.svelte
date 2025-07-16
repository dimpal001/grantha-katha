<script lang="ts">
  // @ts-nocheck
  import Icon from '@iconify/svelte'
  import { translations } from '../../../utils/translations'
  import { language } from '../../../stores/appStore'

  $: footerLinks = [
    {
      label: translations[$language]?.footer?.about,
      href: 'https://granthakatha.com/aboutus',
    },
    {
      label: translations[$language]?.footer?.terms,
      href: 'https://granthakatha.com/termsandconditions',
    },
    {
      label: translations[$language]?.footer?.privacy,
      href: 'https://granthakatha.com/privacypolicy',
    },
    {
      label: translations[$language]?.footer?.contact,
      href: 'https://granthakatha.com/contacts',
    },
    {
      label: translations[$language]?.footer?.howToOrder,
      href: 'https://granthakatha.com/howtoorder',
    },
    {
      label: translations[$language]?.footer?.team,
      href: 'https://granthakatha.com/ourteam',
    },
    {
      label: translations[$language]?.footer?.contact,
      href: 'https://granthakatha.com/contacts',
    },
  ]

  const socialLinks = [
    {
      icon: 'mdi:linkedin',
      href: 'https://www.linkedin.com/company/granthakatha/',
    },
    {
      icon: 'mdi:facebook',
      href: 'https://www.facebook.com/share/1EZuPbQGqd/',
    },
    { icon: 'mdi:twitter', href: 'https://x.com/GranthaKatha' },
    {
      icon: 'mdi:instagram',
      href: 'https://www.instagram.com/granthakatha?utm_source=qr&igsh=MWN0cnZ2N3IxbWI4eQ==',
    },
  ]

  function isNonLatin(text) {
    return text && !/^[\x00-\x7F]*$/.test(text)
  }
</script>

<footer
  class="bg-[#6257a5] text-white/80 py-10 px-6 text-center font-sans mb-10"
>
  <div class="flex justify-center gap-6 mb-6">
    {#each socialLinks as link}
      <a
        href={link.href}
        target="_blank"
        class="hover:text-orange-500 transition"
      >
        <Icon icon={link.icon} class="w-8 h-8" />
      </a>
    {/each}
  </div>

  <div class={`grid grid-cols-1 gap-4 max-w-4xl mx-auto mb-8 text`}>
    {#each footerLinks as link}
      <a
        href={link.href}
        target="_blank"
        class={`hover:text-orange-500 ${isNonLatin(link) && 'font-serif'} transition`}
        >{link.label}</a
      >
    {/each}
  </div>

  <img src="/logo.png" class="filter brightness-0 invert w-40 h-40 mx-auto" />

  <div
    class={`pt-5 text-xs ${isNonLatin(translations[$language]?.footer?.copyright) ? 'font-serif' : ''}`}
  >
    {translations[$language]?.footer?.copyright ||
      '© 2025 Grantha Katha. All rights reserved.'}
  </div>
</footer>
