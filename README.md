# Puff theme for TWSAA

This repository customizes the official TWSAA Twig theme for Puff. It is a theme source package; publishing this repository does not activate it on a store.

## Apply this file set

Start with the complete official twsaa/twig-theme repository at commit 04207778c898c6ceabeda5245f3d43ff8c6c1e17. Merge the assets and views folders at repository root, replacing matching files. Do not upload an extra enclosing folder. Keep all unchanged upstream files.

## Homepage activation

The prepared configuration has release.enabled=true after local preflight. The custom homepage requires the verified price/availability and order flags, exactly124 products, and every destination product link. Setting only release.enabled=false in views/puff/config.json.twig restores native homepage blocks while retaining custom header, footer and policies. The public catalog is a static snapshot and needs updating when prices or availability change. Product, cart and checkout transactions remain native TWSAA.

## Platform submission

After committing the complete theme, submit the public repository URL through TWSAA's custom theme form with the name and cover image. Platform review and activation are separate steps. Verify the rendered homepage, variant selection, quantity, cart, search, account and policy routes in the platform before claiming completion.

## Development

The upstream project requires PHP and Composer with Twig3. Run composer install and then php -S 127.0.0.1:8000 index.php for its sample fixture preview. Upstream sample data and helpers are not production store state. No customer records, credentials, local previews or internal audit files are part of this customization file set.
