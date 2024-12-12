import React from 'react';

const EmailLayout = ({ url, title, message, logo, password }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3490dc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {logo && <img src={logo} alt="Company Logo" className="logo" />}
          <h1>{title}</h1>
          <p>{message}</p>
          {password && (
            <p>Your temporary password is: <strong>{password}</strong></p>
          )}
          <p>
            <a href={url} className="button">
              Verify Email Address
            </a>
          </p>
          <p>If you did not create an account, no further action is required.</p>
        </div>
      </body>
    </html>
  );
};

export default EmailLayout;

