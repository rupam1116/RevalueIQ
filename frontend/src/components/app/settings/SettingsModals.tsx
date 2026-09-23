"use client";

import React, { useState, useEffect } from "react";
import { X, Key, ShieldCheck, Cookie, Headphones, Bug, Lightbulb, AlertTriangle, Check, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { submitSupportTicket, CookiePreferences } from "@/lib/settingsApi";
import { useAuth } from "@/context/AuthContext";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h3 id="modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// 1. Change Password Modal with Real Firebase Re-Authentication
export const ChangePasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Minimum secure password policy
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPass)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass)) {
      setError("Password must contain at least one special character.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No active authenticated session found.");
      }

      // Authoritative Firebase re-authentication
      const cred = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);

      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      onSuccess();
      onClose();
    } catch (err: any) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-login-credentials"
      ) {
        setError("password is incorrect");
      } else if (err.code === "auth/requires-recent-login") {
        setError("Recent authentication required. Please sign out and sign in again.");
      } else {
        setError(err.message || "Unable to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Current Password</label>
          <input
            type="password"
            required
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">New Password</label>
          <input
            type="password"
            required
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="Min 8 chars, 1 uppercase, 1 special symbol"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder="Re-enter new password"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold cursor-pointer border-0 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Update Password"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

// 2. Two-Factor Authentication Modal (Truthful status per Step 4)
export const Enable2FAModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Two-Factor Authentication (2FA / MFA)">
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            MFA Provider Not Configured
          </p>
          <p className="text-[11px] leading-relaxed">
            Multi-Factor Authentication requires SMS / TOTP multi-factor enrollment enabled on Google Cloud Identity Platform for this Firebase project. In the current standard tier workspace, second-factor verification is not configured.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active Security Controls
          </p>
          <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>Cryptographic password hashing via Firebase Auth (scrypt)</li>
            <li>Cryptographically signed Bearer tokens (RS256)</li>
            <li>Automatic session invalidation on password change or deletion</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer border-0"
          >
            Close
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

// 3. Cookie Preferences Modal with Persistent State
export const CookiePreferencesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cookies?: CookiePreferences;
  onSave: (cookies: CookiePreferences) => Promise<void> | void;
}> = ({ isOpen, onClose, cookies, onSave }) => {
  const [localCookies, setLocalCookies] = useState<CookiePreferences>(
    cookies || {
      essential: true,
      analytics: true,
      marketing: false,
      functional: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cookies) {
      setLocalCookies(cookies);
    }
  }, [cookies]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localCookies);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Granular Cookie Preferences">
      <div className="space-y-4 text-xs">
        <p className="text-slate-600 dark:text-slate-400">
          Manage how cookies are used to store session identity, telemetry, and personalization rules.
        </p>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Strictly Necessary Cookies</p>
              <p className="text-[10px] text-slate-500">Required for login sessions & security checks.</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Always Active</span>
          </div>

          <div
            onClick={() => setLocalCookies((prev) => ({ ...prev, analytics: !prev.analytics }))}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Performance & Telemetry Cookies</p>
              <p className="text-[10px] text-slate-500">Helps analyze page load speeds and app errors.</p>
            </div>
            <input
              type="checkbox"
              checked={localCookies.analytics}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div
            onClick={() => setLocalCookies((prev) => ({ ...prev, marketing: !prev.marketing }))}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Personalization Cookies</p>
              <p className="text-[10px] text-slate-500">Tailors local repair shop discounts and marketplace listings.</p>
            </div>
            <input
              type="checkbox"
              checked={localCookies.marketing}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold cursor-pointer border-0 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

// 4. Delete Account Modal with Strict Text Confirmation
export const DeleteAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfirmed = confirmText.trim().toUpperCase() === "DELETE MY ACCOUNT";

  const handleAction = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Confirm Permanent Account Deletion">
      <div className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Warning: Action Cannot Be Undone
          </p>
          <p className="text-[11px] text-rose-600 dark:text-rose-300/80">
            All device valuations, saved certificates, and personal account records will be closed. Financial transaction records remain stored for legal tax compliance.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">
            To confirm, type <span className="font-mono text-rose-600 dark:text-rose-400">DELETE MY ACCOUNT</span> below:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            placeholder="Type 'DELETE MY ACCOUNT'"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border-0"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmed || loading}
            onClick={handleAction}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Permanently Delete"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

// 5. Support Form Modal with Real Backend Persistence
export const SupportFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: "contact" | "bug" | "feature";
  onSubmitSuccess: (message: string) => void;
}> = ({ isOpen, onClose, type, onSubmitSuccess }) => {
  const { getToken } = useAuth();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTitle = () => {
    if (type === "contact") return "Contact 24/7 Support";
    if (type === "bug") return "Report a Technical Issue / Bug";
    return "Submit a Feature Request";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim().length < 3) {
      setError("Subject must be at least 3 characters.");
      return;
    }
    if (details.trim().length < 10) {
      setError("Please provide at least 10 characters of detail.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token required.");

      await submitSupportTicket(token, {
        type,
        subject: subject.trim(),
        details: details.trim(),
      });

      const msg =
        type === "contact"
          ? "Support ticket submitted! Our team will respond shortly."
          : type === "bug"
          ? "Bug report submitted to RevalueIQ engineering team."
          : "Feature request logged! Thank you for helping shape RevalueIQ.";

      setSubject("");
      setDetails("");
      onSubmitSuccess(msg);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Subject / Short Summary</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
            placeholder={
              type === "bug"
                ? "e.g. AI valuation fails on certain image uploads"
                : type === "feature"
                ? "e.g. Requesting support for additional Indian regional languages"
                : "e.g. Inquiry regarding verified NGO drop-off locations"
            }
            maxLength={150}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Detailed Description</label>
          <textarea
            rows={4}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Please provide step-by-step details or background information..."
            maxLength={3000}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer border-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold cursor-pointer border-0 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};
