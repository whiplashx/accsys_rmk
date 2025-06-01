<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Access Request - AccSys</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .request-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
            display: block;
        }
        .field-value {
            color: #6b7280;
            background: white;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
        }
        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin: 10px 10px 10px 0;
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .button.secondary {
            background: #6b7280;
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
        }
        .urgent {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 Document Access Request</h1>
            <p>AccSys - Accreditation System</p>
        </div>
        
        <div class="content">
            <div class="urgent">
                <strong>⚠️ Action Required:</strong> A new document access request needs your review.
            </div>

            <h2>Request Details</h2>
            
            <div class="request-card">
                <div class="field">
                    <span class="field-label">👤 Requested By:</span>
                    <div class="field-value">{{ $accessRequest->user->name }} ({{ $accessRequest->user->email }})</div>
                </div>

                <div class="field">
                    <span class="field-label">📄 Document:</span>
                    <div class="field-value">{{ $accessRequest->document->name }}</div>
                </div>

                <div class="field">
                    <span class="field-label">🏫 Program:</span>
                    <div class="field-value">{{ $accessRequest->program->name ?? 'N/A' }}</div>
                </div>

                <div class="field">
                    <span class="field-label">📝 Reason:</span>
                    <div class="field-value">{{ $accessRequest->reason }}</div>
                </div>

                <div class="field">
                    <span class="field-label">📅 Requested On:</span>
                    <div class="field-value">{{ $accessRequest->created_at->format('F j, Y \a\t g:i A') }}</div>
                </div>

                <div class="field">
                    <span class="field-label">👨‍💼 Assigned Dean:</span>
                    <div class="field-value">{{ $accessRequest->dean->name ?? 'Not assigned' }}</div>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/dean/document-requests') }}" class="button">
                    🔍 Review Request
                </a>
                <a href="{{ url('/dean/documents') }}" class="button secondary">
                    📁 View All Documents
                </a>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the request details and reason provided</li>
                <li>Verify the user's authorization to access this document</li>
                <li>Approve or reject the request with appropriate feedback</li>
                <li>Set an expiration date if approving (optional)</li>
            </ul>

            <p>You can manage all document access requests from your dean dashboard. If you have any questions about this request, please contact the system administrator.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from AccSys.</p>
            <p>Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} AccSys. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
