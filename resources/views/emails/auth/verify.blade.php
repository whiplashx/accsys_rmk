@php
    $reactComponent = json_encode([
        'component' => 'EmailLayout',
        'props' => [
            'url' => $url,
            'title' => $title,
            'message' => $message,
            'logo' => $logo,
            'password' => $password,
        ],
    ]);
@endphp

