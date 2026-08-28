<script>
  const links = [
    { href: 'mailto:emilymaytsai@gmail.com', src: '/email.png', alt: 'email', target: null },
    { href: 'https://www.linkedin.com/in/emi-tsai/', src: '/linkedin.png', alt: 'linkedin', target: '_blank' },
    { href: 'https://www.instagram.com/emilyytsai/', src: '/instagram.png', alt: 'instagram', target: '_blank' },
    { href: 'https://discord.com/users/beeemi', src: '/discord.png', alt: 'discord', target: '_blank' },
    { href: 'https://www.github.com/emilyytsai', src: '/github.png', alt: 'github', target: '_blank' },
    { href: 'https://open.spotify.com/user/emilyishkewl?si=9ac8e340b3d04ba2', src: '/spotify.png', alt: 'spotify', target: '_blank' }
  ];
</script>

<!-- contact -->
<section id="contact" class="fade-in font-outfit relative z-20 w-full max-w-2xl lg:max-w-5xl mx-auto px-4 py-6 space-y-1 sm:space-y-3 lg:space-y-5 sm:mt-2">
  <h4 class="fade-in text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">Contact</h4>

  <p class="text-base sm:text-lg lg:text-xl text-white text-center py-2">
    Feel free to reach out I would love to connect!
  </p>

  <div class="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 z-20">
    {#each links as link}
      <a href={link.href} target={link.target} rel="noopener noreferrer" class="icon-tile aspect-square h-[75px] sm:h-[80px] lg:h-[90px] w-auto shadow-2xl">
        <img src={link.src} alt={link.alt} class="w-full h-full object-contain" />
      </a>
    {/each}
  </div>
</section>