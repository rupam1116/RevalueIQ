"use client";

import React, { useState, useEffect, useRef } from "react";
import { RepairCenterItem } from "@/types/repairCenter";
import { LeafletOsmMap } from "./LeafletOsmMap";
import {
  MapPin,
  Navigation,
  Star,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveGoogleMapProps {
  centers: RepairCenterItem[];
  selectedCenter: RepairCenterItem | null;
  onSelectCenter: (center: RepairCenterItem) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  centers,
  selectedCenter,
  onSelectCenter,
  userCoords,
}) => {
  const provider = (process.env.NEXT_PUBLIC_REPAIR_MAP_PROVIDER || "osm").toLowerCase();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // If provider is OSM or Google API key is absent, use the 100% free OpenStreetMap Leaflet implementation
  if (provider === "osm" || !apiKey) {
    return (
      <LeafletOsmMap
        centers={centers}
        selectedCenter={selectedCenter}
        onSelectCenter={onSelectCenter}
        userCoords={userCoords}
      />
    );
  }

  // Google Maps Platform Canvas implementation (Preserved for production switch)
  return (
    <GoogleMapsCanvas
      centers={centers}
      selectedCenter={selectedCenter}
      onSelectCenter={onSelectCenter}
      userCoords={userCoords}
      apiKey={apiKey}
    />
  );
};

const GoogleMapsCanvas: React.FC<InteractiveGoogleMapProps & { apiKey: string }> = ({
  centers,
  selectedCenter,
  onSelectCenter,
  userCoords,
  apiKey,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  // Dynamic Script Loader for Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey) return;
    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      return;
    }

    const scriptId = "google-maps-js-sdk";
    if (document.getElementById(scriptId)) return;

    window.initGoogleMapsCallback = () => {
      setIsMapLoaded(true);
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window.initGoogleMapsCallback;
    };
  }, [apiKey]);

  // Initialize Real Google Map instance
  useEffect(() => {
    if (!isMapLoaded || !window.google || !mapContainerRef.current) return;

    const initialLat = userCoords?.latitude || centers[0]?.latitude || 17.3850;
    const initialLng = userCoords?.longitude || centers[0]?.longitude || 78.4867;

    const mapOptions = {
      center: { lat: initialLat, lng: initialLng },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    };

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map;
      infoWindowRef.current = new window.google.maps.InfoWindow();
    } catch (err) {
      console.warn("Could not create Google Maps instance:", err);
    }
  }, [isMapLoaded]);

  // Render User Location & Center Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (userCoords && userCoords.latitude && userCoords.longitude) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({
          position: { lat: userCoords.latitude, lng: userCoords.longitude },
          map,
          title: "Your Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#0284c7",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 999,
        });
      } else {
        userMarkerRef.current.setPosition({ lat: userCoords.latitude, lng: userCoords.longitude });
        userMarkerRef.current.setMap(map);
      }
    }

    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;

    if (userCoords && userCoords.latitude && userCoords.longitude) {
      bounds.extend(new window.google.maps.LatLng(userCoords.latitude, userCoords.longitude));
      hasPoints = true;
    }

    centers.forEach((center) => {
      if (!center.latitude || !center.longitude) return;

      const pos = { lat: center.latitude, lng: center.longitude };
      bounds.extend(new window.google.maps.LatLng(pos.lat, pos.lng));
      hasPoints = true;

      const markerColor = center.is_authorized ? "#0891b2" : "#059669";

      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        title: center.name,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 1.5,
          scale: 1.6,
          anchor: new window.google.maps.Point(12, 22),
        },
      });

      marker.addListener("click", () => {
        onSelectCenter(center);
        const contentString = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 240px; color: #0f172a;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">${center.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${center.address}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 700;">
              <span style="color: #d97706;">★ ${center.rating} (${center.review_count})</span>
              ${center.distance_km !== null && center.distance_km !== undefined ? `<span style="color: #059669;">${center.distance_km} km away</span>` : ""}
            </div>
          </div>
        `;
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });

    if (hasPoints && centers.length > 0) {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [centers, userCoords, isMapLoaded, onSelectCenter]);

  // Pan to selected center
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCenter || !selectedCenter.latitude || !selectedCenter.longitude) return;
    mapInstanceRef.current.panTo({
      lat: selectedCenter.latitude,
      lng: selectedCenter.longitude,
    });
    mapInstanceRef.current.setZoom(14);
  }, [selectedCenter]);

  const activeCenter = selectedCenter || centers[0];
  const directionsUrl = activeCenter
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeCenter.latitude},${activeCenter.longitude}&destination_place_id=${activeCenter.google_place_id || activeCenter.provider_place_id || ""}`
    : "#";

  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Real-World Google Maps Network</span>
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

      <div
        className={`relative w-full rounded-2xl bg-[#f0fdf4] dark:bg-[#061e14] border border-emerald-100 dark:border-emerald-900/40 overflow-hidden transition-all duration-300 ${
          isExpanded ? "h-[480px]" : "h-[340px]"
        }`}
      >
        <div ref={mapContainerRef} className="w-full h-full" />

        {activeCenter && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-2xl shadow-xl space-y-2">
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

            <div className="flex items-center gap-2 pt-1">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-8 flex items-center justify-center gap-1.5 text-center shadow-xs"
              >
                <Navigation className="w-3 h-3" />
                <span>Directions</span>
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
    </div>
  );
};
