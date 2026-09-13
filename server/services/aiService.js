const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Service to improve a resume summary using Gemini
 */
const improveSummary = async (currentSummary, skills, experience) => {
  if (!genAI) {
    throw new Error('Gemini API key is missing. AI features are disabled.');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          improvedSummary: { type: SchemaType.STRING },
          suggestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          }
        },
        required: ["improvedSummary", "suggestions"]
      }
    }
  });

  const prompt = `
    You are an expert career coach and resume writer. 
    Improve the following professional summary to make it more impactful, professional, and ATS-friendly.
    
    Current Summary: ${currentSummary || 'None provided'}
    Relevant Skills: ${skills || 'None provided'}
    Experience Context: ${experience || 'None provided'}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI improvement. Please try again later.');
  }
};

/**
 * Service to calculate Job Match using Gemini
 */
const calculateJobMatch = async (resumeData, jobDescription, requiredSkills) => {
  if (!genAI) {
    throw new Error('Gemini API key is missing. AI features are disabled.');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: {
      temperature: 0.2, // lower temperature for more deterministic analysis
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          overallScore: { type: SchemaType.NUMBER },
          label: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
          skillsAnalysis: {
            type: SchemaType.OBJECT,
            properties: {
              matching: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              missing: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              additional: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            },
            required: ["matching", "missing", "additional"]
          },
          recommendation: { type: SchemaType.STRING },
          improvementSteps: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                desc: { type: SchemaType.STRING }
              },
              required: ["title", "desc"]
            }
          },
          breakdown: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                category: { type: SchemaType.STRING },
                score: { type: SchemaType.NUMBER }
              },
              required: ["category", "score"]
            }
          }
        },
        required: [
          "overallScore", "label", "explanation", "skillsAnalysis", 
          "recommendation", "improvementSteps", "breakdown"
        ]
      }
    }
  });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) software. 
    Compare the candidate's resume against the job description and required skills.
    
    Candidate Resume Data: ${JSON.stringify(resumeData)}
    Job Description: ${jobDescription}
    Required Skills: ${requiredSkills}

    Analyze the match and return your response in the strictly required JSON format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to calculate AI job match. Please try again later.');
  }
};

module.exports = {
  improveSummary,
  calculateJobMatch
};
