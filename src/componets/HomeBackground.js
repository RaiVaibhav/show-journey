import WorldMap from "./molumen_world_map_1.png";
export default function HomeBackground({ children }) {
  return (
    <div
      className="h-screen flex items-center flex-row justify-between flex-wrap w-full m-auto md:m-0 bg-center bg-no-repeat bg-contain	"
      style={{ backgroundImage: `url(${WorldMap})` }}
    >
      {children}
    </div>
  );
}
