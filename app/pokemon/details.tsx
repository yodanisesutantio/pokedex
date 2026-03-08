"use client";

import Navbar from "@/components/navbar";
import PokemonAvatar, { PokemonVariant } from "@/components/pokemon-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getEvolutionPaths,
  getPokemonDetails,
  pokedexId,
  typeClass,
  VERSION_NAMES,
} from "@/lib/helper";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonAbility = {
  name: string;
  hidden: boolean;
};

export type EvolutionNode = {
  id: number;
  name: string;
  level?: number;
  item?: string;
  trigger?: string;
  evolves_to: EvolutionNode[];
};

export type PokemonDetails = {
  id: number;
  name: string;
  types: string[];
  pokedexByGeneration: Record<string, string[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sprites: any;
  variants: string[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  cry: string;
  evolution: EvolutionNode;
  species: string;
  abilities: PokemonAbility[];
  genderRate: number;
  captureRate: number;
  baseHappiness: number;
  growthRate: string;
};

export default function PokedexDetails() {
  const [pageLoading, setPageLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [isShiny, setIsShiny] = useState(false);

  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const femaleRate =
    pokemon?.genderRate === -1 ? 0 : (pokemon?.genderRate ?? 0) * 12.5;
  const maleRate = pokemon?.genderRate === -1 ? 0 : 100 - femaleRate;

  const generations = Object.keys(pokemon?.pokedexByGeneration ?? {}).filter(
    (g) => g && VERSION_NAMES[g]
  );
  const [variant, setVariant] = useState<PokemonVariant>("home");
  const variants = useMemo(() => {
    if (!pokemon) return ["home"];

    const v: PokemonVariant[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkSprite = (spriteSet: any) => {
      return spriteSet && (spriteSet.front_default || spriteSet.front_shiny);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generations: Record<PokemonVariant, any> = {
      home: pokemon.sprites?.other?.home,
      gen1: pokemon.sprites?.versions?.["generation-i"]?.["red-blue"],
      gen2: pokemon.sprites?.versions?.["generation-ii"]?.crystal,
      gen3: pokemon.sprites?.versions?.["generation-iii"]?.emerald,
      gen4: pokemon.sprites?.versions?.["generation-iv"]?.["diamond-pearl"],
      gen5: pokemon.sprites?.versions?.["generation-v"]?.["black-white"],
      gen6: pokemon.sprites?.versions?.["generation-vi"]?.["x-y"],
      gen7: pokemon.sprites?.versions?.["generation-vii"]?.[
        "ultra-sun-ultra-moon"
      ],
      gen8: pokemon.sprites?.versions?.["generation-viii"]?.icons,
    };

    for (const [variant, spriteSet] of Object.entries(generations)) {
      if (checkSprite(spriteSet)) {
        v.push(variant as PokemonVariant);
      }
    }

    return v.length ? v : ["home"];
  }, [pokemon]);

  const safeVariant = variants.includes(variant) ? variant : variants[0];

  useEffect(() => {
    if (!q) return;

    const load = async () => {
      setPageLoading(true);
      const data = await getPokemonDetails(Number(q));
      setPokemon(data);
      setPageLoading(false);
    };

    load();
  }, [q]);

  useEffect(() => {
    if (!variants.includes(variant)) {
      // Defer the state update to avoid synchronous setState() inside the effect
      const id = setTimeout(() => {
        setVariant(variants[0] as PokemonVariant);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [variants, variant]);

  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    if (pokemon) {
      const id = setTimeout(() => setStatsVisible(true), 100);
      return () => clearTimeout(id);
    }
  }, [pokemon]);

  const playCry = () => {
    if (!pokemon?.cry) return;

    const audio = new Audio(pokemon.cry);
    audio.volume = 0.6;
    audio.play();
  };

  return (
    <main className="min-h-screen flex flex-col bg-muted">
      <Navbar withRegion={false} />
      <div className="flex flex-col gap-3 h-[calc(100vh-5.5rem)] p-3 lg:p-6 pt-0 lg:pt-0">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-1 relative">
            {pageLoading && (
              <Skeleton className="absolute inset-0 w-24 rounded-sm" />
            )}
            <h1
              className={`text-3xl font-bold flex flex-row gap-3 ${
                pageLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="text-muted-foreground">
                #{pokedexId(pokemon?.id ?? 0)}
              </span>
              {pokemon?.name}
            </h1>
          </div>
          <div className="flex gap-1 relative">
            {pageLoading && (
              <Skeleton className="absolute inset-0 w-14 rounded-sm" />
            )}
            {pokemon?.types.map((type: string) => {
              return (
                <span
                  key={type}
                  className={`px-2 py-0.5 rounded-full text-sm font-medium h-fit ${
                    typeClass[type]
                  } ${pageLoading ? "opacity-0" : "opacity-100"}`}
                >
                  {type.toLocaleUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 h-screen">
          <div className="col-span-1 flex flex-col gap-3">
            <div className="group relative w-full h-full bg-card border border-foreground  rounded-2xl">
              {imageLoading && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
              )}
              <PokemonAvatar
                pokemon={pokemon ?? ({} as PokemonDetails)}
                variant={safeVariant as PokemonVariant}
                isShiny={isShiny}
                onLoadingChange={setImageLoading}
                className={`group-hover:scale-110 transition-transform duration-400 ease-in-out`}
              />
            </div>
            <div className="flex flex-row gap-3">
              <Card
                className={`group relative ${
                  variants.length > 0 ? "w-1/2" : "w-full"
                } rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground`}
              >
                {pageLoading && (
                  <Skeleton className="absolute inset-0 w-full rounded-2xl" />
                )}
                <CardContent
                  className={`flex items-center justify-center text-xs min-h-[36px] max-h-[36px] overflow-hidden p-0 ${
                    pageLoading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shiny-variant"
                      checked={isShiny}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        setIsShiny(!!checked);
                      }}
                      disabled={safeVariant === "gen1"}
                    />
                    <Label htmlFor="shiny-variant">Shiny</Label>
                  </div>
                </CardContent>
              </Card>
              {variants.length > 0 && (
                <Card className="group w-1/2 rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground cursor-pointer">
                  <CardContent className="relative flex items-center justify-center text-xs min-h-[36px] max-h-[36px] overflow-hidden p-0">
                    {pageLoading && (
                      <Skeleton className="absolute inset-0 w-full rounded-2xl" />
                    )}
                    <Select
                      value={safeVariant}
                      onValueChange={(v) => setVariant(v as PokemonVariant)}
                    >
                      <SelectTrigger
                        className={`w-full cursor-pointer ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <SelectValue placeholder="Variant" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sprite Variant</SelectLabel>

                          {variants.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v === "home" ? "HOME" : v.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-5 gap-3">
            <div className="col-span-4">
              <div className="flex flex-col gap-3 grid grid-cols-4">
                <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[162px] col-span-4">
                  <CardHeader className="px-3 pt-3 relative">
                    {pageLoading && (
                      <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                    )}
                    <h2
                      className={`font-bold text-xl ${
                        pageLoading ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Entries
                    </h2>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                    {pageLoading && (
                      <div className="flex flex-col gap-2 absolute top-0 w-[calc(100%-1.5rem)] z-3 rounded-2xl">
                        <Skeleton className="h-9" />
                        <Skeleton className="h-6" />
                        <Skeleton className="h-6" />
                      </div>
                    )}
                    <Tabs
                      key={Object.keys(pokemon?.pokedexByGeneration ?? {}).join(
                        ","
                      )}
                      className={`w-full ${
                        pageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      defaultValue={
                        Object.keys(pokemon?.pokedexByGeneration ?? {})[0] ?? ""
                      }
                    >
                      <div className="w-full overflow-x-auto scrollbar-hide">
                        <TabsList className="w-max">
                          {generations.map((gen) => (
                            <TabsTrigger
                              key={gen}
                              value={gen}
                              className="cursor-pointer"
                            >
                              {VERSION_NAMES[gen]}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                      {Object.entries(pokemon?.pokedexByGeneration ?? {}).map(
                        ([gen, texts]) => (
                          <TabsContent key={gen} value={gen}>
                            <div className="space-y-2 text-sm font-medium h-14 overflow-y-auto">
                              {texts.map((text, i) => (
                                <p key={i}>&ldquo;{text}&rdquo;</p>
                              ))}
                            </div>
                          </TabsContent>
                        )
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
                <div className="col-span-2">
                  <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Stats
                      </h2>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                      )}
                      <div
                        className={`space-y-1 ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        {pokemon?.stats.map((stat) => {
                          const width = Math.min((stat.value / 255) * 100, 100);

                          const bgColor =
                            stat.value >= 100
                              ? "bg-green-500"
                              : stat.value >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500";

                          return (
                            <React.Fragment key={stat.name}>
                              <Separator />
                              <div className="flex items-center gap-3 text-xs">
                                <span className="w-20 capitalize text-muted-foreground">
                                  {stat.name.replace("special-", "sp. ")}
                                </span>

                                <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={`h-full transition-[width] duration-700 ease-out ${bgColor}`}
                                    style={{
                                      width: statsVisible ? `${width}%` : "0%",
                                    }}
                                  />
                                </div>

                                <span className="w-8 text-right font-medium">
                                  {stat.value}
                                </span>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        <Separator />
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="w-20">Total</span>
                          <div className="flex-1 rounded-full h-2 overflow-hidden"></div>
                          <span className="w-8 text-right">
                            {pokemon?.stats?.reduce((t, s) => t + s.value, 0) ??
                              0}
                          </span>
                        </div>
                        <Separator />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-2">
                  <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[238px]">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Evolution Chain
                      </h2>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] h-[180px] rounded-2xl" />
                      )}
                      <div
                        className={`pb-2 overflow-auto h-[190px] scrollbar-hide ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-center min-w-max min-h-[180px]">
                          {pokemon?.evolution && (
                            <EvolutionNode node={pokemon.evolution} />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-1">
                  <Card className="rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[100px]">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Gender Ratio
                      </h2>
                    </CardHeader>

                    <CardContent className="p-3 pt-0 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                      )}
                      <div
                        className={`${
                          pageLoading ? "opacity-0" : "opacity-100"
                        } space-y-1.5`}
                      >
                        {pokemon?.genderRate === -1 ? (
                          <div className="w-full h-3 rounded-full bg-muted" />
                        ) : (
                          <>
                            <div className="w-full h-3 rounded-full overflow-hidden flex">
                              <div
                                className="bg-green-500"
                                style={{ width: `${maleRate}%` }}
                              />
                              <div
                                className="bg-red-500"
                                style={{ width: `${femaleRate}%` }}
                              />
                            </div>

                            <div className="flex justify-between text-sm font-medium">
                              <span>♂ {maleRate}%</span>
                              <span>♀ {femaleRate}%</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-1">
                  <Card className="rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[100px]">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Catch Rate
                      </h2>
                    </CardHeader>

                    <CardContent className="p-3 pt-0 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                      )}
                      <div
                        className={`${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <p>{pokemon?.captureRate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-1">
                  <Card className="rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[100px]">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Base Happiness
                      </h2>
                    </CardHeader>

                    <CardContent className="p-3 pt-0 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                      )}
                      <div
                        className={`${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <p>{pokemon?.baseHappiness}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-1">
                  <Card className="rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[100px]">
                    <CardHeader className="px-3 pt-3 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                      )}
                      <h2
                        className={`font-bold text-xl ${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        Growth Rate
                      </h2>
                    </CardHeader>

                    <CardContent className="p-3 pt-0 relative">
                      {pageLoading && (
                        <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                      )}
                      <div
                        className={`${
                          pageLoading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <p>
                          {pokemon?.growthRate &&
                            pokemon.growthRate
                              .replace(/-/g, " ")
                              .toLowerCase()
                              .replace(/^./, (c) => c.toUpperCase())}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-fit">
                <CardHeader className="px-3 pt-3 relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                  )}
                  <h2
                    className={`font-bold text-xl ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Cry
                  </h2>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                  )}
                  <Button
                    variant="outline"
                    className={`cursor-pointer ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onClick={playCry}
                  >
                    <Play />
                  </Button>
                </CardContent>
              </Card>
              <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-fit">
                <CardHeader className="px-3 pt-3 relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                  )}
                  <h2
                    className={`font-bold text-xl ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Height
                  </h2>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                  )}
                  <div
                    className={`${pageLoading ? "opacity-0" : "opacity-100"}`}
                  >
                    <p>{(pokemon?.height ?? 0) / 10} m</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-fit">
                <CardHeader className="px-3 pt-3 relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                  )}
                  <h2
                    className={`font-bold text-xl ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Weight
                  </h2>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                  )}
                  <div
                    className={`${pageLoading ? "opacity-0" : "opacity-100"}`}
                  >
                    <p>{(pokemon?.weight ?? 0) / 10} kg</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-fit">
                <CardHeader className="px-3 pt-3 relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                  )}
                  <h2
                    className={`font-bold text-xl ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Species
                  </h2>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 border-foreground relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                  )}
                  <div
                    className={`${pageLoading ? "opacity-0" : "opacity-100"}`}
                  >
                    <p>{pokemon?.species}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="group rounded-2xl overflow-hidden py-0 gap-0 shadow-none border border-foreground h-[121px]">
                <CardHeader className="px-3 pt-3 relative">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 w-20 h-7 rounded-2xl" />
                  )}
                  <h2
                    className={`font-bold text-xl ${
                      pageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Abilities
                  </h2>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2 border-foreground relative overflow-y-auto h-[60px]">
                  {pageLoading && (
                    <Skeleton className="absolute inset-3 top-0 bottom-1 w-[calc(100%-1.5rem)] rounded-2xl" />
                  )}
                  <ul
                    className={`${pageLoading ? "opacity-0" : "opacity-100"}`}
                  >
                    {pokemon?.abilities.map((ability) => (
                      <li
                        key={ability.name}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">{ability.name}</span>
                        {ability.hidden && (
                          <span className="text-xs text-muted-foreground">
                            (Hidden)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function EvolutionNode({ node }: { node: EvolutionNode }) {
  const paths = getEvolutionPaths(node);

  return (
    <div className="flex flex-col gap-4">
      {paths.map((path, i) => (
        <div key={i} className="flex items-center gap-6">
          {path.map((p, idx) => (
            <div key={p.id} className="flex items-center gap-4">
              <Link
                href={`/pokemon?q=${p.id}`}
                className="flex flex-col items-center text-xs cursor-pointer"
              >
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${p.id}.png`}
                  alt={p.name}
                  width={80}
                  height={80}
                />
                <span className="capitalize">{p.name}</span>
              </Link>

              {idx !== path.length - 1 && (
                <div className="flex flex-col items-center text-[10px] text-muted-foreground w-20">
                  <ArrowRight className="w-6 h-6" />

                  {path[idx + 1].level && (
                    <span>Lv. {path[idx + 1].level}</span>
                  )}

                  {path[idx + 1]?.item && (
                    <span className="capitalize">
                      {path[idx + 1]?.item?.replace(/-/g, " ")}
                    </span>
                  )}

                  {path[idx + 1].trigger === "trade" && <span>Trade</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
