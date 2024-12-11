import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('API key is missing');
    return NextResponse.json(
      { error: 'DeepSeek API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages } = body;

    console.log('Sending request to DeepSeek API...');
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response not OK:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices?.[0]?.message) {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid API response format');
    }

    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    console.error('Detailed API Error:', error);
    // 返回更具体的错误信息
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 