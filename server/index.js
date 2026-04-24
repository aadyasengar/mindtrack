import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Clients
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: Sentiment & Distress Analysis
const analyzeSentiment = (message) => {
  const lowMsg = message.toLowerCase();
  const negativeWords = ['sad', 'tired', 'anxious', 'stressed', 'lonely', 'depressed', 'angry', 'hurt'];
  const positiveWords = ['happy', 'good', 'excited', 'grateful', 'peaceful', 'loved', 'joy'];

  if (negativeWords.some(word => lowMsg.includes(word))) return 'stressed';
  if (positiveWords.some(word => lowMsg.includes(word))) return 'positive';
  return 'neutral';
};

const detectDistress = (message) => {
  const lowMsg = message.toLowerCase();
  const distressKeywords = [
    "can't take this", "hopeless", "disappear", "nothing matters", 
    "giving up", "hurt myself", "end it all", "don't want to be here"
  ];
  return distressKeywords.some(keyword => lowMsg.includes(keyword));
};

// 1. Chat System
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // Fetch conversation memory (last 5 messages)
    const { data: history } = await supabase
      .from('chats')
      .select('message, response')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const mood = analyzeSentiment(message);

    // Prepare messages for OpenAI
    const messages = [
      { 
        role: 'system', 
        content: `You are a calm, empathetic, and supportive mental wellness assistant. 
        
Rules:
- Do NOT give medical or clinical diagnoses.
- Be warm, human-like, and concise (2-3 sentences max).
- Avoid repetitive structures. If a user repeats an emotion, acknowledge it and suggest a small action.
- Always include a gentle follow-up prompt (e.g., "Want to share more?", "What's on your mind?").
- If the user asks for advice or "what to do", suggest one small action (breathing, break, journaling).
- Adapt your tone:
  - stressed → calming, grounding, suggests breathing.
  - sad → comforting, validating, stays present.
  - happy → encouraging, joyful, asks for details.
  
Tone: supportive, human-like, short.`
      }
    ];

    // Add history (last 5 messages)
    if (history && history.length > 0) {
      history.reverse().forEach(chat => {
        messages.push({ role: 'user', content: chat.message });
        messages.push({ role: 'assistant', content: chat.response });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    let aiResponse;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 150,
        temperature: 0.8 // Increased temperature for more variety
      });
      aiResponse = completion.choices[0].message.content;
    } catch (apiError) {
      console.error('OpenAI Error, using fallback:', apiError);
      aiResponse = getFallbackResponse(mood, message, history);
    }

    // Store in DB
    await supabase.from('chats').insert([
      { user_id: userId, message: message, response: aiResponse, mood: mood }
    ]);

    const isDistressed = detectDistress(message);

    res.json({ 
      response: aiResponse, 
      mood: mood,
      isDistressed: isDistressed
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper: Fallback Responses (Varied and Context-Aware)
const getFallbackResponse = (mood, message, history) => {
  const variations = {
    stressed: [
      "That sounds overwhelming. Want to take a moment to breathe together?",
      "I hear you. Things feel like a lot right now, don’t they?",
      "It’s okay to feel this way. Let’s slow things down for a moment."
    ],
    sad: [
      "I’m really sorry you’re feeling like this. Do you want to talk about it?",
      "That sounds tough. I’m here to listen.",
      "You don’t have to go through this alone."
    ],
    positive: [
      "That’s great to hear! What’s been going well?",
      "I love that 😊 Tell me more!",
      "Sounds like a good moment — what made it special?"
    ],
    neutral: [
      "I'm listening. What else is on your mind?",
      "I see. How does that make you feel?",
      "Thanks for sharing that with me."
    ]
  };

  // Check for "what to do" intent
  if (message.toLowerCase().includes("what do i do") || message.toLowerCase().includes("help me")) {
    return "Let's try something small—take 5 slow breaths with me. Or maybe a 2-minute stretch? Which sounds better right now?";
  }

  // Context Awareness: Check if user is repeating mood
  const lastMood = history?.[0]?.mood;
  if (lastMood === mood && mood === 'stressed') {
    return "I noticed you're still feeling quite stressed. Do you want to try a quick breathing exercise or talk about what's causing it?";
  }

  const list = variations[mood] || variations.neutral;
  const response = list[Math.floor(Math.random() * list.length)];
  const followUp = [" Want to share more?", " What’s been on your mind?", " Do you think something specific triggered this?"];
  
  return response + followUp[Math.floor(Math.random() * followUp.length)];
};

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('chats')
      .select('message, response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Mood Tracker
app.post('/api/mood', async (req, res) => {
  try {
    const { userId, mood, note } = req.body;
    const { data, error } = await supabase.from('moods').insert([
      { user_id: userId, mood, note }
    ]);
    if (error) throw error;
    res.json({ message: 'Mood logged successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/mood/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Mood Analytics
app.get('/api/mood/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('moods')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const moodCounts = data.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
    
    let insight = "You've been maintaining a steady mood lately.";
    if (mostFrequentMood === 'stressed') {
      insight = "You've been feeling stressed frequently this week. Remember to take small breaks.";
    } else if (mostFrequentMood === 'sad') {
      insight = "You've been feeling low lately. Be kind to yourself and reach out to someone if needed.";
    } else if (mostFrequentMood === 'happy') {
      insight = "You've had a great week! Keep that positive energy going.";
    }

    res.json({ 
      mostFrequentMood, 
      insight,
      count: data.length,
      history: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Journaling System
app.post('/api/journal', async (req, res) => {
  try {
    const { userId, title, content, mood } = req.body;
    const { data, error } = await supabase.from('journals').insert([
      { user_id: userId, title, content, mood }
    ]);
    if (error) throw error;
    res.json({ message: 'Journal saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/journal/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Self-Help API
app.get('/api/self-help', (req, res) => {
  res.json({
    breathing: [
      { name: "Box Breathing", steps: "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s", benefit: "Calms the nervous system" },
      { name: "4-7-8 Technique", steps: "Inhale 4s, Hold 7s, Exhale 8s", benefit: "Helps with sleep and anxiety" }
    ],
    journaling: [
      "What are three things you are grateful for today?",
      "Describe a moment today when you felt at peace.",
      "What is one challenge you overcame recently?"
    ],
    tips: [
      "Take a 5-minute walk outside.",
      "Drink a warm cup of herbal tea.",
      "Practice 2 minutes of mindful stretching."
    ]
  });
});

// 5. Weekly AI Report (WOW Feature)
app.get('/api/report/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch last 7 days of moods and chats
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: moods } = await supabase
      .from('moods')
      .select('mood, note')
      .eq('user_id', userId)
      .gte('created_at', weekAgo);

    const { data: chats } = await supabase
      .from('chats')
      .select('message, mood')
      .eq('user_id', userId)
      .gte('created_at', weekAgo);

    const moodSummary = moods?.map(m => m.mood).join(', ') || 'No moods logged';
    const chatSummary = chats?.map(c => c.message).join(' | ') || 'No chats recorded';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: 'system', 
          content: 'You are a compassionate wellness coach. Analyze the user\'s week and provide a supportive 2-3 sentence summary and one actionable tip.' 
        },
        { 
          role: 'user', 
          content: `Moods this week: ${moodSummary}. Recent chat topics: ${chatSummary}. Please generate my weekly wellness report.` 
        }
      ]
    });

    res.json({ report: completion.choices[0].message.content });

  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
