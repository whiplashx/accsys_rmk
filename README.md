# AccSys - Accreditation Management System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel 11.x">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18.x">
  <img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP 8.2+">
  <img src="https://img.shields.io/badge/Inertia.js-1.0-9553E9?style=flat-square&logo=inertia&logoColor=white" alt="Inertia.js">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License">
</p>

## About AccSys

**AccSys (Accreditation System)** is a comprehensive web-based application designed to streamline and manage institutional accreditation processes. Built specifically for educational institutions, AccSys facilitates collaboration between different stakeholders in the accreditation process, from initial preparation to final evaluation.

### 🎯 Key Features

- **Multi-Role Access Control**: Four distinct user roles (Admin/Dean, Local Task Force, Local Accreditor, Outside Accreditor) with tailored interfaces
- **Hierarchical Accreditation Structure**: Areas → Parameters → Indicators organization system
- **Task Management**: Assign and track accreditation tasks across teams with real-time progress monitoring
- **Document Management**: Secure upload, storage, and access control for accreditation documents with approval workflows
- **Self-Survey System**: Digital rating and evaluation tools for internal assessments
- **Document Access Requests**: Secure document sharing with approval workflows and time-limited access
- **Real-time Analytics**: Progress tracking, performance dashboards, and comprehensive reporting
- **Program Management**: Support for multiple academic programs with individual oversight
- **Email Notifications**: Automated notifications for access requests, task assignments, and updates

### 🏗️ System Architecture

AccSys is built using modern web technologies:

- **Backend**: Laravel 11.x with Fortify for authentication
- **Frontend**: React 18.x with Inertia.js for seamless SPA experience
- **Styling**: TailwindCSS with custom components
- **Database**: MySQL with comprehensive relationships
- **File Storage**: AWS S3 integration for document storage
- **Email**: Mailgun integration for notifications
- **Charts**: Recharts for analytics and reporting
- **PDF Generation**: HTML2PDF.js for document generation

### 👥 User Roles & Capabilities

#### Admin/Dean
- Complete system oversight and user management
- Program and accreditation structure management
- Task assignment and monitoring across all programs
- Document access approval and management
- Comprehensive analytics and reporting

#### Local Task Force
- Task execution and document upload
- Self-survey completion and rating submission
- Document access requests for restricted materials
- Progress tracking and status updates

#### Local Accreditor
- Independent evaluation and rating of indicators
- Document review and assessment
- Quality assurance and feedback provision
- Comparison with self-assessments

#### Outside Accreditor
- External evaluation and validation
- Independent assessment of institutional claims
- Final recommendation and reporting
- Objective third-party perspective

### 📋 Core Modules

1. **User Management**: Role-based access control with program assignments
2. **Accreditation Structure**: Hierarchical organization of evaluation criteria
3. **Task Management**: Assignment, tracking, and completion workflows
4. **Document Management**: Secure storage with granular access controls
5. **Self-Survey System**: Digital evaluation and rating tools
6. **Analytics Dashboard**: Real-time progress and performance metrics
7. **Notification System**: Email alerts and in-app notifications

## Getting Started

### System Requirements

- PHP 8.2 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Composer
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/whiplashx/accsys_rmk.git
   cd accsys_rmk
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate --seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

### Development

Run the development environment with all services:

```bash
composer dev
```

This starts:
- Laravel development server
- Queue worker
- Log monitoring (Pail)
- Vite development server with hot reloading

Alternatively, run services individually:
- **Server**: `php artisan serve`
- **Frontend**: `npm run dev`
- **Queue**: `php artisan queue:work`

## Documentation

For detailed usage instructions, see the [User Manual](USER_MANUAL.md) which covers:
- System navigation and interfaces
- Role-specific workflows and capabilities
- Feature guides and best practices
- Administrative procedures
- Troubleshooting and support

## Technology Stack

- **Backend Framework**: Laravel 11.x
- **Frontend Library**: React 18.x
- **Full-Stack Framework**: Inertia.js
- **CSS Framework**: TailwindCSS
- **Authentication**: Laravel Fortify
- **Authorization**: Spatie Laravel Permission
- **Build Tool**: Vite
- **Icons**: Heroicons & Lucide React
- **Charts**: Recharts
- **Notifications**: React Toastify
- **PDF Generation**: HTML2PDF.js

## Contributing

AccSys is developed to meet the specific needs of institutional accreditation processes. Contributions are welcome through:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Submit a pull request with detailed description

## Security

If you discover a security vulnerability within AccSys, please send an email to the development team. All security vulnerabilities will be promptly addressed.

## License

AccSys is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
