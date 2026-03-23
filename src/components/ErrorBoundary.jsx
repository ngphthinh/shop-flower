import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Có lỗi xảy ra</h4>
            <p>Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại hoặc báo cho quản trị viên.</p>
            <details style={{ whiteSpace: "pre-wrap" }}>
              {String(this.state.error && this.state.error.stack)}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
