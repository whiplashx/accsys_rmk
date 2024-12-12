import React from 'react';
import { Book, Users, Calendar, Trophy, ChartBar, Globe } from 'lucide-react';
import { Link , Head} from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import CopilotInterface from '@/Components/Chatbot';

const UniversityDashboard = () => {
  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-950">
      <Head title='MinSU - Accreditation'></Head>
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <ApplicationLogo/>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Mindoro State University</h1>
            <p className="text-emerald-100 mt-1">Bongabong Campus</p>
          </div>
        </div>  
        <Link
        href={route('login')} 
        active={route().current('login')}
        className="flex items-center space-x-2 text-white bg-emerald-800 mr-10 relative group"
        >
        <span className="relative">
            Accreditation
            <span 
            className="absolute inset-x-0 -bottom-1 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"
            ></span>
        </span>
        </Link>    
      </header>
      <div className="px-6 py-12 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">Shaping Tomorrow's Leaders</h2>
        <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
          Discover high-class education and research opportunities in a vibrant academic community committed to excellence and innovation.
        </p>
      </div>
      <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <Book className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-semibold">Academic Excellence</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">Over 20 undergraduate and graduate programs across diverse disciplines</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Research Output</span>
              <span className="font-semibold">98%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{width: '98%'}}></div>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-lg rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-semibold">Vibrant Community</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">Join a diverse community of scholars.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">10k+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-lg rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-semibold">Campus Events</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">Engaging activities and events throughout the academic year</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Research Symposium</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">International Fair</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Next Week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8 bg-white/5 backdrop-blur-lg mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          
        </div>
      </div>
      
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="mt-2">Mindoro State University - Bongabong Campus</p>
            <p>Oriental Mindoro, Philippines</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="mt-2">
              <a href="mailto:joshneiel.manalo102403@gmail.com" className="text-emerald-300 hover:underline">joshneiel.manalo102403@gmail.com</a>
            </p>
          </div>
          <div>

          </div>
        </div>
        <div className="mt-6 text-center text-sm border-t border-gray-800 pt-4">
          &copy; {new Date().getFullYear()} Mindoro State University. All Rights Reserved.
        </div>
      </footer>

    </div>

  );
};

export default UniversityDashboard;