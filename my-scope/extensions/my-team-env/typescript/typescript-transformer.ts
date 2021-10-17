import * as path from 'path';
import {
  TsConfigTransformer,
  TypescriptConfigMutator,
} from "@teambit/typescript";

export const commonTransformer: TsConfigTransformer = (
  config: TypescriptConfigMutator
) => {
  const newConfig = config.addTypes([path.join(__dirname, 'stylable.d.ts')])
  return newConfig;
};

/**
 * Transformation for the dev config only
 * @param config
 * @param context
 * @returns
 */
export const devConfigTransformer: TsConfigTransformer = (
  config: TypescriptConfigMutator,
) => {
  const newConfig = commonTransformer(config, {});
  return newConfig;
};

/**
 * Transformation for the build only
 * @param config
 * @param context
 * @returns
 */
export const buildConfigTransformer: TsConfigTransformer = (
  config: TypescriptConfigMutator
) => {
  const newConfig = commonTransformer(config, {});
  return newConfig;
};