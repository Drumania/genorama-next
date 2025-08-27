"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Folk",
  "Metal",
  "Punk",
  "Blues",
  "Indie",
  "Alternative",
  "Latin",
  "World",
  "Ambient",
]

interface SearchBandasProps {
  initialSearch?: string
  initialGenre?: string
}

export function SearchBandas({ initialSearch = "", initialGenre = "" }: SearchBandasProps) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedGenre, setSelectedGenre] = useState(initialGenre)
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL()
  }

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? "" : genre)
  }

  const updateURL = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (search.trim()) {
      params.set("search", search.trim())
    } else {
      params.delete("search")
    }

    if (selectedGenre) {
      params.set("genre", selectedGenre)
    } else {
      params.delete("genre")
    }

    router.push(`/bandas?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedGenre("")
    router.push("/bandas")
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artistas, bandas o géneros..."
            className="pl-10 bg-background border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button type="submit" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(search || selectedGenre) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: "{search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearch("")
                  updateURL()
                }}
              />
            </Badge>
          )}
          {selectedGenre && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Género: {selectedGenre}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedGenre("")
                  updateURL()
                }}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Genre Filters */}
      {showFilters && (
        <div className="p-4 border border-border/50 rounded-lg bg-muted/20">
          <h3 className="font-medium mb-3">Filtrar por género:</h3>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleGenreSelect(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={updateURL}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
