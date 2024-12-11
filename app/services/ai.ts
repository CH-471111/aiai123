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
      throw new Error('API 请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('AI API 调用错误:', error);
    throw error;
  }
} 