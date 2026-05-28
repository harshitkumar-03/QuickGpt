import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function test() {

  try {

    const completion =
      await openai.chat.completions.create({

        model: "google/gemini-2.0-flash-001",

        messages: [
          {
            role: "user",
            content: "Hello",
          },
        ],

      });

    console.log(
      completion.choices[0].message.content
    );

  } catch (error) {

    console.log(error);

  }

}

test();