import React from "react";

interface CardContainerProps {
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-0 py-4 animate-fade-left mb-16">
      {" "}
      {children}
    </div>
  );
};

export default CardContainer;
