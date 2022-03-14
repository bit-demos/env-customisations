import { MainRuntime } from '@teambit/cli';
import { UseWebpackModifiers, UseTypescriptModifiers } from "@teambit/react";
import MyOrgEnvAspect, { MyOrgEnvMain } from "@learn-bit-react/configs.webpack.my-org-env";
import EnvsAspect, { Environment, EnvsMain } from "@teambit/envs";
import { MyTeamEnvAspect } from "./my-team-env.aspect";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";
import { 
  devConfigTransformer, 
  buildConfigTransformer 
} from './typescript/typescript-transformer';

type MyOrgEnvDeps = [EnvsMain, MyOrgEnvMain];

export class MyTeamEnvMain {
  constructor(readonly teamEnv: Environment) {}
  static slots = [];
  static dependencies = [EnvsAspect, MyOrgEnvAspect];
  static runtime = MainRuntime;
  static async provider([envs, myOrgEnv]: MyOrgEnvDeps) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };
    const tsModifiers: UseTypescriptModifiers = {
      devConfig: [devConfigTransformer],
      buildConfig: [buildConfigTransformer],
    };

    const envWebpackTransform = myOrgEnv.useWebpack(webpackModifiers);
    const envTsTransform = myOrgEnv.useTypescript(tsModifiers);
    const myEnv = myOrgEnv.compose([
      envWebpackTransform,
      envTsTransform,
      myOrgEnv.overrideJestConfig(require.resolve('./jest/jest.config.js'))
    ]);
    envs.registerEnv(myEnv);
    return new MyTeamEnvMain(myEnv);
  }
}

MyTeamEnvAspect.addRuntime(MyTeamEnvMain);
