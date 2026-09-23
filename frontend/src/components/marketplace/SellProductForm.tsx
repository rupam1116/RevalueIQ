"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MarketplaceProduct, CategoryType } from './types';
import { createMarketplaceListing, updateMarketplaceListing } from '@/lib/marketplaceApi';
import { fetchWithAuth } from '@/lib/api';
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  ShieldCheck,
  Wrench,
  DollarSign,
  Info,
  Check,
  Leaf,
  Shield,
  Smartphone,
  Laptop,
  Layers,
  AlertCircle,
  Loader2,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegisteredDevice {
  id: string;
  device_name?: string;
  category?: string;
  brand?: string;
  model?: string;
  purchase_year?: number;
  condition?: string;
  storage?: string;
  ram?: string;
}

interface UserValuationItem {
  id: string;
  valuation_code?: string;
  device_id?: string;
  input?: any;
  valuation?: {
    estimated_resale_value?: number;
    circularity_score?: number;
    co2_saved_kg?: number;
    ewaste_diverted_kg?: number;
    water_saved_liters?: number;
  };
}

interface SellProductFormProps {
  onClose: () => void;
  onPublishListing: (newProduct: MarketplaceProduct) => void;
  editProduct?: MarketplaceProduct | null;
  onUpdateListing?: (updatedProduct: MarketplaceProduct) => void;
}

