// Import types
import type { ReactNode } from "react";

export default function FittedContainer({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "relative", flexGrow: 1 }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}
