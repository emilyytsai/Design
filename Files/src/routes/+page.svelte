<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { fade } from 'svelte/transition';
  import { backOut, cubicIn } from 'svelte/easing';
  import Hero from '$lib/hero.svelte';
  import ProjectsBento from '$lib/projects-bento.svelte';
  import Contact from '$lib/contact.svelte';
  import Gallery from '$lib/gallery.svelte';

  let showIntro = true;
  let mobileMenuOpen = false;

  setTimeout(() => {
    showIntro = false;
  }, 2000);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  // peeking cat: stays up for 10s (or until hovered), then returns 10s after it leaves
  type CatSide = 'bottom' | 'left' | 'right';
  let catUp = false;
  let catSide: CatSide = 'bottom';
  let catOffset = 80;
  let catTimer: ReturnType<typeof setTimeout>;

  // never the same side twice in a row, and a random spot along that edge
  function pickCatSpot() {
    const sides = (['bottom', 'left', 'right'] as CatSide[]).filter((s) => s !== catSide);
    catSide = sides[Math.floor(Math.random() * sides.length)];
    catOffset = catSide === 'bottom' ? 10 + Math.random() * 70 : 20 + Math.random() * 50;
  }

  // slides the cat in/out from its edge by its own size, so it starts fully off screen
  function peek(_node: Element, { side, duration, easing }: { side: CatSide; duration: number; easing: (t: number) => number }) {
    const axis = side === 'bottom' ? 'Y' : 'X';
    const sign = side === 'left' ? -1 : 1;
    return { duration, easing, css: (t: number) => `transform: translate${axis}(${(1 - t) * 110 * sign}%)` };
  }

  function showCat() {
    pickCatSpot();
    catUp = true;
    catTimer = setTimeout(hideCat, 10000);
  }

  function hideCat() {
    if (!catUp) return;
    catUp = false;
    clearTimeout(catTimer);
    catTimer = setTimeout(showCat, 10000);
  }

  onMount(() => {
    // wait for the intro screen to finish
    catTimer = setTimeout(showCat, 3000);
    return () => clearTimeout(catTimer);
  });

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
    <div class="smile-pill hidden md:grid place-items-center shrink-0 font-outfit text-base text-white">
      <span class="smile-pill-face">(˶˃ ᵕ ˂˶)</span>
      <span class="smile-pill-hi">Hii !</span>
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

<!-- peeking cat, pops out from the bottom, left, or right and ducks back on hover (or tap on touch screens) -->
{#if catUp}
  <div
    class="peek-cat from-{catSide} font-outfit text-2xl text-white"
    style={catSide === 'bottom' ? `left: clamp(1rem, ${catOffset}%, calc(100% - 10rem))` : `top: clamp(5rem, ${catOffset}%, calc(100% - 12rem))`}
    aria-hidden="true"
    on:pointerenter={hideCat}
    in:peek={{ side: catSide, duration: 600, easing: backOut }}
    out:peek={{ side: catSide, duration: 450, easing: cubicIn }}
  ><span class="peek-cat-face">ฅ₍^. .^₎ฅ</span></div>
{/if}