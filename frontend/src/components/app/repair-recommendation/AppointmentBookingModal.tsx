"use client";

import React, { useState } from "react";
import { AuthorizedRepairCenter, RecommendationAppointment } from "@/types/repairRecommendation";
import { X, Calendar, Clock, Phone, MapPin, Truck, CheckCircle2, ShieldCheck, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  center: AuthorizedRepairCenter | null;
  deviceName?: string;
  onBookingSubmitted: (booking: RecommendationAppointment) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  center,
  deviceName = "iPhone 15 Pro",
  onBookingSubmitted,
}) => {
  const [preferredDate, setPreferredDate] = useState("2026-08-08");
  const [preferredTime, setPreferredTime] = useState("11:00 AM - 12:00 PM");
  const [selectedIssue, setSelectedIssue] = useState("Battery & Screen Replacement");
  const [pickupRequired, setPickupRequired] = useState(true);
  const [address, setAddress] = useState("Flat 402, Cyber Towers View Apt, Gachibowli, Hyderabad");
  const [contactNumber, setContactNumber] = useState("+91 98765 43210");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RecommendationAppointment | null>(null);

  if (!isOpen || !center) return null;

  const TIME_SLOTS = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM",
    "06:00 PM - 07:00 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: RecommendationAppointment = {
      id: `app-req-${Math.floor(Math.random() * 90000 + 10000)}`,
      centerId: center.id,
      centerName: center.name,
      deviceName,
      issue: selectedIssue,
      preferredDate,
      preferredTime,
      pickupRequired,
      address: pickupRequired ? address : undefined,
      contactNumber,
      confirmationCode: `REV-HYD-${Math.floor(Math.random() * 8999 + 1000)}`,
      status: "Confirmed",
    };

    setConfirmedBooking(newAppointment);
    setIsSubmitted(true);
    onBookingSubmitted(newAppointment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 text-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 relative my-6">
        {/* Header Bar */}
        <div className="bg-emerald-950 text-white p-5 border-b border-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Book Repair Appointment</h3>
              <p className="text-xs text-emerald-300">Store: <strong className="text-white">{center.name}</strong></p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              onClose();
            }}
            className="p-1.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1.5 text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Device Model:</span>
                  <span className="font-bold text-slate-900">{deviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">OEM Parts Warranty:</span>
                  <span className="font-bold text-emerald-700">1 Year Factory Warranty</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-emerald-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" /> Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setPreferredTime(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        preferredTime === slot
                          ? "bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-xs"
                          : "bg-white border-emerald-100 text-slate-700 hover:bg-emerald-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Option */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-slate-900">Doorstep Pickup Service</h4>
                      <p className="text-[11px] text-slate-500">Free courier pickup within 10 km</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPickupRequired(true)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        pickupRequired ? "bg-emerald-600 text-white" : "text-slate-600"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupRequired(false)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        !pickupRequired ? "bg-slate-200 text-slate-800" : "text-slate-600"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {pickupRequired && (
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Pickup Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-emerald-100 text-xs text-slate-900 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-emerald-200 text-xs text-slate-900 font-mono"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Submit & Confirm Appointment
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Confirmation Code: <strong className="text-emerald-700">{confirmedBooking?.confirmationCode}</strong>
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center p-2 border border-slate-200">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <p className="text-[11px] text-slate-500">Show QR code at store or to courier rider</p>
              </div>

              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs cursor-pointer"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
