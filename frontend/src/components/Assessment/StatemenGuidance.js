import React from "react";
import { Info } from "lucide-react"; // optional, or use a simple 'i' character
 
const StatementGuidance = ({ statement, guidance }) => {
  return (
<div className="relative flex items-start gap-2 my-2">
<div className="group relative cursor-pointer">
<Info size={16} className="text-blue-600" />
 
        {/* Tooltip */}
<div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg w-64">
          {guidance}
</div>
</div>
 
      <p className="text-base">{statement}</p>
</div>
  );
};
 
export default StatementGuidance;