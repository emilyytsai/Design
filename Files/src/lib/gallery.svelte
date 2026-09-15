<!-- gallery -->
  <script lang="ts">
    const galleryImages = [
      35, 34, 33, 31, 30, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
      18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    ].map((number) => ({
      src: `/${number}.${[33, 26].includes(number) ? 'jpeg' : 'png'}`,
      alt: 'My leadership and life'
    }));
  </script>

  <section id="gallery" class="relative z-20 w-full" style="background-color: #fbf3e7;">
    <!-- seam from the dark projects section above -->
    <svg class="-mb-px block h-[60px] w-full text-[#0b0b0d]" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 0 L1440 0 L1440 60 C1140 15 720 5 0 50 Z"></path>
    </svg>

    <div class="fade-in font-outfit mx-auto w-full max-w-2xl px-4 py-10 sm:space-y-3 lg:max-w-5xl lg:space-y-5">
      <span class="block text-center font-outfit text-xs font-bold uppercase tracking-[0.2em] text-[#98aafa]">Gallery</span>
      <h4 class="mt-3 text-center font-fredoka text-3xl font-semibold text-[#16161a] sm:text-4xl md:text-5xl">
        Snapshots of my life
      </h4>

      <p class="py-2 text-center text-base text-[#16161a]/60 sm:text-lg lg:text-xl">
        A look into my leadership life + more!
      </p>

      <div class="mx-auto grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
        {#each galleryImages as image, i}
          <div
            class="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/20 shadow-xl transition-transform duration-300 ease-out hover:scale-[1.05]"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-115"
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- seam into the dark contact section below -->
    <svg class="-mb-px block h-[60px] w-full text-[#0b0b0d]" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 60 L1440 60 L1440 0 C1140 45 720 55 0 10 Z"></path>
    </svg>
  </section>

