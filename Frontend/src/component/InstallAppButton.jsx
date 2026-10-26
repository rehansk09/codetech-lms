import React, { useEffect, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";

const isIosDevice = () => /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

const InstallAppButton = ({ mobile = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [installed, setInstalled] = useState(() => isStandalone());

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!deferredPrompt && !isIosDevice())) return null;

  const install = async () => {
    if (isIosDevice()) {
      setShowIosHelp(true);
      return;
    }
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome !== "accepted") setDeferredPrompt(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={install}
        className={mobile ? "inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300" : "inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950"}
      >
        <Download className="h-4 w-4" /> Install app
      </button>

      {showIosHelp && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Install Codetech">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Smartphone className="h-5 w-5" /></span><button onClick={() => setShowIosHelp(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button></div>
            <h2 className="mt-5 text-xl font-semibold">Install Codetech</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">In Safari, tap the <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200"><Share className="h-3.5 w-3.5" /> Share</span> button, then choose <strong>Add to Home Screen</strong>.</p>
            <button onClick={() => setShowIosHelp(false)} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Got it</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallAppButton;
