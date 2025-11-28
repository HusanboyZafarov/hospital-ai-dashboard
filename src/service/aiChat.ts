import { axiosInstance } from "../jwt";

interface AIChatResponse {
  answer: string;
  // Add other fields if API returns more
}

const postAiChat = (question: string): Promise<AIChatResponse> => {
  return axiosInstance
    .post("/ai-chat/", { question })
    .then((res) => res.data)
    .catch((err) => {
      console.error("AI chat error:", err);
      throw err;
    });
};

const aiChatService = {
  postAiChat,
};

export default aiChatService;
