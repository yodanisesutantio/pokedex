"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Brain,
  Database,
  Gamepad,
  InboxIcon,
  Map,
  Moon,
  OctagonAlert,
  Search,
  Sun,
} from "lucide-react";
// import ProfileAvatar from "./profile-avatar";
import { getRegions } from "@/lib/helper";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export interface NavbarProps {
  className?: string;
  withRegion?: boolean;
  activeRegion?: string;
  setActiveRegion?: (region?: string) => void;
}

export interface Region {
  name: string;
  pokemon: {
    id: number;
    name: string;
  }[];
}

export default function Navbar(props: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [pokemonCache, setPokemonCache] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    async function loadRegions() {
      const data = await getRegions();
      setRegions(data);
    }

    loadRegions();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  useEffect(() => {
    async function preloadPokemon() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");

      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list = data.results.map((p: any) => ({
        id: p.url.split("/").slice(-2, -1)[0],
        name: p.name.toLowerCase(),
      }));

      setPokemonCache(list);
    }

    preloadPokemon();
  }, []);

  return (
    <div
      className={`sticky z-8 bg-muted ${isScrolled ? "shadow-lg" : ""} top-0 flex gap-2 justify-between p-6 scrollbar-hide ${props.className}`}
    >
      <Link href={`/`}>
        <h3 className="font-bold text-xl">Pokédex</h3>
      </Link>
      {props.withRegion && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {regions.map((region) => (
            <Button
              key={region.name}
              variant={
                props.activeRegion === region.name ? "default" : "outline"
              }
              onClick={() => props.setActiveRegion?.(region.name)}
              className="capitalize shrink-0 border border-foreground cursor-pointer"
            >
              {region.name}
            </Button>
          ))}
        </div>
      )}
      {!props.withRegion && (
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border border-foreground bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer">
                Pokémon Data
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-96">
                  <ListItem href="/pokedex" title="Pokédex">
                    List of all Pokémon
                  </ListItem>
                  <ListItem href="#" title="Pokémon Types">
                    Get to know the strength or weaknesses of each Pokémon Types
                  </ListItem>
                  <ListItem href="#" title="Pokémon Regions">
                    Each region introduces new Pokémon, local forms, characters,
                    gyms or trials, unique mechanics, and its own story.
                  </ListItem>
                  <ListItem href="#" title="Pokémon Games">
                    Explore the various mainline Pokémon games and their
                    features
                  </ListItem>
                  <ListItem href="#" title="Pokémon Abilities">
                    Learn about the unique abilities of each Pokémon
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} border border-foreground bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50`}
              >
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">
                      About Devs
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 h-fit">
                    <Empty className="!p-2">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <OctagonAlert />
                        </EmptyMedia>
                        <EmptyTitle>Hi there!</EmptyTitle>
                        <EmptyDescription>
                          You are about to be redirected to{" "}
                          <Link
                            href="https://yodanis-portfolio.vercel.app/about"
                            passHref
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant={`link`} className="cursor-pointer">
                              https://yodanis-portfolio.vercel.app/about
                            </Button>
                          </Link>
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent className="flex-row justify-center gap-2">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setPopoverOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Link
                          href={`https://yodanis-portfolio.vercel.app/about`}
                          passHref
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="cursor-pointer">Proceed</Button>
                        </Link>
                      </EmptyContent>
                    </Empty>
                  </PopoverContent>
                </Popover>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      <div className="flex flex-row gap-2">
        <Button
          variant={`ghost`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="cursor-pointer"
        >
          <Search size={24} />
        </Button>
        <Button
          variant={`ghost`}
          onClick={(e) => {
            e.stopPropagation();
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="cursor-pointer"
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </Button>
        {/* <ProfileAvatar /> */}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Try 'Pikachu' or anything you want to look for..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Menu">
              <Link href={`/pokedex`} onClick={() => setOpen(false)}>
                <CommandItem className="cursor-pointer">
                  <Database />
                  <span>Pokédex</span>
                </CommandItem>
              </Link>
              <Link href={`/#`} onClick={() => setOpen(false)}>
                <CommandItem className="cursor-pointer">
                  <InboxIcon />
                  <span>Pokémon Types</span>
                </CommandItem>
              </Link>
              <Link href={`/#`} onClick={() => setOpen(false)}>
                <CommandItem className="cursor-pointer">
                  <Map />
                  <span>Pokémon Regions</span>
                </CommandItem>
              </Link>
              <Link href={`/#`} onClick={() => setOpen(false)}>
                <CommandItem className="cursor-pointer">
                  <Gamepad />
                  <span>Pokémon Games</span>
                </CommandItem>
              </Link>
              <Link href={`/#`} onClick={() => setOpen(false)}>
                <CommandItem className="cursor-pointer">
                  <Brain />
                  <span>Pokémon Abilities</span>
                </CommandItem>
              </Link>
            </CommandGroup>
            <CommandSeparator />
            {!search &&
              regions.map((region) => (
                <CommandGroup
                  key={region.name}
                  heading={`${region.name.charAt(0).toUpperCase() + region.name.slice(1)} Region`}
                >
                  {(region.pokemon ?? []).slice(0, 3).map((p) => (
                    <Link
                      href={`/pokemon?q=${p.id}`}
                      key={p.id}
                      onClick={() => setOpen(false)}
                    >
                      <CommandItem value={p.name} className="cursor-pointer">
                        <span className="capitalize">{p.name}</span>
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              ))}
            {search && (
              <CommandGroup heading="Search Results">
                {pokemonCache
                  .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((p) => (
                    <Link
                      href={`/pokemon?q=${p.id}`}
                      key={p.id}
                      onClick={() => setOpen(false)}
                    >
                      <CommandItem
                        key={p.id}
                        value={p.name}
                        className="cursor-pointer"
                      >
                        <span className="capitalize">{p.name}</span>
                      </CommandItem>
                    </Link>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
