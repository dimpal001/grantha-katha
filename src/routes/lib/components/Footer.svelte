<script>
  import Icon from '@iconify/svelte'

  const links = [
    { label: 'আমাৰ বিষয়ে', href: 'https://granthakatha.com/aboutus' },
    {
      label: 'নিয়ম আৰু চৰ্তাৱলী',
      href: 'https://granthakatha.com/termsandconditions',
    },
    { label: 'গোপনীয়তা নীতি', href: 'https://granthakatha.com/privacypolicy' },
    { label: 'যোগাযোগ', href: 'https://granthakatha.com/contacts' },
    {
      label: 'কেনেকৈ অর্ডাৰ কৰিব',
      href: 'https://granthakatha.com/howtoorder',
    },
    { label: 'আমাৰ সহকৰ্মীসকল', href: 'https://granthakatha.com/ourteam' },
    { label: 'যোগাযোগ', href: 'https://granthakatha.com/contacts' },
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
</script>

<footer class="bg-[#6257a5] text-white/80 py-10 px-6 text-center font-sans">
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

  <div class="grid grid-cols-1 gap-4 max-w-4xl mx-auto mb-8 text font-serif">
    {#each links as link}
      <a
        href={link.href}
        target="_blank"
        class="hover:text-orange-500 transition">{link.label}</a
      >
    {/each}
  </div>

  <img src="/logo.png" class="filter brightness-0 invert w-40 h-40 mx-auto" />

  <p class="mt-10 text-xs font-serif">
    কপিৰাইট © ২০২৫। সকলো অধিকাৰ সংৰক্ষিত। গ্ৰন্থকথা
  </p>
</footer>
