import axios from 'axios';
import DiagnosisLog from '../models/DiagnosisLog.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// @desc    AI Symptom Checker
// @route   POST /api/ai/symptom-check
// @access  Private (Doctor, Patient)
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    // Validate input
    if (!symptoms || !age || !gender) {
      return res.status(400).json({ 
        error: 'Please provide symptoms, age, and gender' 
      });
    }

    // Fallback response in case AI fails
    const fallbackResponse = {
      possible_conditions: ['Unable to analyze symptoms'],
      severity: 'medium',
      recommendations: [
        'Please consult a doctor for proper diagnosis',
        'Monitor your symptoms',
        'Seek immediate medical attention if symptoms worsen'
      ],
      should_see_doctor: true,
      confidence: 0,
      note: 'AI service temporarily unavailable - showing safe fallback'
    };

    try {
      // Call OpenRouter API
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'You are a medical assistant AI. Analyze symptoms and return ONLY valid JSON. Do not include any text before or after the JSON.'
            },
            {
              role: 'user',
              content: `As a medical assistant, analyze these symptoms and return ONLY JSON:
              
Symptoms: ${symptoms}
Age: ${age}
Gender: ${gender}

Return format (MUST be valid JSON):
{
  "possible_conditions": ["condition1", "condition2", "condition3"],
  "severity": "low",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "should_see_doctor": true,
  "confidence": 0.75
}

Severity must be one of: "low", "medium", "high"
Confidence must be a number between 0 and 1
Include at least 2 possible conditions and 2 recommendations.`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://clinic-management.com',
            'X-Title': 'Clinic Management System'
          }
        }
      );

      // Extract AI response
      let aiContent = response.data.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      aiContent = aiContent.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();

      // Parse JSON response
      let aiResponse;
      try {
        aiResponse = JSON.parse(aiContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return res.json(fallbackResponse);
      }

      // Save to diagnosis log
      await DiagnosisLog.create({
        userId: req.user._id,
        symptoms,
        aiResponse,
        confidence: aiResponse.confidence || 0
      });

      // Return AI response
      res.json(aiResponse);

    } catch (aiError) {
      console.error('AI API Error:', aiError.message);
      
      // Return safe fallback - never crash
      res.json(fallbackResponse);
    }

  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// @desc    Get user's diagnosis history
// @route   GET /api/ai/history
// @access  Private
export const getDiagnosisHistory = async (req, res) => {
  try {
    const diagnosisLogs = await DiagnosisLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: diagnosisLogs.length,
      data: diagnosisLogs
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};
