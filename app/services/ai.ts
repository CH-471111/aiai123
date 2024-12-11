export async function getChatResponse(messages: Array<{role: 'user' | 'assistant', content: string}>) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '请求失败');
    }

    const data = await response.json();
    if (!data.content) {
      throw new Error('API 响应格式错误');
    }

    return data;
  } catch (error) {
    console.error('AI API 调用错误:', error);
    throw error;
  }
} 