<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #064e3b;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f8f9fa;
        }
        .credentials {
            background-color: white;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Mindoro State University</h1>
            <p>Accreditation System</p>
        </div>
        
        <div class="content">
            <h2>Welcome, {{ $name }}!</h2>
            <p>Your account has been created successfully. Below are your login credentials:</p>
            
            <div class="credentials">
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Password:</strong> {{ $password }}</p>
            </div>
            
            <p>Please login using these credentials and change your password immediately for security purposes.</p>
            <p>You can access the system at: <a href="{{ url('/') }}">{{ url('/') }}</a></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; {{ date('Y') }} Mindoro State University. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
