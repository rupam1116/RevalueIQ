"use client";

import React, { useState } from "react";
import { RepairShop, BookingRequest, DeviceCategory } from "@/types/repairShop";
import { X, CheckCircle2, Calendar, Clock, Smartphone, Laptop, Gamepad2, Headphones, Watch, ArrowRight, ArrowLeft, ShieldCheck, MapPin, Truck, Sparkles, QrCode, Download, Share2 } from "lucide-react";

interface MultiStepBookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  shop: RepairShop | null;
  onBookingComplete: (booking: BookingRequest) => void;
  initialService?: string;
}

export const MultiStepBookingWizard: React.FC<MultiStepBookingWizardProps> = ({
  isOpen,
  onClose,
  shop,
  onBookingComplete,
  initialService,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<DeviceCategory>("Smartphone");
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("iPhone 14 Pro");
  const [issueType, setIssueType] = useState(initialService || "OLED Screen & Glass Replacement");
  const [issueDescription, setIssueDescription] = useState("Display glass cracked after drop. Touch screen is fully functional.");
  const [selectedDate, setSelectedDate] = useState("2026-08-08");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:30 AM - 11:30 AM");
  const [fullName, setFullName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex.mercer@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [pickupRequested, setPickupRequested] = useState(true);
  const [pickupAddress, setPickupAddress] = useState("123 Green St, Apt 4B, San Francisco, CA 94102");
  const [userNotes, setUserNotes] = useState("Please contact 15 minutes before arrival.");

  if (!isOpen) return null;

  const targetShopName = shop ? shop.name : "iFix Green Labs & Repair Hub";
  const targetShopId = shop ? shop.id : "shop-1";

  const DEVICE_CATEGORIES: { id: DeviceCategory; label: string; icon: any }[] = [
    { id: "Smartphone", label: "Smartphone", icon: Smartphone },
    { id: "Laptop", label: "Laptop & Mac", icon: Laptop },
    { id: "Gaming Console", label: "Console", icon: Gamepad2 },
    { id: "Audio", label: "Headphones", icon: Headphones },
    { id: "Smartwatch", label: "Smartwatch", icon: Watch },
  ];

  const COMMON_ISSUES = [
    "OLED Screen & Glass Replacement",
    "High-Capacity Battery Replacement",
    "Ultrasonic Water Damage Decontamination",
    "Logic Board Micro-Soldering Repair",
    "Type-C / Charging Port Repair",
    "Camera Module / Lens Repair",
  ];

  const AVAILABLE_DATES = [
    { day: "Thu", date: "Aug 6", full: "2026-08-06" },
    { day: "Fri", date: "Aug 7", full: "2026-08-07" },
    { day: "Sat", date: "Aug 8", full: "2026-08-08" },
    { day: "Mon", date: "Aug 10", full: "2026-08-10" },
    { day: "Tue", date: "Aug 11", full: "2026-08-11" },
  ];

  const TIME_SLOTS = [
    { slot: "09:00 AM - 10:00 AM", period: "Morning" },
    { slot: "10:30 AM - 11:30 AM", period: "Morning" },
    { slot: "01:30 PM - 02:30 PM", period: "Afternoon" },
    { slot: "03:00 PM - 04:00 PM", period: "Afternoon" },
    { slot: "05:00 PM - 06:00 PM", period: "Evening" },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else if (step === 5) {
      // Create final booking
      const newBooking: BookingRequest = {
        id: `book-${Math.floor(Math.random() * 90000 + 10000)}`,
        shopId: targetShopId,
        shopName: targetShopName,
        deviceCategory: category,
        deviceBrand: brand,
        deviceModel: model,
        issueType,
        issueDescription,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        userFullName: fullName,
        userEmail: email,
        userPhone: phone,
        pickupRequested,
        pickupAddress: pickupRequested ? pickupAddress : undefined,
        userNotes,
        estimatedCost: issueType.includes("Screen") ? 129 : issueType.includes("Battery") ? 69 : 149,
        confirmationId: `RIX-${Math.floor(Math.random() * 89999 + 10000)}`,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };
      onBookingComplete(newBooking);
      setStep(6); // Step 6: Success
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 6) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200 dark:border-emerald-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0 relative my-6">
        {/* Wizard Header Bar */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                Step {step} of 6
              </span>
              <span className="text-xs text-slate-400 font-medium">• {targetShopName}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {step === 1 && "Step 1: Select Your Device"}
              {step === 2 && "Step 2: Choose Repair Issue"}
              {step === 3 && "Step 3: Select Appointment Date"}
              {step === 4 && "Step 4: Choose Time Slot"}
              {step === 5 && "Step 5: Review & Confirm Booking"}
              {step === 6 && "Step 6: Booking Confirmed!"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Step Body Content */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin">
          {/* STEP 1: CHOOSE DEVICE */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your device category and enter the model name to find compatible genuine replacement parts.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DEVICE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm"
                          : "bg-white dark:bg-[#09140e] border-emerald-200/80 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                      <div className="text-xs font-bold">{cat.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple, Samsung, Dell"
                    className="w-full p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Exact Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. iPhone 14 Pro, MacBook Air M2"
                    className="w-full p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ISSUE */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select the primary symptom or repair service required for your {brand} {model}.
              </p>

              <div className="space-y-2">
                {COMMON_ISSUES.map((issue) => {
                  const isSelected = issueType === issue;
                  return (
                    <button
                      key={issue}
                      onClick={() => setIssueType(issue)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm"
                          : "bg-white dark:bg-[#09140e] border-emerald-200/80 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span>{issue}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Describe Symptom / Issue Details</label>
                <textarea
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Provide additional details (e.g. dropped in water, battery drains fast)..."
                  className="w-full p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE DATE */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select an upcoming available date for your repair appointment or courier pickup.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {AVAILABLE_DATES.map((item) => {
                  const isSelected = selectedDate === item.full;
                  return (
                    <button
                      key={item.full}
                      onClick={() => setSelectedDate(item.full)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                          : "bg-white dark:bg-[#09140e] border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="text-[10px] uppercase font-extrabold opacity-80">{item.day}</div>
                      <div className="text-sm font-extrabold">{item.date}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CHOOSE TIME SLOT */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a convenient 1-hour time window on {selectedDate}.
              </p>

              <div className="space-y-2">
                {TIME_SLOTS.map((ts) => {
                  const isSelected = selectedTimeSlot === ts.slot;
                  return (
                    <button
                      key={ts.slot}
                      onClick={() => setSelectedTimeSlot(ts.slot)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white dark:bg-[#09140e] border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{ts.slot}</span>
                      </div>
                      <span className="text-[10px] opacity-80 uppercase">{ts.period} Slot</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW BOOKING */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Appointment Summary</h4>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <div><strong>Shop:</strong> {targetShopName}</div>
                  <div><strong>Device:</strong> {brand} {model}</div>
                  <div><strong>Service:</strong> {issueType}</div>
                  <div><strong>Date & Time:</strong> {selectedDate} @ {selectedTimeSlot}</div>
                  <div><strong>Est. Cost:</strong> $129 (Zero diagnostic fee)</div>
                  <div><strong>Warranty:</strong> 1 Year OEM Warranty</div>
                </div>
              </div>

              {/* Contact Information Input Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Customer Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pickupCheck"
                    checked={pickupRequested}
                    onChange={(e) => setPickupRequested(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="pickupCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Request Free Doorstep Express Courier Pickup
                  </label>
                </div>

                {pickupRequested && (
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Pickup Address</label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: BOOKING CONFIRMED SUCCESS */}
          {step === 6 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your repair voucher has been generated. Confirmation ID: <strong className="text-emerald-600">RIX-88421</strong>
                </p>
              </div>

              {/* QR Code Placeholder Box */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-[#09140e] border border-emerald-200 dark:border-emerald-900 space-y-3">
                <div className="w-32 h-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl mx-auto flex items-center justify-center p-2 shadow-inner">
                  <QrCode className="w-24 h-24 text-slate-800 dark:text-slate-200" />
                </div>
                <p className="text-[11px] text-slate-500">Show this QR code at {targetShopName} or to the courier driver.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done & Return to Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls (Steps 1 to 5) */}
        {step < 6 && (
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#07130c] border-t border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                step === 1
                  ? "opacity-40 cursor-not-allowed text-slate-400"
                  : "bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 cursor-pointer"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{step === 5 ? "Confirm & Book" : "Next Step"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
