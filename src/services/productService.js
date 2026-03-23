import api from "./api";

export const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   */
  async getProducts() {
    try {
      const response = await api.get("products.json");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  /**
   * Tìm kiếm sản phẩm
   */
  async searchProducts(query) {
    try {
      const response = await api.get("/api/products/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  /**
   * Lấy sản phẩm theo danh mục
   */
  async getProductsByCategory(categoryId) {
    try {
      const response = await api.get(`/api/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
};
