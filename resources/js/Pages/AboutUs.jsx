import React, { useState, useEffect } from "react";
import {
    Book,
    Users,
    Calendar,
    ChevronRight,
    ExternalLink,
    Instagram,
    Twitter,
    Facebook,
} from "lucide-react";
import { Link, Head, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import CopilotInterface from "@/Components/Chatbot";

const UniversityDashboard = () => {
    const { url, component } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    // Team members data
    const teamMembers = [
        {
            name: "Jane Doe",
            role: "Lead Developer",
            description: "Responsible for system architecture and backend development",
            image: "/images/placeholder.jpg"
        },
        {
            name: "John Smith",
            role: "Frontend Developer",
            description: "Created the user interface and user experience design",
            image: "/images/placeholder.jpg"
        },
        {
            name: "Alex Johnson",
            role: "Database Specialist",
            description: "Designed and implemented the database architecture",
            image: "/images/placeholder.jpg"
        },
        {
            name: "Sam Wilson",
            role: "QA Engineer",
            description: "Ensured quality and performance of the system",
            image: "/images/placeholder.jpg"
        },
        {
            name: "Taylor Brown",
            role: "Project Manager",
            description: "Coordinated development and managed project timeline",
            image: "/images/placeholder.jpg"
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Simple section detection
            const position = window.scrollY + 100;
            if (position < document.getElementById("team").offsetTop) {
                setActiveSection("hero");
            } else if (position < document.getElementById("mission").offsetTop) {
                setActiveSection("team");
            } else {
                setActiveSection("mission");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 overflow-x-hidden">
            <Head title="MinSU - About Us" />

            {/* Decorative elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[15%] left-[5%] w-64 h-64 bg-emerald-100 rounded-full opacity-30 blur-[80px]"></div>
                <div className="absolute bottom-[25%] right-[10%] w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-[100px]"></div>
            </div>

            <header
                className={`fixed w-full transition-all duration-500  color-white  z-50 ${
                    scrolled
                        ? "py-3 bg-white/95 backdrop-blur-md shadow-sm"
                        : "py-6 bg-white/80 backdrop-blur-sm"
                }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4 group">
                        <div
                            className={`${
                                scrolled ? "w-12 h-12" : "w-16 h-16"
                            } bg-transparent rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden`}
                        >
                            <ApplicationLogo
                                className={`transition-all duration-500 ${
                                    scrolled ? "w-10 h-10" : "w-14 h-14"
                                } text-emerald-700`}
                            />
                        </div>
                        <div>
                            <h1
                                className={`font-light tracking-wide transition-all duration-500 ${
                                    scrolled
                                        ? "text-emerald-800 text-2xl"
                                        : "text-emerald-700 text-3xl"
                                }`}
                            >
                                Mindoro State{" "}
                                <span className="font-medium">University</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex gap-8">
                            <a
                                href={route("welcome")}
                                className={`text-sm font-light transition-all duration-300 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300 
                                ${component === 'Welcome' 
                                  ? 'text-emerald-800 after:bg-emerald-600 after:scale-x-100' 
                                  : 'text-gray-600 after:bg-emerald-400'}`}
                            >
                                Home
                            </a>
                            <a
                                href={route("aboutus")}
                                className={`text-sm font-light transition-all duration-300 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300 
                                ${component === 'AboutUs' 
                                  ? 'text-emerald-800 after:bg-emerald-600 after:scale-x-100' 
                                  : 'text-gray-600 after:bg-emerald-400'}`}
                            >
                                About Us
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section with Animation and Background Image */}
                <section
                    id="hero"
                    className="min-h-screen flex items-center pt-24 pb-20 relative"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply"></div>
                        <img
                            src="/images/body.jpg"
                            alt="Mindoro State University Campus"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="opacity-0 animate-[fadeInDown_1s_ease_forwards]">
                            <h2 className="text-6xl font-light text-white mb-8 tracking-tight leading-tight max-w-3xl mx-auto">
                                About <span className="font-normal">Our</span>
                                <span className="block font-medium">
                                    University
                                </span>
                            </h2>
                            <div className="w-16 h-1 bg-emerald-400 mx-auto my-6 rounded-full"></div>
                            <p className="text-lg text-emerald-50 max-w-xl mx-auto font-light leading-relaxed opacity-90">
                                Mindoro State University's Accreditation System is designed to streamline and enhance the accreditation process, providing robust tools for assessment, document management, and continuous improvement.
                            </p>
                        </div>

                        <div className="mt-16 opacity-0 animate-[fadeInUp_1s_0.5s_ease_forwards]">
                            <Link
                                href="#team"
                                className="inline-flex items-center gap-2 bg-emerald-700 text-white py-3 px-8 rounded-full hover:bg-emerald-800 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-100 group"
                            >
                                <span>Meet Our Team</span>
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="absolute bottom-8 left-0 w-full flex justify-center animate-bounce">
                            <div className="w-8 h-12 border-2 border-emerald-300 rounded-full flex items-start justify-center p-2">
                                <div className="w-1 h-3 bg-emerald-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Members Section */}
                <section className="py-32" id="team">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-light text-emerald-900 mb-4">
                                Development <span className="font-medium">Team</span>
                            </h3>
                            <p className="text-emerald-600 max-w-lg mx-auto font-light">
                                Meet the talented individuals behind the development of this system
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {teamMembers.map((member, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 group hover:border-emerald-50 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 mx-auto transition-transform duration-300 group-hover:scale-110">
                                        <span className="text-2xl text-emerald-700">{member.name.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-xl font-medium text-emerald-900 mb-3 text-center">
                                        {member.name}
                                    </h3>
                                    <p className="text-emerald-600 text-sm mb-4 text-center">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-6 text-center font-light leading-relaxed">
                                        {member.description}
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <a href="#" className="text-emerald-500 hover:text-emerald-700 transition-colors">
                                            <Twitter size={16} />
                                        </a>
                                        <a href="#" className="text-emerald-500 hover:text-emerald-700 transition-colors">
                                            <Instagram size={16} />
                                        </a>
                                        <a href="#" className="text-emerald-500 hover:text-emerald-700 transition-colors">
                                            <Facebook size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

                {/* Mission & Vision Section with Background Image */}
                <section className="py-24 relative" id="mission">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        <img
                            src="/images/body.jpg"
                            alt="Mindoro State University Campus"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-emerald-50"></div>
                    </div>

                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIj48cGF0aCBmaWxsPSIjMTBiOTgxMTAiIGQ9Ik0zNi41NyAzMy4zOGwtNi0uMjNhLjUuNSAwIDAxLS40OC0uNDhsLS4yMy02YS41LjUgMCAwMS43OC0uNDZsNi4yMyAzLjE4YS41LjUgMCAwMS4yMy4zLjUuNSAwIDAxLS4wNy4zOGwtMS45NSAyLjk0YS41LjUgMCAwMS0uNTIuMzd6Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h3 className="text-4xl font-light text-emerald-900 mb-4">
                            Our <span className="font-medium">Mission & Vision</span>
                        </h3>
                        <p className="text-emerald-600 max-w-lg mx-auto font-light mb-16">
                            The driving force behind our university's commitment to excellence
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md hover:border-emerald-50 transition-all duration-300">
                                <h4 className="text-xl font-medium text-emerald-800 mb-4">Our Mission</h4>
                                <p className="text-gray-600 font-light leading-relaxed">
                                    To provide accessible quality education through responsive instruction, 
                                    distinctive research, sustainable extension and production programs 
                                    for the holistic development of individuals in a dynamic society.
                                </p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md hover:border-emerald-50 transition-all duration-300">
                                <h4 className="text-xl font-medium text-emerald-800 mb-4">Our Vision</h4>
                                <p className="text-gray-600 font-light leading-relaxed">
                                    A premier university in the MIMAROPA region with recognized excellence 
                                    in instruction, research and extension that nurtures morally upright individuals 
                                    competitive in the global knowledge economy.
                                </p>
                            </div>
                        </div>

                        <div className="mt-24">
                            <Link
                                href={route("login")}
                                className="inline-flex items-center gap-3 bg-white text-emerald-800 border border-emerald-100 py-3 px-8 rounded-full hover:bg-emerald-700 hover:text-white transition-all duration-500 hover:shadow-lg hover:shadow-emerald-100 hover:border-transparent group"
                            >
                                <span>Access Accreditation Portal</span>
                                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <ApplicationLogo className="w-8 h-8 text-emerald-700" />
                                <h4 className="font-normal text-lg text-emerald-800">
                                    Mindoro State University
                                </h4>
                            </div>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">
                                Dedicated to excellence in education, research
                                and community service in Oriental Mindoro and
                                beyond.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-emerald-800 font-medium mb-6">
                                Contact
                            </h3>
                            <p className="text-gray-600 font-light mb-2">
                                Mindoro State University - Bongabong Campus
                            </p>
                            <p className="text-gray-600 font-light mb-2">
                                Oriental Mindoro, Philippines
                            </p>
                            <a
                                href="mailto:joshneiel.manalo102403@gmail.com"
                                className="text-emerald-700 hover:text-emerald-900 font-light block mt-4 transition-colors duration-300"
                            >
                                joshneiel.manalo102403@gmail.com
                            </a>
                        </div>

                        <div>
                            <h3 className="text-sm uppercase tracking-wider text-emerald-800 font-medium mb-6">
                                Connect
                            </h3>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-500">
                        <p className="mb-2">
                            © {new Date().getFullYear()} Mindoro State
                            University. All Rights Reserved.
                        </p>
                        <div className="flex justify-center gap-6 mt-4 text-gray-400 text-xs">
                            <a
                                href="#"
                                className="hover:text-emerald-700 transition-colors duration-300"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-emerald-700 transition-colors duration-300"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-emerald-700 transition-colors duration-300"
                            >
                                Accessibility
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 1;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default UniversityDashboard;
