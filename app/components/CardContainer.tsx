import React from "react";

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-0 py-4 animate-fade-left">
      {" "}
      {children}
    </div>
  );
};

export default CardContainer;
