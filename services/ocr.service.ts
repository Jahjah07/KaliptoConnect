import axios from "axios";

const VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_KEY;

export async function runOCR(base64: string) {
  const res = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
    {
      requests: [
        {
          image: { content: base64.replace("data:image/jpeg;base64,", "") },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    }
  );

  return res.data.responses[0].fullTextAnnotation?.text || "";
}
