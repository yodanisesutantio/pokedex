import { EvolutionNode } from "@/app/pokemon/details";

const descriptionCache: Record<number, string> = {};

export const typeClass: Record<string, string> = {
  normal: "bg-neutral-200 text-neutral-800",
  fire: "bg-orange-200 text-orange-800",
  water: "bg-blue-200 text-blue-800",
  electric: "bg-yellow-200 text-yellow-800",
  grass: "bg-green-200 text-green-800",
  ice: "bg-cyan-200 text-cyan-800",
  fighting: "bg-red-200 text-red-800",
  poison: "bg-purple-200 text-purple-800",
  ground: "bg-amber-200 text-amber-800",
  flying: "bg-sky-200 text-sky-800",
  psychic: "bg-pink-200 text-pink-800",
  bug: "bg-lime-200 text-lime-800",
  rock: "bg-stone-300 text-stone-900",
  ghost: "bg-violet-200 text-violet-800",
  dragon: "bg-indigo-200 text-indigo-800",
  dark: "bg-gray-300 text-gray-900",
  steel: "bg-slate-200 text-slate-800",
  fairy: "bg-rose-200 text-rose-800",
};

export const VERSION_NAMES: Record<string, string> = {
  red: "Red",
  blue: "Blue",
  yellow: "Yellow",
  gold: "Gold",
  silver: "Silver",
  crystal: "Crystal",
  ruby: "Ruby",
  sapphire: "Sapphire",
  emerald: "Emerald",
  "omega-ruby": "Omega Ruby",
  "alpha-sapphire": "Alpha Sapphire",
  x: "X",
  y: "Y",
  sun: "Sun",
  moon: "Moon",
  sword: "Sword",
  shield: "Shield",
  scarlet: "Scarlet",
  violet: "Violet",
};

export function getEvolutionPaths(
  node: EvolutionNode,
  path: EvolutionNode[] = []
): EvolutionNode[][] {
  const currentPath = [...path, node];

  if (node.evolves_to.length === 0) {
    return [currentPath];
  }

  return node.evolves_to.flatMap((child) =>
    getEvolutionPaths(child, currentPath)
  );
}

export async function getPokemonIdsByGeneration(gen: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
  const data = await res.json();

  return (
    data.pokemon_species
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((species: any) => Number(species.url.split("/").slice(-2)[0]))
      .sort((a: number, b: number) => a - b)
  );
}

