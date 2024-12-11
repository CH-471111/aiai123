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

    console.log('Sending request to DeepSeek API with messages:', messages);
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

    console.log('DeepSeek API response status:', response.status);
    const responseText = await response.text();
    console.log('DeepSeek API raw response:', responseText);

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
      
      if (!response.ok) {
        console.error('API Response not OK:', response.status, data);
        throw new Error(data.error?.message || `API request failed: ${response.status}`);
      }

      if (!data.choices?.[0]?.message) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid API response format');
      }

      const result = data.choices[0].message;
      console.log('Sending response to client:', result);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Failed to parse API response:', responseText);
      throw new Error('API 返回了无效的响应格式');
    }
  } catch (error) {
    console.error('Detailed API Error:', error);
    return NextResponse.json(
      { 
        error: '抱歉，AI 服务暂时不可用，请稍后再试。如果问题持续存在，请联系客服。',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 