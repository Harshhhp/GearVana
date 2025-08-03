import React from "react";

const CarPage = ({ params }) => {
  const { id } = params;

  return (
    <div className="text-white p-8 text-2xl">
      CarPage: {id}
    </div>
  );
};

export default CarPage;
