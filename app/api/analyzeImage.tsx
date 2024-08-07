import OpenAI from "openai/index.mjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  error?: string;
  choices?: { text: string }[];
};

const openai = new OpenAI();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.send({message: "Hello world"})
  if (req.method === "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageBase64 } = req.body;
  console.log("image: ", imageBase64);

  const userPrompt = `
        Create a json structure for this image which should list out the item, quantity, and 
        expiration data if found. Return only the json structure :\n\n![image](data:image/jpeg;base64,${imageBase64})`;
  const systemPrompt = `
        You are a pantry specialist with an extensive experience identifying pantry items from pictures. 
        You can accurately count the number of pantry items that is presented to you. Return the json structure of the 
        following image containing the following fields: item, quantity, and expiry date if found. Return only json structure
    `;
  let analysisText;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "gpt-4-vision-preview",
      max_tokens: 500,
    });

    analysisText = completion.choices[0].message.content;
    if (!analysisText) {
      throw new Error("No content received from OpenAI");
    }
  } catch (err) {
    res.status(500).json({ message: "Error connecting to OpenAI API", error: err.message });
  }


  console.log("analysis text: ", analysisText);
}
