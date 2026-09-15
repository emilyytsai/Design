<!-- case study modal -->
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import type { CaseStudy } from './case-studies';

  export let cs: CaseStudy;

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

  const sections = (c: CaseStudy) => [
    { label: '01 · Problem Statement', body: c.problem, list: null },
    { label: '02 · User Research & Pain Points', body: null, list: c.research },
    { label: '03 · Iteration & Prototyping', body: null, list: c.iteration },
    { label: '04 · Final Solution & Impact', body: c.solution, list: c.impact }
  ];
</script>

<div
  class="case-modal-backdrop flex items-center justify-center p-3 sm:p-6"
  on:click={close}
  on:keydown={onKeydown}
  role="presentation"
  transition:fade={{ duration: 150 }}
>
  <div
    class="case-modal relative max-h-[88vh] w-full max-w-3xl overflow-y-auto"
    style={`--cs-accent: ${cs.accent}`}
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="dialog"
    aria-modal="true"
    aria-label={cs.title}
    tabindex="-1"
    transition:scale={{ duration: 180, start: 0.96 }}
  >
    <!-- header image -->
    <div class="relative aspect-[16/8] w-full overflow-hidden sm:aspect-[16/6]">
      <img src={cs.image} alt={cs.title} class="h-full w-full object-cover" />
      <div class="absolute inset-0" style="background: linear-gradient(to top, #131316 0%, rgba(19,19,22,0.25) 55%, rgba(19,19,22,0.05) 100%);"></div>

      <button
        type="button"
        on:click={close}
        aria-label="Close case study"
        class="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:border-white/60"
      >
        &times;
      </button>

      <div class="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <p class="font-fredoka text-2xl font-bold text-white sm:text-4xl">{cs.title}</p>
        <p class="mt-1 font-outfit text-sm text-white/75 sm:text-base">{cs.tagline}</p>
      </div>
    </div>

    <div class="space-y-8 p-5 sm:p-8">
      {#each cs.tags as tag}
        <span class="tech-tag mr-1.5">{tag}</span>
      {/each}

      {#each sections(cs) as section}
        <div class="flex gap-4">
          <div class="case-step-dot mt-1">{section.label.slice(0, 2)}</div>
          <div class="flex-1 space-y-2">
            <p class="case-section-label">{section.label.slice(5)}</p>
            {#if section.body}
              <p class="font-outfit text-sm leading-relaxed text-white/80 sm:text-base">{section.body}</p>
            {/if}
            {#if section.list}
              <ul class="space-y-1.5">
                {#each section.list as item}
                  <li class="flex gap-2 font-outfit text-sm leading-relaxed text-white/80 sm:text-base">
                    <span class="mt-2 h-1 w-1 shrink-0 rounded-full" style="background: var(--cs-accent);"></span>
                    {item}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/each}

      <div class="btn-row !justify-start pt-2">
        {#each cs.links as link}
          <a href={link.href} target="_blank" rel="noopener noreferrer" class="pill-btn" style="color: {cs.accent}; border-color: {cs.accent}66;">
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>
