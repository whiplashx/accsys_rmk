import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  TrophyIcon,
  ClipboardDocumentCheckIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import GuestLayout from '@/Layouts/GuestLayout';

export default function MinsuDashboard() {
  const [currentSystemIndex, setCurrentSystemIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  // Handle scroll to change systems
  useEffect(() => {
    let isScrolling = false;
    
    const handleScroll = (e) => {
      if (isScrolling) return;
      
      const delta = e.deltaY;
      
      if (Math.abs(delta) > 10) {
        isScrolling = true;
        
        if (delta > 0 && currentSystemIndex < systems.length - 1) {
          // Scroll down - next system
          nextSystem();
        } else if (delta < 0 && currentSystemIndex > 0) {
          // Scroll up - previous system
          prevSystem();
        }
        
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };
    
    window.addEventListener('wheel', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentSystemIndex]);

  // Campus background images for each system
  // Save the MinSU campus images to public/images/ as:
  // minsu-campus-1.jpg (main building with green)
  // minsu-campus-2.jpg (building at sunset)
  // minsu-campus-3.jpg (campus grounds)
  // minsu-campus-4.jpg (building front view)
  // minsu-logo.png (MinSU seal/logo)
  const campusImages = [
    '/images/minsu-campus-1.jpg',
    '/images/minsu-campus-2.jpg',
    '/images/minsu-campus-3.jpg',
    '/images/minsu-campus-4.jpg',
  ];

  const systems = [
    {
      id: 1,
      title: 'Roomify',
      client: 'MinSU Administration',
      description: 'Room management and scheduling system for efficient space utilization across all MinSU campuses.',
      status: 'Coming Soon',
      icon: BuildingOfficeIcon,
      color: 'green',
      gradient: 'from-green-500 via-emerald-500 to-lime-500',
      features: ['Room Booking', 'Schedule Management', 'Resource Allocation'],
      link: null
    },
    {
      id: 2,
      title: 'MinSU Intramurals Leaderboards',
      client: 'MinSU Bongabong Sports Committee',
      description: 'Real-time updates of sports competition leaderboards held on campus. Managed by sports committee or PE instructors to facilitate and update competition scores.',
      status: 'Active',
      icon: TrophyIcon,
      color: 'yellow',
      gradient: 'from-yellow-500 via-amber-500 to-orange-400',
      features: ['Live Scores', 'Team Rankings', 'Event Management', 'Real-time Updates'],
      link: 'https://intramurals-leaderboard.vercel.app/'
    },
    {
      id: 3,
      title: 'OSAS iScholar',
      client: 'MinSU Office of Student Affairs and Services',
      description: 'Scholarship management system for students to apply, track, and manage scholarship applications and grants.',
      status: 'Active',
      icon: AcademicCapIcon,
      color: 'orange',
      gradient: 'from-orange-500 via-orange-600 to-red-500',
      features: ['Application Management', 'Scholarship Tracking', 'Document Submission', 'Grant Monitoring'],
      link: 'https://osas-i-scholar.vercel.app'
    },
    {
      id: 4,
      title: 'Accreditation System',
      client: 'MinSU Quality Assurance',
      description: 'Comprehensive accreditation management system for tracking program compliance, documentation, and evaluation processes.',
      status: 'Active',
      icon: ClipboardDocumentCheckIcon,
      color: 'green',
      gradient: 'from-green-600 via-teal-600 to-cyan-600',
      features: ['Document Management', 'Progress Tracking', 'Compliance Monitoring', 'Evaluation Tools'],
      link: window.location.origin
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Coming Soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Planned': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[status] || styles['Planned'];
  };

  const handleSystemClick = (system) => {
    if (system.link) {
      window.open(system.link, '_blank');
    }
  };

  const changeSystem = (newIndex, transitionDirection) => {
    setIsTransitioning(true);
    setDirection(transitionDirection);
    
    setTimeout(() => {
      setCurrentSystemIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const nextSystem = () => {
    const newIndex = (currentSystemIndex + 1) % systems.length;
    changeSystem(newIndex, 'next');
  };

  const prevSystem = () => {
    const newIndex = (currentSystemIndex - 1 + systems.length) % systems.length;
    changeSystem(newIndex, 'prev');
  };

  const goToSystem = (index) => {
    if (index !== currentSystemIndex) {
      const transitionDirection = index > currentSystemIndex ? 'next' : 'prev';
      changeSystem(index, transitionDirection);
    }
  };

  const currentSystem = systems[currentSystemIndex];
  const Icon = currentSystem.icon;

  return (
    <>
      <Head title="MinSU Systems Dashboard" />
      
      {/* Full Screen Hero Section */}
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Background Image with Crossfade Effect */}
        <div className="absolute inset-0">
          {campusImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentSystemIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
          
          {/* Animated Gradient Overlays - Each with its own transition */}
          <div className="absolute inset-0">
            {systems.map((system, index) => (
              <div
                key={`gradient-${index}`}
                className={`absolute inset-0 bg-gradient-to-br ${system.gradient} transition-opacity duration-1000 ease-in-out ${
                  index === currentSystemIndex ? 'opacity-75' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          
          {/* Static dark overlays for consistency */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center gap-4">
            {/* MinSU Logo */}
            <img 
              src="/images/minsu-logo.png" 
              alt="MinSU Logo" 
              className="h-16 w-16 drop-shadow-2xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Mindoro State University</h1>
            </div>
          </div>

        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 h-[calc(100vh-88px)] flex items-center justify-center px-8">
          <div className="max-w-6xl w-full">
            <div 
              className={`text-center mb-12 transition-all duration-500 ${
                isTransitioning 
                  ? direction === 'next' 
                    ? 'opacity-0 translate-x-20' 
                    : 'opacity-0 -translate-x-20'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* System Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-8 border-4 border-white/30 transform transition-transform duration-500 hover:scale-110">
                    <Icon className="h-24 w-24 text-white drop-shadow-2xl" />
                  </div>
                </div>
              </div>

              

              {/* Title */}
              <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl animate-slide-up">
                {currentSystem.title}
              </h2>
              
              {/* Client */}
              <p className="text-2xl text-white/90 mb-6 font-light animate-slide-up" style={{ animationDelay: '100ms' }}>
                {currentSystem.client}
              </p>

              {/* Description */}
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
                {currentSystem.description}
              </p>

              {/* Features */}
              {currentSystem.features.length > 0 && (
                <div className="mb-10 animate-slide-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex flex-wrap justify-center gap-3">
                    {currentSystem.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 transform transition-all duration-300 hover:scale-105 hover:bg-white/30"
                        style={{ animationDelay: `${400 + idx * 50}ms` }}
                      >
                        <SparklesIcon className="h-4 w-4" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
                {currentSystem.link ? (
                  <button
                    onClick={() => handleSystemClick(currentSystem)}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    <span>Launch System</span>
                    <ArrowTopRightOnSquareIcon className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold text-lg cursor-not-allowed border-2 border-white/30"
                  >
                    <ClockIcon className="h-6 w-6" />
                    <span>Coming Soon</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSystem}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 border border-white/30 group"
        >
          <ChevronLeftIcon className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <button
          onClick={nextSystem}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 border border-white/30 group"
        >
          <ChevronRightIcon className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
        </button>

      

        {/* Dots Navigation */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {systems.map((system, index) => (
            <button
              key={system.id}
              onClick={() => goToSystem(index)}
              className={`transition-all duration-300 ${
                index === currentSystemIndex
                  ? 'w-12 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
              }`}
              aria-label={`Go to ${system.title}`}
            />
          ))}
        </div>

        {/* System Counter */}
        <div className="absolute bottom-12 right-8 z-20 text-white/60 text-sm font-semibold">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            {currentSystemIndex + 1} / {systems.length}
          </div>
        </div>
      </div>
    </>
  );
}