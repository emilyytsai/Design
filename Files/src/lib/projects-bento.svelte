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
</script>

<section id="projects" class="relative z-20 w-full pb-24 pt-4 sm:pb-32" style="background-color: #0b0b0d;">
  <div class="mx-auto w-full max-w-6xl px-4">

    <div class="fade-in mx-auto max-w-2xl text-center">
      <span class="font-outfit text-xs font-bold uppercase tracking-[0.2em] text-[#98aafa]">Projects</span>
      <h4 class="mt-3 font-fredoka text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
        Product design, end to end
      </h4>
      <p class="mt-3 font-outfit text-base text-white/60 sm:text-lg">
        A few case studies from problem to shipped product & the UI/UX work that supports them!
      </p>
    </div>

    <div class="fade-in mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-4">
      {#each caseStudies as cs (cs.id)}
        <button
          type="button"
          on:click={() => open(cs)}
          class="bento-card group aspect-[4/3] text-left sm:aspect-[16/10] lg:aspect-auto {cs.size === 'featured' ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : 'lg:col-span-2 lg:row-span-1'}"
          style={`--pq-accent: ${cs.accent}`}
        >
          <div class="relative h-full w-full">
            <img src={cs.image} alt={cs.title} class="bento-card-img absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div class="bento-card-scrim absolute inset-0"></div>

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
