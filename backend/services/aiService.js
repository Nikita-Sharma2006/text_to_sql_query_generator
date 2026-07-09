import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatSession from '../models/ChatSession.js';
import Schema from '../models/Schema.js';

// Initialize the Google Generative AI client
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY in .env file.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Clean markdown wrapper from Gemini output text
const cleanJSONResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

/**
 * Generate MySQL query from natural language prompt, incorporating active schemas and conversation memory.
 */
export const generateMySQLQuery = async (userId, prompt) => {
  const genAI = getGenAIClient();
  
  // 1. Fetch user's active schemas to inject as context
  const activeSchemas = await Schema.find({ userId });
  let schemaContext = '';
  if (activeSchemas.length > 0) {
    schemaContext = '\nYou must formulate the query using the following MySQL database structure:\n';
    activeSchemas.forEach(s => {
      schemaContext += `\n/* Schema Scroll: ${s.schemaName} */\n${s.schemaContent}\n`;
    });
  } else {
    schemaContext = '\n(Note: No active schema scrolls are loaded. Generate generic MySQL queries using common table assumptions like users, orders, products, etc. Mention that you assumed the schema structure in the explanation.)\n';
  }

  // 2. Build standard system instructions
  const systemInstruction = `You are Shogun AI, an expert MySQL 8.x Database Administrator.
Your task is to convert the user's natural language request into a high-performance MySQL query.

Rules:
1. Generate ONLY valid, optimized MySQL 8.x query syntax.
2. Do NOT support or output PostgreSQL, SQL Server, Oracle, SQLite, or MariaDB syntax.
3. Return a JSON response matching the following structure. Keep your output in valid, parseable JSON syntax:
   - If the request is ambiguous or lacks enough detail to write correct SQL (e.g. "show sales" or "give me orders" without knowing what columns/period or tables to use), set "needsClarification" to true, and provide a follow-up question in the "question" field. In this mode, do not provide "sql", "explanation", "confidence", or "confidenceReason".
   - If the request is clear, set "needsClarification" to false, and populate:
     - "sql": "The raw MySQL query statement. Do NOT include markdown code blocks inside the SQL string value. Format the SQL with uppercase keywords and indentations (readable, not minified)."
     - "explanation": "An elegant, brief bullet-point breakdown of what the query does."
     - "confidence": "High" | "Medium" | "Low"
     - "confidenceReason": "A brief explanation of why this confidence level was chosen (e.g. Uploaded schema matches requested tables)."

Safety Guidelines:
- If the user asks you to show or access other users' database schemas, favorite queries, or chat history, you must refuse. Set "needsClarification": false, "sql": "SELECT 'Access Denied' AS status;", and explain the refusal politely inside the "explanation" field (e.g., "I cannot access or reveal records belonging to other warriors.").

Database Schema scrolls:
${schemaContext}
`;

  // 3. Fetch user's chat session history for conversation memory
  let session = await ChatSession.findOne({ userId });
  if (!session) {
    session = new ChatSession({ userId, messages: [] });
  }

  // Map messages to Gemini's chat history format
  const history = [];
  session.messages.forEach(msg => {
    if (msg.sender === 'user') {
      history.push({
        role: 'user',
        parts: [{ text: msg.text }]
      });
    } else {
      // Map AI response as JSON string matching the expected model output
      const modelPayload = {
        needsClarification: msg.sql === null,
        sql: msg.sql,
        explanation: msg.explanation
      };
      if (msg.sql === null) {
        modelPayload.question = msg.text;
      }
      history.push({
        role: 'model',
        parts: [{ text: JSON.stringify(modelPayload) }]
      });
    }
  });

  // 4. Initialize model with instructions
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  // 5. Start Gemini Chat with history
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(prompt);
  const responseText = result.response.text();
  
  // 6. Parse response JSON
  let aiOutput;
  const cleanedText = cleanJSONResponse(responseText);
  try {
    aiOutput = JSON.parse(cleanedText);
  } catch (parseError) {
    console.error(`[AI Parser Error] Failed to parse JSON: ${cleanedText}`);
    aiOutput = {
      needsClarification: false,
      sql: 'SELECT * FROM users;',
      explanation: 'Returned default fallback query due to output parsing error.',
      confidence: 'Low',
      confidenceReason: 'Failed to parse Gemini output structure.'
    };
  }

  // 7. Save conversation to ChatSession
  session.messages.push({
    sender: 'user',
    text: prompt
  });

  if (aiOutput.needsClarification) {
    session.messages.push({
      sender: 'ai',
      text: aiOutput.question || 'Could you clarify your request?',
      sql: null,
      explanation: null
    });
  } else {
    session.messages.push({
      sender: 'ai',
      text: 'SQL forged successfully.',
      sql: aiOutput.sql,
      explanation: aiOutput.explanation
    });
  }

  // Keep messages list tidy (limit to last 30 messages)
  if (session.messages.length > 30) {
    session.messages = session.messages.slice(-30);
  }
  await session.save();

  return aiOutput;
};

/**
 * Generate a detailed explanation for a given SQL query
 */
export const explainSQLQuery = async (userId, sql) => {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are Shogun AI, an expert MySQL Database Administrator.
Provide a detailed explanation of the logic, filters, and performance considerations for the following MySQL statement:

${sql}

Format the output as a beautiful, bulleted breakdown using simple English. Avoid excessive technical jargon.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
