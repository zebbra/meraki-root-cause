declare namespace MerakiRootCause {
  interface IInventory {
    mac: string;
    serial: string;
    networkId?: string;
    model: string;
    claimedAt: string;
    publicIp?: any;
    name: string;
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

  export interface IDeviceSummary extends IInventory, IStatus {
    neighbors?: INeighbor[];
    uplinks?: IUplink[];
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
    orgId: string;
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

  export interface ICdp {
    deviceId: string;
    portId: string;
    address: string;
    sourcePort: string;
  }

  export interface ILldp {
    systemName: string;
    portId: string;
    managementAddress: string;
    sourcePort: string;
  }

  export interface ILldpCdpPortsMap {
    [x: string]: {
      cdp: ICdp;
      lldp?: ILldp;
    };
  }

  export interface ILldpCdp {
    sourceMac: string;
    ports: ILldpCdpPortsMap;
  }

  export interface INeighbor {
    portId: string;
    mac: string;
    deviceId: string;
    address: string;
    sourcePort: string;
    systemName: string;
    managementAddress: string;
  }

  export interface ITopologyNode {
    name: string;
    serial: string;
    mac: string;
    status: string;
    model: string;
  }

  export interface ITopologyEdge {
    v: string;
    w: string;
    value: object;
  }

  export interface IJsonGraph {
    options: {
      directed: boolean;
      multigraph: boolean;
      compund: boolean;
    };
    nodes: ITopologyNode[];
    edges: ITopologyEdge[];
  }

  export interface IUplink {
    interface: string;
    status: string;
    ip: string;
    gateway: string;
    publicIp: string;
    dns: string;
    usingStaticIp: boolean;
  }

  export interface IMerakiAlert {
    alertType: string;
    sharedSecret: string;
    organizationId: string;
    networkId: string;
    deviceSerial?: string;
  }
}

export default MerakiRootCause;
