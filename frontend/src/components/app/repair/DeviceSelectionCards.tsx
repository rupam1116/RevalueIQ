"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Check,
  Search,
  ChevronRight,
  Layers,
  Sparkles,
  Edit3,
  PlusCircle,
  Tag,
  X,
  RotateCcw,
} from "lucide-react";
import { DeviceCategory, RepairDeviceSelection } from "@/types/repair";
import { useAuth } from "@/context/AuthContext";
import { getUserDevices, UserDeviceResponse } from "@/lib/userApi";

interface DeviceSelectionCardsProps {
  selection: RepairDeviceSelection;
  onChange: (selection: RepairDeviceSelection) => void;
}

const CATEGORIES: { id: DeviceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Smartphone", label: "Smartphones", icon: Smartphone },
  { id: "Laptop", label: "Laptops & MacBooks", icon: Laptop },
  { id: "Tablet", label: "Tablets & iPads", icon: Tablet },
  { id: "Smartwatch", label: "Smartwatches", icon: Watch },
  { id: "Audio/Gaming", label: "Audio & Gaming", icon: Headphones },
];

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  Smartphone: [
    "Apple",
    "Samsung",
    "Google Pixel",
    "OnePlus",
    "Xiaomi / Redmi",
    "Vivo",
    "Oppo",
    "Realme",
    "Motorola",
    "Nothing",
    "POCO",
    "Other Brand",
  ],
  Laptop: [
    "Apple",
    "Dell",
    "HP",
    "Lenovo",
    "ASUS",
    "Acer",
    "MSI",
    "Microsoft Surface",
    "Razer",
    "LG",
    "Other Brand",
  ],
  Tablet: [
    "Apple",
    "Samsung",
    "Lenovo",
    "Xiaomi",
    "OnePlus",
    "Amazon Fire",
    "Microsoft Surface",
    "Other Brand",
  ],
  Smartwatch: [
    "Apple",
    "Samsung",
    "Garmin",
    "Fitbit",
    "Google Pixel",
    "OnePlus",
    "Noise",
    "boAt",
    "Amazfit",
    "Other Brand",
  ],
  "Audio/Gaming": [
    "Sony",
    "Bose",
    "Apple",
    "Sennheiser",
    "JBL",
    "Marshall",
    "Nintendo",
    "PlayStation",
    "Xbox",
    "ASUS ROG",
    "Steam / Valve",
    "Other Brand",
  ],
};

