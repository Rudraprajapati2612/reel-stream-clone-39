import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import MovieRow from "@/components/MovieRow";
import MovieModal from "@/components/MovieModal";
import { useToast } from "@/hooks/use-toast";

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
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("tmdb_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("tmdb_api_key", key);
    toast({
      title: "API Key Set",
      description: "TMDB API key has been saved successfully!",
    });
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Movie row configurations
  const movieRows = [
    {
      title: "Netflix Originals",
      endpoint: "/discover/tv?with_networks=213",
      isLargeRow: true,
    },
    {
      title: "Trending Now",
      endpoint: "/trending/all/week",
      isLargeRow: false,
    },
    {
      title: "Top Rated",
      endpoint: "/movie/top_rated",
      isLargeRow: false,
    },
    {
      title: "Action Movies",
      endpoint: "/discover/movie?with_genres=28",
      isLargeRow: false,
    },
    {
      title: "Comedy Movies",
      endpoint: "/discover/movie?with_genres=35",
      isLargeRow: false,
    },
    {
      title: "Horror Movies",
      endpoint: "/discover/movie?with_genres=27",
      isLargeRow: false,
    },
    {
      title: "Romance Movies",
      endpoint: "/discover/movie?with_genres=10749",
      isLargeRow: false,
    },
    {
      title: "Documentaries",
      endpoint: "/discover/movie?with_genres=99",
      isLargeRow: false,
    },
    {
      title: "Sci-Fi Movies",
      endpoint: "/discover/movie?with_genres=878",
      isLargeRow: false,
    },
    {
      title: "Popular TV Shows",
      endpoint: "/tv/popular",
      isLargeRow: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar onApiKeyChange={handleApiKeyChange} hasApiKey={!!apiKey} />

      {/* Banner */}
      <Banner apiKey={apiKey} />

      {/* Movie Rows */}
      {apiKey && (
        <div className="relative z-10 -mt-32">
          {movieRows.map((row, index) => (
            <MovieRow
              key={index}
              title={row.title}
              endpoint={row.endpoint}
              apiKey={apiKey}
              isLargeRow={row.isLargeRow}
              onMovieSelect={handleMovieSelect}
            />
          ))}
        </div>
      )}

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        apiKey={apiKey}
        onClose={closeModal}
      />

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p className="mb-2">Built with React, TypeScript, and TMDB API</p>
          <p className="text-sm">
            This is a Netflix clone for educational purposes. Get your free TMDB API key at{" "}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-netflix-red hover:underline"
            >
              themoviedb.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;