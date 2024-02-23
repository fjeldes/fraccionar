import React from "react";

export default function ItemUf({ icon, title }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="border-2 border-primary rounded-full w-36 h-36 justify-center items-center flex">
        {icon}
      </div>
      <div className="mt-3 text-center">
        <p>{title}</p>
      </div>
    </div>
  );
}
