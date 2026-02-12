"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional horizontal line underneath. Pass lineClassName/lineStyle to customize. */
  lineClassName?: string;
  lineStyle?: React.CSSProperties;
  /** Gap between text and line (e.g. 4, "0.25rem") — tweak until you lock in */
  lineGap?: number | string;
  /** "shooting-star" = animated line + character wave */
  lineAnimation?: "static" | "shooting-star";
  /** Duration of shooting-star animation in seconds */
  lineAnimationDuration?: number;
  children: React.ReactNode;
}

export function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = "X",
  className = "",
  style = {},
  lineClassName,
  lineStyle,
  lineGap = 4,
  lineAnimation = "static",
  lineAnimationDuration = 5,
  children,
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const split = SplitText.create(rootRef.current.querySelector("p"), {
      type: "chars",
      charsClass: "inline-block will-change-transform",
    });

    split.chars.forEach((el) => {
      const c = el as HTMLElement;
      gsap.set(c, { attr: { "data-content": c.innerHTML } });
    });

    const lockCharWidths = () => {
      split.chars.forEach((el) => {
        const c = el as HTMLElement;
        const { width } = c.getBoundingClientRect();
        c.style.width = `${width}px`;
        c.style.minWidth = `${width}px`;
        c.style.maxWidth = `${width}px`;
        c.style.textAlign = "center";
        c.style.display = "inline-block";
        c.style.boxSizing = "border-box";
        c.style.overflow = "hidden";
        c.style.verticalAlign = "top";
      });
    };
    const runLock = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(lockCharWidths);
      });
    };
    runLock();
    document.fonts?.ready?.then(runLock);

    const handleMove = (e: PointerEvent) => {
      split.chars.forEach((el) => {
        const c = el as HTMLElement;
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(c, {
            overwrite: "auto",
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: c.dataset.content || "",
              chars: scrambleChars,
              speed,
            },
            ease: "none",
          });
        }
      });
    };

    const el = rootRef.current;
    el.addEventListener("pointermove", handleMove);

    // Shooting star line + character wave animation
    let animTimeline: gsap.core.Timeline | null = null;
    if (lineAnimation === "shooting-star" && lineRef.current) {
      const lineEl = lineRef.current;
      const lineTrail = lineEl.querySelector("[data-line-trail]") as HTMLElement;
      const containerWidth = (lineEl.parentElement as HTMLElement).offsetWidth;

      const tl = gsap.timeline({ repeat: -1 });
      animTimeline = tl;

      // Character wave: staggered up-down for travelling wave effect
      const waveLen = lineAnimationDuration * 0.36;
      const stagger = (lineAnimationDuration * 0.6) / Math.max(split.chars.length, 1);
      split.chars.forEach((charEl, i) => {
        const c = charEl as HTMLElement;
        gsap.set(c, { yPercent: 0 });
        const start = i * stagger;
        tl.to(
          c,
          { yPercent: 6, duration: waveLen / 2, ease: "sine.inOut" },
          start
        );
        tl.to(
          c,
          { yPercent: -6, duration: waveLen / 2, ease: "sine.inOut" },
          start + waveLen / 2
        );
        tl.to(
          c,
          { yPercent: 0, duration: waveLen / 2, ease: "sine.inOut" },
          start + waveLen
        );
      });

      // Line: left → right over 70% of duration, fade out in last 30%, then reset
      gsap.set(lineTrail, { left: 0, opacity: 1 });
      tl.to(
        lineTrail,
        {
          left: containerWidth - 40,
          duration: lineAnimationDuration * 0.7,
          ease: "power2.inOut",
        },
        0
      );
      tl.to(
        lineTrail,
        {
          opacity: 0,
          duration: lineAnimationDuration * 0.3,
          ease: "power2.in",
        },
        lineAnimationDuration * 0.7
      );
      tl.add(() => {
        gsap.set(lineTrail, { left: 0, opacity: 1 });
      }, lineAnimationDuration);
    }

    return () => {
      el.removeEventListener("pointermove", handleMove);
      animTimeline?.kill();
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars, lineAnimation, lineAnimationDuration]);

  const showLine = lineClassName != null || lineStyle != null;
  const isShootingStar = lineAnimation === "shooting-star";

  return (
    <div
      ref={rootRef}
      className={className}
      style={style}
    >
      <p>{children}</p>
      {showLine && isShootingStar && (
        <div
          ref={lineRef}
          role="presentation"
          aria-hidden
          className="relative w-full overflow-hidden"
          style={{
            marginTop: typeof lineGap === "number" ? `${lineGap}px` : lineGap,
            height: 2,
          }}
        >
          <div
            data-line-trail
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 60,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, transparent 33%, var(--color-colour3) 100%)",
              opacity: 0.6,
              ...lineStyle,
            }}
          />
        </div>
      )}
      {showLine && !isShootingStar && (
        <div
          role="presentation"
          aria-hidden
          className={lineClassName}
          style={{
            marginTop: typeof lineGap === "number" ? `${lineGap}px` : lineGap,
            ...lineStyle,
          }}
        />
      )}
    </div>
  );
}
