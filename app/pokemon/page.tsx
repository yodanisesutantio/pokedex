import { Suspense } from "react";
import PokedexDetails from "./details";

export default function PokemonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokedexDetails />
    </Suspense>
  );
}
