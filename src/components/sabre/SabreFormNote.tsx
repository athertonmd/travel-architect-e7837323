
import React from "react";

export function SabreFormNote() {
  return (
    <div className="text-sm text-white/70 p-4 bg-navy-light/50 rounded-md border border-white/10">
      <p className="font-medium mb-2">Note:</p>
      <p>You may also consider entering an FNBTS- entry to the agency level or specific company level profile, so that all PNR's get queued to the Mantic Point PCC and queue at end transact.</p>
      <p className="mt-2">Example entry: <code className="bg-navy-light px-2 py-1 rounded">FNBTS-P4UH/xxx/11-MANTIC POINT</code></p>
    </div>
  );
}
