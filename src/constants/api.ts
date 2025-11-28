export const isStage = () =>
  window.location.host.includes("stage") ||
  window.location.host.includes("localhost") ||
  window.location.host.includes("dev");

const https = `https://api.examora.educompass.uz/api/`;
const socket = `wss://api.examora.educompass.uz/`;

export const baseUrl = {
  https,
  socket,
};
