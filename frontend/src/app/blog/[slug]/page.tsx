import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, CheckCircle2, Quote, Sparkles, ArrowRight } from "lucide-react";
import { getBlogPostBySlug, blogPosts } from "@/lib/blogData";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current one)
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 relative selection:bg-primary/20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-primary/10 via-accent/5 to-transparent blur-3xl pointer-events-none" />

      <article className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all insights
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="px-3.5 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20 shadow-sm">
              {post.category}
            </span>
            <span className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1.5 text-emerald-500" />
              {post.date}
            </span>
            <span className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins tracking-tight text-foreground leading-[1.2]">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed font-normal border-l-4 border-primary/40 pl-4 py-1 italic">
            {post.excerpt}
          </p>

          {/* Author Box */}
          <div className="flex items-center gap-4 pt-6 border-t border-border/60">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 shadow-md"
            />
            <div>
              <h3 className="font-semibold text-foreground text-base">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 md:p-14 border border-border shadow-xl space-y-8 mb-16">
          {post.sections.map((section, index) => {
            switch (section.type) {
              case 'p':
                return (
                  <p key={index} className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.text}
                  </p>
                );
              case 'h2':
                return (
                  <h2 key={index} className="text-2xl sm:text-3xl font-bold font-poppins text-foreground pt-6 pb-2 border-b border-border/40">
                    {section.text}
                  </h2>
                );
              case 'callout':
                return (
                  <div key={index} className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-l-4 border-emerald-500 shadow-sm relative overflow-hidden">
                    <Sparkles className="absolute top-4 right-4 w-24 h-24 text-emerald-500/5 pointer-events-none" />
                    <div className="flex items-start gap-3 relative z-10">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        {section.text}
                      </p>
                    </div>
                  </div>
                );
              case 'quote':
                return (
                  <blockquote key={index} className="my-8 p-8 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-border/80 text-center relative shadow-inner">
                    <Quote className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                    <p className="text-lg sm:text-xl font-poppins font-medium text-foreground italic leading-relaxed mb-4">
                      "{section.text}"
                    </p>
                    {section.author && (
                      <footer className="text-sm font-semibold text-primary">
                        — {section.author}
                      </footer>
                    )}
                  </blockquote>
                );
              case 'list':
                return (
                  <ul key={index} className="space-y-4 my-6 pl-2 sm:pl-4">
                    {section.items?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="flex w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              default:
                return null;
            }
          })}

          {/* Tags */}
          <div className="pt-10 mt-12 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground mr-2">Topics:</span>
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Newsletter CTA Inside Blog */}
        <div className="bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 dark:from-slate-900 dark:via-primary/20 dark:to-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl border border-primary/20 mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold font-poppins">Stay Ahead of the Curve</h3>
            <p className="text-slate-200 text-sm sm:text-base">
              Subscribe to RevalueIQ Insights for weekly deep-dives into sustainable hardware and AI innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2" suppressHydrationWarning>
              <input 
                type="email" 
                placeholder="Enter your work email" 
                suppressHydrationWarning
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
              <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 shadow-md" suppressHydrationWarning>
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Related Insights Section */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-poppins text-foreground">Related Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((relPost) => (
                <Link 
                  href={`/blog/${relPost.slug}`} 
                  key={relPost.slug}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between block"
                >
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{relPost.category}</span>
                    <h4 className="text-lg font-bold text-foreground mt-2 mb-3 group-hover:text-primary transition-colors leading-snug">
                      {relPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {relPost.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                    <span>{relPost.readTime}</span>
                    <span className="flex items-center text-primary font-medium group-hover:underline">
                      Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
    </div>
  );
}
