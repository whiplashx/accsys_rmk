import React, { useState, useEffect } from 'react';
import { Book, Users, Calendar, ChevronRight } from 'lucide-react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import CopilotInterface from '@/Components/Chatbot';

const UniversityDashboard = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      <Head title='MinSU - Accreditation' />
      
      <header className={`fixed w-full transition-all duration-300 ${scrolled ? 'py-3 bg-white shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-emerald-100">
              <ApplicationLogo className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`font-light tracking-wide transition-all duration-300 ${scrolled ? 'text-emerald-800 text-xl' : 'text-emerald-700 text-2xl'}`}>
                Mindoro State <span className="font-medium">University</span>
              </h1>
            </div>
          </div>
          
          <Link
            href={route('login')} 
            active={route().current('login')}
            className="text-emerald-800 border border-emerald-100 px-5 py-2 rounded-full hover:bg-emerald-50 transition-all duration-300"
          >
            Accreditation Portal
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section with Animation */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-light text-emerald-900 mb-8 tracking-tight">
              Shaping <span className="font-normal">Tomorrow's Leaders</span>
            </h2>
            <p className="text-lg text-emerald-700 max-w-2xl mx-auto font-light leading-relaxed opacity-90">
              Discover exceptional education in a vibrant community devoted to excellence and innovation.
            </p>
            <div className="mt-12">
              <Link 
                href="#explore" 
                className="inline-flex items-center gap-2 bg-emerald-700 text-white py-3 px-6 rounded-full hover:bg-emerald-800 transition-all duration-300"
              >
                Explore Programs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" id="explore">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <Book className="w-8 h-8 text-emerald-600 mb-6" />
                <h3 className="text-xl font-medium text-emerald-900 mb-4">Academic Excellence</h3>
                <p className="text-gray-600 mb-6 font-light">
                  Over 20 undergraduate and graduate programs across diverse disciplines
                </p>
                <div className="h-1 w-16 bg-emerald-500 rounded-full"></div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <Users className="w-8 h-8 text-emerald-600 mb-6" />
                <h3 className="text-xl font-medium text-emerald-900 mb-4">Vibrant Community</h3>
                <p className="text-gray-600 mb-6 font-light">
                  Join a diverse community of over 10,000 scholars and researchers
                </p>
                <div className="h-1 w-16 bg-emerald-500 rounded-full"></div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <Calendar className="w-8 h-8 text-emerald-600 mb-6" />
                <h3 className="text-xl font-medium text-emerald-900 mb-4">Campus Events</h3>
                <p className="text-gray-600 mb-6 font-light">
                  Engaging activities and events throughout the academic year
                </p>
                <div className="h-1 w-16 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-emerald-50">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-light text-emerald-800 mb-12">Our Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="p-4">
                <p className="text-4xl font-light text-emerald-700 mb-2">20+</p>
                <p className="text-sm text-emerald-600 uppercase tracking-wider">Programs</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-light text-emerald-700 mb-2">10K+</p>
                <p className="text-sm text-emerald-600 uppercase tracking-wider">Students</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-light text-emerald-700 mb-2">95%</p>
                <p className="text-sm text-emerald-600 uppercase tracking-wider">Employment</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-light text-emerald-700 mb-2">30+</p>
                <p className="text-sm text-emerald-600 uppercase tracking-wider">Partners</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-emerald-800 font-medium mb-4">Contact</h3>
              <p className="text-gray-600 font-light">Mindoro State University - Bongabong Campus</p>
              <p className="text-gray-600 font-light">Oriental Mindoro, Philippines</p>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-wider text-emerald-800 font-medium mb-4">Connect</h3>
              <a href="mailto:joshneiel.manalo102403@gmail.com" className="text-emerald-700 hover:text-emerald-900 font-light block mb-2">
                joshneiel.manalo102403@gmail.com
              </a>
            </div>
            
            <div className="text-right">
              <ApplicationLogo className="w-8 h-8 inline-block text-emerald-700" />
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Mindoro State University. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UniversityDashboard;