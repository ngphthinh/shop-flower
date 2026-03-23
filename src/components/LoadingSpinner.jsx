export default function LoadingSpinner() {
  return (
    <div
      className="d-flex justify-content-center py-5"
      role="status"
      aria-live="polite">
      <div className="spinner-border text-success" aria-hidden="true" />
      <span className="visually-hidden">Đang tải...</span>
    </div>
  );
}
