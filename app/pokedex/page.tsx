"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PokemonCard from "@/components/pokemon-card";
import Link from "next/link";
import Navbar from "@/components/navbar";
import {
  getPokemonBatch,
  getPokemonIdsByGeneration,
  regionToGen,
} from "@/lib/helper";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleX } from "lucide-react";

const BATCH_SIZE = 30;

export default function Pokedex() {
  const [activeRegion, setActiveRegion] = useState("kanto");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    setHasMore(true);

    setPokemon([]);
    setPage(0);

    try {
      const gen = regionToGen[activeRegion];
      // const pokemonIds = await getPokemonIdsByGeneration(gen);
      const pokemonIds = await getPokemonIdsByGeneration(gen);

      if (!pokemonIds.length) {
        setError("No Pokémon found for this region.");
        setPokemon([]);
        return;
      }

      setIds(pokemonIds);

      const firstBatch = await getPokemonBatch(pokemonIds.slice(0, BATCH_SIZE));

      setPokemon(firstBatch);
      setPage(1);

      if (pokemonIds.length <= BATCH_SIZE) {
        setHasMore(false);
      }
    } catch {
      setError("Failed to load Pokémon.");
      setPokemon([]);
    }

    setLoading(false);
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const start = page * BATCH_SIZE;
    const nextIds = ids.slice(start, start + BATCH_SIZE);

    if (!nextIds.length) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }

    const more = await getPokemonBatch(nextIds);

    setPokemon((prev) => [...prev, ...more]);
    setPage((p) => p + 1);

    if (start + BATCH_SIZE >= ids.length) {
      setHasMore(false);
    }

    setLoadingMore(false);
  }, [page, ids, loadingMore, hasMore]);

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRegion]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    const current = observerRef.current;

    if (current) observer.observe(current);

    return () => observer.disconnect();
  }, [loadMore, ids]);

  return (
    <main className="min-h-screen flex flex-col bg-muted">
      <Navbar
        withRegion
        activeRegion={activeRegion}
        setActiveRegion={(key) => setActiveRegion(key ?? "")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1 items-start px-6 py-8 pt-0">
        {loading ? (
          <div className="col-span-full h-full flex items-center justify-center p-8 text-sm text-muted-foreground">
            Loading Pokédex...
          </div>
        ) : error ? (
          <div className="col-span-full h-full flex flex-col gap-2 items-center justify-center p-8 text-sm text-red-500">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleX color={`var(--destructive)`} />
                </EmptyMedia>
                <EmptyTitle>Oops!</EmptyTitle>
                <EmptyDescription>{error}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={loadInitial}
                >
                  Retry
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            {pokemon.map((p) => (
              <Link key={p.id} href={`/pokemon?q=${p.id}`}>
                <PokemonCard pokemon={p} />
              </Link>
            ))}

            {hasMore && <div ref={observerRef} className="col-span-full h-1" />}

            {loadingMore && hasMore && (
              <div className="col-span-full text-center text-sm text-muted-foreground">
                Loading more Pokémon...
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
