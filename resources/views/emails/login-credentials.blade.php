<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .header {
            background-color: #064e3b;
            color: white;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 15px;
        }
        .content {
            padding: 30px;
            background-color: #f8f9fa;
        }
        .credentials {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid #064e3b;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #064e3b;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        a {
            color: #064e3b;
            text-decoration: none;
        }
        h1 {
            margin: 0;
            font-size: 24px;
        }
        h2 {
            color: #064e3b;
            margin-top: 0;
        }
        .system-name {
            font-size: 18px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="AccSys Logo" class="logo">
            <h1>AccSys</h1>
            <p class="system-name">Accreditation System</p>
        </div>
        
        <div class="content">
            <h2>Welcome, {{ $name }}!</h2>
            <p>Your account has been created successfully. Below are your login credentials:</p>
            
            <div class="credentials">
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Password:</strong> {{ $password }}</p>
            </div>
            
            <p>Please login using these credentials and change your password immediately for security purposes.</p>
            
            <center>
                <a href="{{ url('/login') }}" class="button">Login Now</a>
            </center>
            
            <p>If the button above doesn't work, you can access the system at:<br>
            <a href="{{ url('/') }}">{{ url('/') }}</a></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; {{ date('Y') }} AccSys. All rights reserved.</p>
        </div>
    </div>
</body>
</html>