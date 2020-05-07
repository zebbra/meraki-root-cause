declare namespace MerakiRootCause {
  interface IInventory {
    mac: string;
    serial: string;
    networkId?: string;
    model: string;
    claimedAt: string;
    publicIp?: any;
    name: string;
    [propName: string]: any;
  }

  interface IStatus {
    name: string;
    serial: string;
    mac: string;
    publicIp?: any;
    networkId?: string;
    status: string;
    lastReportedAt?: any;
    usingCellularFailover: boolean;
    wan1Ip?: any;
    wan2Ip?: any;
    lanIp?: any;
  }

  export interface INetwork {
    id: string;
    organizationId: string;
    name: string;
    timeZone: string;
    tags?: string;
    productTypes: string[];
    type: "combined" | "appliance" | "switch" | "wireless";
    disableMyMerakiCom: boolean;
    disableRemoteStatusPage: boolean;
  }

  export interface INetworkId {
    netId: string;
  }

  export interface IOrganization {
    id: string;
    name: string;
  }

  export interface IOrganizationId {
    orgId: string;
  }

  export interface ILicense {
    status: string;
    expirationDate: string;
    licensedDeviceCounts: {
      [x: string]: number;
    };
  }
}

export default MerakiRootCause;
