# Setting up Gemini AI Integration

## Get Your Free Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

## Add to Your Server

Open `server/.env` and add:

```
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key from Google AI Studio.

## Features Enabled

Once you add the API key and restart the server, you'll get:

### 1. **Auto-Categorization** 
- Leave category blank when adding expenses
- Just add a description (note)
- AI will automatically categorize it as Food, Travel, Shopping, Entertainment, or Others

Example:
- "bought groceries" → Food
- "uber to office" → Travel
- "new shoes" → Shopping
- "movie tickets" → Entertainment

### 2. **AI Spending Insights**
- Go to the Insights tab
- Get personalized tips based on your spending patterns
- Receive budget management advice
- Get insights specific to students

### 3. **Smart Analysis**
- AI analyzes your spending vs. monthly allowance
- Warns you when approaching budget limits
- Provides actionable tips to save money
- Understands student life and gives relevant advice

## Restart Server

After adding the API key:

1. Stop the server (Ctrl+C)
2. Run `npm start` again
3. The AI features will now be active!

## Cost

The Gemini API has a generous free tier:
- 15 requests per minute
- 1500 requests per day
- Perfect for personal use!

No credit card required for the free tier.
