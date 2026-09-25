import { Modal } from "./Modal";

export function Confirm({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  subtle,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  subtle?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="muted" style={{ lineHeight: 1.5, margin: "2px 0 16px" }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost grow" onClick={onClose}>
          Cancel
        </button>
        <button
          className={`btn ${subtle ? "btn-primary" : "btn-danger"} grow`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}