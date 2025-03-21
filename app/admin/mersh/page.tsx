import ButtonHome from "@/components/ButtonHome";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React from "react";

const MershPage: React.FC = () => {
  const { loading } = useProtectedRoute("ADMIN");

  if (loading) {
    return <p>Chargement...</p>;
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
