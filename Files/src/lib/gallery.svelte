<!-- gallery -->
  <script lang="ts">
    import { onMount } from 'svelte';
    import PhotoModal from './photo-modal.svelte';

    const galleryImages = [
      36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
      18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    ].map((number) => ({
      // small webp for the grid, larger one for the modal (generated from the originals in static/)
      src: `/gallery/small/${number}.webp`,
      full: `/gallery/full/${number}.webp`,
      alt: 'My leadership and life'
    }));

    // fade each photo in once it has loaded; checks `complete` so photos cached before hydration still show
    function fadeOnLoad(img: HTMLImageElement) {
      const show = () => img.classList.add('is-loaded');
      if (img.complete && img.naturalWidth) show();
      else img.addEventListener('load', show, { once: true });
    }

    // masonry: cards cycle through these shapes so the columns stagger
    const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/3]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]'];

    // 2 columns on phones up to 6 on very wide screens, so cards stay a similar size as the gallery widens
    let innerWidth = 1024;
    $: columnCount = innerWidth < 640 ? 2 : innerWidth < 1024 ? 3 : innerWidth < 1280 ? 4 : innerWidth < 1536 ? 5 : 6;

    // deal photos out round-robin; each column is duplicated so its track can loop seamlessly at -50%.
    // neighbouring columns run in opposite directions at slightly different speeds
    $: columns = Array.from({ length: columnCount }, (_, c) => {
      const items = galleryImages
        .map((image, i) => ({ ...image, aspect: aspects[i % aspects.length] }))
        .filter((_, i) => i % columnCount === c);
      return { items: [...items, ...items], reverse: c % 2 === 1, duration: 70 + ((c * 13) % 30) };
    });

    let active: { full: string; alt: string } | null = null;

    function open(image: { full: string; alt: string }) {
      active = image;
    }

    function close() {
      active = null;
    }

    // each column's position is driven from JS (not a CSS animation) so auto-scroll, the mouse wheel,
    // and drag/swipe all move the same offset. offset wraps at half the track height, where the
    // duplicated photos line up, so the column loops seamlessly
    type ColumnState = {
      offset: number;
      velocity: number; // px/s left over from a flick, decays to 0
      hovered: boolean;
      pointerDown: boolean;
      dragging: boolean;
      startY: number;
      lastY: number;
      lastT: number;
      idleUntil: number; // auto-scroll waits until this time after manual input
      suppressClick: boolean; // the last press was a drag, or a tap to stop a flick, not a tap on a photo
    };

    let tracks: HTMLDivElement[] = [];
    let columnState: ColumnState[] = [];
    $: columnState = columns.map(() => ({
      offset: 0,
      velocity: 0,
      hovered: false,
      pointerDown: false,
      dragging: false,
      startY: 0,
      lastY: 0,
      lastT: 0,
      idleUntil: 0,
      suppressClick: false
    }));

    const RESUME_DELAY = 800;
    const DRAG_THRESHOLD = 5;

    function handleWheel(e: WheelEvent, c: number) {
      // sideways trackpad swipes aren't for the columns
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const s = columnState[c];
      const lines = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      s.offset += e.deltaY * lines;
      s.velocity = 0;
      s.idleUntil = performance.now() + RESUME_DELAY;
    }

    function handlePointerEnter(e: PointerEvent, c: number) {
      if (e.pointerType === 'mouse') columnState[c].hovered = true;
    }

    function handlePointerDown(e: PointerEvent, c: number) {
      const s = columnState[c];
      s.pointerDown = true;
      // touching a column that's still gliding from a flick just stops it
      s.suppressClick = Math.abs(s.velocity) > 50;
      s.startY = s.lastY = e.clientY;
      s.lastT = e.timeStamp;
      s.velocity = 0;
      s.idleUntil = Infinity;
    }

    // the pointer is only captured once it has moved a few px, so a plain click still reaches the photo;
    // after a real drag the release lands on the column instead, so it doesn't open one by accident
    function handlePointerMove(e: PointerEvent, c: number) {
      const s = columnState[c];
      if (!s.pointerDown) return;
      if (!s.dragging) {
        if (Math.abs(e.clientY - s.startY) < DRAG_THRESHOLD) return;
        s.dragging = true;
        s.suppressClick = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
      const step = e.clientY - s.lastY;
      const dt = e.timeStamp - s.lastT;
      s.offset -= step;
      if (dt > 0) s.velocity = Math.max(-4000, Math.min(4000, (-step / dt) * 1000));
      s.lastY = e.clientY;
      s.lastT = e.timeStamp;
    }

    function handlePointerUp(e: PointerEvent, c: number) {
      const s = columnState[c];
      if (!s.pointerDown) return;
      s.pointerDown = false;
      if (s.dragging) {
        s.dragging = false;
        // holding still before letting go means no flick
        if (e.timeStamp - s.lastT > 80) s.velocity = 0;
        s.idleUntil = performance.now() + RESUME_DELAY;
      } else {
        s.idleUntil = 0;
      }
    }

    // pointer capture alone isn't enough on touch screens: phones can still fire a click on the photo
    // where a swipe started, so a swipe or a flick-stopping tap is caught here before it reaches the photo.
    // keyboard clicks (detail 0) always go through
    function handleClick(e: MouseEvent, c: number) {
      const s = columnState[c];
      if (!s.suppressClick || e.detail === 0) return;
      s.suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }

    function handlePointerLeave(e: PointerEvent, c: number) {
      columnState[c].hovered = false;
      if (!columnState[c].dragging) handlePointerUp(e, c);
    }

    onMount(() => {
      // warm the cache with every thumbnail once the page has settled, so photos are ready before
      // the gallery scrolls into view instead of popping in one by one
      const warm = () => galleryImages.forEach(({ src }) => (new Image().src = src));
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
      if (document.readyState === 'complete') idle(warm);
      else window.addEventListener('load', () => idle(warm), { once: true });

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let last = performance.now();
      let frame: number;

      function tick(now: number) {
        // clamp so a backgrounded tab doesn't jump on return
        const dt = Math.min(now - last, 50) / 1000;
        last = now;

        columns.forEach((column, c) => {
          const el = tracks[c];
          const s = columnState[c];
          if (!el || !s) return;
          const half = el.scrollHeight / 2;
          if (!half) return;

          if (!s.dragging) {
            if (Math.abs(s.velocity) > 5) {
              // flick glide, losing ~95% of its speed per second
              s.offset += s.velocity * dt;
              s.velocity *= Math.pow(0.05, dt);
            } else {
              s.velocity = 0;
              if (!reduceMotion && !s.hovered && now > s.idleUntil) {
                s.offset += ((column.reverse ? -1 : 1) * half * dt) / column.duration;
              }
            }
          }

          s.offset = ((s.offset % half) + half) % half;
          el.style.transform = `translate3d(0, ${-s.offset}px, 0)`;
        });

        frame = requestAnimationFrame(tick);
      }

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    });
  </script>

  <svelte:window bind:innerWidth />

  <section id="gallery" class="relative z-20 w-full" style="background-color: #ffffff;">
    <!-- seam from the dark projects section above -->
    <svg class="-mb-px block h-[60px] w-full text-[#0b0b0d]" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 0 L1440 0 L1440 60 C1140 15 720 5 0 50 Z"></path>
    </svg>

    <div class="fade-in font-outfit mx-auto w-full max-w-2xl px-4 py-10 sm:space-y-3 lg:max-w-5xl lg:space-y-5">
      <span class="block text-center font-outfit text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#98aafa]">Gallery</span>
      <h4 class="mt-3 text-center font-fredoka text-3xl font-semibold text-[#16161a] sm:text-4xl md:text-5xl">
        Snapshots of my life
      </h4>

      <p class="py-2 text-center text-base text-[#16161a]/60 sm:text-lg lg:text-xl">
        A look into my leadership life + more!
      </p>
    </div>

    <div class="masonry-viewport fade-in mx-auto mt-4 h-[28rem] w-full max-w-[110rem] px-4 sm:h-[34rem] sm:px-6 lg:h-[38rem] lg:px-10">
      <div class="flex h-full gap-3 sm:gap-4">
        {#each columns as column, c (`${columnCount}-${c}`)}
          <div
            class="masonry-column min-w-0 flex-1"
            role="presentation"
            on:wheel|nonpassive={(e) => handleWheel(e, c)}
            on:pointerenter={(e) => handlePointerEnter(e, c)}
            on:pointerdown={(e) => handlePointerDown(e, c)}
            on:pointermove={(e) => handlePointerMove(e, c)}
            on:pointerup={(e) => handlePointerUp(e, c)}
            on:pointercancel={(e) => handlePointerUp(e, c)}
            on:pointerleave={(e) => handlePointerLeave(e, c)}
            on:click|capture={(e) => handleClick(e, c)}
          >
            <div class="masonry-track" bind:this={tracks[c]}>
              {#each column.items as image, i (i)}
                <button
                  type="button"
                  on:click={() => open(image)}
                  class="masonry-item relative mb-3 block w-full overflow-hidden rounded-2xl border border-black/10 bg-[#efeff2] sm:mb-4 {image.aspect}"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable="false"
                    use:fadeOnLoad
                    class="h-full w-full object-cover"
                  />
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- seam into the dark contact section below -->
    <svg class="-mb-px mt-10 block h-[60px] w-full text-[#0b0b0d]" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 60 L1440 60 L1440 0 C1140 45 720 55 0 10 Z"></path>
    </svg>
  </section>

  {#if active}
    <PhotoModal src={active.full} alt={active.alt} on:close={close} />
  {/if}
