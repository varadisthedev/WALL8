// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Auto-categorize expense based on description
exports.categorizeExpense = async (description, amount) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log('Gemini API key not configured, using fallback');
            return 'Others';
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Based on this expense description: "${description}" (amount: ₹${amount}), categorize it into ONE of these categories ONLY: Food, Travel, Shopping, Entertainment, Others. 
        
Respond with ONLY the category name, nothing else.

Examples:
- "lunch at restaurant" -> Food
- "cab to office" -> Travel
- "bought shoes" -> Shopping  
- "movie tickets" -> Entertainment
- "groceries" -> Food
- "electricity bill" -> Others`;

        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        // Validate response
        const validCategories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Others'];
        if (validCategories.includes(response)) {
            console.log(`✨ AI Categorized "${description}" as: ${response}`);
            return response;
        }

        // Fallback to Others if invalid
        console.log('AI returned invalid category, using Others');
        return 'Others';
    } catch (error) {
        console.error('Error in AI categorization:', error.message);
        return 'Others';
    }
};

// Generate spending insights and tips
exports.generateSpendingInsights = async (userData, expenseData, budgetStatus) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return {
                insights: [
                    "Add your Gemini API key to get AI-powered spending insights!",
                    "Visit https://makersuite.google.com/app/apikey to get your free API key."
                ],
                tips: [
                    "Track your expenses regularly",
                    "Set realistic budgets for each category",
                    "Review your spending patterns weekly"
                ]
            };
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a financial advisor helping a student manage their money. Analyze this spending data and provide insights:

User Profile:
- Age: ${userData.age || 'Unknown'}
- Monthly Allowance: ₹${userData.monthlyAllowance || 0}
- Institution: ${userData.institution || 'Unknown'}
- City: ${userData.city || 'Unknown'}

Current Month Spending:
- Total Spent: ₹${budgetStatus.currentMonth?.total || 0}
- Transactions: ${budgetStatus.currentMonth?.count || 0}
- Average Transaction: ₹${budgetStatus.currentMonth?.average || 0}

Budget Status:
- Budget Remaining: ₹${budgetStatus.remaining || 0}
- Over Budget: ${budgetStatus.isOverBudget ? 'Yes' : 'No'}

Top Categories:
${expenseData.topCategories?.map(c => `- ${c.category}: ₹${c.total}`).join('\n') || 'No data'}

Please provide:
1. 3-4 key insights about their spending patterns (be specific with numbers)
2. 3-4 actionable tips to improve their financial habits (relevant to students)

Format your response as JSON:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        // Try to parse JSON response
        try {
            // Remove markdown code blocks if present
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanResponse);
            console.log('✨ Generated AI Insights successfully');
            return parsed;
        } catch (parseError) {
            console.error('Failed to parse AI response, using fallback');
            return {
                insights: [
                    `You've spent ₹${budgetStatus.currentMonth?.total || 0} this month across ${budgetStatus.currentMonth?.count || 0} transactions.`,
                    budgetStatus.isOverBudget
                        ? "You're over budget. Consider reducing non-essential spending."
                        : `You have ₹${budgetStatus.remaining || 0} remaining in your budget.`,
                    "Track your expenses daily to stay within your budget."
                ],
                tips: [
                    "Set spending limits for each category",
                    "Review your expenses weekly",
                    "Look for ways to save on regular expenses"
                ]
            };
        }
    } catch (error) {
        console.error('Error generating insights:', error.message);
        return {
            insights: [
                "Unable to generate AI insights at this time.",
                `You've spent ₹${budgetStatus.currentMonth?.total || 0} this month.`,
                "Keep tracking your expenses to build better habits."
            ],
            tips: [
                "Review your spending patterns regularly",
                "Set realistic budgets",
                "Save a portion of your allowance each month"
            ]
        };
    }
};
