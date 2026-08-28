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

  <section
    id="gallery"
    class="fade-in font-outfit relative z-20 mx-auto w-full max-w-2xl px-4 py-6 sm:mt-6 sm:space-y-3 lg:max-w-5xl lg:space-y-5"
  >
    <h4 class="text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl">
      Gallery
    </h4>

    <p class="py-2 text-center text-base text-white sm:text-lg lg:text-xl">
      A look into my leadership life + more!
    </p>

    <div class="mx-auto grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
      {#each galleryImages as image, i}
        <div
          class="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl transition-transform duration-300 ease-out hover:scale-[1.05]"
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
  </section>

