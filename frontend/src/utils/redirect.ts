export const redirectToProvider = (provider:string) => {
  window.location.href = `http://localhost:8000/api/auth/${provider}/redirect`;
};
