<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\View;
use App\Services\Content;
use Illuminate\Mail\Mailables\Content as MailablesContent;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;
    public $password;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $url, string $password = null)
    {
        $this->url = $url;
        $this->password = $password;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Verify Your Email Address')->view('emails.auth.verify');
    }

    public function content(): MailablesContent
    {
        $reactHtml = View::make('emails.auth.verify', [
            'url' => $this->url,
            'title' => 'Verify Your Email Address',
            'message' => 'Thank you for registering! Please click the button below to verify your email address:',
            'logo' => asset('images/logo.png'), // Adjust this path to your actual logo path
            'password' => $this->password,
        ])->render();

        return new MailablesContent(
            view: 'emails.layout',
            with: [
                'reactHtml' => $reactHtml,
            ],
        );
    }
}

