import { forwardRef } from "react";

const ScrollableContainer = forwardRef(function ScrollableContainer(
  { children }: { children: React.ReactNode },
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div style={{ position: "relative", blockSize: "100%" }}>
      <div
        style={{ position: "absolute", inset: 0, overflowY: "auto" }}
        ref={ref}
        data-testid="chat-scroll-container"
      >
        {children}
      </div>
    </div>
  );
});

export default ScrollableContainer;
