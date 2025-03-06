import React from "react";
export function SabreIntegrationProcess() {
  return <div className="mb-6 p-4 border border-gold/20 rounded-md bg-navy-light/50">
      <h3 className="text-lg font-medium mb-2 text-zinc-50">Sabre Integration Process</h3>
      <ol className="list-decimal list-inside space-y-3 text-white/90">
        <li>
          The TMC will set-up a Branch Access with Sabre for all required PCCs with the Mantic Point PCCs: 
          <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4UH</span> and
          <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4SH</span> to allow access to read PNR data via Sabre Queue Placement (QP)
        </li>
        <li>The TMC will advise Mantic Point once the process has been completed</li>
        <li>Mantic Point developer team will assign a Trip Builder queue</li>
        <li>Mantic Point will advise the TMC once the access has been granted by Sabre</li>
        <li>
          The TMC will queue all or certain PNRs to Mantic Point's PCC: 
          <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4UH</span>
        </li>
      </ol>
    </div>;
}