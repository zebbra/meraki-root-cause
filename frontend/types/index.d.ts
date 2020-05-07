export interface IDeviceStatuses {
  online: number;
  alerting: number;
  offline: number;
  other: number;
}

export interface IDevices {
  mx: number;
  ms: number;
  mr: number;
  mv: number;
}

export interface IOrganization {
  id: string;
  name: string;
}

export interface IOrganizationSummary {
  id: string;
  name: string;
  status: string;
  expirationDate: string;
  networks: number;
  statuses: IDeviceStatuses;
  devices: IDevices;
}

export interface INetwork {
  name: string;
  tags: string | null;
  type: string;
}
