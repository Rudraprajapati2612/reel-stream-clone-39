import { useEffect, useState } from "react";
import { X, Play, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import YouTube from "react-youtube";
import { tmdbService } from "@/services/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

interface MovieModalProps {
  movie: Movie | null;
  apiKey: string;
  onClose: () => void;
}

const MovieModal = ({ movie, apiKey, onClose }: MovieModalProps) => {
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!movie || !apiKey) return;

    const fetchMovieData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trailer
        const trailerData = await tmdbService.getMovieTrailer(apiKey, movie.id);
        if (trailerData && trailerData.length > 0) {
          setTrailerKey(trailerData[0].key);
        }

        // Fetch detailed movie info
        const details = await tmdbService.getMovieDetails(apiKey, movie.id);
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movie, apiKey]);

  const youtubeOpts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (!movie) return null;

  const displayMovie = movieDetails || movie;
  const releaseYear = displayMovie.release_date?.split("-")[0] || displayMovie.first_air_date?.split("-")[0];

  return (
    <Dialog open={!!movie} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-background border-border max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Trailer or backdrop */}
          <div className="relative aspect-video bg-secondary rounded-t-lg overflow-hidden">
            {trailerKey ? (
              <YouTube
                videoId={trailerKey}
                opts={youtubeOpts}
                className="w-full h-full"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={`https://image.tmdb.org/t/p/original${displayMovie.backdrop_path || displayMovie.poster_path}`}
                  alt={displayMovie.title || displayMovie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold mb-2">
                    {displayMovie.title || displayMovie.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <Button size="lg" className="bg-white text-black hover:bg-white/80">
                      <Play className="w-5 h-5 mr-2" />
                      Play
                    </Button>
                    <Button size="lg" variant="secondary">
                      <Plus className="w-5 h-5 mr-2" />
                      My List
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Movie details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-green-500 font-semibold">
                    {Math.round(displayMovie.vote_average * 10)}% Match
                  </span>
                  {releaseYear && <span className="text-muted-foreground">{releaseYear}</span>}
                  {displayMovie.runtime && (
                    <span className="text-muted-foreground">{displayMovie.runtime}m</span>
                  )}
                </div>

                <p className="text-foreground/90 text-base leading-relaxed mb-6">
                  {displayMovie.overview}
                </p>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="rounded-full">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {displayMovie.genres && displayMovie.genres.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Genres:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {displayMovie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-2 py-1 bg-secondary text-xs rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Rating:
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">★</span>
                    <span>{displayMovie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;