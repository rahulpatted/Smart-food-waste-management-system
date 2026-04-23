export const useAuth = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return { token };
};
