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
  children,
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

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
            overwrite: true,
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

    return () => {
      el.removeEventListener("pointermove", handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={style}
    >
      <p>{children}</p>
      {(lineClassName != null || lineStyle != null) && (
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
