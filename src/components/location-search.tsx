"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";
import { GeocodingError, searchCities } from "@/services/geocoding";
import type { LocationSearchProps, SelectedLocation } from "@/types/location";

export function LocationSearch({
  onSelect,
  placeholder = "Search for a city...",
  className,
  inputClassName,
  disabled = false,
  autoFocus = false,
  id,
}: LocationSearchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SelectedLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setErrorMessage(null);
      setActiveIndex(-1);
      setIsOpen(trimmedQuery.length > 0);
      return;
    }

    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsOpen(true);

      try {
        const results = await searchCities(trimmedQuery, {
          signal: controller.signal,
          limit: 6,
        });

        setSuggestions(results);
        setActiveIndex(results.length > 0 ? 0 : -1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSuggestions([]);
        setActiveIndex(-1);
        setErrorMessage(
          error instanceof GeocodingError
            ? error.message
            : "Something went wrong while searching for locations."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void runSearch();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleSelect(location: SelectedLocation) {
    setQuery(`${location.name}, ${location.country}`);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    setErrorMessage(null);
    onSelect(location);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      if (suggestions.length > 0 || errorMessage || query.trim().length >= 2) {
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        if (!isOpen || suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        setActiveIndex((current) =>
          current < suggestions.length - 1 ? current + 1 : 0
        );
        break;
      }
      case "ArrowUp": {
        if (!isOpen || suggestions.length === 0) {
          return;
        }
        event.preventDefault();
        setActiveIndex((current) =>
          current > 0 ? current - 1 : suggestions.length - 1
        );
        break;
      }
      case "Enter": {
        if (!isOpen || activeIndex < 0 || !suggestions[activeIndex]) {
          return;
        }
        event.preventDefault();
        handleSelect(suggestions[activeIndex]);
        break;
      }
      case "Escape": {
        if (!isOpen) {
          return;
        }
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      }
      default:
        break;
    }
  }

  const showDropdown = isOpen && query.trim().length > 0;
  const showEmpty =
    showDropdown &&
    !isLoading &&
    !errorMessage &&
    debouncedQuery.trim().length >= 2 &&
    suggestions.length === 0;
  const showHint =
    showDropdown &&
    !isLoading &&
    !errorMessage &&
    query.trim().length > 0 &&
    query.trim().length < 2;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <label htmlFor={inputId} className="sr-only">
        Search location
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-11 w-full rounded-xl border border-border/80 bg-background/90 pr-10 pl-10 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-background/60",
            inputClassName
          )}
        />
        {isLoading ? (
          <Loader2
            className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-label="Searching locations"
          />
        ) : null}
      </div>

      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border/80 bg-card/95 p-1 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-card/95"
        >
          {isLoading && suggestions.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Searching cities...
            </div>
          ) : null}

          {errorMessage ? (
            <div
              role="alert"
              className="px-3 py-3 text-sm text-destructive"
            >
              {errorMessage}
            </div>
          ) : null}

          {showHint ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Type at least 2 characters to search.
            </div>
          ) : null}

          {showEmpty ? (
            <div className="flex flex-col items-start gap-1 px-3 py-4">
              <p className="text-sm font-medium text-foreground">
                No locations found
              </p>
              <p className="text-sm text-muted-foreground">
                Try a different city name.
              </p>
            </div>
          ) : null}

          {suggestions.map((location, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${location.name}-${location.latitude}-${location.longitude}-${index}`}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted/70"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(location)}
              >
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {location.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {location.country}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
