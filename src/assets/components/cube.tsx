import "../../style.scss";
import { useEffect, useState } from "react";

interface CubeProps {
  activeCategory: number;
  onCategoryChange: (category: number) => void;
}

const categories = [
  { id: 1, title: "Музыка" },
  { id: 2, title: "Кино" },
  { id: 3, title: "Литература" },
  { id: 4, title: "Искусство" },
  { id: 5, title: "Спорт" },
  { id: 6, title: "Наука" },
];

const Cube = ({ activeCategory, onCategoryChange }: CubeProps) => {
  const [rotation, setRotation] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  const angle = 360 / categories.length;
  const offset = -60;

  useEffect(() => {
    setTextVisible(false);
    setRotation(-(activeCategory - 1) * angle + offset);
    const timer = setTimeout(() => setTextVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [activeCategory, angle, offset]);

  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`cube cube-${i}`} />
      ))}

      <div
        className="circle"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        {categories.map(({ id, title }, i) => {
          const active = id === activeCategory;
          return (
            <div
              key={id}
              className={`small-circle ${active ? "active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => onCategoryChange(id)}
            >
              <div
                className="small-circle-content"
                style={{ transform: `rotate(${-rotation}deg)` }}
              >
                <span>{id}</span>
                <span
                  className="small-circle-title"
                  style={{
                    opacity: active && textVisible ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                >
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cube;
