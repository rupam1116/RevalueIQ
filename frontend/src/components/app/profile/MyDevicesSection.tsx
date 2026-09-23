"use client";

import React, { useState } from "react";
import { UserDeviceItem } from "@/lib/mockProfileData";
import { UserDeviceCreateRequest } from "@/lib/userApi";
import {
  Smartphone,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  X,
  Tag,
  Wrench,
  Heart,
  Recycle,
  Cpu,
  Calendar,
  ShieldAlert,
  Plus,
  Trash2,
  Laptop,
} from "lucide-react";

interface MyDevicesSectionProps {
  devices: UserDeviceItem[];
  onNavigateTab?: (tabId: string) => void;
  onAddDevice?: (device: UserDeviceCreateRequest) => Promise<void>;
  onDeleteDevice?: (deviceId: string) => Promise<void>;
}

export const MyDevicesSection: React.FC<MyDevicesSectionProps> = ({
  devices,
  onNavigateTab,
  onAddDevice,
  onDeleteDevice,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<UserDeviceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Device Form State
  const [formBrand, setFormBrand] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formCategory, setFormCategory] = useState("Smartphone");
  const [formStorage, setFormStorage] = useState("128GB");
  const [formRam, setFormRam] = useState("6GB");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formPurchaseYear, setFormPurchaseYear] = useState("2023");
  const [formCondition, setFormCondition] = useState("Good");
  const [formNotes, setFormNotes] = useState("");

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddDevice) return;

    setIsSubmitting(true);
    try {
      await onAddDevice({
        brand: formBrand,
        model: formModel,
        category: formCategory,
        storage: formStorage,
        ram: formRam,
        serial_number: formSerialNumber,
        purchase_year: formPurchaseYear,
        condition: formCondition,
        status: "Active",
        notes: formNotes,
      });

      // Reset form & close modal
      setFormBrand("");
      setFormModel("");
      setFormSerialNumber("");
      setFormNotes("");
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (!onDeleteDevice) return;
    if (!confirm("Are you sure you want to remove this device from your portfolio?")) return;

    setDeletingId(deviceId);
    try {
      await onDeleteDevice(deviceId);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: UserDeviceItem["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      case "Sold":
        return "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30";
      case "Repaired":
        return "bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/30";
      case "Donated":
        return "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30";
      default:
        return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700";
    }
  };

  const getRecommendationBadge = (rec: UserDeviceItem["recommendation"]) => {
    switch (rec) {
      case "Sell":
        return { label: "AI Rec: Marketplace Resale", icon: Tag, color: "text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30" };
      case "Repair":
        return { label: "AI Rec: Certified Repair", icon: Wrench, color: "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30" };
      case "Donate":
        return { label: "AI Rec: NGO Device Donation", icon: Heart, color: "text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30" };
      case "Recycle":
        return { label: "AI Rec: Certified E-Waste Recycle", icon: Recycle, color: "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Registered Devices ({devices.length})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage your electronic devices, physical condition ratings, and AI circular recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {onAddDevice && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-0"
            >
              <Plus className="w-4 h-4" /> Add Device
            </button>
          )}

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("valuation")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Appraise New Device
            </button>
          )}
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">No Devices Registered Yet</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Add your first smartphone, laptop, or electronic device to track carbon offset metrics and circular value.
          </p>
          {onAddDevice && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer border-0 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Your First Device
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map((device) => {
            const recInfo = getRecommendationBadge(device.recommendation);
            const RecIcon = recInfo.icon;
            return (
              <div
                key={device.id}
                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between shadow-xl group"
              >
                {/* Image & Action Badges */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={device.imageUrl}
                    alt={device.deviceName}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold border backdrop-blur-md ${getStatusBadge(
                      device.status
                    )}`}
                  >
                    {device.status}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-300">
                    {device.category}
                  </span>

                  {/* Delete button */}
                  {onDeleteDevice && (
                    <button
                      onClick={() => handleDelete(device.id)}
                      disabled={deletingId === device.id}
                      className="absolute top-3 left-3 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                      title="Delete device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Body details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                      {device.deviceName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {device.specsSnippet}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Condition</span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30">
                        {device.aiGrade}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold ${recInfo.color}`}>
                      <RecIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{recInfo.label}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDevice(device)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    View Device Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Register New Device
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Add device specifications to your RevalueIQ portfolio.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple, Samsung"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 15 Pro, XPS 15"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Smartwatch">Smartwatch</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Grade A+">Grade A+</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Storage</label>
                  <input
                    type="text"
                    placeholder="256GB"
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">RAM</label>
                  <input
                    type="text"
                    placeholder="8GB"
                    value={formRam}
                    onChange={(e) => setFormRam(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Purchase Year</label>
                  <input
                    type="text"
                    placeholder="2023"
                    value={formPurchaseYear}
                    onChange={(e) => setFormPurchaseYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Serial Number</label>
                <input
                  type="text"
                  placeholder="Optional serial/IMEI"
                  value={formSerialNumber}
                  onChange={(e) => setFormSerialNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Notes & Specs</label>
                <textarea
                  rows={2}
                  placeholder="Additional specifications..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-extrabold text-xs shadow-md cursor-pointer border-0 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Device"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Device Details
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Registered on {selectedDevice.analysedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedDevice.imageUrl}
                alt=""
                className="w-20 h-20 object-contain rounded-xl bg-white dark:bg-slate-900 p-2"
              />
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedDevice.deviceName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{selectedDevice.specsSnippet}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                    Condition: {selectedDevice.aiGrade}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                Hardware Specs
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <p className="text-slate-500 font-semibold">Category</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-200">{selectedDevice.category}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <p className="text-slate-500 font-semibold">Status</p>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{selectedDevice.status}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
