import { chatbotClient } from  "../utils/axiosClient.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


// POST /api/v1/chatbot/chat
export const chat = asyncHandler(async (req,res) => {
    const { query, thread_id} = req.body;

    if(!query){
        throw new ApiError(400, "query is required");
    }

   try {
     const { data } = await chatbotClient.post("/chat",{
        query,
        thread_id,
    });

    return res.status(200).json(
        new ApiResponse(200, data, "Chat response fetched", req.id)
    );
   } catch (error) {
    console.error("Chatbot error:", err.message);

    if (err.code === "ECONNABORTED") {
      throw new ApiError(504, "Chatbot service timeout");
   }
   throw new ApiError(
      err.response?.status || 500,
      err.response?.data?.detail || "Chatbot service failed"
    );
}
    
});

// POST /api/v1/chatbot/chat/stream

export const chatStream = asyncHandler(async (req, res) => {
  const { query, thread_id } = req.body;

  if (!query) {
    throw new ApiError(400, "query is required");
  }

  const response = await chatbotClient.post(
    "/chat/stream",
    { query, thread_id },
    { responseType: "stream" }
  );

  res.setHeader("Content-Type", "application/json");

  response.data.pipe(res);
});

// POST /api/v1/chatbot/suggest
export const suggest = asyncHandler(async (req, res) => {
  const { final_answer, thread_id } = req.body;

  if (!final_answer) {
    throw new ApiError(400, "final_answer is required");
  }

  const { data } = await chatbotClient.post("/suggest", {
    final_answer,
    thread_id,
  });

  return res.status(200).json(
    new ApiResponse(200, data, "Suggestions fetched", req.id)
  );
});

// GET /api/v1/chatbot/health
export const health = asyncHandler(async (req, res) => {
  const { data } = await chatbotClient.get("/health");

  return res.status(200).json(
    new ApiResponse(200, data, "Chatbot service healthy", req.id)
  );
});