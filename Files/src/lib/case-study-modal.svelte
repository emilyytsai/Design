<!-- case study: the clicked bento card grows from its spot in the grid into a full-screen page,
     then its image settles into a header while the write-up slides up underneath. closing runs it backwards -->
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
  import type { CaseStudy } from './case-studies';
  import { EASE_OUT, SPRING, POP, GLIDE, prefersReducedMotion, rectStyle, frame, viewportBox, stop, settle, squish } from './expand-motion';

  export let cs: CaseStudy;
  // the bento card this opened from: where the expansion starts and where closing lands
  export let sourceEl: HTMLElement;

  const dispatch = createEventDispatcher<{ closestart: void; closed: void }>();

  let shell: HTMLDivElement;
  let scroller: HTMLDivElement;
  let hero: HTMLDivElement;
  let closeBtn: HTMLButtonElement;

  let phase: 'expanding' | 'open' | 'closing' = 'expanding';
  let closing = false;
  let showClose = false;
  let backdropOn = true;

  const reduced = prefersReducedMotion();
  const ms = (n: number) => (reduced ? 0 : n);
  const RADIUS = '1.5rem';
  const PANEL_RADIUS = '2rem';
  const PANEL_MAX = 1080;

  const start = sourceEl.getBoundingClientRect();

  // the open panel: a big rounded card floating over the dimmed page, not edge to edge.
  // keep in sync with .cs-shell.is-docked in app.css, which takes over once it's open
  const panel = () => {
    const { vw, vh, margin: m } = viewportBox();
    const left = Math.max(m, (vw - PANEL_MAX) / 2);
    return { top: m, left, width: vw - left * 2, height: vh - m * 2 };
  };

  function fadeEls(selector: string, to: 0 | 1, duration: number, delay = 0, y = 0) {
    const els = Array.from(shell.querySelectorAll<HTMLElement>(selector));
    return Promise.all(
      els.map((el, i) => {
        if (to) {
          stop(el);
          el.style.transform = `translateY(${y}px)`;
        }
        return settle(el, { opacity: String(to), transform: `translateY(${to ? 0 : y}px)` }, {
          duration: ms(duration),
          delay: ms(delay + i * 40),
          easing: to ? POP : EASE_OUT
        });
      })
    );
  }

  // scroll the write-up back to the top over `duration`, easing out like GLIDE
  function scrollToTop(duration: number) {
    const from = scroller.scrollTop;
    if (!from) return;
    if (!duration) {
      scroller.scrollTop = 0;
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      scroller.scrollTop = from * Math.pow(1 - t, 4);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // one continuous motion: the card springs open into the panel while, at the same time, its image
  // eases to header height and the write-up fades up underneath into the space the panel opens up
  async function expand() {
    const DURATION = ms(640);

    // header: from the card's height straight to its settled height, on the same curve as the panel
    hero.classList.add('is-settled');
    const headerHeight = hero.offsetHeight;
    hero.style.height = `${start.height}px`;

    const grown = settle(shell, frame(panel(), PANEL_RADIUS), { duration: DURATION, easing: SPRING });
    settle(hero, { height: `${headerHeight}px` }, { duration: DURATION, easing: SPRING });
    // a little squish as it's pressed, then it springs open
    if (!reduced) squish(shell);

    fadeEls('[data-card-text]', 0, 140);
    fadeEls('[data-hero-text]', 1, 420, DURATION * 0.3, 18);
    fadeEls('[data-body]', 1, 480, DURATION * 0.4, 36);
    // the close button arrives as the panel lands
    setTimeout(() => !closing && (showClose = true), DURATION * 0.6);

    if (!(await grown) || closing) return;
    // hand sizes back to css so window resizes keep the panel and header in place
    Object.assign(shell.style, { top: '', left: '', width: '', height: '', borderRadius: '' });
    shell.classList.add('is-docked');
    stop(hero);
    hero.style.height = '';
    phase = 'open';
    closeBtn?.focus({ preventScroll: true });
  }

  async function close() {
    if (closing) return;
    closing = true;
    phase = 'closing';

    // one continuous motion: the panel glides back into its card while, at the same time, the
    // write-up fades, the header grows back to fill the card, and the page scrolls back to the top
    const DURATION = ms(620);
    const end = sourceEl.getBoundingClientRect(); // measured now, in case the page moved

    // switch the panel from css placement back to pixels so it can animate from where it is
    if (shell.classList.contains('is-docked')) {
      const r = shell.getBoundingClientRect();
      shell.classList.remove('is-docked');
      Object.assign(shell.style, frame(r, PANEL_RADIUS));
    }

    dispatch('closestart'); // the rest of the grid bounces back in alongside
    backdropOn = false;
    fadeEls('[data-body]', 0, 180);
    fadeEls('[data-hero-text]', 0, 180);
    fadeEls('[data-card-text]', 1, 260, DURATION * 0.5);

    // header: from its current height to the card's height, on the same curve as the panel
    stop(hero);
    hero.style.height = `${hero.offsetHeight}px`;
    hero.classList.remove('is-settled');
    settle(hero, { height: `${end.height}px` }, { duration: DURATION, easing: GLIDE });
    scrollToTop(DURATION);

    await settle(shell, frame(end, RADIUS), { duration: DURATION, easing: GLIDE });
    dispatch('closed');
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  let prevOverflow = '';
  onMount(() => {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);
    tick().then(expand);
  });

  onDestroy(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = prevOverflow;
    window.removeEventListener('keydown', onKeydown);
  });

  const sections = (c: CaseStudy) => [
    { label: '01 · Problem Statement', body: c.problem, list: null },
    { label: '02 · User Research & Pain Points', body: null, list: c.research },
    { label: '03 · Iteration & Prototyping', body: null, list: c.iteration },
    { label: '04 · Final Solution & Impact', body: c.solution, list: c.impact }
  ];
</script>

<div class="cs-backdrop" class:is-visible={backdropOn} aria-hidden="true"></div>

<div
  bind:this={shell}
  class="cs-shell"
  style={rectStyle(start) + `border-radius:${RADIUS};--cs-accent:${cs.accent};--pq-accent:${cs.accent};--cs-ink:color-mix(in srgb, ${cs.accent} 55%, #ffffff)`}
  role="dialog"
  aria-modal="true"
  aria-label={cs.title}
  tabindex="-1"
>
  <div bind:this={scroller} class="cs-scroll" class:is-locked={phase === 'expanding' || phase === 'closing'}>
    <!-- header: starts out as the card itself, then settles to a header -->
    <div bind:this={hero} class="cs-hero">
      <img src={cs.image} alt={cs.title} class="absolute inset-0 h-full w-full object-cover" draggable="false" />
      <div class="bento-card-scrim-light absolute"></div>

      <!-- the card's own label, so the first frames match the grid exactly -->
      <div data-card-text class="cs-card-text absolute bottom-0 left-0 flex flex-col gap-2 p-5 sm:p-6" style={`width:${start.width}px`}>
        <div class="flex flex-wrap gap-1.5">
          {#each cs.tags.slice(0, cs.size === 'featured' ? 5 : 3) as tag}
            <span class="tech-tag !text-[0.68rem]">{tag}</span>
          {/each}
        </div>
        <p class="font-fredoka text-xl font-bold text-[#f4ebf2] sm:text-2xl">{cs.title}</p>
        <p class="font-outfit text-sm text-[#f4ebf2]/75 sm:text-base">{cs.tagline}</p>
        <span class="mt-2 inline-flex w-fit items-center gap-1 font-outfit text-sm font-semibold text-[#f4ebf2]">
          View case study <span aria-hidden="true">&rarr;</span>
        </span>
      </div>

      <div class="absolute inset-x-0 bottom-0">
        <div class="mx-auto w-full max-w-3xl px-5 pb-8 sm:px-8 sm:pb-12">
          <p data-hero-text class="cs-reveal font-outfit text-xs font-bold uppercase tracking-[0.2em]" style="color: var(--cs-ink);">Case study</p>
          <p data-hero-text class="cs-reveal mt-2 font-fredoka text-3xl font-bold text-[#f4ebf2] sm:text-5xl">{cs.title}</p>
          <p data-hero-text class="cs-reveal mt-2 font-outfit text-base text-[#f4ebf2]/75 sm:text-lg">{cs.tagline}</p>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl space-y-8 px-5 py-8 sm:px-8 sm:py-12">
      <div data-body class="cs-reveal">
        {#each cs.tags as tag}
          <span class="tech-tag mb-1.5 mr-1.5 inline-block">{tag}</span>
        {/each}
      </div>

      {#each sections(cs) as section}
        <div data-body class="cs-reveal flex gap-4">
          <div class="case-step-dot mt-1">{section.label.slice(0, 2)}</div>
          <div class="flex-1 space-y-2">
            <p class="case-section-label">{section.label.slice(5)}</p>
            {#if section.body}
              <p class="font-outfit text-sm leading-relaxed text-[#f4ebf2]/80 sm:text-base">{section.body}</p>
            {/if}
            {#if section.list?.length}
              <ul class="space-y-1.5">
                {#each section.list as item}
                  <li class="flex gap-2 font-outfit text-sm leading-relaxed text-[#f4ebf2]/80 sm:text-base">
                    <span class="mt-2 h-1 w-1 shrink-0 rounded-full" style="background: var(--cs-accent);"></span>
                    {item}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/each}

      {#if cs.links.length}
        <div data-body class="cs-reveal btn-row !justify-start pt-2">
          {#each cs.links as link}
            <a href={link.href} target="_blank" rel="noopener noreferrer" class="pill-btn" style="color: var(--cs-ink); border-color: {cs.accent}99;">
              {link.label}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <button
    bind:this={closeBtn}
    type="button"
    on:click={close}
    aria-label="Close case study"
    class="cs-close absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[#f4ebf2]/20 bg-[#3e3140]/70 text-xl text-[#f4ebf2] backdrop-blur-md transition hover:border-[#f4ebf2]/50 sm:right-6 sm:top-6"
    class:is-visible={showClose && phase !== 'closing'}
  >
    <!-- drawn x instead of the &times; glyph, which sits low in the circle because of the font -->
    <svg viewBox="0 0 14 14" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" /></svg>
  </button>
</div>
