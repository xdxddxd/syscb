"use client";

import { motion } from 'framer-motion';
import { cn, fadeInUp, scaleIn, defaultTransition } from '@/lib/utils';
import { Card as BaseCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'scale';
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className, 
  variant = 'default',
  delay = 0 
}: AnimatedCardProps) {
  const variants = {
    default: fadeInUp,
    hover: {
      ...fadeInUp,
      hover: { y: -4, scale: 1.02, transition: { duration: 0.2 } }
    },
    scale: scaleIn
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      <BaseCard className="h-full transition-shadow duration-200 hover:shadow-lg">
        {children}
      </BaseCard>
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  delay = 0
}: StatsCardProps) {
  return (
    <AnimatedCard variant="hover" delay={delay} className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </AnimatedCard>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon,
  href,
  onClick,
  className,
  delay = 0
}: FeatureCardProps) {
  const CardWrapper = href ? motion.a : motion.div;
  
  return (
    <CardWrapper
      href={href}
      onClick={onClick}
      className={cn(
        "block cursor-pointer",
        className
      )}
      variants={{
        ...fadeInUp,
        hover: { 
          y: -8, 
          transition: { duration: 0.3, ease: "easeOut" } 
        }
      }}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ ...defaultTransition, delay }}
    >
      <BaseCard className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          {icon && (
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 text-primary">
                {icon}
              </div>
            </div>
          )}
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </BaseCard>
    </CardWrapper>
  );
}
