import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Hook đơn giản để fetch dữ liệu từ API
 * @param {string} url - URL endpoint cần fetch
 * @param {boolean} enabled - Có fetch ngay hay không (default: true)
 * @returns {object} { data, loading, error, refetch }
 */
export function useFetch(url, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [url, enabled]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}
