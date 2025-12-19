"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { 
  FileText, 
  DollarSign, 
  Briefcase, 
  Gift, 
  Users, 
  Shield,
  Building2,
  Sparkles
} from "lucide-react";

export default function PayrollConfigurationPage() {
  const { user } = useAuth();
  
  // Protect route - ONLY Payroll Specialist can access this dashboard
  useRequireAuth([SystemRole.PAYROLL_SPECIALIST], '/dashboard');

  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.fullName || user?.workEmail?.split('@')[0] || user?.personalEmail?.split('@')[0] || 'User';

  const configurationCards = [
    {
      title: "Payroll Policies",
      description: "Manage payroll policies and rules",
      href: "/dashboard/payroll-configuration/policies",
      icon: FileText,
      color: "blue",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      buttonGradient: "from-blue-600 to-blue-700",
      hoverGradient: "from-blue-700 to-blue-800",
      glowColor: "shadow-blue-500/50",
    },
    {
      title: "Pay Grades",
      description: "Configure pay grades and salary bands",
      href: "/dashboard/payroll-configuration/pay-grades",
      icon: DollarSign,
      color: "purple",
      gradient: "from-purple-500 via-purple-600 to-fuchsia-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      buttonGradient: "from-purple-600 to-purple-700",
      hoverGradient: "from-purple-700 to-purple-800",
      glowColor: "shadow-purple-500/50",
    },
    {
      title: "Pay Types",
      description: "Manage different pay types",
      href: "/dashboard/payroll-configuration/pay-types",
      icon: Briefcase,
      color: "blue",
      gradient: "from-indigo-500 via-blue-600 to-cyan-600",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      buttonGradient: "from-indigo-600 to-indigo-700",
      hoverGradient: "from-indigo-700 to-indigo-800",
      glowColor: "shadow-indigo-500/50",
    },
    {
      title: "Allowances",
      description: "Configure employee allowances",
      href: "/dashboard/payroll-configuration/allowances",
      icon: Gift,
      color: "green",
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      buttonGradient: "from-emerald-600 to-emerald-700",
      hoverGradient: "from-emerald-700 to-emerald-800",
      glowColor: "shadow-emerald-500/50",
    },
    {
      title: "Signing Bonuses",
      description: "Manage signing bonus configurations",
      href: "/dashboard/payroll-configuration/signing-bonuses",
      icon: Users,
      color: "orange",
      gradient: "from-orange-500 via-amber-600 to-yellow-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      buttonGradient: "from-orange-600 to-orange-700",
      hoverGradient: "from-orange-700 to-orange-800",
      glowColor: "shadow-orange-500/50",
    },
    {
      title: "Termination Benefits",
      description: "Configure termination and resignation benefits",
      href: "/dashboard/payroll-configuration/termination-benefits",
      icon: Shield,
      color: "red",
      gradient: "from-rose-500 via-red-600 to-pink-600",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
      buttonGradient: "from-rose-600 to-rose-700",
      hoverGradient: "from-rose-700 to-rose-800",
      glowColor: "shadow-rose-500/50",
    },
    {
      title: "Insurance Brackets",
      description: "Configure insurance contribution brackets",
      href: "/dashboard/payroll-configuration/insurance-brackets",
      icon: Building2,
      color: "indigo",
      gradient: "from-violet-500 via-indigo-600 to-blue-600",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      buttonGradient: "from-violet-600 to-violet-700",
      hoverGradient: "from-violet-700 to-violet-800",
      glowColor: "shadow-violet-500/50",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>
      
      {/* Animated Mesh Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse"></div>
      
      {/* Animated Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      ></div>
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section with Enhanced Styling */}
        <div className="mb-12 lg:mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">Payroll Configuration</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            <span className="text-white drop-shadow-lg">
              Payroll Specialist
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
              Dashboard
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
            Welcome, <span className="font-bold text-white">{userName}</span>.
            <br className="hidden sm:block" />
            <span className="text-white/80">Create and manage payroll configurations with ease.</span>
          </p>
        </div>

        {/* Section Title with Enhanced Design */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white whitespace-nowrap">
              Configuration Management
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          <div className="flex justify-center">
            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"></div>
          </div>
        </div>

        {/* Configuration Cards Grid with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {configurationCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.href}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${card.glowColor}`}></div>
                
                {/* Main Card */}
                <div className="relative rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:shadow-3xl">
                  {/* Card Background with Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`}></div>
                  
                  {/* Overlay Pattern */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  
                  {/* Card Top Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${card.gradient} opacity-100`}></div>
                  
                  {/* Card Content */}
                  <div className="relative p-6 lg:p-8">
                    {/* Icon with Enhanced Styling */}
                    <div className="mb-6">
                      <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors drop-shadow-lg">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 mb-8 text-sm lg:text-base leading-relaxed min-h-[3rem] font-medium drop-shadow-md">
                      {card.description}
                    </p>

                    {/* Enhanced Button */}
                    <Link
                      href={card.href}
                      className="group/btn relative inline-flex items-center justify-center w-full px-6 py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 transform group-hover:scale-105 shadow-2xl hover:shadow-3xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
                    >
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      {/* Button Text */}
                      <span className="relative z-10 flex items-center gap-2 text-white font-bold drop-shadow-lg">
                        Manage {card.title.split(' ')[0]} {card.title.split(' ')[1] || ''}
                        <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </Link>
                  </div>

                  {/* Bottom Accent Line on Hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