const POPULAR_MODELS: Record<string, string[]> = {
  // Smartphones
  "Apple-Smartphone": [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 15 Pro Max",
    "iPhone 15",
    "iPhone 14 Pro",
    "iPhone 13",
    "iPhone 12",
    "iPhone 11",
    "iPhone SE (3rd Gen)",
  ],
  "Samsung-Smartphone": [
    "Galaxy S24 Ultra",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy Z Fold6",
    "Galaxy Z Flip6",
    "Galaxy A55 5G",
    "Galaxy S22 Ultra",
    "Galaxy A35 5G",
  ],
  "Google Pixel-Smartphone": [
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 8 Pro",
    "Pixel 8a",
    "Pixel 7 Pro",
    "Pixel 7a",
    "Pixel 6a",
  ],
  "OnePlus-Smartphone": [
    "OnePlus 12",
    "OnePlus 12R",
    "OnePlus 11 5G",
    "OnePlus Open",
    "OnePlus Nord 4",
    "OnePlus Nord CE 4",
  ],
  "Xiaomi / Redmi-Smartphone": [
    "Xiaomi 14 Ultra",
    "Xiaomi 14",
    "Redmi Note 13 Pro+ 5G",
    "Redmi Note 13 5G",
    "Xiaomi 13 Pro",
  ],
  "Vivo-Smartphone": [
    "Vivo X100 Pro",
    "Vivo V30 Pro",
    "Vivo V29 Pro",
    "Vivo T3 5G",
    "Vivo Y200 5G",
  ],
  "Oppo-Smartphone": [
    "Oppo Find X7 Ultra",
    "Oppo Reno 11 Pro 5G",
    "Oppo Reno 10 Pro+",
    "Oppo F25 Pro 5G",
  ],
  "Realme-Smartphone": [
    "Realme GT 6",
    "Realme 12 Pro+ 5G",
    "Realme 11 Pro+ 5G",
    "Realme Narzo 70 Pro",
  ],
  "Motorola-Smartphone": [
    "Motorola Edge 50 Ultra",
    "Motorola Edge 50 Pro",
    "Motorola Razr 50 Ultra",
    "Moto G84 5G",
  ],
  "Nothing-Smartphone": [
    "Nothing Phone (2)",
    "Nothing Phone (2a) Plus",
    "Nothing Phone (2a)",
    "Nothing Phone (1)",
    "CMF Phone 1",
  ],
  "POCO-Smartphone": [
    "POCO F6 Pro",
    "POCO F6",
    "POCO X6 Pro 5G",
    "POCO M6 Pro 5G",
  ],

  // Laptops
  "Apple-Laptop": [
    "MacBook Pro 16 (M3 Max / Pro)",
    "MacBook Pro 14 (M3 Max / Pro)",
    "MacBook Air 15 (M3 / M2)",
    "MacBook Air 13 (M3 / M2 / M1)",
    "MacBook Pro 13 (M2 / M1)",
    "MacBook Pro 16 (Intel)",
  ],
  "Dell-Laptop": [
    "XPS 15 (9530 / 9520)",
    "XPS 13 Plus (9320)",
    "XPS 16 (9640)",
    "Alienware m16 R2",
    "Inspiron 15 (3520 / 3530)",
    "Latitude 7440 / 5440",
  ],
  "HP-Laptop": [
    "Spectre x360 14 / 16",
    "Envy x360 15",
    "Pavilion 15",
    "Omen Transcend 16",
    "Victus 16 Gaming",
    "EliteBook 840 G10",
  ],
  "Lenovo-Laptop": [
    "ThinkPad X1 Carbon Gen 12 / 11",
    "ThinkPad T14s Gen 4 / 3",
    "ThinkPad E14 Gen 5",
    "Legion Pro 7i / 5i",
    "Yoga 9i 2-in-1",
    "IdeaPad Slim 5",
  ],
  "ASUS-Laptop": [
    "ROG Zephyrus G16 (2024)",
    "ROG Zephyrus G14",
    "ROG Strix SCAR 16",
    "TUF Gaming A15",
    "ZenBook 14 OLED",
    "VivoBook 15",
  ],
  "Acer-Laptop": [
    "Predator Helios 16",
    "Nitro 16 Gaming",
    "Swift Go 14 OLED",
    "Aspire 7 Gaming",
    "Aspire 5",
  ],
  "MSI-Laptop": [
    "Titan 18 HX",
    "Raider GE78 HX",
    "Stealth 16 Studio",
    "Katana 15",
    "Cyborg 15",
  ],
  "Microsoft Surface-Laptop": [
    "Surface Laptop 7 (Copilot+ PC)",
    "Surface Laptop 5",
    "Surface Laptop Studio 2",
    "Surface Pro 11th Edition",
    "Surface Pro 9",
  ],
  "Razer-Laptop": [
    "Razer Blade 16 (2024)",
    "Razer Blade 14",
    "Razer Blade 18",
    "Razer Blade 15",
  ],
  "LG-Laptop": [
    "LG gram Pro 17 / 16",
    "LG gram 17 (2024)",
    "LG gram 16 (2024)",
    "LG gram 14",
  ],

  // Tablets
  "Apple-Tablet": [
    "iPad Pro 13 (M4)",
    "iPad Pro 11 (M4 / M2)",
    "iPad Air 13 / 11 (M2)",
    "iPad Air 5th Gen (M1)",
    "iPad 10th Gen (10.9-inch)",
    "iPad Mini 7 / 6",
  ],
  "Samsung-Tablet": [
    "Galaxy Tab S9 Ultra",
    "Galaxy Tab S9+",
    "Galaxy Tab S9 FE",
    "Galaxy Tab S8+",
    "Galaxy Tab A9+",
  ],
  "Lenovo-Tablet": [
    "Lenovo Tab P12 Pro",
    "Lenovo Tab P12",
    "Lenovo Tab M11",
    "Legion Tab (Y700)",
  ],
  "Xiaomi-Tablet": [
    "Xiaomi Pad 6S Pro 12.4",
    "Xiaomi Pad 6",
    "Redmi Pad Pro 5G",
  ],
  "OnePlus-Tablet": [
    "OnePlus Pad 2",
    "OnePlus Pad",
    "OnePlus Pad Go",
  ],
  "Amazon Fire-Tablet": [
    "Fire Max 11",
    "Fire HD 10",
    "Fire HD 8",
  ],
  "Microsoft Surface-Tablet": [
    "Surface Pro 11 (Copilot+)",
    "Surface Pro 9",
    "Surface Go 4",
  ],

  // Smartwatches
  "Apple-Smartwatch": [
    "Apple Watch Ultra 2",
    "Apple Watch Series 10",
    "Apple Watch Series 9",
    "Apple Watch Series 8",
    "Apple Watch SE (2nd Gen)",
  ],
  "Samsung-Smartwatch": [
    "Galaxy Watch Ultra",
    "Galaxy Watch 7 (44mm / 40mm)",
    "Galaxy Watch 6 Classic",
    "Galaxy Watch 5 Pro",
    "Galaxy Watch 4",
  ],
  "Garmin-Smartwatch": [
    "Fenix 8 / 7 Pro Solar",
    "Epix Pro (Gen 2)",
    "Forerunner 965 / 265",
    "Venu 3",
  ],
  "Fitbit-Smartwatch": [
    "Fitbit Sense 2",
    "Fitbit Versa 4",
    "Fitbit Charge 6",
  ],
  "Google Pixel-Smartwatch": [
    "Pixel Watch 3 (45mm / 41mm)",
    "Pixel Watch 2",
    "Pixel Watch",
  ],
  "OnePlus-Smartwatch": [
    "OnePlus Watch 2",
    "OnePlus Watch 2R",
  ],
  "Noise-Smartwatch": [
    "Noise ColorFit Pro 5 Max",
    "Noise ColorFit Ultra 3",
    "Noise Origin",
  ],
  "boAt-Smartwatch": [
    "boAt Wave Ultima Max",
    "boAt Lunar Tigre",
    "boAt Storm Call 3",
  ],
  "Amazfit-Smartwatch": [
    "Amazfit Balance",
    "Amazfit T-Rex Ultra / 2",
    "Amazfit GTR 4",
  ],

  // Audio / Gaming
  "Sony-Audio/Gaming": [
    "WH-1000XM5 Wireless Headphones",
    "WH-1000XM4 Wireless Headphones",
    "WF-1000XM5 Wireless Earbuds",
    "PlayStation 5 Pro Console",
    "PlayStation 5 Slim (Disc / Digital)",
    "PlayStation DualSense Wireless Controller",
  ],
  "Bose-Audio/Gaming": [
    "QuietComfort Ultra Headphones",
    "QuietComfort Ultra Earbuds",
    "QuietComfort 45 Headphones",
    "Noise Cancelling Headphones 700",
  ],
  "Apple-Audio/Gaming": [
    "AirPods Max (USB-C / Lightning)",
    "AirPods Pro 2 (USB-C MagSafe)",
    "AirPods 4 (Active Noise Cancellation)",
    "AirPods 3rd Gen",
    "HomePod (2nd Gen)",
  ],
  "Sennheiser-Audio/Gaming": [
    "Momentum 4 Wireless",
    "Momentum True Wireless 4",
    "ACCENTUM Plus Wireless",
    "HD 660S2 Headphones",
  ],
  "JBL-Audio/Gaming": [
    "JBL Tour ONE M2",
    "JBL Live 770NC",
    "JBL Tune 770NC",
    "JBL Flip 6 Portable",
  ],
  "Marshall-Audio/Gaming": [
    "Marshall Major V",
    "Marshall Monitor II A.N.C.",
    "Marshall Stanmore III",
  ],
  "Nintendo-Audio/Gaming": [
    "Nintendo Switch OLED Model",
    "Nintendo Switch (Standard V2)",
    "Nintendo Switch Lite",
    "Nintendo Switch Pro Controller",
  ],
  "PlayStation-Audio/Gaming": [
    "PS5 Pro Console",
    "PS5 Slim Console (Disc / Digital)",
    "DualSense Wireless Controller",
    "PlayStation Portal",
  ],
  "Xbox-Audio/Gaming": [
    "Xbox Series X Console",
    "Xbox Series S Console",
    "Xbox Wireless Controller",
    "Xbox Elite Wireless Controller Series 2",
  ],
  "ASUS ROG-Audio/Gaming": [
    "ROG Ally X (2024)",
    "ROG Ally (Z1 Extreme)",
    "ROG Delta S Wireless Headset",
  ],
  "Steam / Valve-Audio/Gaming": [
    "Steam Deck OLED (1TB / 512GB)",
    "Steam Deck LCD",
    "Valve Index VR Kit",
  ],
};

