"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { ActivityItem, ConfirmCompletionPayload } from "@/lib/historyApi";
import { Button } from "@/components/ui/button";

interface ConfirmCompletionModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
  onConfirm: (activity: ActivityItem, payload: ConfirmCompletionPayload) => Promise<void>;
}

export const ConfirmCompletionModal: React.FC<ConfirmCompletionModalProps> = ({
  activity,
  onClose,
  onConfirm,
}) => {
  const [completedDate, setCompletedDate] = useState(new Date().toISOString().split("T")[0]);
  const [costOrEarning, setCostOrEarning] = useState(activity?.value_inr ? String(activity.value_inr) : "");
  const [providerOrRecipient, setProviderOrRecipient] = useState(
    activity?.details.repair_shop || activity?.details.buyer_or_ngo || ""
  );
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onConfirm(activity, {
        completed_date: completedDate,
        final_cost_or_earning_inr: costOrEarning ? parseFloat(costOrEarning) : undefined,
        service_provider_or_recipient: providerOrRecipient,
        completion_notes: notes,
        receipt_or_reference: reference,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to confirm completion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 relative">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Confirm External Completion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activity.device_name} • {activity.event_code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          Transitioning this action from <strong>Tier 2 (Action Initiated)</strong> to <strong>Tier 3 (Externally Completed)</strong> will permanently record verified CO₂ savings and e-waste prevention into your circular profile.
        </p>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Date Completed
            </label>
            <input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Service Provider, Repair Shop, or Recipient NGO
            </label>
            <input
              type="text"
              value={providerOrRecipient}
              onChange={(e) => setProviderOrRecipient(e.target.value)}
              placeholder="e.g. Authorized Service Center, Local Repairer, NGO"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Final Amount (₹ INR)
              </label>
              <input
                type="number"
                value={costOrEarning}
                onChange={(e) => setCostOrEarning(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Invoice / Reference ID
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. INV-2026-8921"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Verification Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. OEM display assembly replaced, battery health restored to 100%."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Confirm & Lock Verified Impact
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
