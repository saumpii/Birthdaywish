import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });

    const data = await response.json();

    // Check if there's an error in the API response
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || 'API Error' },
        { status: 400 }
      );
    }

    // Check if we have the expected response structure
    if (!data.content || !data.content[0] || !data.content[0].text) {
      return NextResponse.json(
        { error: 'Unexpected API response format' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      wish: data.content[0].text
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate wish' },
      { status: 500 }
    );
  }
}