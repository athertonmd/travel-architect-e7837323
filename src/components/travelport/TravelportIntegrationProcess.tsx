
import React from "react";

export function TravelportIntegrationProcess() {
  return (
    <div className="mb-6 p-4 border border-purple-500/20 rounded-md bg-navy-light/50">
      <h3 className="text-lg font-medium mb-2 text-zinc-50">Travelport Integration Process</h3>
      <ol className="list-decimal list-inside space-y-3 text-white/90">
        <li>
          Set up your Travelport profile with the required PCC
        </li>
        <li>
          Configure the branch settings in your Travelport system
        </li>
        <li>
          Assign a dedicated queue for Trip Builder in your Travelport configuration
        </li>
        <li>
          Enter your credentials on this page and save them
        </li>
        <li>
          Trip Builder will validate your credentials and establish the connection
        </li>
      </ol>
    </div>
  );
}
