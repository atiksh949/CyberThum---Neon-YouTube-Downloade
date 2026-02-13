
export interface ThumbnailData {
  videoId: string;
  maxRes: string;
  hq: string;
  mq: string;
  sd: string;
}

export enum ResolutionType {
  MAX_RES = 'Max Res (HD)',
  HQ = 'High Quality',
  MQ = 'Medium Quality',
  SD = 'Standard Definition'
}

export interface DownloadQueueItem {
  id: string;
  videoId: string;
  resolution: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}
