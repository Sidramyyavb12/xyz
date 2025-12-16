"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Warehouse,
  Clock,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track and manage all your hardware inventory in real-time with ease.'
    },
    {
      icon: TrendingUp,
      title: 'Stock Analytics',
      description: 'Get insights into stock levels, trends, and make data-driven decisions.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your inventory anywhere, anytime on any device seamlessly.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports on inventory flow and sales patterns.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay updated with instant notifications on stock changes and alerts.'
    }
  ];

  const stats = [
    { icon: Warehouse, value: '10K+', label: 'Items Tracked' },
    { icon: Users, value: '500+', label: 'Active Users' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
    { icon: CheckCircle, value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar/>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-black text-white rounded-2xl"
            >
              <Package className="w-8 h-8" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              KrixFlow Inventory
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Modern hardware inventory management system designed for efficiency and growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-black rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features to streamline your inventory management and boost productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join hundreds of businesses already using KrixFlow
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-600 text-sm">
              © 2024 KrixFlow Inventory. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                About
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}