"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  getPokemonDescription,
  getPokemonImage,
  pokedexId,
  typeClass,
} from "@/lib/helper";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pokemon: any;
  onClick?: (key: number) => void;
}

export default function PokemonCard({ pokemon, onClick }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const pokemonImage = getPokemonImage(pokemon.id);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    async function loadDesc() {
      const desc = await getPokemonDescription(pokemon.id);
      setDescription(desc);
    }

    loadDesc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground cursor-pointer"
      onClick={() => onClick?.(pokemon.id)}
    >
      <div className="relative w-full h-40 bg-card flex items-center justify-center">
        {isLoading && <Skeleton className="absolute inset-0" />}
        {/* 
        <Button
          variant={`ghost`}
          size={`sm`}
          className="absolute right-2 top-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
        >
          {pokemon.starred ? (
            <Star size={24} className="text-yellow-400" fill="currentColor" />
          ) : (
            <Star size={18} />
          )}
        </Button> */}

        <Image
          src={pokemonImage}
          alt={
            pokemon.name
              ? pokemon.name.charAt(0).toUpperCase() +
                pokemon.name.slice(1).toLowerCase()
              : pokemon.name
          }
          fill
          onLoad={() => setIsLoading(false)}
          className={`object-contain p-4 group-hover:scale-120 transition-all duration-400 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <CardContent className="p-3 space-y-2 border-t border-foreground relative">
        <Button
          variant={`ghost`}
          size={`sm`}
          className="absolute right-2 top-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
        >
          <MoreHorizontal size={18} />
        </Button>

        <div>
          <div className="relative">
            {isLoading && (
              <Skeleton className="absolute inset-0 w-10 rounded-sm" />
            )}
            <p
              className={`text-xs text-muted-foreground ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              #{pokedexId(pokemon.id)}
            </p>
          </div>
          <div className="relative">
            {isLoading && (
              <Skeleton className="absolute inset-0 w-36 rounded-sm" />
            )}
            <h3
              className={`text-lg font-semibold ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              {pokemon.name
                ? pokemon.name.charAt(0).toUpperCase() +
                  pokemon.name.slice(1).toLowerCase()
                : pokemon.name}
            </h3>
          </div>
        </div>

        <div className="flex gap-1 relative">
          {isLoading && (
            <Skeleton className="absolute inset-0 w-14 rounded-sm" />
          )}
          {pokemon.types.map((type: string) => {
            return (
              <span
                key={type}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeClass[type]} ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                {type.toLocaleUpperCase()}
              </span>
            );
          })}
        </div>
      </CardContent>

      <CardDescription className="p-3 pt-0 text-xs min-h-[3.75rem] max-h-[3.75rem] overflow-hidden">
        <div className="relative">
          {isLoading && <Skeleton className="absolute inset-0 rounded-sm" />}

          <span
            className={`${isLoading ? "opacity-0" : "opacity-100"} line-clamp-3`}
          >
            &ldquo;{description}&rdquo;
          </span>
        </div>
      </CardDescription>
    </Card>
  );
}
