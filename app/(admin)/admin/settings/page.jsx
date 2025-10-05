// app/settings/page.jsx

import React from "react";
import { SettingsForm } from "./_components/settings-form"; // ⬅️ FIXED: Changed to a NAMED IMPORT

export const metadata = {
  title: "Settings | GearVana Admin",
  description: "Manage dealership working hours and admin users",
};

const SettingsPage = () => {
  return (
    <div className="p-6">
      {/* Note: Corrected typo from "text-2x1" to "text-2xl" */}
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <SettingsForm />
    </div>
  );
};

export default SettingsPage;