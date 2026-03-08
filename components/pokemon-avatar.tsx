"use client";

import { PokemonDetails } from "@/app/pokemon/page";
import Image from "next/image";
import { useEffect, useState } from "react";

const pikachu =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

export interface PokemonAvatarProps {
  pokemon: PokemonDetails;
  isShiny?: boolean;
  variant: PokemonVariant;
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
}

export type PokemonVariant =
  | "home"
  | "gen1"
  | "gen2"
  | "gen3"
  | "gen4"
  | "gen5"
  | "gen6"
  | "gen7"
  | "gen8";

export default function PokemonAvatar(props: PokemonAvatarProps) {
  const [src, setSrc] = useState(pikachu);
  const [isSilhouette, setIsSilhouette] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleError = () => {
    setVisible(false);

    setSrc(pikachu);
    setIsSilhouette(true);

    props.onLoadingChange?.(true);
  };

  useEffect(() => {
    const spriteSet = (() => {
      const map = {
        home: props.pokemon?.sprites?.other?.home,
        gen1: props.pokemon?.sprites?.versions?.["generation-i"]?.["red-blue"],
        gen2: props.pokemon?.sprites?.versions?.["generation-ii"]?.crystal,
        gen3: props.pokemon?.sprites?.versions?.["generation-iii"]?.emerald,
        gen4: props.pokemon?.sprites?.versions?.["generation-iv"]?.[
          "diamond-pearl"
        ],
        gen5: props.pokemon?.sprites?.versions?.["generation-v"]?.[
          "black-white"
        ],
        gen6: props.pokemon?.sprites?.versions?.["generation-vi"]?.["x-y"],
        gen7: props.pokemon?.sprites?.versions?.["generation-vii"]?.[
          "ultra-sun-ultra-moon"
        ],
        gen8: props.pokemon?.sprites?.versions?.["generation-viii"]?.icons,
      };

      return map[props.variant];
    })();

    let next = null;
    let silhouette = false;

    if (props.isShiny) {
      next = spriteSet?.front_shiny;
      if (!next) silhouette = true;
    }

    if (!next) next = spriteSet?.front_default;

    if (!next || typeof next !== "string" || next.trim() === "") {
      next = pikachu;
      silhouette = true;
    }

    setVisible(false);
    setSrc(next);

    setIsSilhouette(silhouette);

    setTimeout(() => {
      setVisible(true);
      props.onLoadingChange?.(false);
    }, 120);

    props.onLoadingChange?.(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pokemon, props.variant, props.isShiny]);

  const handleLoad = () => {
    setVisible(true);
    props.onLoadingChange?.(false);
  };

  return (
    <Image
      src={src || pikachu}
      alt={props.pokemon.name}
      fill
      onLoad={handleLoad}
      onError={handleError}
      className={`
        rounded-2xl overflow-hidden cursor-pointer object-contain p-4
        transition-opacity duration-400 ease-in-out
        ${isSilhouette ? "brightness-0 contrast-200" : ""}
        ${visible ? "opacity-100" : "opacity-0"}
        ${props.className ?? ""}
      `}
    />
  );
}
