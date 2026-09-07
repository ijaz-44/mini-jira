import api from "@/services/api";
// Re-exporting configured instance so all imports use the same interceptors & credentials
export { api };
export default api;