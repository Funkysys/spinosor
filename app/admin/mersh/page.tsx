"use client";
import ButtonHome from "@/components/ButtonHome";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";

const MershPage: React.FC = () => {
  const { loading } = useProtectedRoute("ADMIN");

  if (loading) {
    return (
      <div className="min-h-screen bg-perso-bg text-perso-white-one p-6">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <ButtonHome />
      <h1>Welcome to the Mersh Admin Page</h1>
      <p>This is the admin page for managing Mersh content.</p>
    </div>
  );
};

export default MershPage;
