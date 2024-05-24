import React from "react";
import { serviceProvider } from "@webstack/common";
import environment from "~/src/core/environment";
import MemberService from "~/src/core/services/MemberService/MemberService";
import ProductService from "~/src/core/services/ProductService/ProductService";
import HomeService from "~/src/core/services/HomeService/HomeService";
import AdminService from "~/src/core/services/AdminService/AdminService";
import DocumentService from "~/src/core/services/DocumentService/DocumentService";
import ProspectService from "~/src/core/services/ProspectService/ProspectService";
import SocialService from "~/src/core/services/SocialService/SocialService";

interface IProps { }
export default class ServiceContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const mock = environment.devSettings?.mockApis;
    serviceProvider.registerService("IMemberService", MemberService);
    serviceProvider.registerService("IProductService", ProductService);
    serviceProvider.registerService("IProspectService", ProspectService);
    serviceProvider.registerService("IHomeService", HomeService);
    serviceProvider.registerService("IAdminService", AdminService);
    serviceProvider.registerService("IDocumentService", DocumentService);
    serviceProvider.registerService("ISocialService", SocialService);
  }

  render() {
    return <></>;
  }
}
