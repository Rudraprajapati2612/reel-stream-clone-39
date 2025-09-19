import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

// TMDB API endpoints
const endpoints = {
  trending: "/trending/all/week",
  netflixOriginals: "/discover/tv?with_networks=213",
  topRated: "/movie/top_rated",
  actionMovies: "/discover/movie?with_genres=28",
  comedyMovies: "/discover/movie?with_genres=35",
  horrorMovies: "/discover/movie?with_genres=27",
  romanceMovies: "/discover/movie?with_genres=10749",
  documentaries: "/discover/movie?with_genres=99",
  sciFiMovies: "/discover/movie?with_genres=878",
  popularTV: "/tv/popular",
  airingToday: "/tv/airing_today",
};

class TMDBService {
  private makeRequest = async (apiKey: string, endpoint: string) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          api_key: apiKey,
          language: "en-US",
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw error;
    }
  };

  getTrending = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.trending);
  };

  getNetflixOriginals = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.netflixOriginals);
  };

  getTopRated = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.topRated);
  };

  getActionMovies = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.actionMovies);
  };

  getComedyMovies = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.comedyMovies);
  };

  getHorrorMovies = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.horrorMovies);
  };

  getRomanceMovies = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.romanceMovies);
  };

  getDocumentaries = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.documentaries);
  };

  getSciFiMovies = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.sciFiMovies);
  };

  getPopularTV = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.popularTV);
  };

  getAiringToday = (apiKey: string) => {
    return this.makeRequest(apiKey, endpoints.airingToday);
  };

  getMoviesByEndpoint = (apiKey: string, endpoint: string) => {
    return this.makeRequest(apiKey, endpoint);
  };

  getMovieTrailer = async (apiKey: string, movieId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: apiKey,
          language: "en-US",
        },
      });
      
      const videos = response.data.results;
      // Filter for trailers and teasers
      return videos.filter((video: any) => 
        video.type === "Trailer" || video.type === "Teaser"
      );
    } catch (error) {
      console.error("Error fetching trailer:", error);
      return [];
    }
  };

  getMovieDetails = async (apiKey: string, movieId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: apiKey,
          language: "en-US",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };
}

export const tmdbService = new TMDBService();