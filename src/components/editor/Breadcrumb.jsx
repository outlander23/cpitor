import { ChevronRight } from "lucide-react";

// Usage: <Breadcrumb path={["pages", "index.vue", "template", "div"]} />
export function Breadcrumb({ path = [] }) {
  return (
    <div className="flex items-center h-6 mt-1 bg-[#1e1e1e] text-xs text-gray-400 px-2 border-b border-[#1a1a1a]">
      {path.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="text-gray-500">{item}</span>
          {i < path.length - 1 && <ChevronRight className="h-3 w-3 mx-1" />}
        </span>
      ))}
    </div>
  );
}
