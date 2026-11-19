// shared motion for the "tile expands into a panel" modals (case-study-modal, photo-modal):
// easings, pixel boxes, and interruptible Web Animations helpers

export type Rect = { top: number; left: number; width: number; height: number };

export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
// springy: overshoots a little and settles back, for the playful bounce
export const SPRING = 'cubic-bezier(0.34, 1.4, 0.64, 1)';
export const POP = 'cubic-bezier(0.34, 1.7, 0.64, 1)';
// smooth glide with no overshoot, for closing in one continuous motion
export const GLIDE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const rectStyle = (r: Rect) => `top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;`;

export const frame = (r: Rect, radius: string) => ({
  top: `${r.top}px`,
  left: `${r.left}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
  borderRadius: radius
});

// the visible area without the page scrollbar, and the gap a floating panel keeps from its edges
export function viewportBox() {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  return { vw, vh, margin: vw < 640 ? 12 : 28 };
}

// freeze anything still animating on el where it is right now, so the next animation picks up
// from there (closing mid-open reverses smoothly instead of jumping)
// (reads the live computed values and writes them inline by hand instead of commitStyles(), which
// mobile Safari doesn't apply reliably: cancel() then dropped the element back to its css start state)
export function stop(el: HTMLElement) {
  const anims = el
    .getAnimations()
    .filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition));
  if (!anims.length) return;

  const props = new Set<string>();
  for (const a of anims) {
    const effect = a.effect as KeyframeEffect | null;
    // additive layers (squish) just drop away; freezing them would bake the squish in
    if (!effect || effect.composite !== 'replace') continue;
    for (const k of effect.getKeyframes()) {
      for (const p of Object.keys(k)) if (!META_KEYS.has(p)) props.add(p);
    }
  }
  const cs = getComputedStyle(el);
  const frozen: Record<string, string> = {};
  for (const p of props) frozen[p] = cs[p as keyof CSSStyleDeclaration] as string;

  for (const a of anims) a.cancel();
  Object.assign(el.style, frozen);
}

const META_KEYS = new Set(['offset', 'computedOffset', 'easing', 'composite']);

// animate el from wherever it is now to `to`, then leave it there as inline style.
// resolves false if a later animation took over the element first
export function settle(el: HTMLElement, to: Keyframe, options: KeyframeAnimationOptions): Promise<boolean> {
  stop(el);
  const a = el.animate([to], { fill: 'forwards', ...options });
  return a.finished.then(
    () => {
      // write the end state inline ourselves, then drop the animation
      for (const [p, v] of Object.entries(to)) {
        if (!META_KEYS.has(p) && v != null) (el.style as unknown as Record<string, string>)[p] = String(v);
      }
      a.cancel();
      return true;
    },
    () => false
  );
}

// a little squish as a tile is pressed, layered on top of whatever else it's doing
export function squish(el: HTMLElement) {
  el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(0.94)', offset: 0.18 }, { transform: 'scale(1)' }],
    { duration: 360, easing: 'ease-out', composite: 'add' }
  );
}
