import "../../style.scss";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// Тип для слайда
interface Slide {
  year: string;
  name: string;
  category: string;
}

const slides: Slide[] = [
  // 🎵 Музыка
  { year: "1988", name: "Релиз альбома Майкла Джексона «Bad», ставшего символом поп-культуры конца XX века.", category: "music" },
  { year: "1988", name: "Релиз альбома Майкла Джексона «Bad», ставшего символом поп-культуры конца XX века.", category: "music" },
  { year: "1994", name: "Выход альбома группы Nirvana «Nevermind», изменившего музыкальную сцену и стиль рока.", category: "music" },
  { year: "2000", name: "Концерт в честь нового тысячелетия, собравший миллионы слушателей по всему миру.", category: "music" },
  // 🎬 Кино
  { year: "1989", name: "Премьера фильма «Бэтмен» с Майклом Китоном, начавшая новую эпоху супергеройского кино.", category: "cinema" },
  { year: "1995", name: "Выход фильма «Титаник» Джеймса Кэмерона, ставшего самым кассовым фильмом своего времени.", category: "cinema" },
  { year: "2001", name: "Премьера «Властелина колец: Братство кольца», положившая начало легендарной кинотрилогии.", category: "cinema" },
  { year: "2001", name: "Премьера «Властелина колец: Братство кольца», положившая начало легендарной кинотрилогии.", category: "cinema" },
  // 📚 Литература
  { year: "1990", name: "Выход первой книги о Гарри Поттере, изменившей детскую литературу и культуру чтения.", category: "literature" },
  { year: "1996", name: "Публикация фантастического романа, объединившего научные идеи и философские размышления о будущем.", category: "literature" },
  { year: "2012", name: "Появление романа «Пятьдесят оттенков серого», вызвавшего огромный резонанс.", category: "literature" },
  { year: "2012", name: "Появление романа «Пятьдесят оттенков серого», вызвавшего огромный резонанс.", category: "literature" },
  // 🎨 Искусство
  { year: "1991", name: "Открытие галереи Tate Modern в Лондоне, ставшей центром современного мирового искусства.", category: "art" },
  { year: "2007", name: "Выставка Дэмьена Херста с платиновым черепом вызвала бурные споры о ценности искусства.", category: "art" },
  { year: "2019", name: "Картина Бэнкси самоуничтожилась после продажи на аукционе, вызвав сенсацию в арт-мире.", category: "art" },
  { year: "2019", name: "Картина Бэнкси самоуничтожилась после продажи на аукционе, вызвав сенсацию в арт-мире.", category: "art" },
  // ⚽ Спорт
  { year: "1998", name: "Франция впервые выиграла чемпионат мира по футболу, обыграв Бразилию со счётом 3/0", category: "sport" },
  { year: "2008", name: "Майкл Фелпс завоевал восемь золотых медалей на Олимпийских играх, установив мировой рекорд.", category: "sport" },
  { year: "2016", name: "Сборная Португалии выиграла чемпионат, впервые в истории став чемпионом континента.", category: "sport" },
  { year: "2016", name: "Сборная Португалии выиграла чемпионат, впервые в истории став чемпионом континента.", category: "sport" },
  // 🔬 Наука
  { year: "2015", name: "13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды.", category: "science" },
  { year: "2016", name: "Телескоп «Хаббл» открыл далёкую галактику GN-z11, расширив границы видимой Вселенной.", category: "science" },
  { year: "2017", name: "Компания Tesla представила электрический грузовик, ознаменовавший новую эру.", category: "science" },
  { year: "2017", name: "Компания Tesla представила электрический грузовик, ознаменовавший новую эру.", category: "science" }
];

const categories = ["music", "cinema", "literature", "art", "sport", "science"];

const getCategoryByNumber = (n: number) => categories[n - 1] || "music";
const getNumberByCategory = (cat: string) => categories.indexOf(cat) + 1;

