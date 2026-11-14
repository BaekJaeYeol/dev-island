import type { Place } from "./places.mjs";

// Small original vector signs keep the 2D view useful without downloading 3D assets.
export function PlaceIcon({ place }: { place: Place }) {
  const tower = place.id === "contact";
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden="true"
      className="place-icon"
    >
      <ellipse cx="60" cy="84" rx="45" ry="10" fill="#294d49" opacity=".08" />
      <path d="M13 76 59 56 107 76 61 96Z" fill="#b9d9b7" />
      {tower ? (
        <>
          <path d="M44 78 47 29 67 20 73 67 58 85Z" fill={place.color} />
          <path d="M58 85 57 32 67 20 73 67Z" fill="#e5b782" />
          <path d="M44 29 58 13 75 23 61 38Z" fill="#668d89" />
          <path d="M50 42 62 37 63 48 50 54Z" fill="#fff2b0" />
          <path d="M52 62 61 58 62 80 52 84Z" fill="#55777b" />
        </>
      ) : (
        <>
          <path d="M29 47 61 34 91 49 61 64Z" fill="#fff7e5" />
          <path d="M29 47 61 63 61 85 29 69Z" fill={place.color} />
          <path d="M61 63 91 49 91 71 61 85Z" fill={place.color} />
          <path d="M61 63 91 49 91 71 61 85Z" fill="#284452" opacity=".1" />
          <path
            d="M23 46 52 21 69 31 61 66Z"
            fill={place.id === "projects" ? "#719dbb" : "#bc92a9"}
          />
          <path
            d="M52 21 96 46 61 66 69 31Z"
            fill={place.id === "projects" ? "#92b8d0" : "#d6afbf"}
          />
          <path d="M39 58 49 63 49 79 39 74Z" fill="#5e7b7e" />
          <path d="M70 64 80 59 80 67 70 72Z" fill="#fff4c5" />
        </>
      )}
      <path d="M20 75V59M20 50V58" stroke="#98785d" strokeWidth="4" />
      <path d="M8 57 20 34 32 57Z" fill="#7cad91" />
    </svg>
  );
}
