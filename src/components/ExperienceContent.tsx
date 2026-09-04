'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements?: string[];
  href?: string;
  logoUrl?: string;
}

export default function ExperienceContent() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const experiences: ExperienceItem[] = [
    {
      company: "Trakto",
      position: "Software Engineer Intern",
      duration: "July 2026 – Present",
      description: "",
      achievements: [
"Developed 3 core modules– Subcontracting (Job Work), Inventory and Ledger– for a cloud-based Manufacturing ERP streamlining vendor operations and material tracking across 2+ vendor workflows",
" Designed backend business logic, data models and database workflows for inventory reconciliation and ledger transactions, reducing data inconsistencies by 10% across subcontracting processes.",
"Collaborated with product managers and business stakeholders to design, develop, test, and deploy scalable ERP features, improving system reliability and streamlining manufacturing operations."
      ],
      href: "https://trakto.tech/",
      logoUrl: "/images/trakto.png",
    },
    {
      company: "Kylix Studio",
      position: "Founder",
      duration: "June 2026 – Present",
      description: "Founded and lead Kylix Studio, a design-driven web development agency focused on building modern digital experiences for startups, businesses, and creators. Oversee the complete project lifecycle, from branding and UI/UX design to full-stack development, deployment, and client communication.",
      achievements: [
      "Designed and developed responsive, high-performance websites and web applications using Next.js, React, TypeScript, Tailwind CSS, and modern backend technologies.",
      "Managed 20+ end-to-end client projects, including requirement gathering, wireframing, UI/UX design, development, deployment, and ongoing maintenance.",
      "Built scalable solutions featuring authentication, database integration, contact automation, payment workflows, and third-party API integrations.",
      "Created custom brand identities, landing pages, and digital experiences that improved online presence and user engagement for clients.",
      "Implemented SEO best practices, performance optimizations, and accessibility standards to ensure production-ready web experiences.",
      ],
      href: "https://kylix.bharath.codes/",
      logoUrl: "/Logo_Kylix (2).png",
    },
    {
      company: "Zeepty",
      position: "UI/UX Design Intern",
      duration: "April 2025 – August 2025",
      description: "Designed and developed frontend interfaces, optimized onboarding flows while enhancing the overall User-Experience.",
      achievements: [
        "Designed and delivered engaging visual content across digital platforms, including social media creatives and marketing assets, enhancing brand consistency and user engagement.",
        "Built pixel-perfect, responsive user interfaces with a strong focus on usability, accessibility, and cross-device compatibility.",
        "Revamped the user onboarding experience through UX research and iterative design improvements, resulting in a 10% increase in user activation.",
        "Collaborated closely with developers and product teams to translate design concepts into scalable, production-ready applications.",
        "Optimized user journeys and interaction flows to improve long-term retention and overall user satisfaction.",
      ],
      href: "https://zeepty.com/",
      logoUrl: "/zeepty.png",
    },

  ]

  const toggleExpanded = (company: string) => {
    setExpanded(prev => ({
      ...prev,
      [company]: !prev[company]
    }))
  }

  return (
    <div className="space-y-4 dark:text-white/70 text-black/70 pb-4">
      {experiences.map((exp) => {
        const isExpanded = expanded[exp.company]
        
        return (
          <div key={exp.company} className="rounded-lg p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                  {exp.logoUrl ? (
                    <Image 
                      src={exp.logoUrl} 
                      alt={exp.company}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-lg font-medium dark:text-white text-black">
                      {exp.company.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium dark:text-white text-black text-sm sm:text-lg">
                    {exp.href ? (
                      <Link 
                        href={exp.href} 
                        target="_blank" 
                        className="hover:text-[#006FEE] transition-colors"
                      >
                        {exp.company}
                      </Link>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-70">
                    {exp.position}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 pl-[3.25rem] sm:pl-0">
                <div className="sm:text-right shrink-0">
                  <p className="text-xs sm:text-sm opacity-50">
                    {exp.duration}
                  </p>
                </div>
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleExpanded(exp.company)}
                        className="shrink-0 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isExpanded ? 'Collapse details' : 'Expand details'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            
            {exp.achievements && exp.achievements.length > 0 && (
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <ul className="space-y-2.5 text-xs sm:text-sm opacity-80">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="text-[#006FEE] shrink-0 mt-1.5">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
