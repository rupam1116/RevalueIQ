"use client";

import React from "react";
import { BookingRequest } from "@/types/repairShop";
import { CheckCircle2, QrCode, Calendar, Clock, MapPin, Phone, Truck, ShieldCheck, Download, Share2, ArrowRight } from "lucide-react";

interface BookingConfirmationViewProps {
  booking: BookingRequest;
  onClose?: () => void;
  onViewTimeline?: () => void;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  onClose,
  onViewTimeline,
}) => {
  return (
    <div className="bg-white dark:bg-[#0b1a13] border border-emerald-200/80 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100 dark:border-emerald-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase mb-0.5">
              Active Booking Voucher
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Appointment #{booking.confirmationId}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Booking voucher saved to PDF downloads.")}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Pass PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Details */}
        <div className="md:col-span-8 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Repair Center:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.shopName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Device & Issue:</span>
              <p className="font-bold text-slate-900 dark:text-white">{booking.deviceBrand} {booking.deviceModel} ({booking.issueType})</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Reserved Slot:</span>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">{booking.date} @ {booking.timeSlot}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Pickup Request:</span>
              <p className="font-bold text-slate-900 dark:text-white">{booking.pickupRequested ? "Free Courier Pickup" : "In-store Walk-in"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold">
            <span>Customer: {booking.userFullName} ({booking.userPhone})</span>
            <span className="text-emerald-600 font-bold">Total: ${booking.estimatedCost}</span>
          </div>
        </div>

        {/* Right Column: QR Code */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#09140e] border border-emerald-200 dark:border-emerald-900 text-center space-y-2">
          <div className="w-28 h-28 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
            <QrCode className="w-20 h-20 text-slate-800 dark:text-slate-200" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Scan code at shop counter</p>

          {onViewTimeline && (
            <button
              onClick={onViewTimeline}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Live Repair Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
