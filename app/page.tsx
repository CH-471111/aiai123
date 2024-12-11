import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-cyan-500">
          智能助手
        </h1>
        <p className="text-lg md:text-xl text-[var(--foreground)]">
          您的贴心AI伙伴，随时为您解答问题
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12">
          <FeatureCard 
            title="简单易用"
            description="直接输入问题即可开始对话"
            icon="👋"
          />
          <FeatureCard 
            title="知识丰富"
            description="可以解答各类生活问题"
            icon="📚"
          />
          <FeatureCard 
            title="随时在线"
            description="24小时随时为您服务"
            icon="⭐"
          />
        </div>

        <div className="mt-12">
          <Link 
            href="/chat"
            className="px-8 py-4 bg-[var(--primary)] text-white rounded-full text-lg font-medium 
                     hover:bg-[var(--primary-hover)] transition-colors inline-block"
          >
            开始对话
          </Link>
        </div>
      </div>
    </main>
  )
}

// 定义 FeatureCard 的 props 接口
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

// 功能卡片组件
function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl bg-[var(--card-background)] shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
