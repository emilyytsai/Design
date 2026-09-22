<!-- gallery -->
  <script lang="ts">
    import PhotoModal from './photo-modal.svelte';

    const galleryImages = [
      35, 34, 33, 31, 30, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
      18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    ].map((number) => ({
      src: `/${number}.${[33, 26].includes(number) ? 'jpeg' : 'png'}`,
      alt: 'My leadership and life'
    }));

    // duplicated so the marquee track can loop seamlessly at -50%
    const marqueeImages = [...galleryImages, ...galleryImages];

    let active: { src: string; alt: string } | null = null;

    function open(image: { src: string; alt: string }) {
      active = image;
    }

    function close() {
      active = null;
    }

    // manual scrolling: pause the auto-scroll while the user touches/drags/scrolls,
    // then resume it after a short idle period
    let viewport: HTMLDivElement;
    let userInteracting = false;
    let resumeTimer: ReturnType<typeof setTimeout>;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    function pauseAuto() {
      userInteracting = true;
      clearTimeout(resumeTimer);
    }

    function scheduleResume() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        userInteracting = false;
      }, 300);
    }

    function handleScroll() {
      pauseAuto();
      scheduleResume();
    }

    function handleWheel(e: WheelEvent) {
      // let native horizontal trackpad gestures pass through untouched;
      // convert vertical mouse-wheel scrolling into horizontal movement
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
      pauseAuto();
      scheduleResume();
    }

    function handlePointerDown(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = viewport.scrollLeft;
      viewport.setPointerCapture(e.pointerId);
      pauseAuto();
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragging) return;
      viewport.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
    }

    function handlePointerUp() {
      dragging = false;
      scheduleResume();
    }
  </script>

  <section id="gallery" class="relative z-20 w-full" style="background-color: #ffffff;">
    <!-- seam from the dark projects section above -->
    <!-- mobile: one wave -->
    <svg class="-mb-px block h-[60px] w-full text-[#0b0b0d] sm:hidden" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 0 L1440 0 L1440 60 C1140 15 720 5 0 50 Z"></path>
    </svg>
    <!-- sm+: two waves -->
    <svg class="-mb-px hidden h-[60px] w-full text-[#0b0b0d] sm:block" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 35 C240 15, 480 55, 720 35 S1200 15, 1440 35 L1440 0 L0 0 Z"></path>
    </svg>

    <div class="fade-in font-outfit mx-auto w-full max-w-2xl px-4 py-10 sm:space-y-3 lg:max-w-5xl lg:space-y-5">
      <span class="name-gradient-static block text-center font-outfit text-xs font-bold uppercase tracking-[0.2em]">Gallery</span>
      <h4 class="mt-3 text-center font-fredoka text-3xl font-semibold text-[#16161a] sm:text-4xl md:text-5xl">
        Snapshots of my life
      </h4>

      <p class="py-2 text-center text-base text-[#16161a]/60 sm:text-lg lg:text-xl">
        A look into my leadership life + more!
      </p>
    </div>

    <div
      class="marquee-viewport fade-in mt-4 w-full"
      class:dragging
      bind:this={viewport}
      on:scroll={handleScroll}
      on:wheel={handleWheel}
      on:pointerdown={handlePointerDown}
      on:pointermove={handlePointerMove}
      on:pointerup={handlePointerUp}
      on:pointerleave={handlePointerUp}
      on:touchstart={pauseAuto}
      on:touchend={scheduleResume}
    >
      <div class="marquee-track" class:paused={userInteracting}>
        {#each marqueeImages as image, i (i)}
          <button
            type="button"
            on:click={() => open(image)}
            class="group relative aspect-[4/3] w-60 shrink-0 overflow-hidden rounded-2xl border border-black/20 transition-transform duration-300 ease-out hover:scale-[1.05] sm:w-72 lg:w-80"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={i < 8 ? 'eager' : 'lazy'}
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-115"
            />
          </button>
        {/each}
      </div>
    </div>

    <!-- seam into the dark contact section below -->
    <!-- mobile: one wave -->
    <svg class="-mb-px mt-10 block h-[60px] w-full text-[#0b0b0d] sm:hidden" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 60 L1440 60 L1440 0 C1140 45 720 55 0 10 Z"></path>
    </svg>
    <!-- sm+: two waves -->
    <svg class="-mb-px mt-10 hidden h-[60px] w-full text-[#0b0b0d] sm:block" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 25 C240 5, 480 45, 720 25 S1200 5, 1440 25 L1440 60 L0 60 Z"></path>
    </svg>
  </section>

  {#if active}
    <PhotoModal src={active.src} alt={active.alt} on:close={close} />
  {/if}
