
import { GoogleGenAI } from "@google/genai";
import { SaleRecord } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeSalesData = async (salesData: SaleRecord[]): Promise<string> => {
  if (!API_KEY) {
    return "AI analysis is disabled. Please configure your Gemini API key.";
  }
  if (salesData.length === 0) {
    return "No sales data to analyze.";
  }

  const dataSummary = salesData.map(r => ({
    product: r.productName,
    customer: r.customerName,
    region: r.region,
    salesperson: r.salesperson,
    quantity: r.quantity,
    total: r.totalAmount
  }));

  const prompt = `
    You are a senior sales analyst. Based on the following sales data in JSON format, provide a concise summary of key insights and trends.
    Focus on:
    - Top-performing products and customers.
    - Regional performance.
    - Any noticeable patterns in sales or discounts.
    - Provide actionable recommendations.
    
    Format your response in markdown.

    Sales Data:
    ${JSON.stringify(dataSummary, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while analyzing the data with Gemini. Please check the console for details.";
  }
};
