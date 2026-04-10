import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-3">
            <div className="modal-header bg-light pb-3">
              <h5
                className="modal-title fw-bold"
                style={{ color: "var(--primary-dark)" }}
              >
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Đóng"
              ></button>
            </div>

            <div className="modal-body p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
