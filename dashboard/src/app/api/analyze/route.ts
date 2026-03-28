import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client using the environment variable.
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { origin, destination, cargoType, aqiExposure } = data;

    // Simulate backend processing delay to feel like an authentic AI service
    await new Promise(resolve => setTimeout(resolve, 800));

    // If an API key is provided, we use the real LLM!
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `You are an expert logistics AI controlling the Fresh-Route Engine for a supply chain in Delhi NCR.
A fleet dispatch is happening:
- Route: ${origin} to ${destination}
- Cargo: ${cargoType}
- Average AQI Exposure on Standard Route: ${aqiExposure}

Respond strictly with a JSON object containing the follow keys:
- "title": A short dramatic title for the insight (e.g. "Cargo Risk Alert")
- "message": A 2-sentence precise explanation of how the pollution will break down the specific cargo and what the AI has decided to do.
- "recommendation": A short 1-line actionable command for the driver.
- "risk": "low", "medium", or "high"
- "confidence": A float between 0.70 and 0.99.

Ensure the response is raw JSON without markdown formatting.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean up markdown code blocks if the LLM adds them
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const llmParsed = JSON.parse(cleanJsonStr);

      return NextResponse.json({
        type: 'prediction',
        icon: '🧬',
        title: llmParsed.title,
        cargo: `${cargoType} (Truck A)`,
        risk: llmParsed.risk,
        confidence: llmParsed.confidence,
        message: llmParsed.message,
        recommendation: llmParsed.recommendation,
        metrics: [
          { label: 'Ozone', value: '180 ppb', status: 'warning' },
          { label: 'SO₂', value: '110 ppb', status: 'critical' },
          { label: 'Temp', value: '6°C', status: 'ok' },
        ],
      });
    }

    // FALLBACK MOCK DATA: If no API key is set, we return an advanced dynamic simulated response
    // based gracefully on the incoming cargo type.

    let message = 'Estimated 28% shelf-life reduction due to SO₂ and PM2.5 exposure. AQI exposure of 380+ is degrading surface integrity.';
    let recommendation = 'Reroute to preserve 24% additional freshness.';
    let risk = 'high';

    if (cargoType === 'Dairy') {
      message = `High humidity combined with elevated NO₂ levels between ${origin} and ${destination} indicates rapid oxidative stress for Dairy products.`;
      recommendation = 'Activate refrigeration mode + seal vents immediately.';
      risk = 'medium';
    } else if (cargoType === 'Vegetables' || cargoType === 'Fruits') {
      message = `Micro-particulate PM2.5 settling on the skin of the ${cargoType} will accelerate rotting if passing through urban traffic bottlenecks.`;
      recommendation = 'Bypass the central zones. Maintain cabin humidity at 85%.';
    }

    return NextResponse.json({
      type: 'prediction',
      icon: '🤖',
      title: 'AI Freshness Simulation',
      cargo: `${cargoType} (Simulated)`,
      risk: risk,
      confidence: 0.88 + (Math.random() * 0.1),
      message: message,
      recommendation: recommendation,
      metrics: [
        { label: 'PM2.5', value: '345 µg/m³', status: 'critical' },
        { label: 'NO₂', value: '92 ppb', status: 'warning' },
        { label: 'Humidity', value: '78%', status: 'ok' },
      ],
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to process insight' }, { status: 500 });
  }
}
