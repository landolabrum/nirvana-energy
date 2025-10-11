
import devEnvironment from "./environments/environment.dev";
import prodEnvironment from "./environments/environment.production";
import { IEnvironment } from "./environments/environment.interface";

// INcludes the subpath of a Developer's browser URL  to determine if the application is running in development mode.
const DEV_URL: string = ":30"
const isDevEnv: boolean=typeof window == "object" && window?.location.href?.toLowerCase().includes(DEV_URL)
let environment : IEnvironment= isDevEnv?  devEnvironment: prodEnvironment;
environment = {
  ...environment,
  isProduction: !isDevEnv,
}

export default environment;