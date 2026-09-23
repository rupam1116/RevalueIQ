"use client";

import React, { useState, useEffect, useRef } from "react";
import { RepairCenterItem } from "@/types/repairCenter";
import { getRepairCenterRoute, DrivingRouteResult } from "@/lib/repairCenterApi";
import {
  MapPin,
  Navigation,
  Star,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ExternalLink,
  Car,
  Clock,
  Compass,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeafletOsmMapProps {
  centers: RepairCenterItem[];
  selectedCenter: RepairCenterItem | null;
  onSelectCenter: (center: RepairCenterItem) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const LeafletOsmMap: React.FC<LeafletOsmMapProps> = ({
  centers,
  selectedCenter,
  onSelectCenter,
  userCoords,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [activeRoute, setActiveRoute] = useState<DrivingRouteResult | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  // 1. Dynamically Load Leaflet CSS & JS SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    const cssId = "leaflet-css-bundle";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const scriptId = "leaflet-js-bundle";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        setIsLeafletReady(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLeafletReady(true);
    }
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!isLeafletReady || !window.L || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userCoords?.latitude || centers[0]?.latitude || 17.3850;
    const initialLng = userCoords?.longitude || centers[0]?.longitude || 78.4867;

    try {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
      });

      // Add OpenStreetMap Standard / Carto Voyager Tile Layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } catch (err) {
      console.warn("Leaflet map initialization notice:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // 3. Render User Location & Center Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !markersGroupRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    markersGroup.clearLayers();

    // User Location Marker
    if (userCoords && userCoords.latitude && userCoords.longitude) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; background: #0284c7; opacity: 0.3; border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #0284c7; border: 3px solid #ffffff; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      userMarkerRef.current = L.marker([userCoords.latitude, userCoords.longitude], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
      userMarkerRef.current.bindTooltip("Your Location", { permanent: false, direction: "top" });
    }

    const bounds = L.latLngBounds([]);
    let hasPoints = false;

    if (userCoords && userCoords.latitude && userCoords.longitude) {
      bounds.extend([userCoords.latitude, userCoords.longitude]);
      hasPoints = true;
    }

    centers.forEach((center) => {
      if (!center.latitude || !center.longitude) return;

      const pos: [number, number] = [center.latitude, center.longitude];
      bounds.extend(pos);
      hasPoints = true;

      const isSelected = selectedCenter?.id === center.id;
      const markerColor = center.is_authorized ? "#0891b2" : "#059669";

      const shopIcon = L.divIcon({
        className: "custom-shop-marker",
        html: `
          <div style="
            background: ${markerColor};
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 12px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
            transition: transform 0.2s ease;
            white-space: nowrap;
          ">
            <span>${center.logo || "🔧"}</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${center.name}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16],
      });

      const marker = L.marker(pos, { icon: shopIcon });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; max-width: 240px; color: #0f172a;">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">${center.name}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${center.address}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 700;">
            <span style="color: #d97706;">★ ${center.rating} (${center.review_count})</span>
            ${center.distance_km !== null && center.distance_km !== undefined ? `<span style="color: #059669;">${center.distance_km} km away</span>` : ""}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        onSelectCenter(center);
      });

      marker.addTo(markersGroup);
    });

    if (hasPoints && centers.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [centers, userCoords, isLeafletReady, selectedCenter, onSelectCenter]);

  // 4. Calculate & Render OSRM Driving Route
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    if (!userCoords || !selectedCenter || !selectedCenter.latitude || !selectedCenter.longitude) {
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      setActiveRoute(null);
      return;
    }

    const L = window.L;
    const map = mapInstanceRef.current;

    let isMounted = true;
    setIsLoadingRoute(true);

    getRepairCenterRoute(
      userCoords.latitude,
      userCoords.longitude,
      selectedCenter.latitude,
      selectedCenter.longitude
    )
      .then((res) => {
        if (!isMounted) return;
        setActiveRoute(res);

        if (routeLayerRef.current) {
          routeLayerRef.current.remove();
        }

        if (res.geometry) {
          routeLayerRef.current = L.geoJSON(res.geometry, {
            style: {
              color: "#059669",
              weight: 4,
              opacity: 0.85,
              dashArray: "2, 6",
            },
          }).addTo(map);
        }
      })
      .catch((err) => {
        console.warn("OSRM route fetch notice:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCenter, userCoords]);

  const activeCenter = selectedCenter || centers[0];
  const directionsUrl = activeCenter
    ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userCoords?.latitude || ""}%2C${userCoords?.longitude || ""}%3B${activeCenter.latitude}%2C${activeCenter.longitude}`
    : "#";

  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-4 shadow-sm space-y-3">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive OpenStreetMap Service Canvas</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Free Open Source Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> OEM Authorized
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Verified Partner
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-xl border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 text-xs font-bold h-8 px-3 cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Maximize2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
            <span>{isExpanded ? "Collapse Map" : "Expand Map"}</span>
          </Button>
        </div>
      </div>

      {/* Map Container Viewport */}
      <div
        className={`relative w-full rounded-2xl bg-[#f0fdf4] dark:bg-[#061e14] border border-emerald-100 dark:border-emerald-900/40 overflow-hidden transition-all duration-300 ${
          isExpanded ? "h-[480px]" : "h-[340px]"
        }`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Active OSRM Route Badge */}
        {activeRoute && (
          <div className="absolute top-3 left-3 z-20 bg-slate-950/85 text-emerald-300 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs font-bold border border-emerald-800/60 shadow-lg flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {activeRoute.distance_km} km • ~{activeRoute.duration_minutes} mins via OSRM
            </span>
          </div>
        )}

        {/* Selected Marker Preview Bottom Floating Card */}
        {activeCenter && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-lg shrink-0">
                  {activeCenter.logo || "🏢"}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">{activeCenter.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {activeCenter.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {activeCenter.rating} ({activeCenter.review_count})
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {activeCenter.is_authorized ? "OEM Authorized" : "OSM Verified"}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 flex items-center justify-center gap-1.5 text-center shadow-xs"
              >
                <Navigation className="w-3 h-3" />
                <span>OSM Route</span>
              </a>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectCenter(activeCenter)}
                className="rounded-xl border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-800 dark:text-slate-200 font-bold text-xs h-8 px-3 cursor-pointer"
              >
                Details
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Discrete OpenStreetMap Disclaimer Footer */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 px-1">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Repair center information is sourced from OpenStreetMap and may vary by location.</span>
      </div>
    </div>
  );
};
