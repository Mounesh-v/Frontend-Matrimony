import React from "react";

const LoadingSpinner = ({ size = "40px", color = "#C2185B" }) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    ></div>
  );
};

export default LoadingSpinner;
