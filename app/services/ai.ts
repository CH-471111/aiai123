async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getChatResponse(messages: Array<{role: 'user' | 'assistant', content: string}>) {
  const maxRetries = 2;
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const response = await fetchWithTimeout('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      }, 30000); // 30秒超时

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }

      if (!data.content) {
        throw new Error('API 响应格式错误');
      }

      return data;
    } catch (error) {
      console.error(`尝试 ${retryCount + 1}/${maxRetries + 1} 失败:`, error);
      if (retryCount === maxRetries) {
        throw new Error('抱歉，AI 助手暂时无法回应，请稍后再试。');
      }
      retryCount++;
      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
    }
  }
} 