export async function getPokemonBatch(ids: number[]) {
  const speciesData = await Promise.all(
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) =>
        r.json()
      )
    )
  );

  const pokemonData = await Promise.all(
    ids.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json())
    )
  );

  return speciesData.map((species, i) => {
    const pokemon = pokemonData[i];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nameEntry = species.names.find((n: any) => n.language.name === "en");

    const flavorEntry = species.flavor_text_entries.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => e.language.name === "en"
    );

    return {
      id: species.id,
      name: nameEntry?.name ?? species.name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      types: pokemon.types.map((t: any) => t.type.name),
      pokedexDescription: flavorEntry?.flavor_text.replace(/\n|\f/g, " ") ?? "",
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvolution(node: any): EvolutionNode {
  const id = Number(node.species.url.split("/").slice(-2)[0]);

  const details = node.evolution_details?.[0];

  return {
    id,
    name: node.species.name,
    level: details?.min_level ?? undefined,
    item: details?.item?.name ?? undefined,
    trigger: details?.trigger?.name ?? undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evolves_to: node.evolves_to.map((child: any) => parseEvolution(child)),
  };
}

export async function getPokemonDetails(id: number) {
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) =>
      r.json()
    ),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nameEntry = species.names.find((n: any) => n.language.name === "en");
  const evoRes = await fetch(species.evolution_chain.url).then((r) => r.json());

  const pokedexByGeneration: Record<string, string[]> = {};
  const evolution = parseEvolution(evoRes.chain);

  species.flavor_text_entries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((e: any) => e.language.name === "en")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .forEach((entry: any) => {
      const gen = entry.version?.name ?? "unknown";
      const text = entry.flavor_text.replace(/\n|\f/g, " ");

      if (!pokedexByGeneration[gen]) {
        pokedexByGeneration[gen] = [];
      }

      if (!pokedexByGeneration[gen].includes(text)) {
        pokedexByGeneration[gen].push(text);
      }
    });

  /**
   * Detect sprite variants
   */
  const variants: string[] = [];

  const versions = pokemon.sprites.versions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(versions).forEach(([gen, games]: any) => {
    const hasSprite = Object.values(games).some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (g: any) => g?.front_default || g?.front_shiny
    );

    if (hasSprite) variants.push(gen);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genusEntry = species.genera.find((g: any) => g.language.name === "en");
  const genderRate = species.gender_rate;
  const captureRate = species.capture_rate;
  const baseHappiness = species.base_happiness;
  const growthRate = species.growth_rate.name;

  return {
    id: pokemon.id,
    name: nameEntry?.name ?? pokemon.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    types: pokemon.types.map((t: any) => t.type.name),
    pokedexByGeneration,
    sprites: pokemon.sprites,
    variants,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stats: pokemon.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    height: pokemon.height,
    weight: pokemon.weight,
    cry: pokemon.cries.latest,
    evolution,
    species: genusEntry?.genus ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abilities: pokemon.abilities.map((a: any) => ({
      name: a.ability.name.replace("-", " "),
      hidden: a.is_hidden,
    })),
    genderRate,
    captureRate,
    baseHappiness,
    growthRate,
  };
}

export async function getRegions() {
  const regionRes = await fetch("https://pokeapi.co/api/v2/region");
  const regionData = await regionRes.json();

  const regionToDex: Record<string, string> = {
    kanto: "kanto",
    johto: "original-johto",
    hoenn: "hoenn",
    sinnoh: "original-sinnoh",
    unova: "original-unova",
    kalos: "kalos-central",
    alola: "alola",
    galar: "galar",
    paldea: "paldea",
  };

  const regions = regionData.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r: any) => r.name)
    .filter((name: string) => regionToDex[name]);

  const dexIndexRes = await fetch(
    "https://pokeapi.co/api/v2/pokedex?limit=100"
  );

  const dexIndex = await dexIndexRes.json();

  const dexMap = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dexIndex.results.map((d: any) => [d.name, d.url])
  );

  const regionResults = await Promise.all(
    regions.map(async (region: string) => {
      const dexSlug = regionToDex[region];
      const dexUrl = dexMap[dexSlug];

      if (!dexUrl) return null;

      try {
        const data = await fetch(dexUrl).then((r) => r.json());

        const pokemonList = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.pokemon_entries.slice(0, 3).map(async (p: any) => {
            const speciesRes = await fetch(p.pokemon_species.url);
            const speciesData = await speciesRes.json();

            const englishName =
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              speciesData.names.find((n: any) => n.language.name === "en")
                ?.name ?? p.pokemon_species.name;

            return {
              id: p.entry_number,
              name: englishName,
            };
          })
        );

        return {
          name: region,
          pokemon: pokemonList,
        };
      } catch {
        return null;
      }
    })
  );

  return regionResults.filter(Boolean);
}

export const regionToGen: Record<string, number> = {
  kanto: 1,
  johto: 2,
  hoenn: 3,
  sinnoh: 4,
  unova: 5,
  kalos: 6,
  alola: 7,
  galar: 8,
  paldea: 9,
};

export const getPokemonImage = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

export const getPokemonShinyImage = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;

export async function getPokemonDescription(id: number) {
  if (descriptionCache[id]) return descriptionCache[id];

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const data = await res.json();

  const entry = data.flavor_text_entries.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => e.language.name === "en"
  );

  const text = entry?.flavor_text.replace(/\f|\n/g, " ") ?? "";

  descriptionCache[id] = text;

  return text;
}

export const pokedexId = (id: number): string => id.toString().padStart(3, "0");
