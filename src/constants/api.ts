export const isStage = () =>
  window.location.host.includes("stage") ||
  window.location.host.includes("localhost") ||
  window.location.host.includes("dev");

const https = `https://api.cofound.uz/api/hospitals`;

export const baseUrl = {
  https,
};