const getCategoryMinMaxYears = (category: string) => {
  const years = slides.filter(s => s.category === category).map(s => parseInt(s.year));
  return { minYear: Math.min(...years), maxYear: Math.max(...years) };
};

// Типизированная функция groupByCategory
const groupByCategory = (arr: Slide[]): Record<string, Slide[]> => {
  const grouped: Record<string, Slide[]> = {};
  arr.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });
  return grouped;
};

interface SliderProps {
  onDatesChange: (minYear: number, maxYear: number) => void;
  activeCategory: number | null;
  onCategoryChange: (categoryNumber: number) => void;
}

const Slider = ({ onDatesChange, activeCategory, onCategoryChange }: SliderProps) => {
  const textSwiperRef = useRef<SwiperType | null>(null);
  const categoryPaginationRef = useRef<HTMLDivElement>(null);

  const groupedByCategory = useMemo(() => groupByCategory(slides), []);
  const categoriesList = useMemo(() => Object.keys(groupedByCategory), [groupedByCategory]);

  const [currentCategorySlide, setCurrentCategorySlide] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [currentCategory, setCurrentCategory] = useState<string>("music");
  const [textSwiperState, setTextSwiperState] = useState({ isBeginning: true, isEnd: false });

  const currentCategorySlides = groupedByCategory[currentCategory] || [];
  const totalCategorySlides = categoriesList.length;

  // 🔽 НОВОЕ: Проверка, находимся ли на последней категории
  const isLastCategory = currentCategorySlide === totalCategorySlides;

  const updatePaginationActiveDot = useCallback((activeIndex: number) => {
    if (categoryPaginationRef.current) {
      const dots = categoryPaginationRef.current.querySelectorAll('.category-pagination-dot');
      dots.forEach((dot, index) => {
        if (index === activeIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
  }, []);

  const handleCategoryChangeSmooth = useCallback((targetIndex: number) => {
    setContentOpacity(0);
    setTimeout(() => {
      const targetCategory = categoriesList[targetIndex];
      setCurrentCategory(targetCategory);
      setCurrentCategorySlide(targetIndex + 1);
      const { minYear, maxYear } = getCategoryMinMaxYears(targetCategory);
      onDatesChange(minYear, maxYear);
      onCategoryChange(getNumberByCategory(targetCategory));
      textSwiperRef.current?.slideTo(0);
      updatePaginationActiveDot(targetIndex);
      setTimeout(() => setContentOpacity(1), 1000);
    }, 100);
  }, [categoriesList, onDatesChange, onCategoryChange, updatePaginationActiveDot]);

  const handlePaginationClick = (index: number) => handleCategoryChangeSmooth(index);

  useEffect(() => {
    if (activeCategory === null) return;
    const targetCategory = getCategoryByNumber(activeCategory);
    const targetIndex = categoriesList.indexOf(targetCategory);
    if (targetIndex >= 0 && targetCategory !== currentCategory) {
      handleCategoryChangeSmooth(targetIndex);
    }
  }, [activeCategory, categoriesList, currentCategory, handleCategoryChangeSmooth]);

  useEffect(() => {
    updatePaginationActiveDot(currentCategorySlide - 1);
  }, [currentCategorySlide, updatePaginationActiveDot]);

  const handleCategoryPrev = () => {
    const newIndex = currentCategorySlide - 2;
    if (newIndex >= 0) {
      handleCategoryChangeSmooth(newIndex);
    }
  };

  const handleCategoryNext = () => {
    const newIndex = currentCategorySlide;
    // 🔽 ИЗМЕНЕНИЕ: Не позволяем перейти на первую категорию с последней
    if (newIndex < totalCategorySlides) {
      handleCategoryChangeSmooth(newIndex);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setTextSwiperState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
  };

  const formatSlideNumber = (num: number) => num.toString().padStart(2, '0');

  const categoryNames: Record<string, string> = {
    music: "Музыка",
    cinema: "Кино",
    literature: "Литература",
    art: "Искусство",
    sport: "Спорт",
    science: "Наука",
  };

  return (
    <div className="slider-container relative w-full">
      <div className="mobile-category">
        <span>{categoryNames[currentCategory]}</span>
      </div>
      <hr />
      <div className="slider-buttons-up">
        <div className="numbers-arrow">
          <div className="slider-numbers">
            <span>{formatSlideNumber(currentCategorySlide)}</span>
            <span>/{formatSlideNumber(totalCategorySlides)}</span>
          </div>
          {/* 🔼 Верхние стрелки */}
          <div className="arrows-top">
            <button 
              onClick={handleCategoryPrev} 
              className="swiper-button-prev-custom"
              disabled={currentCategorySlide === 1} // Отключаем на первой категории
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                <path 
                  d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071" 
                  stroke="#42567A" 
                  strokeWidth="2" 
                />
              </svg>
            </button>
            <button 
              onClick={handleCategoryNext} 
              className="swiper-button-next-custom"
              disabled={isLastCategory} // Отключаем на последней категории
              style={{ 
                // 🔽 НОВОЕ: Прозрачность 50% на последней категории
                opacity: isLastCategory ? 0.5 : 1 
              }}
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none" style={{ transform: "rotate(180deg)" }}>
                <path 
                  d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071" 
                  stroke="#42567A" 
                  strokeWidth="2" 
                />
              </svg>
            </button>
          </div>
        </div>
        <div 
          ref={categoryPaginationRef}
          className="category-pagination mobile-pagination"
          style={{ display: window.innerWidth < 375 ? 'flex' : 'none' }}
        >
          {categoriesList.map((_, index) => (
            <button
              key={index}
              className={`category-pagination-dot ${index === currentCategorySlide - 1 ? 'active' : ''}`}
              onClick={() => handlePaginationClick(index)}
              aria-label={`Перейти к категории ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Swiper
        modules={[Virtual]}
        virtual
        spaceBetween={30}
        slidesPerView={3}
        slidesPerGroup={1}
        breakpoints={{
          320: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }}
        onSwiper={(swiper) => { 
          textSwiperRef.current = swiper; 
          setTextSwiperState({ 
            isBeginning: swiper.isBeginning, 
            isEnd: swiper.isEnd 
          }); 
        }}
        onSlideChange={handleSlideChange}
      >
        {currentCategorySlides.map((slide, idx) => (
          <SwiperSlide key={idx} virtualIndex={idx}>
            <div className="slide-block-wrapper">
              <div className={`slide-block ${idx % 3 === 1 ? "center-block" : "side-block"}`}>
                <div className="slide-title" style={{ opacity: contentOpacity, transition: "opacity 0.3s ease-in-out" }}>
                  {slide.year}
                </div>
                <div className="slide-text" style={{ opacity: contentOpacity, transition: "opacity 0.3s ease-in-out" }}>
                  {slide.name}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔽 Нижние стрелки - СКРЫВАЮТСЯ КОГДА ТЕКСТ ЗАКОНЧИЛСЯ */}
      <div className="arrows-two">
        <button 
          onClick={() => textSwiperRef.current?.slidePrev()} 
          className="btn-slide" 
          style={{ opacity: textSwiperState.isBeginning ? 0 : 1 }}
          disabled={textSwiperState.isBeginning}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ transform: "rotate(180deg)" }}>
            <path d="M0.707 0.707L5.707 5.707L0.707 10.707" stroke="#3877EE" strokeWidth="2" />
          </svg>
        </button>
        <button 
          onClick={() => textSwiperRef.current?.slideNext()} 
          className="btn-slide" 
          style={{ opacity: textSwiperState.isEnd ? 0 : 1 }}
          disabled={textSwiperState.isEnd}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M0.707 0.707L5.707 5.707L0.707 10.707" stroke="#3877EE" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slider;