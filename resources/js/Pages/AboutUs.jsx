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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Simple section detection
            const position = window.scrollY + 100;
            if (position < document.getElementById("explore").offsetTop) {
                setActiveSection("hero");
            } else if (position < document.getElementById("stats").offsetTop) {
                setActiveSection("explore");
            } else {
                setActiveSection("stats");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="font-sans text-gray-900 bg-gray-50 overflow-x-hidden">
            <Head title="MinSU - Accreditation" />

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
