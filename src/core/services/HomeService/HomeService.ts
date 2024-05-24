import ApiService from "../ApiService";
import environment from "~/src/core/environment";
import IHomeService, { IGroup, IHomePostLight, IHomePostLightRename, ILight } from "./IHomeService"
import { getService } from "@webstack/common";
import IMemberService from "../MemberService/IMemberService";




export default class HomeService extends ApiService implements IHomeService {

  private MemberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.home);
    this.MemberService = getService<IMemberService>('IMemberService');
  }
  public async light(
    { id, name }: IHomePostLight
  ): Promise<ILight> {
    return this.post<any, any>(
      "/hue/light",
      { id, name }
    );
  }
  public async hue_list(
    type='light'
    ): Promise<any> {
      return await this.get<any>(
        `/api/home/hue/list?type=${type}`,
      );
    }
    public async lightsOn(
    ): Promise<any> {
      return await this.get<any>(
        "/api/home/hue/all-on",
      );
    }
    public async lightsOff(
    ): Promise<any> {
      return await this.get<any>(
        "/api/home/hue/all-off",
      );
    }
    public async stream(
      cameraId: string
    ): Promise<string> {
      return this.get<string>(
        `/cam-${cameraId}`,
      );
    }
    public async hue_brightness(
      id: number, brightness: number, type?: string
    ): Promise<any> {
      return this.post<any, any>(
        `/api/home/hue/light-bri?id=${id}&bri=${brightness}&type=${type}`,
        
      );
    }


    public async listGroups(): Promise<any> {
      return await this.get<any>(
        "/api/home/hue/groups",
      );
    }
    public async hue_rename({ id, name, new_name }: IHomePostLightRename): Promise<any> {
      const requestData = { id, name, new_name };
      return await this.post<any, any>(
        "/api/home/hue/light/rename",
        requestData
      );
    }
  
    public async createGroup(newGroup: IGroup): Promise<IGroup> {
      return await this.post<any, any>(
        "/api/home/hue/groups",
        newGroup
      );
    }
  
    public async modifyGroup(request: any): Promise<any> {
      const { group_id, ...data } = request;
      return await this.put<any, any>(
        `/api/home/hue/groups/${group_id}`,
        data
      );
    }
  
    public async deleteGroup(group_id: string): Promise<any> {
      return await this.delete<any>(
        `/api/home/hue/groups/${group_id}`,
      );
    }

    public async hue_toggle(
      id: any,
      hue_object: string = 'light'
    ): Promise<any> {
      return this.get<any>(
        `/api/home/hue/toggle?id=${id}${hue_object && `&type=${hue_object}`||''}`,
      );
    }
    public async lightColor(
      id: any,
      hex: string,
      type: string,
    ): Promise<any> {
      return this.get<any>(
        `/api/home/hue/light-hex-color?id=${id}&hex=${hex.replaceAll('#','')}&type=${type}`,
      );
    }
    public async getVehicles(
      access: any
    ): Promise<any> {
      return this.post<any, any>(
        "/auto/vehicles",
        access
      );
    }
    public async startVehicle(
      request: any
    ): Promise<any> {
      return this.post<any, any>(
        "/auto/vehicle/start",
        request
      );
    }
    protected appendHeaders(headers: { [key: string]: string }) {
      super.appendHeaders(headers);
      const token = this.MemberService.getCurrentUserToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    
}
