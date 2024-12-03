import React from 'react';
import { Book, Users, Calendar, Trophy, ChartBar, Globe } from 'lucide-react';
import { Link , Head} from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

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
          Discover world-class education and research opportunities in a vibrant academic community committed to excellence and innovation.
        </p>
      </div>
      <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/95 backdrop-blur-lg rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <Book className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-semibold">Academic Excellence</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">Over 100 undergraduate and graduate programs across diverse disciplines</p>
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
            <p className="text-gray-600">Join a diverse community of scholars from around the world</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">120+</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">25k+</div>
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
          <div className="text-center">
            <ChartBar className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-sm text-emerald-100">Graduate Employment</div>
          </div>
          <div className="text-center">
            <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-sm text-emerald-100">Research Centers</div>
          </div>
          <div className="text-center">
            <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">Top 1%</div>
            <div className="text-sm text-emerald-100">Global Rankings</div>
          </div>
          <div className="text-center">
            <Book className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">300+</div>
            <div className="text-sm text-emerald-100">Published Papers</div>
          </div>
        </div>
      </div>
      {/* Additional Section */}
      <div className="px-6 py-12 bg-white/10 backdrop-blur-lg mt-8">
          <h2 className="text-4xl font-bold text-white text-center mb-6">Why Choose MinSU?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/95 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <Trophy className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Recognized Excellence</h3>
              <p className="text-gray-600 mt-2">Ranked among the top universities in Asia for innovation and quality education.</p>
            </div>
            <div className="bg-white/95 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Global Diversity</h3>
              <p className="text-gray-600 mt-2">Students and faculty from over 120 countries create a multicultural learning experience.</p>
            </div>
            <div className="bg-white/95 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <ChartBar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Career Success</h3>
              <p className="text-gray-600 mt-2">95% of our graduates secure employment or higher education opportunities within 6 months.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="mt-2">Mindoro State University - Bongabong Campus</p>
            <p>Mindoro, Philippines</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <p className="mt-2">
              <a href="mailto:joshneiel.manalo102403@gmail.com" className="text-emerald-300 hover:underline">joshneiel.manalo102403@gmail.com</a>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-1">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Admissions</a></li>
              <li><a href="#" className="hover:underline">Programs</a></li>
              <li><a href="#" className="hover:underline">Research</a></li>
            </ul>
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