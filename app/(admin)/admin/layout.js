import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <section>
      {/* Optional: Custom admin-specific layout styling */}
      {children}
    </section>
  );
}
