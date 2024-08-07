import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  const userPrompt = `
        Create a json structure for this image which should list out the item, quantity, and 
        expiration data if found. Return only the json structure :\n\n![image](data:image/jpeg;base64,${imageBase64})`;
  const systemPrompt = `
        You are a pantry specialist with an extensive experience identifying pantry items from pictures. 
        You can accurately count the number of pantry items that is presented to you. Return the json structure of the 
        following image containing the following fields: item, quantity, and expiry date if found. Return only json structure
    `;
  let data;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "openai/gpt-3.5-turbo",
      max_tokens: 500,
    });

    data = completion.choices[0].message.content;

    if (!data) {
      throw new Error("No content received from OpenAI");
    }
    console.log("analysis text: ", data);
    return NextResponse.json({ description: data }, { status: 200});
  } catch (err) {
    return NextResponse.json(
      { message: "Error connecting to OpenAI API" },
      { status: 500 }
    );
  }

}
