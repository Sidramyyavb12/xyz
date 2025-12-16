"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  Zap, 
  Heart,
  ArrowLeft 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'We aim to simplify inventory management for hardware businesses of all sizes.'
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Constantly improving with cutting-edge technology and user feedback.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Your success is our success. We build features that truly matter.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Enterprise-grade reliability with attention to every detail.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: '15+ years in supply chain management'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'Ex-Google engineer, inventory systems expert'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      description: 'UX specialist with passion for simplicity'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      description: 'Full-stack wizard, optimization enthusiast'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
     <Navbar/>
     
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              About KrixFlow
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to revolutionize how hardware businesses manage their inventory
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-6 text-lg text-slate-700 leading-relaxed"
          >
            <p>
              Founded in 2020, KrixFlow was born from a simple observation: hardware businesses 
              were struggling with outdated, complex inventory systems that slowed them down 
              instead of helping them grow.
            </p>
            <p>
              Our founders, who had decades of combined experience in retail and technology, 
              decided to build something different. Something that would be powerful yet simple, 
              comprehensive yet intuitive, and accessible to businesses of all sizes.
            </p>
            <p>
              Today, KrixFlow serves over 500 businesses worldwide, helping them track over 
              10,000 items, streamline operations, and make data-driven decisions. But we're 
              just getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-700 text-lg">
                To become the world's most trusted inventory management platform, 
                empowering businesses to operate with perfect efficiency and clarity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-700 text-lg">
                To simplify inventory management through innovative technology, 
                making it accessible and effective for every hardware business.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-slate-300 text-lg">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-slate-600 text-lg">Passionate experts dedicated to your success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 text-center"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                <div className="text-sm text-blue-600 font-medium mb-2">{member.role}</div>
                <p className="text-sm text-slate-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Experience the future of inventory management today
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      <footer/>
    </div>
  );
}