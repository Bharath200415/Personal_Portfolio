import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: 'codesync',
    title: "CodeSync",
    description: "[Under development] A collaborative interview-coding platform.",
    longDescription: "Doable is a modern, AI-powered task management platform designed for teams who want to ship faster and work smarter. Built with Next.js 15, React 19, and TypeScript, Doable combines the power of AI assistance with intuitive project management tools.",
    liveLink: "https://codesync.bharath.codes",
    githubLink: "https://github.com/Bharath200415/CodeSync",
    video: 'doable',
    image: '/images/doable.png',
    tweetUrl: "https://x.com/code_kartik/status/1983166411192340957",
    tags: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "AI SDKs",
      "Postgresql",
      "Prisma",
      "shadcn/ui",
      "Groq AI",
      "OpenAI gpt-oss-120b",
      "Better Auth",
    ],
  },
  {
    id: 'vaultx',
    title: "Vault-X",
    description: " A mini cloud storage app for uploading, managing, and sharing files using AWS services.",
    longDescription: "Harnesses the power of Groq AI and large language models for personalized learning experiences\n\nProvides intelligent study plan generation and dynamic resource curation\n\nBuilt with modern web technologies offering an intuitive interface\n\nSeamless interaction with AI-powered educational tools makes learning more efficient and engaging",
    liveLink: "https://vaultx.bharath.codes",
    githubLink: "https://github.com/bharath200415/vaultx",
    video: 'mind-mentor',
    image: '/vaultx.webp',
    tweetUrl: "https://x.com/code_kartik/status/1887125453359788069",
    tags: [
      "React.js",
      "Tailwind CSS",
      "AWS S3",
      "JavaScript",
      "Express",
      "Node.js",
      "AWS EC2"
    ],
  },
  {
    id: "typescout",
    title: "TypeScout",
    description: "Download fonts from any website in multiple formats instantly.",
    longDescription:
      "Link Preview is a tool that allows you to preview how your links appear on social platforms. Test metadata across Telegram, Discord, Slack, X, Facebook, LinkedIn, and WhatsApp.",
    liveLink: "https://typescout.bharath.codes",
    githubLink: "https://github.com/bharath200415/typescout",
    video: "linkpreview",
    image: "/typescout.webp",
    tweetUrl: "https://x.com/code_kartik/status/2014328471141663162",
    tags: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "shadcn/ui",
      "Web Scraping"
    ],
  },
   {
    id: 'graminSeva',
    title: "Gramin Seva",
    description: "A fullstack comprehensive complaint management system designed for rural India.",
    longDescription: "Streamlines git workflow by automatically generating meaningful commit messages using AI\n\nIntegrates seamlessly with existing git repositories and development workflows\n\nSupports multiple commit message styles and customization options\n\nBuilt with modern CLI tools for optimal developer experience and reliability",
    liveLink: "https://graminsevavitb.vercel.app",
    githubLink: "https://github.com/bharath200415/graminseva",
    video: 'lazycommit-video',
    image: '/images/lazycommit.png',
    tweetUrl: "https://x.com/code_kartik/status/1968387201760444798",
    tags: [
      "JavaScript",
      "Express",
      "Node.js",
      "MongoDB",
      "React.js",
      "TailwindCSS",
      "JWT"

    ],
  },
  {
    id: "zenNotes",
    title: "ZenNotes",
    description: "A go-to Note taking App, which stores everything locally on the browser and fetches notes from the browser's local data when rendered.",
    longDescription:
      "OneURL is an open-source alternative to Linktree. Create a beautiful profile page to share all your important links in one place.",
    liveLink: "https://zennotes.bharath.codes",
    githubLink: "https://github.com/bharath200415/zennotes",
    video: "oneurl",
    image: "/zennotes.webp",
    tweetUrl: "https://x.com/code_kartik/status/2006784332246167877",
    tags: [
      "React.js",
      "JavaScript",
      "Shadcn UI",
      "Tailwind CSS",
      "LocalStorage",
    ],
  },
  {
    id: "snapQR",
    title: "SnapQR",
    description: "SnapQR is a lightweight Chrome extension that instantly converts any link into a downloadable QR code along with copy to clipboard option using REST API.",
    longDescription:
      "BetterShot is an open-source alternative to CleanShot X for macOS. Capture, edit, and enhance your screenshots with professional quality.",
    liveLink: "https://github.com/bharath200415/snapqr",
    githubLink: "https://github.com/bharath200415/snapqr",
    video: "https://pub-52330599f4c24002984ec170d5e0354d.r2.dev/cursorful-video-1768649132147%20(1).mp4",
    image: "/snapqr.webp",
    tweetUrl: "https://x.com/code_kartik/status/2010651653125607464",
    tags: [
      "HTML",
      "Tailwind CSS",
      "JavaScript",
      "Canvas API",
      "REST API",
    ],
  },

];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id)
}

export const getAllProjects = (): Project[] => {
  return projects
}
