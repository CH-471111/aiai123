import { NextResponse } from 'next/server';

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let lastError: Error | undefined;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (i === maxRetries) break;
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  
  throw lastError || new Error('Failed to fetch after retries');
}

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
    const response = await fetchWithRetry('https://api.deepseek.com/v1/chat/completions', {
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
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices?.[0]?.message) {
      throw new Error('Invalid API response format');
    }

    return NextResponse.json(data.choices[0].message);
  } catch (error) {
    console.error('Detailed API Error:', error);
    
    // 返回更详细的错误信息
    return NextResponse.json(
      { 
        error: '抱歉，AI 服务暂时不可用，请稍后再试。',
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 