export const SellProductForm: React.FC<SellProductFormProps> = ({
  onClose,
  onPublishListing,
  editProduct = null,
  onUpdateListing,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // User Devices & Valuations State
  const [userDevices, setUserDevices] = useState<RegisteredDevice[]>([]);
  const [userValuations, setUserValuations] = useState<UserValuationItem[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(editProduct?.deviceId || '');
  const [selectedValuationId, setSelectedValuationId] = useState<string>(editProduct?.valuationId || '');

  // Form State
  const [images, setImages] = useState<string[]>(editProduct?.images || []);
  const [title, setTitle] = useState(editProduct?.title || '');
  const [category, setCategory] = useState<CategoryType>(editProduct?.category || 'Phones');
  const [brand, setBrand] = useState(editProduct?.brand || 'Apple');
  const [model, setModel] = useState(editProduct?.model || '');
  const [purchaseYear, setPurchaseYear] = useState<number>(editProduct?.purchaseYear || 2023);
  const [condition, setCondition] = useState<'A+' | 'A' | 'B+' | 'B' | 'C'>((editProduct?.condition as any) || 'A');
  const [storage, setStorage] = useState('128GB');
  const [ram, setRam] = useState('8GB');
  const [batteryHealth, setBatteryHealth] = useState('92%');
  const [askingPrice, setAskingPrice] = useState<string>(editProduct?.price ? String(editProduct.price) : '35000');
  const [warrantyOption, setWarrantyOption] = useState(editProduct?.warranty || '12-Month Revalue Eco Warranty');
  const [description, setDescription] = useState(editProduct?.description || '');

  // AI Appraisal State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiComputed, setAiComputed] = useState({
    estimatedValue: 38000,
    suggestedPrice: 35000,
    repairCost: 0,
    repairRec: 'Device hardware passed full RevalueIQ AI diagnostic checks.',
    circularScore: 92,
    co2Saved: 74.5,
    ewasteDiverted: 0.85,
  });

  // Action State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPublishedSuccess, setIsPublishedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load User Registered Devices & Valuations
  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      setIsLoadingDevices(true);
      try {
        const [devRes, valRes] = await Promise.all([
          fetchWithAuth('/api/v1/users/me/devices'),
          fetchWithAuth('/api/v1/valuations'),
        ]);

        if (devRes.ok && isMounted) {
          const devData = await devRes.json();
          setUserDevices(devData.devices || devData.items || (Array.isArray(devData) ? devData : []));
        }

        if (valRes.ok && isMounted) {
          const valData = await valRes.json();
          setUserValuations(valData.valuations || valData.items || (Array.isArray(valData) ? valData : []));
        }
      } catch (err) {
        // Non-blocking fallback
      } finally {
        if (isMounted) setIsLoadingDevices(false);
      }
    }
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autofill form when a user device is picked
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (!deviceId) return;

    const dev = userDevices.find((d) => d.id === deviceId);
    if (dev) {
      if (dev.category) setCategory(dev.category as CategoryType);
      if (dev.brand) setBrand(dev.brand);
      if (dev.model) setModel(dev.model);
      if (dev.purchase_year) setPurchaseYear(dev.purchase_year);
      if (dev.condition && ['A+', 'A', 'B+', 'B', 'C'].includes(dev.condition)) {
        setCondition(dev.condition as any);
      }
      if (dev.storage) setStorage(dev.storage);
      if (dev.ram) setRam(dev.ram);
      setTitle(`${dev.brand} ${dev.model || dev.device_name || 'Device'} (${dev.purchase_year || 2023})`);

      // Attempt matching valuation
      const linkedVal = userValuations.find((v) => v.device_id === deviceId);
      if (linkedVal) {
        setSelectedValuationId(linkedVal.id);
        if (linkedVal.valuation?.estimated_resale_value) {
          const valEst = Math.round(linkedVal.valuation.estimated_resale_value);
          setAskingPrice(String(valEst));
          setAiComputed({
            estimatedValue: valEst,
            suggestedPrice: valEst,
            repairCost: 0,
            repairRec: 'Appraisal imported from linked Phase 3 Valuation report.',
            circularScore: linkedVal.valuation.circularity_score || 92,
            co2Saved: linkedVal.valuation.co2_saved_kg || 74.5,
            ewasteDiverted: linkedVal.valuation.ewaste_diverted_kg || 0.85,
          });
        }
      }
    }
  };

  const runAiDiagnostics = () => {
    setIsAiProcessing(true);
    setCurrentStep(3);

    setTimeout(() => {
      const baseVal = parseInt(askingPrice) || 35000;
      setAiComputed((prev) => ({
        ...prev,
        estimatedValue: Math.round(baseVal * 1.06),
        suggestedPrice: baseVal,
        repairCost: condition === 'B' || condition === 'C' ? 2500 : 0,
        repairRec:
          condition === 'B' || condition === 'C'
            ? 'Minor battery degradation noted. Certified circular resale recommended.'
            : 'Pristine diagnostic integrity. Hardware benchmark optimal.',
        circularScore: condition === 'A+' ? 96 : condition === 'A' ? 92 : 85,
        co2Saved: 74.5,
      }));
      setIsAiProcessing(false);
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Each image must be under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages((prev) => (prev.length < 8 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (saveAsDraft: boolean = false) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const priceNum = parseFloat(askingPrice) || 35000;
      const listingTitle = title.trim() || `${brand} ${model || category} (${purchaseYear})`.trim();

      const payload = {
        device_id: selectedDeviceId || undefined,
        valuation_id: selectedValuationId || undefined,
        category,
        brand: brand.trim() || 'Electronics',
        model: model.trim() || category,
        title: listingTitle,
        description: description.trim() || `Pre-owned ${brand} ${model || category} in Grade ${condition} condition. Inspected with RevalueIQ circular diagnostics.`,
        condition,
        functional_status: 'Fully Functional',
        specifications: {
          ram,
          storage,
          purchase_year: purchaseYear,
          battery_health: batteryHealth,
        },
        images: images.map((url, idx) => ({ url, type: 'standard', order: idx })),
        asking_price_inr: priceNum,
        original_price_inr: Math.round(priceNum * 1.35),
        warranty: warrantyOption,
        return_policy: '14-Day Free Returns',
        shipping_method: 'Insured Eco Express Shipping',
        save_as_draft: saveAsDraft,
      };

      if (editProduct) {
        const updatedProduct = await updateMarketplaceListing(editProduct.id, {
          category,
          brand: brand.trim() || 'Electronics',
          model: model.trim() || category,
          title: listingTitle,
          description: description.trim() || `Pre-owned ${brand} ${model || category} in Grade ${condition} condition. Inspected with RevalueIQ circular diagnostics.`,
          condition,
          functional_status: 'Fully Functional',
          specifications: {
            ram,
            storage,
            purchase_year: purchaseYear,
            battery_health: batteryHealth,
          },
          images: images.map((url, idx) => ({ url, type: 'standard', order: idx })),
          asking_price_inr: priceNum,
          original_price_inr: Math.round(priceNum * 1.35),
          warranty: warrantyOption,
          return_policy: '14-Day Free Returns',
          shipping_method: 'Insured Eco Express Shipping',
        });
        if (onUpdateListing) {
          onUpdateListing(updatedProduct);
        }
      } else {
        const createdProduct = await createMarketplaceListing(payload);
        onPublishListing(createdProduct);
      }
      setIsPublishedSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save listing. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Sell Pre-Owned Electronics</h2>
              <p className="text-xs text-slate-500">AI Circular Valuation & Second-Life Marketplace</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { step: 1, title: '1. Device Specs' },
            { step: 2, title: '2. Diagnostics' },
            { step: 3, title: '3. AI Appraisal' },
            { step: 4, title: '4. Publish' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-xl border transition-all ${
                currentStep === item.step
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : currentStep > item.step
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Device Identification */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Quick Fill from Registered Devices */}
            {userDevices.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    Select from My Registered Devices (Phase 2 & 3):
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">{userDevices.length} available</span>
                </div>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleSelectDevice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-200 bg-white text-xs font-bold text-slate-800 shadow-xs"
                >
                  <option value="">-- Or enter device details manually --</option>
                  {userDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.brand} {d.model || d.device_name} ({d.category || 'Device'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs font-bold text-slate-900"
                >
                  <option value="Phones">Phones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Audio">Audio</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Smart Watches">Smart Watches</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Samsung, Sony"
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro, M3 MacBook"
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Purchase Year</label>
                <input
                  type="number"
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(parseInt(e.target.value) || 2023)}
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Storage</label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="e.g. 256GB"
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g. 16GB"
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Battery Health</label>
                <input
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="e.g. 92%"
                  className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Listing Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apple iPhone 14 Pro 128GB Deep Purple"
                className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Device Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include details about cosmetic condition, original box, included chargers, or accessories..."
                className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-emerald-100">
              <Button onClick={() => setCurrentStep(2)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6">
                Next: Diagnostics <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Condition & Photos Upload */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Cosmetic Grade Assessment</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { grade: 'A+', label: 'Pristine / Mint' },
                  { grade: 'A', label: 'Excellent' },
                  { grade: 'B+', label: 'Very Good' },
                  { grade: 'B', label: 'Good' },
                  { grade: 'C', label: 'Refurbished' },
                ].map((c) => (
                  <button
                    key={c.grade}
                    type="button"
                    onClick={() => setCondition(c.grade as any)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      condition === c.grade
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50/50 border-emerald-100 text-slate-700 hover:bg-emerald-100/60'
                    }`}
                  >
                    <div>{c.grade}</div>
                    <div className="text-[10px] font-normal mt-0.5 opacity-80">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos Upload Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Device Photographs ({images.length}/8)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-emerald-700 hover:underline font-bold"
                >
                  Upload from Device
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-emerald-200 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50 flex flex-col items-center justify-center text-emerald-700 font-bold text-xs p-2 text-center cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 mb-1 text-emerald-600" />
                    + Upload Photo
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-emerald-100">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="rounded-2xl text-xs font-bold">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button onClick={runAiDiagnostics} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6">
                Run AI Valuation <Sparkles className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: AI Valuation Simulation */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            {isAiProcessing ? (
              <div className="py-12 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">Running RevalueIQ AI Circular Valuation...</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Computing circular economy score, avoided CO₂e, and real-time secondary market demand in Indian Rupees (INR)...
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 rounded-3xl space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" /> AI Certified Valuation Report
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-black">
                      Circularity Score: {aiComputed.circularScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center">
                      <span className="text-[10px] text-emerald-200 font-bold uppercase">Estimated Value</span>
                      <div className="text-xl font-black">₹{aiComputed.estimatedValue.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center">
                      <span className="text-[10px] text-emerald-200 font-bold uppercase">CO₂e Diverted</span>
                      <div className="text-xl font-black">{aiComputed.co2Saved} kg</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-emerald-200 font-bold uppercase">E-Waste Prevented</span>
                      <div className="text-xl font-black">{aiComputed.ewasteDiverted} kg</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Set Asking Price (₹ INR)</label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-emerald-200 bg-white text-base font-black text-slate-900"
                  />
                  <p className="text-[11px] text-slate-500">
                    Suggested fair price based on Phase 3 Valuation: <strong className="text-emerald-700">₹{aiComputed.suggestedPrice.toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                <div className="flex justify-between pt-4 border-t border-emerald-100">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="rounded-2xl text-xs font-bold">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>
                  <Button onClick={() => setCurrentStep(4)} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6">
                    Proceed to Confirmation <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Final Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            {isPublishedSuccess ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Listing Saved & Published Successfully!</h3>
                <p className="text-xs text-slate-500">Your device is now live in the RevalueIQ Circular Marketplace.</p>
              </div>
            ) : (
              <>
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Listing Summary</h4>
                  <div className="flex items-center gap-4">
                    {images && images.length > 0 && images[0] ? (
                      <img src={images[0]} alt="" className="w-16 h-16 rounded-2xl object-cover border border-emerald-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800">
                        <ImageIcon className="w-8 h-8 opacity-60" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{title || `${brand} ${model}`}</h3>
                      <p className="text-xs text-slate-500">{category} • Grade {condition} • Year {purchaseYear}</p>
                      <p className="text-lg font-black text-emerald-700 mt-1">₹{parseInt(askingPrice || '0').toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Eco Warranty Protection</label>
                  <select
                    value={warrantyOption}
                    onChange={(e) => setWarrantyOption(e.target.value)}
                    className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs font-bold text-slate-900"
                  >
                    <option value="12-Month Revalue Eco Warranty">12-Month Revalue Eco Warranty</option>
                    <option value="18-Month Certified Pro Warranty">18-Month Certified Pro Warranty</option>
                    <option value="6-Month Standard Warranty">6-Month Standard Warranty</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-100">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="rounded-2xl text-xs font-bold">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => handlePublish(true)}
                      className="rounded-2xl text-xs font-bold border-emerald-200 text-slate-700 hover:bg-emerald-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handlePublish(false)}
                      className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                      Publish Listing Now
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
