
<?php

class Config
{
    private static $config;

    public static function get($key, $default = null)
    {
        if (is_null(self::$config)) {
            self::$config = require __DIR__ . '/../../config.php';
        }

        return self::$config[$key] ?? $default;
    }
}
