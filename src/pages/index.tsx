import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("src/pages/MapComponent.tsx"), {
  ssr: false,
});

const isWindowContext = typeof window !== "undefined";

export default function Home() {
  return (
    <main className="flex flex-row min-h-screen p-4">
      <div className="flex flex-col w-[20%] p-2">
        <div className="font-semibold">Select Bus Routes</div>
      </div>
      <div className=" w-[80%] p-2">{isWindowContext && <MapComponent />}</div>
    </main>
  );
}
