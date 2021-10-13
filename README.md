# Webpack Transform Examples

This repo illustrates how to customise a bit environment's webpack config via webpack transformers.

As an added bonus, in order to illustrate where this could be useful, the updated webpack configuration enables Stylable css for anyone who's looking to see how to do that with Bit :) 

Here you will find two custom environments, `my-org-env` and `my-team-env`, which together demonstrate each of the webpack override strategies available with Bit. `my-org-env` also demonstrates how to create a re-overridable env via creating a `compose` function. 

Webpack config overrides can be done in 3 ways:

1. Incorporating a new webpack.config.js file, whose contents will be merged with the config of the env being overriden 
1. Via built-in mutator functions, which programmatically mutate the existing config.
1. Manually accessing current webpack config and updating its contents

## webpack.config.js

To import a config file as an override, use the following syntax in the webpack.transformers file (config is the original webpack config):
``` js
...
import webpackConfig from './webpack-config';

...

config.merge([webpackConfig]);

```

## Mutators

The (Webpack Config Mutator)[https://bit.dev/teambit/webpack/modules/config-mutator] contains built-in functions for common mutations of the webpack config.

These mutations are chainable, so the syntax is as follows:
```js
  config
    .addEntry('./entry1.js')
    .addEntry('./entry2.js', { position: 'prepend' })
    .addPlugin(new MyPlugin())
    .addAliases({ react: 'custom-react-path' })
    .addTopLevel('output', { publicPath: { publicPath: 'my-public-path' } })
    .addModuleRule(cssRule);

```
## Manual Mutation

And of course you can access the config directly via `config.raw` and then mutate its contents directly.

```js
function findCssRule(rules: Array<any>, testMatcher = `/\\.css$/`) {
  return rules.find((rule) => rule.test && rule.test.toString() === testMatcher);
}

function excludeStCssFromRule(rule, excluder = /\.st\.css$/) {
  rule.exclude = excluder;
  return rule;
}

...
  const cssRule = findCssRule(newConfig.raw.module.rules);
  excludeStCssFromRule(cssRule, /\.(module|st)\.css$/);
  return newConfig;
...

```

This method requires familiarity with the current config and its contents, so can only be used when you know what your overriding (e.g. to override the react env's webpack config, you can see the base config in the react env's files), while the built-in mutators contain the logic for accessing and updating the config itself, and require only providing the relevant parameters for the desired mutation.



