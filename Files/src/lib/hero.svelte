<!-- hero -->
<section
  id="home"
  class="relative z-20 w-full"
  style="background-color: #ffffff;"
>
  <div class="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-4 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:flex-row lg:gap-16 lg:pt-44">

    <!-- copy -->
    <div class="flex w-full flex-col items-center gap-6 text-center lg:w-3/5 lg:items-start lg:text-left">

      <span class="inline-flex items-center gap-1.5 rounded-full border-2 border-[#16161a] bg-[#f8d9e7] px-5 py-2 font-outfit text-sm font-semibold tracking-wide text-[#16161a]">
        Product Designer & UI/UX Designer
      </span>

      <h1 class="font-fredoka text-4xl font-bold leading-[1.05] text-[#16161a] sm:text-5xl md:text-6xl">
        <span class="name-gradient font-playfair italic text-6xl sm:text-7xl md:text-8xl">
          Emily Tsai
        </span>
        <br />
        <span class="font-fredoka font-normal">
          Turning ideas into reality with
          <span class="relative inline-block whitespace-nowrap">
            design & code
            <svg
              class="absolute -bottom-1 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 7 C 50 2, 150 2, 198 7"
                stroke="#aebaff"
                stroke-width="6"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </span>
      </h1>

      <p class="max-w-xl px-2 py-4 font-outfit text-sm leading-relaxed text-[#16161a]/60 sm:text-base">
        Currently a <b class="text-[#16161a]">Computer Science</b> major with minors in
        <b class="text-[#16161a]">Data Science</b> and
        <b class="text-[#16161a]">Communication Studies</b>
        at CSU Fullerton, where I am President of VGDC, Co-Team Lead for ACM Node Buds, and an
        Officer for ACM Open Source. I am also an
        <b class="text-[#16161a]">Event Specialist Campus Launcher</b>
        at <b class="text-[#16161a]">DoorDash</b>! ♡
      </p>

      <div class="mt-2 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
        <a href="#projects" class="cta-sharp">
          View My Work
          <span aria-hidden="true">&rarr;</span>
        </a>

        <a
          href="/Emily_Tsai_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-sharp-outline"
        >
          Resume
        </a>
      </div>
    </div>

    <!-- portrait -->
    <div class="relative flex w-full shrink-0 items-center justify-center lg:w-2/5">
      <div class="relative aspect-square w-72 sm:w-96 md:w-[26rem]">

        <!-- SVG shape + image container -->
        <svg
          class="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] sm:-inset-10 sm:h-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] md:-inset-12 md:h-[calc(100%+6rem)] md:w-[calc(100%+6rem)]"
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <!-- lighter gradient -->
            <linearGradient
              id="portraitGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#b5c1ff" />
              <stop offset="48%" stop-color="#d3caf8" />
              <stop offset="100%" stop-color="#f9ddeb" />
            </linearGradient>

            <!-- exact same shape used to crop the photo -->
            <clipPath id="portraitClip">
              <path
                d="
                  M 250 20
                  C 330 5, 425 35, 466 105
                  C 505 172, 481 262, 462 326
                  C 440 399, 386 465, 308 478
                  C 224 492, 133 474, 76 419
                  C 20 365, 18 280, 34 207
                  C 50 135, 82 76, 151 44
                  C 182 29, 216 25, 250 20
                  Z
                "
              />
            </clipPath>
          </defs>

          <!-- light gradient background -->
          <path
            fill="url(#portraitGradient)"
            d="
              M 250 20
              C 330 5, 425 35, 466 105
              C 505 172, 481 262, 462 326
              C 440 399, 386 465, 308 478
              C 224 492, 133 474, 76 419
              C 20 365, 18 280, 34 207
              C 50 135, 82 76, 151 44
              C 182 29, 216 25, 250 20
              Z
            "
          />
        </svg>

        <!-- photo clipped to the exact same shape -->
        <svg
          class="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] sm:-inset-10 sm:h-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] md:-inset-12 md:h-[calc(100%+6rem)] md:w-[calc(100%+6rem)]"
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="photoClip">
              <path
                d="
                  M 250 20
                  C 330 5, 425 35, 466 105
                  C 505 172, 481 262, 462 326
                  C 440 399, 386 465, 308 478
                  C 224 492, 133 474, 76 419
                  C 20 365, 18 280, 34 207
                  C 50 135, 82 76, 151 44
                  C 182 29, 216 25, 250 20
                  Z
                "
              />
            </clipPath>
          </defs>

<image
  href="/emi-image6.png"
  x="65"
  y="28"
  width="375"
  height="500"
  preserveAspectRatio="xMidYMid slice"
  clip-path="url(#photoClip)"
/>
        </svg>

        <!-- subtle outline -->
        <svg
          class="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] sm:-inset-10 sm:h-[calc(100%+5rem)] sm:w-[calc(100%+5rem)] md:-inset-12 md:h-[calc(100%+6rem)] md:w-[calc(100%+6rem)]"
          viewBox="0 0 500 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="
              M 250 20
              C 330 5, 425 35, 466 105
              C 505 172, 481 262, 462 326
              C 440 399, 386 465, 308 478
              C 224 492, 133 474, 76 419
              C 20 365, 18 280, 34 207
              C 50 135, 82 76, 151 44
              C 182 29, 216 25, 250 20
              Z
            "
            fill="none"
            stroke="#16161a"
            stroke-width="3"
            opacity="0.9"
          />
        </svg>

      </div>
    </div>
  </div>

  <!-- soft seam into the dark section below -->
  <svg
    class="-mb-px block h-[60px] w-full text-[#0b0b0d]"
    viewBox="0 0 1440 60"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M0 60 L1440 60 L1440 0 C1140 45 720 55 0 10 Z"
    ></path>
  </svg>
</section>