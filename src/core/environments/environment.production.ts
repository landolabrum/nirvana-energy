import { IEnvironment } from "./environment.interface";

const prodEnvironment: IEnvironment = {
  useMockApi: false,
  isProduction: false,
  merchant:{
    name:"deepturn",
  },
  legacyJwtCookie: {
    name: "auth-token",
    // domain: "dev.connectunited.com",
  },
  serviceEndpoints: {
    membership: '',
    shopping: '',
    distributor: '',
    home: '',
    social: '',
    admin: ''
  },
  firebase: {
    webApiKey: '',
    authDomain: '',
    projectId: '',
  },
};

export default prodEnvironment;
