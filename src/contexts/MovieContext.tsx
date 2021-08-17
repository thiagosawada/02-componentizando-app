import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { api } from '../services/api';

interface MovieContextProviderProps {
  children: ReactNode;
}

interface Genre {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MovieContextData {
  selectedGenreId: number;
  genres: Genre[];
  movies: Movie[];
  selectedGenre: Genre;
  handleClickButton: (id: number) => void;
}

export function MovieContextProvider({ children }: MovieContextProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre>({} as Genre);

  useEffect(() => {
    api.get<Genre[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<Movie[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<Genre>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <MovieContext.Provider value={{
      selectedGenreId,
      genres,
      movies,
      selectedGenre,
      handleClickButton
    }}>
      { children }
    </MovieContext.Provider>
  )
}

const MovieContext = createContext({} as MovieContextData);

export const useMovie = () => {
  return useContext(MovieContext);
}