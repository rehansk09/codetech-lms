import React from "react";
import { RefreshCw, WifiOff, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

const PwaUpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 z-[60] mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-4 text-white shadow-2xl sm:bottom-7 sm:left-7 sm:right-auto">
      <div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">{needRefresh ? <RefreshCw className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{needRefresh ? "A Codetech update is ready" : "Codetech is ready offline"}</p><p className="mt-1 text-xs leading-5 text-slate-300">{needRefresh ? "Refresh to use the latest version." : "Previously visited pages and app assets are now available offline."}</p>{needRefresh && <button onClick={() => updateServiceWorker(true)} className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold hover:bg-blue-500">Refresh now</button>}</div><button onClick={() => { setOfflineReady(false); setNeedRefresh(false); }} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Dismiss"><X className="h-4 w-4" /></button></div>
    </div>
  );
};

export default PwaUpdatePrompt;
