<?php

namespace App\Mail;

use App\Models\DocumentAccessRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DocumentAccessRequestNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $accessRequest;

    public function __construct(DocumentAccessRequest $accessRequest)
    {
        $this->accessRequest = $accessRequest;
    }

    public function build()
    {
        return $this->subject('New Document Access Request - AccSys')
                    ->view('emails.document-access-request');
    }
}
