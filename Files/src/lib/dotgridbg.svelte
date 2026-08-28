<script lang="ts">
  import { onMount } from 'svelte';

  export let spacing = 55;
  export let radius = 1.75;
  export let repelRadius = 250;
  export let strength = 50;
  export let color = 'rgba(255,255,255,0.22)';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    const mouse = { x: -9999, y: -9999 };
    let dots: { x: number; y: number; ox: number; oy: number }[] = [];
    let w = 0, h = 0;
    let frame: number;

    function build() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let x = spacing / 2; x < w; x += spacing)
        for (let y = spacing / 2; y < h; y += spacing)
          dots.push({ x, y, ox: 0, oy: 0 });
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;

      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        let tx = 0, ty = 0;
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) ** 2;
          tx = (dx / dist) * force * strength;
          ty = (dy / dist) * force * strength;
        }

        d.ox += (tx - d.ox) * 0.15;
        d.oy += (ty - d.oy) * 0.15;

        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    build();
    tick();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('resize', build);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', build);
    };
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0 z-0 pointer-events-none"></canvas>