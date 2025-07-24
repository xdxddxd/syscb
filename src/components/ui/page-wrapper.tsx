"use client";

import { motion } from 'framer-motion';
import { cn, fadeInUp, staggerContainer, defaultTransition } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageWrapper({ 
  children, 
  className, 
  title, 
  description, 
  actions 
}: PageWrapperProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={cn("flex flex-col h-full", className)}
    >
      {(title || description || actions) && (
        <motion.div 
          variants={fadeInUp}
          className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="flex flex-col gap-4 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                {title && (
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-muted-foreground text-sm lg:text-base">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        variants={fadeInUp}
        className="flex-1 overflow-auto"
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ContentSection({ children, className, delay = 0 }: ContentSectionProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay }}
      className={cn("space-y-6", className)}
    >
      {children}
    </motion.div>
  );
}

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export function GridContainer({ 
  children, 
  className, 
  cols = 3 
}: GridContainerProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={cn(
        'grid gap-6',
        colsClasses[cols],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
