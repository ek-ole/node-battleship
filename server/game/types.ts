export interface WSMessage {
  type: string;
  data: unknown;
  id: number;
}

export interface RegRequest {
  type: 'reg';
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

export interface RegResponse {
  type: 'reg';
  data: string;
  id: 0;
}