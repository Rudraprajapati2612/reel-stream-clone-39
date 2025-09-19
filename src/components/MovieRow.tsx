import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tmdbService } from "@/services/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface MovieRowProps {
  title: string;
  endpoint: string;
  apiKey: string;
  isLargeRow?: boolean;
  onMovieSelect: (movie: Movie) => void;
}

const MovieRow = ({
  title,
  endpoint,
  apiKey,
  isLargeRow = false,
  onMovieSelect,
}: MovieRowProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!apiKey) return;

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await tmdbService.getMoviesByEndpoint(apiKey, endpoint);
        setMovies(data || []);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey, endpoint, title]);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = window.innerWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 bg-secondary animate-pulse rounded-md ${
                isLargeRow ? "w-48 h-72" : "w-64 h-36"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="px-4 md:px-8 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground">No movies found</p>
      </div>
    );
  }

  return (
    <div className="relative px-4 md:px-8 mb-8 group">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Movies container */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 ${
                isLargeRow ? "w-48" : "w-64"
              }`}
              onClick={() => onMovieSelect(movie)}
            >
              <div className="relative group/item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    isLargeRow ? movie.poster_path : movie.backdrop_path || movie.poster_path
                  }`}
                  alt={movie.title || movie.name}
                  className={`w-full object-cover rounded-md ${
                    isLargeRow ? "h-72" : "h-36"
                  }`}
                  loading="lazy"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {movie.title || movie.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 text-xs text-foreground/80">
                      <span>★ {movie.vote_average.toFixed(1)}</span>
                      <span>•</span>
                      <span>{movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default MovieRow;