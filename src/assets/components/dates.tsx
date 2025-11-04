import "../../style.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DatesProps {
  minYear: number;
  maxYear: number;
  prevMinYear: number;
  prevMaxYear: number;
}

const Dates = ({ minYear, maxYear, prevMinYear, prevMaxYear }: DatesProps) => {
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);

  const animate = (el: HTMLDivElement, from: number, to: number, delay = 0) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { innerText: from },
      {
        innerText: to,
        duration: Math.min(Math.abs(to - from) * 0.2, 3),
        ease: "power2.out",
        delay,
        snap: { innerText: 1 },
        onUpdate() {
          el.innerText = Math.round(+this.targets()[0].innerText).toString();
        },
      }
    );
  };

  useEffect(() => {
    if (!minRef.current || !maxRef.current) return;
    if (prevMinYear !== minYear) animate(minRef.current, prevMinYear, minYear);
    if (prevMaxYear !== maxYear) animate(maxRef.current, prevMaxYear, maxYear, 0.3);
  }, [minYear, maxYear, prevMinYear, prevMaxYear]);

  return (
    <div className="dates__inner">
      <div className="date">
        <div ref={minRef} className="date__block">{minYear}</div>
        <div ref={maxRef} className="date__block">{maxYear}</div>
      </div>
    </div>
  );
};

export default Dates;
