<!-- photo modal: the clicked gallery tile springs out of the masonry into a floating panel sized to the
     photo, then glides back into its tile in one motion when closed. same motion as the case study modal -->
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
  import { SPRING, GLIDE, prefersReducedMotion, rectStyle, frame, viewportBox, stop, settle, squish } from './expand-motion';

  // full-size photo, plus the thumbnail already on screen so the first frames match the tile exactly
  export let src: string;
  export let thumb: string;
  export let alt: string;
  // the gallery tile this opened from: where the expansion starts and where closing lands
  export let sourceEl: HTMLElement;

  const dispatch = createEventDispatcher<{ closestart: void; closed: void }>();

  let shell: HTMLDivElement;
  let closeBtn: HTMLButtonElement;

  let phase: 'expanding' | 'open' | 'closing' = 'expanding';
  let backdropOn = true;
  let fullLoaded = false;

  const reduced = prefersReducedMotion();
  const ms = (n: number) => (reduced ? 0 : n);
  const TILE_RADIUS = '1rem';
  const PANEL_RADIUS = '1.5rem';
  const PANEL_MAX_W = 1200;

  const start = sourceEl.getBoundingClientRect();

  // the photo's real shape, from the thumbnail (same image, smaller) so the panel is sized right away
  const thumbImg = sourceEl.querySelector('img');
  const aspect = thumbImg?.naturalWidth && thumbImg.naturalHeight ? thumbImg.naturalWidth / thumbImg.naturalHeight : 4 / 3;

  // the open panel: the whole photo, as big as fits inside the window's margins, centered
  const panel = () => {
    const { vw, vh, margin: m } = viewportBox();
    let width = Math.min(vw - m * 2, PANEL_MAX_W);
    let height = width / aspect;
    if (height > vh - m * 2) {
      height = vh - m * 2;
      width = height * aspect;
    }
    return { top: (vh - height) / 2, left: (vw - width) / 2, width, height };
  };

  async function expand() {
    const grown = settle(shell, frame(panel(), PANEL_RADIUS), { duration: ms(520), easing: SPRING });
    if (!reduced) squish(shell);
    if (!(await grown) || phase === 'closing') return;
    phase = 'open';
    closeBtn?.focus({ preventScroll: true });
  }

  // one continuous glide back into the tile (measured now, in case the page moved)
  async function close() {
    if (phase === 'closing') return;
    phase = 'closing';
    dispatch('closestart');
    backdropOn = false;
    await settle(shell, frame(sourceEl.getBoundingClientRect(), TILE_RADIUS), { duration: ms(620), easing: GLIDE });
    dispatch('closed');
  }

  // also catches a photo that was already cached and loaded before the listener was attached
  function whenLoaded(img: HTMLImageElement) {
    const show = () => (fullLoaded = true);
    if (img.complete && img.naturalWidth) show();
    else img.addEventListener('load', show, { once: true });
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  // keep the open panel fitted to the window
  function onResize() {
    if (phase !== 'open') return;
    stop(shell);
    Object.assign(shell.style, frame(panel(), PANEL_RADIUS));
  }

  let prevOverflow = '';
  onMount(() => {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);
    tick().then(expand);
  });

  onDestroy(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = prevOverflow;
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
  });
</script>

<div class="ph-backdrop" class:is-visible={backdropOn} on:click={close} role="presentation"></div>

<div
  bind:this={shell}
  class="ph-shell"
  style={rectStyle(start) + `border-radius:${TILE_RADIUS}`}
  role="dialog"
  aria-modal="true"
  aria-label={alt}
  tabindex="-1"
>
  <img src={thumb} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" draggable="false" />
  <!-- sharper full-size photo fades in over the thumbnail once it arrives -->
  <img
    {src}
    {alt}
    class="ph-full absolute inset-0 h-full w-full object-cover"
    class:is-loaded={fullLoaded}
    use:whenLoaded
    draggable="false"
  />

  <button
    bind:this={closeBtn}
    type="button"
    on:click={close}
    aria-label="Close photo"
    class="cs-close absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/50 text-lg text-white backdrop-blur-md transition hover:border-white/60 sm:right-4 sm:top-4"
    class:is-visible={phase === 'open'}
  >
    <!-- drawn x instead of the &times; glyph, which sits low in the circle because of the font -->
    <svg viewBox="0 0 14 14" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" /></svg>
  </button>
</div>
