import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from "@teambit/webpack";
import { StylableWebpackPlugin } from "@stylable/webpack-plugin";
import { JSONPath } from "jsonpath-plus";

export function stylableTransform(config: WebpackConfigMutator): void {
  const cssRule = JSONPath<any[]>({
    json: config.raw,
    path: `$.module.rules..[?(@ && @.test && RegExp(@.test).test('st.css'))]`,
  });

  if (cssRule.length !== 1 ) {
    throw new Error(
        `failed to set stylable webpack exclusion, didnt find a css rule` + 
        ` This probably means the webpack configuration of Bit itself has changed!`
    );
}

  excludeStCssFromRule(cssRule[0]);
}

/**
 * Transformation to apply for both preview and dev server
 * @param config 
 * @param context 
 */
function commonTransformation(
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) {
  // add stylable support
  config.addPlugin(new StylableWebpackPlugin({ }));
  // @ts-ignore
  stylableTransform(config);
  return config;
}

/**
 * Transformation for the preview only
 * @param config 
 * @param context 
 * @returns 
 */
export const previewConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
}

/**
 * Transformation for the dev server only
 * @param config 
 * @param context 
 * @returns 
 */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};

function excludeStCssFromRule(rule, excluder = /\.st\.css$/) {
  console.log("rule in ExcludeStFromRule", JSON.stringify(rule))
  rule.exclude = excluder;
  return rule;
}