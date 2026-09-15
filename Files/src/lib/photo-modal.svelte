<!-- photo modal: enlarges a gallery image, same pattern as the case study modal -->
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let src: string;
  export let alt: string;

  const dispatch = createEventDispatcher<{ close: void }>();

  function close() {
    dispatch('close');
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  onMount(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  });

  onDestroy(() => {
    window.removeEventListener('keydown', onKeydown);
  });
</script>

<div
  class="case-modal-backdrop flex items-center justify-center p-3 sm:p-6"
  on:click={close}
  on:keydown={onKeydown}
  role="presentation"
  transition:fade={{ duration: 150 }}
>
  <div
    class="case-modal relative max-h-[88vh] w-full max-w-3xl overflow-hidden"
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="dialog"
    aria-modal="true"
    aria-label={alt}
    tabindex="-1"
    transition:scale={{ duration: 180, start: 0.96 }}
  >
    <img src={src} alt={alt} class="max-h-[88vh] w-full object-contain" />

    <button
      type="button"
      on:click={close}
      aria-label="Close photo"
      class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:border-white/60"
    >
      &times;
    </button>
  </div>
</div>
