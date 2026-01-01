<?php

return [

    // Which routes should be CORS-enabled
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // HTTP methods allowed
    'allowed_methods' => ['*'],

    // Frontend origins
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],

    // Allowed headers
    'allowed_headers' => ['*'],

    // Exposed headers
    'exposed_headers' => [],

    // How long browsers should cache preflight requests
    'max_age' => 0,

    // Important for Sanctum cookie-based auth
    'supports_credentials' => true,
];