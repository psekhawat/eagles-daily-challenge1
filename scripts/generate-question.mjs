import fs from "node:fs/promises";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const out = "data/today.json";
const now = new Date();
const date = new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York"}).format(now);

const prompt = `Create ONE Eagles (Philadelphia Eagles) trivia question for ${date}.
Difficulty: medium to hard. Four multiple-choice answers, exactly one correct.
Prefer historical/team/player/stat questions that can be fact-checked.
Do not ask about rumors. Do not repeat the existing question if provided.
Return ONLY valid JSON with:
{"date":"YYYY-MM-DD","question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}
correct is the zero-based index. Keep the explanation concise.
Existing question: ${(await fs.readFile(out,"utf8").catch(()=>'' )).slice(0,1000)}`;

const response = await client.responses.create({
  model: process.env.OPENAI_MODEL || "gpt-5",
  tools: [{type:"web_search"}],
  input: prompt
});

let raw = response.output_text.trim().replace(/^```json\s*/,"").replace(/```$/,"").trim();
const q = JSON.parse(raw);
if(q.date!==date || !q.question || !Array.isArray(q.options) || q.options.length!==4 ||
   !Number.isInteger(q.correct) || q.correct<0 || q.correct>3 || !q.explanation) throw new Error("Invalid AI question");
await fs.writeFile(out, JSON.stringify(q,null,2)+"\n");
console.log(`Generated Eagles question for ${date}`);
