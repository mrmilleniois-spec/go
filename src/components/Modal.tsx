import type { ReactNode } from "react";
import { IconX } from "./Icons";

export function Modal({
  open,
  onClose,
  title,
  children,
  sheet = true,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  sheet?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={`modal ${sheet ? "modal-sheet" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <span className="modal-title">{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}