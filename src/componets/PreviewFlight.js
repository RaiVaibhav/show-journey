import { useEffect, useRef } from "react";
import {
  along,
  point as turfPoint,
  bearing,
  lineDistance as turfDistance,
} from "@turf/turf";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";

export default function PreviewFlight({ origin, destination }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLayer = {
    id: "route",
    source: "route",
    type: "line",
    paint: {
      "line-width": 2,
      "line-color": "#007cbf",
    },
  };
  const pointLayer = {
    id: "point",
    source: "point",
    type: "symbol",
    layout: {
      "icon-image": "airport-15",
      "icon-size": 1,
      "icon-rotate": ["get", "bearing"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  };
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: origin,
      zoom: 4,
      projection: "mercator",
      style: "mapbox://styles/mapbox/navigation-day-v1",
      accessToken:
      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
    });
  });

  useEffect(() => {
    if (!map.current) return;
    const route = {
      type: "FeatureCollection",
      features: destination.map((i) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [origin, i],
        },
      })),
    };
    const point = {
      type: "FeatureCollection",
      features: destination.map((i) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: origin,
        },
      })),
    };
    const steps = 1000;
    for (let z = 0; z < destination.length; z++) {
      const lineDistance = turfDistance(route.features[z], "kilometers");
      let arc = [];
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = along(route.features[z], i, "kilometers");
        arc.push(segment.geometry.coordinates);
      }

      route.features[z].geometry.coordinates = arc;
    }
    function animate(featureIdx, cntr) {
      if (cntr >= route.features[featureIdx].geometry.coordinates.length - 1) {
        return;
      }
      point.features[featureIdx].geometry.coordinates =
        route.features[featureIdx].geometry.coordinates[cntr];

      point.features[featureIdx].properties.bearing = bearing(
        turfPoint(
          route.features[featureIdx].geometry.coordinates[
            cntr >= steps ? cntr - 1 : cntr
          ]
        ),
        turfPoint(
          route.features[featureIdx].geometry.coordinates[
            cntr >= steps ? cntr : cntr + 1
          ]
        )
      );

      map.current.getSource("point").setData(point);

      if (cntr < steps) {
        requestAnimationFrame(function () {
          animate(featureIdx, cntr + 1);
        });
      }
    }

    map.current.on("load", () => {
      map.current.addSource("route", {
        type: "geojson",
        data: route,
      });

      map.current.addSource("point", {
        type: "geojson",
        data: point,
      });

      map.current.addLayer(routeLayer);

      map.current.addLayer(pointLayer);

      for (let j = 0; j < destination.length; j++) {
        animate(j, 0);
      }
    });
    const routeSource = map.current.getSource("route");
    const pointSource = map.current.getSource("point");
    if (routeSource && pointSource) {
      routeSource.setData({
        ...route,
      });
      pointSource.setData({
        ...point,
      });
      for (let j = 0; j < destination.length; j++) {
        animate(j, 0);
      }
    }
  });
  return <div className="h-full" ref={mapContainer}></div>;
}
