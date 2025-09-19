import { useEffect, useState } from "react";
import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tmdbService } from "@/services/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  backdrop_path?: string;
  poster_path?: string;
}

interface BannerProps {
  apiKey: string;
}

const Banner = ({ apiKey }: BannerProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;

    const fetchBannerMovie = async () => {
      try {
        setIsLoading(true);
        const trendingMovies = await tmdbService.getTrending(apiKey);
        if (trendingMovies && trendingMovies.length > 0) {
          const randomMovie = trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.error("Error fetching banner movie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerMovie();
  }, [apiKey]);

  const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? text.substring(0, maxLength - 1) + "..." : text;
  };

  if (isLoading) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-background to-secondary">
        <div className="animate-pulse text-2xl text-foreground">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-r from-background to-secondary">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Welcome to Netflix Clone</h2>
          <p className="text-muted-foreground">Please add your TMDB API key to start exploring movies</p>
        </div>
      </div>
    );
  }

  const backgroundImage = movie.backdrop_path || movie.poster_path;

  return (
    <div
      className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backgroundImage
          ? `url(https://image.tmdb.org/t/p/original${backgroundImage})`
          : "none",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4 md:px-8 ml-4 md:ml-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          {movie.title || movie.name || movie.original_name}
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-foreground/90 leading-relaxed animate-fade-in">
          {truncateText(movie.overview, 200)}
        </p>

        <div className="flex items-center space-x-4 animate-fade-in">
          <Button size="lg" className="bg-white text-black hover:bg-white/80 font-semibold px-8">
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-secondary/60 text-white border-white/20 hover:bg-secondary/80 font-semibold px-8"
          >
            <Plus className="w-5 h-5 mr-2" />
            My List
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:text-white/80 font-semibold px-8"
          >
            <Info className="w-5 h-5 mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;