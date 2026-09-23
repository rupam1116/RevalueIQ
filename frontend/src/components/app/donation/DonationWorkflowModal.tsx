"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Laptop, Building, Calendar, ShieldCheck, Sparkles, Truck, MapPin, Phone, User, ArrowRight, ArrowLeft } from "lucide-react";
import { DonationCenter, MOCK_DONATION_CENTERS, DonationRecord } from "@/lib/mockDonationData";
import { Button } from "@/components/ui/button";

interface WorkflowModalProps {
  initialCenter?: DonationCenter | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteDonation: (record: DonationRecord) => void;
}

export const DonationWorkflowModal: React.FC<WorkflowModalProps> = ({
  initialCenter,
  isOpen,
  onClose,
  onCompleteDonation,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedDevice, setSelectedDevice] = useState<string>("MacBook Air (2017)");
  const [deviceCategory, setDeviceCategory] = useState<string>("Laptops");
  const [customDeviceDetails, setCustomDeviceDetails] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<DonationCenter>(initialCenter || MOCK_DONATION_CENTERS[0]);

  // Fulfillment
  const [fulfillmentType, setFulfillmentType] = useState<"Pickup" | "Drop-off">("Pickup");
  const [pickupDate, setPickupDate] = useState<string>("2026-08-08");
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>("10:00 AM - 1:00 PM");
  const [userName, setUserName] = useState<string>("Rupam Das");
  const [userPhone, setUserPhone] = useState<string>("+91 98765 43210");
  const [userAddress, setUserAddress] = useState<string>("Plot 14, Silicon Valley Colony, HITEC City, Hyderabad");

  const calculateCo2 = () => {
    if (deviceCategory === "Laptops") return 145.5;
    if (deviceCategory === "Tablets") return 45.0;
    if (deviceCategory === "Smartphones") return 32.0;
    return 65.0;
  };

  const handleConfirm = () => {
    const certId = `DON-2026-${Math.floor(10000 + Math.random() * 90000)}-EC`;
    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      certificateId: certId,
      userName: userName,
      deviceName: selectedDevice === "Custom Device" ? customDeviceDetails : selectedDevice,
      deviceCategory: deviceCategory,
      serialOrModel: "REVAL-DON-2026",
      organizationId: selectedOrg.id,
      organizationName: selectedOrg.name,
      date: new Date().toISOString().split("T")[0],
      fulfillmentType: fulfillmentType,
      pickupDate: pickupDate,
      pickupTimeSlot: pickupTimeSlot,
      estimatedCo2SavedKg: calculateCo2(),
      treesEquivalent: Number((calculateCo2() / 22).toFixed(1)),
      circularScoreBonus: 50,
      status: "Completed",
    };

    onCompleteDonation(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in transition-all">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header matching SellProductForm header */}
        <div className="p-6 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between bg-emerald-50/40 dark:bg-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Donate Electronics Workflow</h2>
              <p className="text-xs text-slate-500">Step {step} of 4: Standardized Circular Donation Stepper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar matching Marketplace SellProductForm */}
        <div className="grid grid-cols-4 border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20">
          {[
            { num: 1, title: "Confirm Device" },
            { num: 2, title: "Donation Method" },
            { num: 3, title: "Schedule Date" },
            { num: 4, title: "Confirmation" },
          ].map((s) => (
            <div
              key={s.num}
              className={`py-2.5 px-2 text-center text-xs font-extrabold border-b-2 transition-all ${
                step >= s.num
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/60"
                  : "border-transparent text-slate-400"
              }`}
            >
              {s.num}. {s.title}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: CONFIRM DEVICE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-emerald-600" /> Confirm Device To Donate
                </h3>
                <p className="text-xs text-slate-500">Select an existing device from your vault or specify custom model details.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "MacBook Air (2017)", category: "Laptops", desc: "Core i5, 8GB RAM, 128GB SSD - Tested working" },
                  { name: "Samsung Galaxy Tab S6 Lite", category: "Tablets", desc: "10.4 inch, 64GB - Minor screen scratches" },
                  { name: "Dell Latitude 5490", category: "Laptops", desc: "Core i5 8th Gen - Fully operational" },
                  { name: "Custom Device", category: "Other", desc: "Specify custom brand, model, and specs" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDevice(item.name);
                      setDeviceCategory(item.category);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDevice === item.name
                        ? "bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-600 text-slate-900 dark:text-white shadow-xs"
                        : "bg-white dark:bg-[#0b1a13] border-emerald-100 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 hover:border-emerald-300"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    {selectedDevice === item.name && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {selectedDevice === "Custom Device" && (
                <div className="space-y-2 pt-2 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Device Details & Model:</label>
                  <input
                    type="text"
                    value={customDeviceDetails}
                    onChange={(e) => setCustomDeviceDetails(e.target.value)}
                    placeholder="e.g. HP Pavilion 15 Notebook (i3, 4GB RAM)"
                    className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHOOSE DONATION METHOD */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" /> Choose Donation Method
                </h3>
                <p className="text-xs text-slate-500">Select whether you prefer doorstep pickup or direct drop-off at {selectedOrg.name}.</p>
              </div>

              {/* Fulfillment Method Radio Cards matching Marketplace SellProductForm */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setFulfillmentType("Pickup")}
                  className={`p-5 rounded-2xl border text-center cursor-pointer transition-all space-y-2 ${
                    fulfillmentType === "Pickup"
                      ? "bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-300 shadow-xs"
                      : "bg-white dark:bg-[#0b1a13] border-emerald-100 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 hover:border-emerald-300"
                  }`}
                >
                  <Truck className="w-8 h-8 mx-auto text-emerald-600" />
                  <h4 className="text-sm font-extrabold">Doorstep Pickup</h4>
                  <p className="text-[11px] text-slate-500">Verified agent collects from home</p>
                </div>

                <div
                  onClick={() => setFulfillmentType("Drop-off")}
                  className={`p-5 rounded-2xl border text-center cursor-pointer transition-all space-y-2 ${
                    fulfillmentType === "Drop-off"
                      ? "bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-300 shadow-xs"
                      : "bg-white dark:bg-[#0b1a13] border-emerald-100 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 hover:border-emerald-300"
                  }`}
                >
                  <MapPin className="w-8 h-8 mx-auto text-teal-600" />
                  <h4 className="text-sm font-extrabold">Self Drop-off</h4>
                  <p className="text-[11px] text-slate-500">Deliver directly to partner hub</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE DATE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" /> Schedule Date & Time
                </h3>
                <p className="text-xs text-slate-500">Enter donor contact info and preferred schedule slot.</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Donor Full Name:</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {fulfillmentType === "Pickup" && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Pickup Address:</label>
                    <textarea
                      rows={2}
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Preferred Date:</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Preferred Time Slot:</label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full p-3 bg-emerald-50/40 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="10:00 AM - 1:00 PM">10:00 AM - 1:00 PM</option>
                      <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                      <option value="4:00 PM - 7:00 PM">4:00 PM - 7:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Confirmation Summary
                </h3>
                <p className="text-xs text-slate-500">Review your final donation summary before generating digital certificate.</p>
              </div>

              <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                  <span className="text-slate-500">Device:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedDevice === "Custom Device" ? customDeviceDetails : selectedDevice}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                  <span className="text-slate-500">Recipient Organization:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{selectedOrg.name}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                  <span className="text-slate-500">Fulfillment Method:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{fulfillmentType} ({pickupDate}, {pickupTimeSlot})</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-2">
                  <span className="text-slate-500">Estimated CO₂ Avoidance:</span>
                  <span className="font-extrabold text-teal-700 dark:text-teal-400">{calculateCo2()} kg CO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Circular Platform Score:</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">+50 Points</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls matching Marketplace Button styling */}
        <div className="p-6 border-t border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="rounded-2xl border-emerald-200 text-slate-700 dark:text-slate-200 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs h-11 px-6 shadow-md border-0"
            >
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-xs h-11 px-6 shadow-lg shadow-emerald-600/20 border-0"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Confirm & Issue Digital Certificate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
