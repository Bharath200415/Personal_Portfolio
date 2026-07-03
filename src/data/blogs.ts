import { BlogPost } from '@/types/blog'

export const blogs: BlogPost[] = [
  {
    id: 'first-principles',
    title: 'How I Think About CP & DSA From First Principles',
    readTime: '7 min read',
    externalUrl: 'https://x.com/Divyansh91565/status/2071916367356567946?s=20'
  },
  {
    id: 'free-lancing',
    title: 'How to Land Your FIRST Freelance Client',
    readTime: '6 min read',
    externalUrl: 'https://x.com/buildwithsid/status/2035730095856390218?s=20'
  },
  {
    id: 'problem-solving',
    title: 'How I Choose Problems, Solve Them, and End Up Getting Traction',
    readTime: '4 min read',
    externalUrl: 'https://medium.com/@code_kartik/how-i-choose-problems-solve-them-and-end-up-getting-traction-89f259eadd4b'
  },
  {
    id: 'ssh-server-guide',
    title: 'How to SSH Into Your Server (The Right Way) A Beginner-Friendly Guide with Pro Tips',
    readTime: '3 min read',
    externalUrl: 'https://medium.com/@code_kartik/how-to-ssh-into-your-server-the-right-way-a-beginner-friendly-guide-with-pro-tips-cbd0e8855c9a'
  },
  // {
  //   id: 'rag',
  //   title: 'What is RAG? Why you should learn it?',
  //   readTime: '6 min read',
  //   externalUrl: 'https://medium.com/@code_kartik/what-is-rag-why-you-should-learn-it-c9408f233086'
  // }
]

export const getBlogById = (id: string): BlogPost | undefined => {
  return blogs.find(blog => blog.id === id)
}
