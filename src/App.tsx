import "./style.scss";
import PageTitle from "./assets/components/pageTitle";
import Cube from "./assets/components/cube";
import Dates from "./assets/components/dates";
import Slider from "./assets/components/slider";
import { useState, useRef } from "react";

// Тип для диапазона лет
interface DatesRange {
  minYear: number;
  maxYear: number;
}

function App() {
  const [currentDates, setCurrentDates] = useState<DatesRange>({ 
    minYear: 1988, 
    maxYear: 2000 
  });
  
  const [activeCategory, setActiveCategory] = useState<number>(1); // 1 - музыка активна с начала
  const prevDatesRef = useRef<DatesRange>({ minYear: 1988, maxYear: 2000 });

  // Добавляем типы для параметров
  const handleDatesChange = (minYear: number, maxYear: number) => {
    prevDatesRef.current = { ...currentDates };
    setCurrentDates({ minYear, maxYear });
  };

  const handleCategoryChange = (categoryNumber: number) => {
    setActiveCategory(categoryNumber);
  };

  return (
    <div className="container">
      <div className="main__inner">
        <div className="background-container">
          <Cube 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>
        <PageTitle />
        <Dates 
          minYear={currentDates.minYear} 
          maxYear={currentDates.maxYear}
          prevMinYear={prevDatesRef.current.minYear}
          prevMaxYear={prevDatesRef.current.maxYear}
        />
        <Slider 
          onDatesChange={handleDatesChange} 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}

export default App;
