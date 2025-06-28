import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../auth/AuthContext";
import RecipeItem from "./RecipeItem";
import useIsMobile from "../../hooks/useIsMobile";
import "./RecipeSuggestions.css";

export default function RecipeSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const { user } = useContext(AuthContext);
  const isMobile = useIsMobile();

  // Simple mobile carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchSuggestions = async () => {
      try {
        const res = await fetch("http://localhost:3001/recipes");
        const allRecipes = await res.json();

        // Lấy user preferences từ localStorage
        const userPreferences = JSON.parse(
          localStorage.getItem(`preferences_${user.email}`)
        ) || {
          favoriteCategories: [],
          recentlyViewed: [],
          preferredCookingTime: "any",
        };

        // Tạo personalized suggestions
        let personalizedSuggestions = [];

        // 1. Gợi ý dựa trên categories yêu thích
        if (userPreferences.favoriteCategories.length > 0) {
          const categoryBasedSuggestions = allRecipes.filter((recipe) =>
            userPreferences.favoriteCategories.includes(recipe.category)
          );
          personalizedSuggestions.push(...categoryBasedSuggestions);
        }

        // 2. Gợi ý dựa trên thời gian nấu ăn ưa thích
        if (userPreferences.preferredCookingTime !== "any") {
          const timeBasedSuggestions = allRecipes.filter((recipe) => {
            if (userPreferences.preferredCookingTime === "quick")
              return recipe.cookingTime <= 30;
            if (userPreferences.preferredCookingTime === "medium")
              return recipe.cookingTime > 30 && recipe.cookingTime <= 60;
            if (userPreferences.preferredCookingTime === "long")
              return recipe.cookingTime > 60;
            return true;
          });
          personalizedSuggestions.push(...timeBasedSuggestions);
        }

        // 3. Gợi ý dựa trên rating cao
        const highRatedRecipes = allRecipes.filter(
          (recipe) => recipe.rating >= 4.0
        );
        personalizedSuggestions.push(...highRatedRecipes);

        // 4. Gợi ý trending (recipes có nhiều comments)
        const trendingRecipes = allRecipes
          .filter((recipe) => recipe.comments && recipe.comments.length > 0)
          .sort(
            (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
          );
        personalizedSuggestions.push(...trendingRecipes.slice(0, 5));

        // Loại bỏ trùng lặp và chỉ lấy 8 suggestions
        const uniqueSuggestions = personalizedSuggestions
          .filter(
            (recipe, index, self) =>
              index === self.findIndex((r) => r.id === recipe.id)
          )
          .slice(0, 8);

        // Nếu không đủ suggestions, thêm random recipes
        if (uniqueSuggestions.length < 6) {
          const remainingRecipes = allRecipes.filter(
            (recipe) => !uniqueSuggestions.find((s) => s.id === recipe.id)
          );
          const shuffled = remainingRecipes.sort(() => 0.5 - Math.random());
          uniqueSuggestions.push(
            ...shuffled.slice(0, 6 - uniqueSuggestions.length)
          );
        }

        setSuggestions(uniqueSuggestions);

        // Lưu thống kê để cải thiện suggestions sau này
        localStorage.setItem(
          `suggestions_${user.email}`,
          JSON.stringify({
            lastGenerated: new Date().toISOString(),
            count: uniqueSuggestions.length,
          })
        );
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        // Fallback từ localStorage
        const fallbackRecipes =
          JSON.parse(localStorage.getItem("recipes")) || [];
        setSuggestions(fallbackRecipes.slice(0, 6));
      }
    };

    fetchSuggestions();
  }, [user]);

  // Auto-scroll cho desktop
  useEffect(() => {
    if (suggestions.length === 0 || !user || isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.max(1, suggestions.length - 2)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [suggestions.length, user, isMobile]);

  // Không render gì nếu user chưa đăng nhập
  if (!user) return null;

  const updateUserPreferences = (category) => {
    const currentPrefs = JSON.parse(
      localStorage.getItem(`preferences_${user.email}`)
    ) || {
      favoriteCategories: [],
      recentlyViewed: [],
      preferredCookingTime: "any",
    };

    if (!currentPrefs.favoriteCategories.includes(category)) {
      currentPrefs.favoriteCategories.push(category);
      localStorage.setItem(
        `preferences_${user.email}`,
        JSON.stringify(currentPrefs)
      );
    }
  };

  const handleRecipeClick = (recipe) => {
    // Track clicked suggestions để cải thiện algorithm
    const clickData =
      JSON.parse(localStorage.getItem(`suggestion_clicks_${user.email}`)) || [];
    clickData.push({
      recipeId: recipe.id,
      category: recipe.category,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(
      `suggestion_clicks_${user.email}`,
      JSON.stringify(clickData)
    );

    // Update user preferences
    updateUserPreferences(recipe.category);
  };

  // Navigation methods
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const maxIndex = isMobile
      ? suggestions.length - 1
      : Math.max(1, suggestions.length - 2);
    setCurrentIndex((prev) => (prev + 1) % maxIndex);
  };

  const prevSlide = () => {
    const maxIndex = isMobile
      ? suggestions.length - 1
      : Math.max(1, suggestions.length - 2);
    setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="suggestions-container">
        <h2>🌟 Suggested for You</h2>
        <div className="suggestions-loading">
          <p>Loading personalized suggestions...</p>
        </div>
      </div>
    );
  }

  const getTransform = () => {
    if (isMobile) {
      return `translateX(-${currentIndex * 100}%)`;
    } else {
      return `translateX(-${currentIndex * (100 / 3)}%)`;
    }
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h2>🌟 Suggested for You, {user.username}</h2>
        <p>Personalized recommendations based on your preferences</p>
      </div>

      <div className="suggestions-carousel">
        {!isMobile && (
          <button className="carousel-btn prev" onClick={prevSlide}>
            ❮
          </button>
        )}

        <div
          className="carousel-track-container"
          ref={containerRef}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          <div
            className="carousel-track"
            ref={trackRef}
            style={{
              transform: getTransform(),
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {suggestions.map((recipe) => (
              <div
                key={recipe.id}
                className="suggestion-slide"
                onClick={() => handleRecipeClick(recipe)}
              >
                <RecipeItem
                  recipe={recipe}
                  onEdit={null}
                  onDelete={null}
                  onFavorite={null}
                  onRate={null}
                  compact={true}
                />
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <button className="carousel-btn next" onClick={nextSlide}>
            ❯
          </button>
        )}
      </div>

      <div className="carousel-indicators">
        {isMobile
          ? // Mobile indicators show all slides
            suggestions.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))
          : // Desktop indicators
            Array.from({ length: Math.max(1, suggestions.length - 2) }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                />
              )
            )}
      </div>

      {isMobile && (
        <div className="mobile-scroll-hint">
          <p>👈 Swipe to explore recipes 👉</p>
        </div>
      )}

      <div className="suggestions-stats">
        <p>
          💡 Tip: Your suggestions improve as you interact with more recipes!
        </p>
      </div>
    </div>
  );
}
