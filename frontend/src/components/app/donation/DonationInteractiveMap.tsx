"use client";

import React, { useState, useEffect, useRef } from "react";
import { DonationOrganization, DonationRouteResult, fetchDonationRoute } from "@/lib/donationOrganizationApi";
import {
  MapPin,
  Navigation,
  Maximize2,
  Minimize2,
  ExternalLink,
  Compass,
  Car,
  Clock,
  Layers,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationInteractiveMapProps {
  organizations: DonationOrganization[];
  selectedOrg: DonationOrganization | null;
  onSelectOrg: (org: DonationOrganization) => void;
  userCoords?: { latitude: number; longitude: number } | null;
  activeRoute?: DonationRouteResult | null;
  onClearRoute?: () => void;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const DonationInteractiveMap: React.FC<DonationInteractiveMapProps> = ({
  organizations,
  selectedOrg,
  onSelectOrg,
  userCoords,
  activeRoute,
  onClearRoute,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

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

    const initialLat = userCoords?.latitude || selectedOrg?.latitude || organizations[0]?.latitude || 17.3850;
    const initialLng = userCoords?.longitude || selectedOrg?.longitude || organizations[0]?.longitude || 78.4867;

    try {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
      });

      // Standard OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersGroupRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;
    } catch (err) {
      console.warn("Leaflet initialization note:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // 3. Render Organization Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !window.L) return;

    const L = window.L;
    markersGroupRef.current.clearLayers();

    organizations.forEach((org) => {
      const isSelected = selectedOrg?.id === org.id;

      // Custom SVG Marker Icon
      const markerHtml = `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${isSelected ? "#059669" : "#10b981"};
          border: 3px solid ${isSelected ? "#ffffff" : "#ffffff"};
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transform: ${isSelected ? "scale(1.2)" : "scale(1.0)"};
          transition: transform 0.2s ease;
        ">
          🎁
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([org.latitude, org.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">
            ${org.category}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 2px 0;">
            ${org.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${org.address}
          </div>
          ${
            org.donation_acceptance_confirmed
              ? '<span style="font-size: 10px; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Confirmed Drop-Off</span>'
              : '<span style="font-size: 10px; background: #fffbeb; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Acceptance Unconfirmed</span>'
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onSelectOrg(org);
      });

      markersGroupRef.current.addLayer(marker);
    });

    // Fit bounds if multiple organizations exist and no active route
    if (organizations.length > 0 && !activeRoute && markersGroupRef.current.getLayers().length > 0) {
      try {
        const bounds = markersGroupRef.current.getBounds();
        if (bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      } catch (e) {
        // Safe ignore
      }
    }
  }, [organizations, selectedOrg, activeRoute, onSelectOrg]);

  // 4. Center map when Selected Organization changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedOrg) return;
    mapInstanceRef.current.setView([selectedOrg.latitude, selectedOrg.longitude], 14, {
      animate: true,
      duration: 0.8,
    });
  }, [selectedOrg]);

  // 5. Render User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userCoords?.latitude && userCoords?.longitude) {
      const userHtml = `
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid #ffffff;
          box-shadow: 0 0 10px rgba(37,99,235,0.6);
        "></div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: "user-gps-marker",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const userMarker = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon });
      userMarker.bindPopup("<strong>Your Location</strong>");
      userMarker.addTo(mapInstanceRef.current);
      userMarkerRef.current = userMarker;
    }
  }, [userCoords]);

  // 6. Render Active Driving Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (activeRoute?.geometry?.coordinates) {
      // GeoJSON coordinates are [lon, lat], Leaflet polyline expects [lat, lon]
      const latLngs = activeRoute.geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]);

      const polyline = L.polyline(latLngs, {
        color: "#059669",
        weight: 6,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;

      try {
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      } catch (e) {
        // Safe ignore
      }
    }
  }, [activeRoute]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const lat = selectedOrg?.latitude || userCoords?.latitude || organizations[0]?.latitude || 17.3850;
    const lng = selectedOrg?.longitude || userCoords?.longitude || organizations[0]?.longitude || 78.4867;
    mapInstanceRef.current.setView([lat, lng], 13, { animate: true });
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-emerald-200 dark:border-emerald-900/60 shadow-md transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 h-auto" : "h-[440px] w-full"
      }`}
    >
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 dark:bg-slate-900 z-0" />

      {/* Floating Map Controls Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-xl shadow-md bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-white border border-slate-200 dark:border-slate-800"
          title={isExpanded ? "Collapse Map" : "Expand Map"}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleRecenter}
          className="rounded-xl shadow-md bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-white border border-slate-200 dark:border-slate-800"
          title="Recenter Map"
        >
          <Compass className="w-4 h-4 text-emerald-600" />
        </Button>
      </div>

      {/* Floating Bottom Left Active Route Pill */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 p-3 rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 shadow-xl flex items-center justify-between gap-4 pointer-events-auto max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-slate-900 dark:text-white">
                Live Driving Route: {activeRoute.distance_km} km
              </p>
              <p className="text-slate-500 flex items-center gap-1 font-semibold text-[11px]">
                <Clock className="w-3 h-3 text-emerald-600" />
                Est. {activeRoute.duration_minutes} mins {activeRoute.summary ? `• ${activeRoute.summary}` : ""}
              </p>
            </div>
          </div>

          {onClearRoute && (
            <button
              onClick={onClearRoute}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-2 py-1 shrink-0"
            >
              Clear Route
            </button>
          )}
        </div>
      )}

      {/* Map Provider Notice Bottom Right */}
      <div className="absolute bottom-1 right-2 z-10 pointer-events-none text-[9px] font-bold text-slate-400 bg-white/80 dark:bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
        🗺️ OpenStreetMap + OSRM Live Navigation
      </div>
    </div>
  );
};
