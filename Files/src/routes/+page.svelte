<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { fade } from 'svelte/transition';
  import Hero from '$lib/hero.svelte';
  import ProjectsBento from '$lib/projects-bento.svelte';
  import Contact from '$lib/contact.svelte';
  import Gallery from '$lib/gallery.svelte';
  import DotGrid from '$lib/dotgridbg.svelte';

  let showIntro = true;
  let mobileMenuOpen = false;

  setTimeout(() => {
    showIntro = false;
  }, 2000);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  onMount(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.03, rootMargin: '0px 0px -15px 0px' }
  );

  //separate observer for tall sections like gallery so that it fires before entering viewport
  const earlyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0, rootMargin: '300px 0px 0px 0px' }
  );

  document.querySelectorAll('.fade-in, .fade-in-x').forEach((el) => observer.observe(el));
  document.querySelectorAll('.fade-in2').forEach((el) => earlyObserver.observe(el));

  return () => {
    observer.disconnect();
    earlyObserver.disconnect();
  };
});
</script>

<svelte:head>
  <title>Emily Tsai · Portfolio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Fredoka:wght@500;600;700&family=Playfair+Display:ital,wght@1,600;1,700&display=swap" rel="stylesheet"/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet"/>
  
</svelte:head>

<!-- intro screen-->
{#if showIntro}
  <section
    class="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50 overflow-hidden"
    out:fade={{ duration: 500 }}
  >

  <!-- animate.css -->
    <h1 class="font-outfit text-6xl font-medium text-white relative z-20 animate__animated animate__flash">
      (˶ᵔ ᵕ ᵔ˶)
    </h1>

    <div class="fixed inset-0 z-0 pointer-events-none"></div>
  </section>
{/if}

<!-- portfolio -->
<main
  class="relative min-h-screen text-white flex flex-col items-center"
  class:invisible={showIntro}
>

<!-- dot grid bg -->
<!-- <div class="dot-grid-bg fixed inset-0 z-0 pointer-events-none"></div> -->
<DotGrid />

<!-- navbar (desktop) -->
<nav class="fixed top-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-5xl">
  <div class="flex items-center justify-between px-6 py-3 rounded-full
              bg-zinc-900/85 border border-black/15 backdrop-blur-md shadow-2xl">

    <!-- name -->
    <a href="#home" class="flex items-center shrink-0">
      <div class="underline-center hover:text-[#98aafa] font-outfit text-3xl font-semibold whitespace-nowrap" data-text="Emily Tsai">Emily Tsai</div>
    </a>

    <!-- links -->
    <ul class="hidden md:flex items-center gap-8 text-[1.25rem] font-outfit text-white">
      <li><a href="#home" class="nav-link">Home</a></li>
      <li><a href="#projects" class="nav-link">Projects</a></li>
      <li><a href="#gallery" class="nav-link">Gallery</a></li>
      <li><a href="#contact" class="nav-link">Contact</a></li>
    </ul>

    <!-- smile pill -->
    <div class="group hidden md:grid place-items-center shrink-0 px-5 py-2 rounded-3xl
                bg-black/55 border border-black/10 font-outfit text-base text-white select-none
                cursor-default transition-colors hover:bg-zinc-950/90">
      <span class="col-start-1 row-start-1 transition-opacity duration-200 group-hover:opacity-0">(˶˃ ᵕ ˂˶)</span>
      <span class="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">Hii !</span>
    </div>

    <!-- side menu button (mobile) -->
    <button
      class="md:hidden relative w-7 h-7 shrink-0"
      on:click={toggleMenu}
      aria-label="Toggle menu"
    >
      <span class={`absolute left-0 w-7 h-0.5 bg-white transition-all duration-300
        ${mobileMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>

      <span class={`absolute left-0 w-7 h-0.5 bg-white transition-all duration-300
        ${mobileMenuOpen ? 'opacity-0 top-3' : 'top-3'}`}></span>

      <span class={`absolute left-0 w-7 h-0.5 bg-white transition-all duration-300
        ${mobileMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
    </button>
  </div>
</nav>

<!-- mobile dropdown -->
{#if mobileMenuOpen}
  <div class="md:hidden fixed top-[80px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-40 overflow-hidden">
    <div
      class="bg-zinc-950/40 backdrop-blur-md flex flex-col items-center
             py-8 space-y-6 text-xl font-outfit rounded-2xl border border-black/50 shadow-2xl"
      in:slide={{ duration: 200 }}
      out:slide={{ duration: 200 }}
    >
      <a href="#home" on:click={toggleMenu} class="hover:text-[#98aafa] transition">Home</a>
      <a href="#projects" on:click={toggleMenu} class="hover:text-[#98aafa] transition">Projects</a>
      <a href="#gallery" on:click={toggleMenu} class="hover:text-[#98aafa] transition">Gallery</a>
      <a href="#contact" on:click={toggleMenu} class="hover:text-[#98aafa] transition">Contact</a>
    </div>
  </div>
{/if}

<!-- hero -->
<Hero />

<!-- projects (bento grid) -->
<ProjectsBento />

<!-- gallery (light surface, matches the hero) -->
<Gallery />

<!-- contact + footer live on the dark surface -->
<div class="w-full" style="background-color: #0b0b0d;">
<!-- contact -->
    <Contact />

<!-- footer -->
  <!-- signature -->
  <div class="relative z-20 mt-8 flex justify-center">
    <img 
      src="/signature.png" 
      alt="Emily Tsai signature" 
      class="w-24 sm:w-30 md:w-36 mix-blend-screen"
      style="opacity: 0.85;"
    />
  </div>
    <footer class="font-outfit relative z-20 text-center text-white/50 text-sm py-6">
      <p>© 2026 Emily Tsai</p>
    </footer>
  </div>

  </main>