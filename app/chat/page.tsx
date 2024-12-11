'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { getChatResponse } from '../services/ai'
import LoadingSpinner from '../components/LoadingSpinner'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 使用 useCallback 优化函数
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 防抖处理输入
  useEffect(() => {
    if (window.innerWidth > 768) {
      inputRef.current?.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await getChatResponse([...messages, userMessage])
      if (aiResponse.content) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiResponse.content
        } as Message])
      }
    } catch (error) {
      console.error('发生错误:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? error.message : '抱歉，我遇到了一些问题，请稍后再试。'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 消息渲染优化
  const renderMessage = useCallback((message: Message, index: number) => (
    <div
      key={index}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-[var(--primary)] text-white'
            : 'bg-[var(--card-background)] text-[var(--foreground)]'
        } shadow-sm`}
      >
        {message.content}
      </div>
    </div>
  ), [])

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      <header className="bg-[var(--card-background)] shadow-sm p-4 fixed top-0 w-full z-10">
        <h1 className="text-xl font-semibold text-center text-[var(--foreground)]">AI 助手</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 mb-20">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 space-y-4">
            <p>您可以问我��何问题，比如：</p>
            <ul className="space-y-2">
              <li>• 今天应该穿什么衣服？</li>
              <li>• 如何制作红烧肉？</li>
              <li>• 附近有什么好玩的地方？</li>
            </ul>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--card-background)] rounded-lg p-4 shadow-sm">
              <LoadingSpinner />
            </div>
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-[var(--card-background)] border-t border-gray-200 dark:border-gray-800 p-4 fixed bottom-0 w-full"
      >
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                     disabled:bg-gray-100 dark:disabled:bg-gray-800
                     bg-[var(--card-background)] text-[var(--foreground)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg 
                     hover:bg-[var(--primary-hover)] transition-colors 
                     disabled:opacity-50 min-w-[80px]"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </form>
    </div>
  )
} 