import { ChevronRight } from "lucide-react";
import { useEditor } from "../../context/EditorContext";

// Usage: <Breadcrumb path={["pages", "index.vue", "template", "div"]} />
export function Breadcrumb({ path = [] }) {
  const { theme, settings } = useEditor();
  const palette = settings?.themeColors?.[theme] || {};

  return (
    <div
      className="flex items-center h-6 mt-1 text-xs px-2 border-b"
      style={{
        background: palette.editorBackground || "#1e1e1e",
        color: palette.editorForeground || "#cccccc",
        borderColor: palette.border || "#1a1a1a",
      }}
    >
      {path.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            style={{
              color: palette.breadcrumbForeground || "#888888",
            }}
          >
            {item}
          </span>
          {i < path.length - 1 && (
            <ChevronRight
              className="h-3 w-3 mx-1"
              color={
                palette.breadcrumbSeparator ||
                palette.editorForeground ||
                "#cccccc"
              }
            />
          )}
        </span>
      ))}
    </div>
  );
}
