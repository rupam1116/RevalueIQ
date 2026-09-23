"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPayments, refundPayment, PaymentItem } from "@/lib/paymentApi";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ArrowDownLeft,
  ExternalLink,
  ShieldCheck,
  Receipt,
  RotateCcw,
  Loader2,
  FileText,
  DollarSign,
  ArrowLeft,
} from "lucide-react";

export default function PaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/app");
    }
  };

  const fetchPaymentData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getPayments(statusFilter);
      setPayments(res.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [user, statusFilter]);

  const handleRefund = async (paymentId: string) => {
    try {
      setRefundLoading(true);
      setRefundMsg(null);
      const updated = await refundPayment(paymentId, "User requested refund via platform UI");
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? updated : p)));
      if (selectedPayment?.id === paymentId) {
        setSelectedPayment(updated);
      }
      setRefundMsg("Refund successfully processed!");
    } catch (err: any) {
      setRefundMsg(`Refund error: ${err.message}`);
    } finally {
      setRefundLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.order_id.toLowerCase().includes(q) ||
      p.gateway_order_id.toLowerCase().includes(q) ||
      (p.gateway_payment_id && p.gateway_payment_id.toLowerCase().includes(q)) ||
      p.purpose.toLowerCase().includes(q) ||
      p.receipt_reference.toLowerCase().includes(q)
    );
  });

  const totalPaidINR = payments
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount_inr, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const renderStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PAID
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <RotateCcw className="w-3.5 h-3.5" />
            REFUNDED
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            {statusStr}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0b1a13] p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition-all cursor-pointer shadow-2xs mr-1"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Back</span>
            </button>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Payment Transactions
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Verified server-side financial audit log & Razorpay transaction receipts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPaymentData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold text-xs transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Processed Volume
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalPaidINR)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Successful Transactions
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {payments.filter((p) => p.status === "PAID").length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gateway Provider
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Razorpay (INR)
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0b1a13] p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, purpose, reference..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-900/60 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["all", "PAID", "CREATED", "FAILED", "REFUNDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-emerald-950/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-emerald-900/60"
              }`}
            >
              {st === "all" ? "All Statuses" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white dark:bg-[#0b1a13] rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Retrieving encrypted payment records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No payment records found</p>
            <p className="text-xs mt-1">Complete a purchase on the Eco Marketplace to see real payment records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order Reference</th>
                  <th className="py-3.5 px-6">Purpose</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/30 text-xs font-semibold">
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.order_id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {p.gateway_order_id}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {(p.metadata?.title_summary as string) || p.purpose}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium">
                        {p.related_entity_type}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {formatCurrency(p.amount_inr)}
                      </span>
                    </td>
                    <td className="py-4 px-6">{renderStatusBadge(p.status)}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-emerald-800"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedPayment(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0b1a13] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Payment Receipt & Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {refundMsg && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-semibold">
                {refundMsg}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedPayment.order_id}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Gateway Order ID:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {selectedPayment.gateway_order_id}
                </span>
              </div>

              {selectedPayment.gateway_payment_id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                  <span className="text-slate-500 dark:text-slate-400">Gateway Payment ID:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPayment.gateway_payment_id}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <div>{renderStatusBadge(selectedPayment.status)}</div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Amount Paid:</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(selectedPayment.amount_inr)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Receipt Ref:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {selectedPayment.receipt_reference}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400">Created At:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {formatDate(selectedPayment.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedPayment.status === "PAID" && (
                <button
                  onClick={() => handleRefund(selectedPayment.id)}
                  disabled={refundLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs transition-colors cursor-pointer border border-purple-200 dark:border-purple-800"
                >
                  <RotateCcw className={`w-4 h-4 ${refundLoading ? "animate-spin" : ""}`} />
                  <span>Request Refund</span>
                </button>
              )}

              <button
                onClick={() => setSelectedPayment(null)}
                className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
