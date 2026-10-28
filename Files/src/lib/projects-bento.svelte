<!-- projects (bento grid) -->
<script lang="ts">
  import { caseStudies, type CaseStudy } from './case-studies';
  import CaseStudyModal from './case-study-modal.svelte';

  let active: CaseStudy | null = null;

  function open(cs: CaseStudy) {
    active = cs;
  }

  function close() {
    active = null;
  }

  // an odd number of standard cards leaves the last one alone in its row; stretch it to fill
  const standardCount = caseStudies.filter((cs) => cs.size === 'standard').length;
  const lastId = caseStudies[caseStudies.length - 1].id;
  const isOrphan = (cs: CaseStudy) => standardCount % 2 === 1 && cs.id === lastId && cs.size === 'standard';

  // phone carousel in a narrow desktop window: a mouse can't swipe, so click-and-drag scrolls it instead.
  // snapping is off mid-drag so it doesn't fight the pointer, and a real drag swallows the click so it
  // doesn't open a case study by accident. touch keeps the browser's native swipe
  function dragScroll(node: HTMLElement) {
    let startX = 0;
    let startScroll = 0;
    let down = false;
    let dragged = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || node.scrollWidth <= node.clientWidth) return;
      down = true;
      dragged = false;
      startX = e.clientX;
      startScroll = node.scrollLeft;
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged) {
        if (Math.abs(dx) < 5) return;
        dragged = true;
        node.classList.add('is-dragging');
        node.setPointerCapture(e.pointerId);
      }
      node.scrollLeft = startScroll - dx;
    };

    const onUp = () => {
      if (!down) return;
      down = false;
      node.classList.remove('is-dragging');
    };

    const onClick = (e: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      e.preventDefault();
      e.stopPropagation();
    };

    node.addEventListener('pointerdown', onDown);
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerup', onUp);
    node.addEventListener('pointercancel', onUp);
    node.addEventListener('click', onClick, true);
    return {
      destroy() {
        node.removeEventListener('pointerdown', onDown);
        node.removeEventListener('pointermove', onMove);
        node.removeEventListener('pointerup', onUp);
        node.removeEventListener('pointercancel', onUp);
        node.removeEventListener('click', onClick, true);
      }
    };
  }
</script>

<section id="projects" class="relative z-20 w-full pb-24 pt-4 sm:pb-32" style="background-color: #0b0b0d;">
  <div class="mx-auto w-full max-w-6xl px-4">

    <div class="fade-in mx-auto max-w-2xl text-center">
      <span class="name-gradient-static font-outfit text-sm sm:text-base font-bold uppercase tracking-[0.2em]">Projects</span>
      <h4 class="mt-3 font-fredoka text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
        Product design, end to end
      </h4>
      <p class="mt-3 font-outfit text-base text-white/60 sm:text-lg">
        A few case studies from problem to shipped product & the UI/UX work that supports them!
      </p>
    </div>

    <!-- phones: two rows that swipe sideways instead of a long stack, columns sized so the next pair peeks in from the edge -->
    <div use:dragScroll class="bento-scroller fade-in mt-12 grid gap-5 max-sm:-mx-4 max-sm:auto-cols-[82%] max-sm:grid-flow-col max-sm:grid-rows-2 max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-4 max-sm:gap-3 max-sm:overflow-x-auto max-sm:px-4 sm:grid-flow-row-dense sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-4">
      {#each caseStudies as cs (cs.id)}
        <button
          type="button"
          on:click={() => open(cs)}
          class="bento-card group aspect-[4/3] text-left sm:aspect-[16/10] lg:aspect-auto max-sm:snap-start {cs.size === 'featured' ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : isOrphan(cs) ? 'sm:col-span-2 lg:col-span-4 lg:row-span-1' : 'lg:col-span-2 lg:row-span-1'}"
          style={`--pq-accent: ${cs.accent}`}
        >
          <div class="bento-card-clip relative h-full w-full">
            <img src={cs.image} alt={cs.title} class="bento-card-img absolute inset-0 h-full w-full object-cover" loading="lazy" draggable="false" />
            <div class="bento-card-scrim absolute"></div>

            <div class="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
              <div class="flex flex-wrap gap-1.5">
                {#each cs.tags.slice(0, cs.size === 'featured' ? 5 : 3) as tag}
                  <span class="tech-tag !text-[0.68rem]">{tag}</span>
                {/each}
              </div>

              <p class="font-fredoka text-xl font-bold text-white sm:text-2xl">{cs.title}</p>
              <p class="font-outfit text-sm text-white/70 sm:text-base">{cs.tagline}</p>

              <span class="mt-2 inline-flex w-fit items-center gap-1 font-outfit text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                View case study <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

{#if active}
  <CaseStudyModal cs={active} on:close={close} />
{/if}
