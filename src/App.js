import { ArrowSmallDownIcon } from "@heroicons/react/24/solid";
import React, { useState, Suspense } from "react";
import HomeBackground from "./componets/HomeBackground";
// import PreviewFlight from "./componets/PreviewFlight";
import SearchInput from "./componets/SearchInput";
const PreviewFlight = React.lazy(() => import("./componets/PreviewFlight"));

function App() {
  const [origin, setOrigin] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const defaultOrigin = [77.209021, 28.613939];

  const onOriginChange = (val) => {
    if(!val) {
      setDestinations([]);
    }
    setOrigin(val)
  }
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-teal-400 to-cyan-400 overflow-auto">
      <HomeBackground>
        <div className="flex text-teal-700 flex-col items-center flex-1 p-10">
          <p className="text-3xl font-semibold p-4">Visualize the flight</p>
          <SearchInput
            options={["Chennai", "Mumbai", "Bangalore"]}
            value={origin ? origin.name : ""}
            onChange={onOriginChange}
            key="asad"
            placeholder="From"
          />
          <div
            className={`flex flex-col items-center ${!origin && "invisible"}`}
          >
            <ArrowSmallDownIcon className="h-6 w-6 text-blue-500 my-2 self-center" />

            <SearchInput
              disabled={!origin}
              options={["Chennai", "Mumbai", "Bangalore"]}
              onChange={setDestinations}
              selectedOptions={destinations}
              isMultiSelect
              key="assass"
              placeholder="To"
            />
          </div>
        </div>
        <div className="h-full flex-1">
          <Suspense fallback={"Loading..."}>
            <PreviewFlight
              origin={
                origin
                  ? [origin.location.lon, origin.location.lat]
                  : defaultOrigin
              }
              destination={destinations.map((i) => [
                i.location.lon,
                i.location.lat,
              ])}
            />
          </Suspense>
        </div>
      </HomeBackground>
    </div>
  );
}

export default App;
