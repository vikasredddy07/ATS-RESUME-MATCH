
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, OptimizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    optimizedResume: {
      type: Type.OBJECT,
      properties: {
        personalInfo: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            website: { type: Type.STRING },
          },
          required: ["fullName", "email", "phone", "location"],
        },
        summary: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              description: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["company", "role", "startDate", "endDate", "description"],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              school: { type: Type.STRING },
              degree: { type: Type.STRING },
              graduationDate: { type: Type.STRING },
              location: { type: Type.STRING },
            },
            required: ["school", "degree", "graduationDate"],
          },
        },
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["personalInfo", "summary", "experience", "education", "skills"],
    },
    atsScore: { type: Type.NUMBER },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    matchedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["optimizedResume", "atsScore", "suggestions", "matchedKeywords", "missingKeywords"],
};

export async function optimizeResume(
  currentResume: string,
  jobDescription: string
): Promise<OptimizationResult> {
  const prompt = `
    Act as a World Class Resume Writer specializing in 100% ATS (Applicant Tracking System) Matching.
    
    CRITICAL RULES FOR 100% MATCHING:
    1. KEYWORD INJECTION: Extract every single technical skill, tool, and soft skill from the Job Description. Naturally weave these into the Professional Summary and Experience bullet points.
    2. STANDARD HEADINGS: Use only standard headings: SUMMARY, EXPERIENCE, EDUCATION, SKILLS. Do not use creative titles like "My Journey" or "Expertise".
    3. BULLET POINTS: Every bullet point must be accomplishment-driven using the STAR method (Situation, Task, Action, Result) or XYZ method (Accomplished [X] as measured by [Y], by doing [Z]).
    4. NO GRAPHICS: Ensure the text content is pure and avoids any reliance on non-text elements.
    5. ATS COMPATIBILITY: Ensure dates use standard formats (e.g., "Jan 2020 - Present") and job titles are clearly stated.
    
    Analyze the provided Resume and Job Description. Optimize the resume for a 100% match.
    
    Current Resume:
    ${currentResume}

    Job Description:
    ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeSchema,
      thinkingConfig: { thinkingBudget: 8000 }
    },
  });

  return JSON.parse(response.text.trim());
}
