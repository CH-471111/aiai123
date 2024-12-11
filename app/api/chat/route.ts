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

    let errorText;
    try {
      errorText = await response.text();
      // 尝试解析响应为 JSON
      const data = JSON.parse(errorText);
      
      if (!response.ok) {
        console.error('API Response not OK:', response.status, data);
        throw new Error(data.error?.message || `API request failed: ${response.status}`);
      }

      if (!data.choices?.[0]?.message) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid API response format');
      }

      return NextResponse.json(data.choices[0].message);
    } catch (parseError) {
      // 如果响应不是有效的 JSON
      console.error('Failed to parse API response:', errorText);
      throw new Error('API 返回了无效的响应格式');
    }
  } catch (error) {
    console.error('Detailed API Error:', error);
    // 返回用户友好的错误信息
    return NextResponse.json(
      { 
        error: '抱歉，AI 服务暂时不可用，请稍后再试。如果问题持续存在，请联系客服。',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 