export const DeviceSelectionCards: React.FC<DeviceSelectionCardsProps> = ({
  selection,
  onChange,
}) => {
  const { user } = useAuth();
  const [modelSearch, setModelSearch] = useState("");
  const [userDevices, setUserDevices] = useState<UserDeviceResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"registered" | "manual">("manual");
  const [isCustomModelActive, setIsCustomModelActive] = useState(false);
  const [customModelInput, setCustomModelInput] = useState("");
  const [isCustomBrandActive, setIsCustomBrandActive] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState("");

  useEffect(() => {
    async function loadUserDevices() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const devices = await getUserDevices(token);
        if (devices && devices.length > 0) {
          setUserDevices(devices);
          if (!selection.deviceId) {
            setActiveTab("registered");
          }
        }
      } catch (err) {
        console.debug("Notice loading registered devices:", err);
      }
    }
    loadUserDevices();
  }, [user]);

  const handleSelectRegisteredDevice = (device: UserDeviceResponse) => {
    setIsCustomModelActive(false);
    setIsCustomBrandActive(false);
    onChange({
      deviceId: device.id,
      category: (device.category as DeviceCategory) || "Smartphone",
      brand: device.brand,
      model: device.model,
      ram: device.ram,
      storage: device.storage,
      year: device.purchase_year,
      condition: device.condition,
      functionalStatus: device.status,
    });
  };

  const handleSelectCategory = (cat: DeviceCategory) => {
    const brands = BRANDS_BY_CATEGORY[cat] || ["Apple", "Samsung", "Other Brand"];
    const defaultBrand = brands[0] || "Apple";
    const defaultModels = POPULAR_MODELS[`${defaultBrand}-${cat}`] || [`${defaultBrand} Standard Model`];
    setIsCustomModelActive(false);
    setIsCustomBrandActive(false);
    setModelSearch("");
    onChange({
      ...selection,
      deviceId: undefined,
      category: cat,
      brand: defaultBrand,
      model: defaultModels[0] || `${defaultBrand} Model`,
    });
  };

  const handleSelectBrand = (brand: string) => {
    if (brand === "Other Brand") {
      setIsCustomBrandActive(true);
      setIsCustomModelActive(true);
      const customB = customBrandInput.trim() || "Other Brand";
      const customM = customModelInput.trim() || "Custom Model";
      onChange({
        ...selection,
        deviceId: undefined,
        brand: customB,
        model: customM,
      });
      return;
    }

    setIsCustomBrandActive(false);
    setIsCustomModelActive(false);
    setCustomBrandInput("");
    const models = POPULAR_MODELS[`${brand}-${selection.category}`] || [`${brand} Device`];
    onChange({
      ...selection,
      deviceId: undefined,
      brand,
      model: models[0] || `${brand} Model`,
    });
  };

  const handleDismissCustomBrand = () => {
    setIsCustomBrandActive(false);
    setIsCustomModelActive(false);
    setCustomBrandInput("");
    const defaultB = currentBrands[0] || "Apple";
    const defaultModels = POPULAR_MODELS[`${defaultB}-${selection.category}`] || [`${defaultB} Model`];
    onChange({
      ...selection,
      deviceId: undefined,
      brand: defaultB,
      model: defaultModels[0] || `${defaultB} Model`,
    });
  };

  const handleSelectModel = (model: string) => {
    setIsCustomModelActive(false);
    setCustomModelInput("");
    onChange({
      ...selection,
      deviceId: undefined,
      model,
    });
  };

  const handleToggleCustomModel = () => {
    if (isCustomModelActive) {
      // Toggle off and restore first standard model
      setIsCustomModelActive(false);
      setCustomModelInput("");
      const defaultM = suggestedModels[0] || `${selection.brand} Model`;
      onChange({
        ...selection,
        deviceId: undefined,
        model: defaultM,
      });
    } else {
      // Toggle on
      setIsCustomModelActive(true);
      const initialVal = modelSearch.trim() || customModelInput.trim() || selection.model || "";
      setCustomModelInput(initialVal);
      onChange({
        ...selection,
        deviceId: undefined,
        model: initialVal || "Custom Model",
      });
    }
  };

  const handleDismissCustomModel = () => {
    setIsCustomModelActive(false);
    setCustomModelInput("");
    const defaultM = suggestedModels[0] || `${selection.brand} Model`;
    onChange({
      ...selection,
      deviceId: undefined,
      model: defaultM,
    });
  };

  const handleCustomModelChange = (val: string) => {
    setCustomModelInput(val);
    onChange({
      ...selection,
      deviceId: undefined,
      model: val.trim() || "Custom Model",
    });
  };

  const handleCustomBrandChange = (val: string) => {
    setCustomBrandInput(val);
    onChange({
      ...selection,
      deviceId: undefined,
      brand: val.trim() || "Other Brand",
    });
  };

  const currentBrands = BRANDS_BY_CATEGORY[selection.category] || ["Apple", "Samsung", "Dell", "Sony", "Other Brand"];
  const modelKey = `${selection.brand}-${selection.category}`;
  const suggestedModels = useMemo(() => {
    return POPULAR_MODELS[modelKey] || [`${selection.brand} Standard Model`];
  }, [modelKey, selection.brand]);

  // Global search across models in the selected category
  const allCategoryModels = useMemo(() => {
    const list: { brand: string; model: string }[] = [];
    currentBrands.forEach((b) => {
      if (b === "Other Brand") return;
      const key = `${b}-${selection.category}`;
      const models = POPULAR_MODELS[key] || [];
      models.forEach((m) => {
        list.push({ brand: b, model: m });
      });
    });
    return list;
  }, [currentBrands, selection.category]);

  // If searching: show filtered results; If not searching: show only top 4 to 6 models!
  const displayedModels = useMemo(() => {
    const query = modelSearch.trim().toLowerCase();
    if (!query) {
      return suggestedModels.slice(0, 6).map((m) => ({ brand: selection.brand, model: m }));
    }
    return allCategoryModels.filter((item) =>
      item.model.toLowerCase().includes(query) || item.brand.toLowerCase().includes(query)
    );
  }, [modelSearch, suggestedModels, allCategoryModels, selection.brand]);

  const exactMatchExists = useMemo(() => {
    const query = modelSearch.trim().toLowerCase();
    if (!query) return false;
    return displayedModels.some((item) => item.model.toLowerCase() === query);
  }, [modelSearch, displayedModels]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
        <div>
          <span className="inline-flex items-center text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Step 1 of 3
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Device Selection
          </h2>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selected Device</span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
            {selection.brand} {selection.model} {selection.deviceId ? "(Registered)" : ""}
          </span>
        </div>
      </div>

      {/* Mode Switcher: Registered Portfolio Devices vs Manual Custom Selection */}
      {userDevices.length > 0 && (
        <div className="flex gap-2 p-1 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("registered")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "registered"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Registered Devices ({userDevices.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "manual"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse / Enter Any Device</span>
          </button>
        </div>
      )}

      {/* Registered Devices Grid View */}
      {activeTab === "registered" && userDevices.length > 0 && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            Select from your registered portfolio (Auto-hydrates confirmed specifications):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userDevices.map((dev) => {
              const isSelected = selection.deviceId === dev.id;
              return (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => handleSelectRegisteredDevice(dev)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? "bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/30"
                      : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 hover:bg-emerald-100/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black">{dev.brand} {dev.model}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold">
                        {dev.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {[dev.storage, dev.ram, dev.purchase_year].filter(Boolean).join(" • ") || "Confirmed Specs"}
                    </p>
                    {dev.condition && (
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Condition: {dev.condition}
                      </p>
                    )}
                  </div>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Category / Brand / Model Selection */}
      {(activeTab === "manual" || userDevices.length === 0) && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category Selection Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              1. Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selection.category === cat.id && !selection.deviceId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-100/80 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                        : "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-100/50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                        isSelected
                          ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                          : "bg-emerald-100/60 dark:bg-[#0b1a13] text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Selection Chips */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              2. Select Brand
            </label>
            <div className="flex flex-wrap gap-2">
              {currentBrands.map((b) => {
                const isSelected =
                  !selection.deviceId &&
                  (b === "Other Brand" ? isCustomBrandActive : selection.brand === b && !isCustomBrandActive);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleSelectBrand(b)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{b}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Brand Entry Input (Visible when 'Other Brand' is selected) */}
            {isCustomBrandActive && (
              <div className="pt-2 animate-in fade-in duration-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Custom Brand / Manufacturer:
                  </span>
                  <button
                    type="button"
                    onClick={handleDismissCustomBrand}
                    className="text-[10px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  >
                    <X className="w-3 h-3" />
                    Back to popular brands
                  </button>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border-2 border-emerald-500 shadow-sm">
                  <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Type brand name (e.g. Framework, TCL, Nothing, MSI, Custom)..."
                    value={customBrandInput}
                    onChange={(e) => handleCustomBrandChange(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  {customBrandInput && (
                    <button
                      type="button"
                      onClick={() => handleCustomBrandChange("")}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Model Selection Grid / Search */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                3. Select Specific Model {!modelSearch && !isCustomModelActive && "(Top Picks)"}
              </label>
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search model or type your own..."
                  value={modelSearch}
                  onChange={(e) => {
                    setModelSearch(e.target.value);
                  }}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {modelSearch && (
                  <button
                    type="button"
                    onClick={() => setModelSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer bg-transparent border-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action: Use Searched Keyword Directly if Not in Catalog */}
            {modelSearch.trim().length > 0 && !exactMatchExists && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                    Not in catalog? Use: <strong className="text-emerald-700 dark:text-emerald-300">"{modelSearch.trim()}"</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleCustomModelChange(modelSearch.trim());
                    setIsCustomModelActive(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold cursor-pointer transition-all shrink-0 shadow-xs border-0"
                >
                  Use Custom Model
                </button>
              </div>
            )}

            {/* Custom Model Input Box when user selects 'Other (Enter Custom Model)' */}
            {isCustomModelActive && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border-2 border-emerald-500 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Enter Custom Device Model:
                  </span>
                  <button
                    type="button"
                    onClick={handleDismissCustomModel}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer bg-white/70 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Back to available models
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Latitude 5440, XPS 15 9500, Custom Desktop, Pixel 8a..."
                    value={customModelInput}
                    onChange={(e) => handleCustomModelChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#07130e] border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                  {customModelInput && (
                    <button
                      type="button"
                      onClick={() => handleCustomModelChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 cursor-pointer bg-transparent border-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Models Selection Grid (4-6 Top Models + 'Other' by default, or filtered search results) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {displayedModels.map((item) => {
                const isSelected =
                  !selection.deviceId &&
                  !isCustomModelActive &&
                  selection.model === item.model &&
                  (modelSearch.trim() ? selection.brand === item.brand : true);

                return (
                  <button
                    key={`${item.brand}-${item.model}`}
                    type="button"
                    onClick={() => {
                      setIsCustomModelActive(false);
                      setCustomModelInput("");
                      if (modelSearch.trim() && item.brand !== selection.brand) {
                        setIsCustomBrandActive(false);
                        setCustomBrandInput("");
                        onChange({
                          ...selection,
                          deviceId: undefined,
                          brand: item.brand,
                          model: item.model,
                        });
                      } else {
                        handleSelectModel(item.model);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-emerald-100/80 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs ring-1 ring-emerald-500/30"
                        : "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="text-xs truncate block">{item.model}</span>
                      {modelSearch.trim() && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                          {item.brand}
                        </span>
                      )}
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* 'Other (Enter Custom Model)' Card Option */}
              <button
                type="button"
                onClick={handleToggleCustomModel}
                className={`p-3 rounded-xl border-2 border-dashed text-left transition-all flex items-center justify-between cursor-pointer ${
                  isCustomModelActive
                    ? "bg-emerald-100/80 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold"
                    : "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold">Other (Enter Custom Model)</span>
                </div>
                {isCustomModelActive ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
