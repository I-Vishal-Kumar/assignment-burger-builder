import {type SliceType, SLICE_COLORS } from "../types";

interface Props {
  slices: SliceType[];
  mini?: boolean;
}

const SLICE_LABELS: Record<SliceType, string> = {
  "aloo-tikki": "Aloo Tikki",
  paneer: "Paneer",
  cheese: "Cheese",
  tomato: "Tomato",
  onion: "Onion",
  lettuce: "Lettuce",
};

const SLICE_HEIGHTS: Record<SliceType, string> = {
  "aloo-tikki": "h-7",
  paneer: "h-6",
  cheese: "h-4",
  tomato: "h-5",
  onion: "h-4",
  lettuce: "h-5",
};

const SLICE_WIDTHS: Record<SliceType, string> = {
  "aloo-tikki": "w-44",
  paneer: "w-40",
  cheese: "w-48",
  tomato: "w-42",
  onion: "w-36",
  lettuce: "w-48",
};

const MINI_HEIGHTS: Record<SliceType, string> = {
  "aloo-tikki": "h-4",
  paneer: "h-3",
  cheese: "h-3",
  tomato: "h-3",
  onion: "h-3",
  lettuce: "h-3",
};

const MINI_WIDTHS: Record<SliceType, string> = {
  "aloo-tikki": "w-24",
  paneer: "w-20",
  cheese: "w-28",
  tomato: "w-24",
  onion: "w-20",
  lettuce: "w-28",
};

function BurgerVisualization({ slices, mini = false }: Props) {
  return (
    <div className={`flex flex-col items-center ${mini ? "gap-0.5" : "gap-1"}`}>
      {/* Top bun */}
      <div
        className={`${
          mini ? "w-28 h-8" : "w-52 h-14"
        } bg-amber-500 rounded-t-full rounded-b-lg shadow-md relative`}
      >
        {/* sesame dots */}
        {!mini && (
          <>
            <div className="absolute w-2 h-2 bg-yellow-200 rounded-full top-3 left-10" />
            <div className="absolute w-2 h-2 bg-yellow-200 rounded-full top-2 left-24" />
            <div className="absolute w-2 h-2 bg-yellow-200 rounded-full top-4 right-12" />
            <div className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full top-5 left-16" />
            <div className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full top-2 right-20" />
          </>
        )}
      </div>

      {slices.length === 0 && !mini && (
        <div className="py-8 text-gray-400 text-sm italic">Add some fillings!</div>
      )}

      {/* Fillings */}
      {slices.map((slice, idx) => {
        const h = mini ? MINI_HEIGHTS[slice] : SLICE_HEIGHTS[slice];
        const w = mini ? MINI_WIDTHS[slice] : SLICE_WIDTHS[slice];

        return (
          <div key={idx} className={`relative ${mini ? "w-28" : "w-52"} flex justify-center`}>
            <div
              className={`${w} ${h} ${SLICE_COLORS[slice]} rounded-lg shadow-sm ${
                slice === "cheese" ? "rounded-b-xl" : ""
              } ${slice === "lettuce" ? "rounded-lg border-2 border-green-500" : ""} ${
                slice === "onion" ? "rounded-full" : ""
              }`}
            />
            {!mini && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 whitespace-nowrap">
                {SLICE_LABELS[slice]}
              </span>
            )}
          </div>
        );
      })}

      {/* Bottom bun */}
      <div
        className={`${
          mini ? "w-28 h-5" : "w-52 h-8"
        } bg-amber-600 rounded-b-xl rounded-t-sm shadow-md`}
      />
    </div>
  );
}

export default BurgerVisualization;
