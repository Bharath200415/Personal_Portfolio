'use client'

import Link from 'next/link'
import DiagonalPattern from './DiagonalPattern'
import BannerSection from './BannerSection'
import ProfileHeader from './ProfileHeader'
import ContentSection from './ContentSection'
import ContentParagraph from './ContentParagraph'
import SectionBorder from './SectionBorder'
import ExperienceContent from './ExperienceContent'
import Reachout from './Reachout'
import CallToAction from './CallToAction'
import ContributionsDisplay from './ContributionsDisplay'
import OpenSourceContributionsCard from './ContributionCard'
import TechStackMarquee from './TechStackMarquee'
import { Reveal } from './Reveal'
import { projects } from '@/data/projects'
import { MasonryProjectCard } from './MasonryProjectCard'
import { blogs } from '@/data/blogs'
import { BlogCard } from './BlogCard'
import { sponsors } from '@/data/sponsors'
import SponsorShowcase from './SponsorShowcase'
import SponsorButton from './SponsorButton'
import NeumorphButton from './NeumorphButton'

export default function NewHeroSection() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <div className="relative mx-auto max-w-4xl">
        {/* Diagonal Patterns */}
        <DiagonalPattern side="left" />
        <DiagonalPattern side="right" />
        
        {/* Main Content */}
        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          {/* Banner Section */}
          <Reveal delay={0.1}>
            <BannerSection 
              bannerImage="/bannerv1.jpeg"
              quote=""
            />
          </Reveal>
          
          {/* Profile Header */}
          <Reveal delay={0.2}>
            <ProfileHeader 
              name="Bharath"
              age="21"
              title="engineer • developer • designer "
              profileImage="/pfp_github.png"
              socialLinks={{
                twitter: "https://x.com/zustydev",
                github: "https://github.com/bharath200415",
                linkedin: "https://www.linkedin.com/in/bharathcodes/",
                resume: "https://drive.google.com/file/d/1s9z-zvPMhe0hjfaXialseXIGH5-m8_7u/view?usp=sharing",
              }}
            />
          </Reveal>
          
          {/* Content Prose */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-base">
              {/* Current Role Section */}
              <Reveal delay={0.1}>
                <ContentSection
                  subtitle="AI Engineer | Full-stack Developer"
                  title=''
                  className="mt-6"
                >
                  <div></div>
                </ContentSection>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-6" />
              </Reveal>
              
              {/* About Section */}
              <Reveal delay={0.1}>
                <ContentSection className="pb-6 sm:pb-8 pt-4 sm:pt-6 px-2 sm:px-0">
                  <ContentParagraph className="mb-2 text-base sm:text-lg">
                    <span className="font-medium dark:text-white text-black">I build from zero.</span> Whether it&apos;s frontend, backend, full-stack applications, or AI-powered experiences, I work across the entire development lifecycle. From UI/UX to deployment to user feedback, I care less about technology debates and more about delivering results that people love using.
                  </ContentParagraph>
                </ContentSection>
              </Reveal>

              <Reveal delay={0.05}>
                <SectionBorder className="mt-6" />
              </Reveal>

               {/* Experience Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <h2 className="text-base sm:text-xl mb-3 opacity-70 mt-4 sm:mt-6 px-4 font-[family-name:var(--font-instrument-serif)]">Professional Experience</h2>
                  <div className="px-4">
                    <ExperienceContent />
                  </div>
                </div>
              </Reveal>

                <Reveal delay={0.05}>
                  <SectionBorder className="mt-4" />
                </Reveal>
              
                 {/* Proof of Work */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-xl opacity-70 font-[family-name:var(--font-instrument-serif)]">Proof of Work</h2>
                  </div>
                  <div className="px-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-3 sm:grid-cols-2 group">
                      {projects.slice(0, 6).map((project) => (
                        <MasonryProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
                    <Link href="/projects">
                      <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                        <span>View All</span>
                        <span>→</span>
                      </NeumorphButton>
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>


              
              {/* Sponsors Section */}
              {/* <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6 flex items-center justify-between">
                  <h2 className="text-base sm:text-xl opacity-60 font-[family-name:var(--font-instrument-serif)]">Sponsors</h2>
                    <SponsorButton 
                      href="https://github.com/sponsors/KartikLabhshetwar"
                      tooltipText="Support my open source work"
                    />
                  </div>
                  <div className="px-4 mb-4 sm:mb-6">
                    <SponsorShowcase sponsors={sponsors} showEmptySlot={false} />
                  </div>
                  <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
                    <Link href="/sponsors">
                      <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                        <span>View All</span>
                        <span>→</span>
                      </NeumorphButton>
                    </Link>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal> */}
              
              {/* GitHub Contributions */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 px-0 mt-4">
                  <h2 className="text-base font-[family-name:var(--font-instrument-serif)] sm:text-xl opacity-40 leading-relaxed -tracking-[0.01em] mb-4 px-4">
                    GitHub Contributions <span className="opacity-40">●</span> @bharath200415
                  </h2>
                  <div className="mb-4 sm:mb-6">
                    <ContributionsDisplay
                      username="bharath200415"
                      variant="compact"
                      className="w-full"
                    />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Tech Stack Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 mt-4 sm:mt-6 mb-4 sm:mb-6">
                  <div className="px-4">
                    <TechStackMarquee className="w-full" />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>

              {/* Thoughts Section */}
              <Reveal delay={0.1}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-xl opacity-70 font-[family-name:var(--font-instrument-serif)]">Thoughts</h2>
                  </div>
                  <div className="px-4">
                    <div className="space-y-0 group">
                      {blogs.slice(0, 3).map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
                    {/* <Link href="/blogs">
                      <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                        <span>View All</span>
                        <span>→</span>
                        <span>It's either 0 or 1.</span>
                      </NeumorphButton>
                    </Link> */}
                    <span className='opacity-60 italic text-base sm:text-xl font-[family-name:var(--font-instrument-serif)]'>"stay hungry, stay foolish!"
                    </span>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Open Source Contributions Section */}
              {/* <Reveal delay={0.1}>
                <div className="sm:px-12 mt-4">
                  <h2 className="text-base font-[family-name:var(--font-instrument-serif)] sm:text-xl opacity-40 mt-4 sm:mt-8 sm:ml-5 leading-relaxed -tracking-[0.01em] mb-4 px-4">
                    Open Source Contributions <span className="opacity-20">●</span> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="px-4">
                    <OpenSourceContributionsCard />
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-4 pt-0" />
              </Reveal> */}

              {/* call to action*/}
              <Reveal delay={0.1}>
                <div className="px-4 sm:px-12">
                  <CallToAction/>
                </div>
              </Reveal>
              
              <Reveal delay={0.05}>
                <SectionBorder className="mt-0 pt-0" />
              </Reveal>
              
              {/* Reachout Section */}
              <Reveal delay={0.1}>
                <div className="mt-4 sm:mt-6">
                  <Reachout 
                    title="Let's connect"
                    subtitle="Find me on these platforms"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
