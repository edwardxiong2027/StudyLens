import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudyModule, ChartType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the schema for the JSON response
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The normalized name of the topic" },
    summary: { type: Type.STRING, description: "A concise 2-sentence summary of the topic." },
    analogy: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Title of the analogy (e.g., 'The Cell as a City')" },
        story: { type: Type.STRING, description: "A paragraph explaining the topic using a real-world analogy." }
      },
      required: ["title", "story"]
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          emoji: { type: Type.STRING, description: "A single emoji representing this concept" },
          example: { type: Type.STRING, description: "A concrete real-world example of this concept in action." }
        },
        required: ["title", "description", "emoji", "example"]
      }
    },
    chartData: {
      type: Type.OBJECT,
      nullable: true,
      description: "Data to visualize a trend or relationship related to the topic. If no quantitative data applies, return null.",
      properties: {
        title: { type: Type.STRING },
        xAxisLabel: { type: Type.STRING },
        yAxisLabel: { type: Type.STRING },
        type: { type: Type.STRING, enum: [ChartType.BAR, ChartType.LINE, ChartType.AREA] },
        explanation: { type: Type.STRING, description: "Why this graph is relevant." },
        data: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER }
            },
            required: ["name", "value"]
          }
        }
      },
      required: ["title", "xAxisLabel", "yAxisLabel", "type", "data", "explanation"]
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctIndex", "explanation"]
      }
    }
  },
  required: ["topic", "summary", "analogy", "keyConcepts", "quiz"]
};

export const generateStudyModule = async (topic: string): Promise<StudyModule> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a comprehensive study module for high school students about: "${topic}". 
      
      Include:
      1. A simplified summary.
      2. A creative "Like A..." analogy (e.g. explain the topic by comparing it to something everyday like a car, a sport, or a video game).
      3. 4 Key concepts. Provide a clear description and a concrete "Real World Example" for each concept.
      4. A dataset for a chart that visualizes a trend, comparison, or phenomenon related to the topic. For example, if the topic is "The Cold War", maybe a chart of nuclear warhead counts over time. If "Photosynthesis", maybe rate of reaction vs light intensity. BE CREATIVE.
      5. A 3-question quiz.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    
    return JSON.parse(text) as StudyModule;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};