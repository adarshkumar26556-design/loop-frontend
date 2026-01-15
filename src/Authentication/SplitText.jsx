import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplitText({
  text,
  className = "",
  delay = 80,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  onLetterAnimationComplete,
}) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll("span");

    gsap.fromTo(
      chars,
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete: onLetterAnimationComplete,
      }
    );
  }, []);

  const splitText =
    splitType === "chars"
      ? text.split("").map((char, i) => (
          <span key={i} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))
      : text;

  return (
    <div ref={textRef} className={className}>
      {splitText}
    </div>
  );
}
