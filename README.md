Created at AstonHack 2016 - [winner of "Best Overall Hack"](https://devpost.com/software/safepassage).

Plots recent UK crime location over a travel route on Google Maps.

# API
Usage: ```api.php?postcodeStart=FOO&postcodeEnd=BAR```

Change FOO and BAR to valid UK postcodes.

Returns a JSON document containing a list of recent crime events within a mile radius of the calculated route between postcodeStart and postcodeEnd. Crime stats are for the previous month only.

# Setting up
Obtain API keys from Google Maps (developer.google.com) for both client and server requests. Please note that in this application the two keys are spread out over two variables, which is useful if you use both HTTP Referrer and IP address key restrictions. You may use the same API key for both if those restrictions do not apply to you.

To change the API keys, open `config.php` insert your keys in place of '' where appropriate:

```php
define('CLIENT_API_KEY', '');
define('SERVER_API_KEY', '');
```
