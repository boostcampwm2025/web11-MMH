export class SttResult {
  result: string;
  message: string;
  token: string;
  version: string;
  params: Params;
  progress: number;
  segments: Segment[];
  text: string;
  confidence: number;
  speakers: Speaker[];
  events: any[];
  eventTypes: any[];
}

interface Params {
  service: string;
  domain: string;
  lang: string;
  completion: string;
  callback: string;
  diarization: Diarization;
  sed: Sed;
  boostings: any[][];
  forbiddens: string;
  wordAlignment: boolean;
  fullText: boolean;
  noiseFiltering: boolean;
  resultToObs: boolean;
  priority: number;
  userdata: Userdata;
}

interface Diarization {
  enable: boolean;
  speakerCountMin: number;
  speakerCountMax: number;
}

interface Sed {
  enable: boolean;
}

interface Userdata {
  _ncp_DomainCode: string;
  _ncp_DomainId: number;
  _ncp_TaskId: number;
  _ncp_TraceId: string;
}

interface Segment {
  start: number;
  end: number;
  text: string;
  confidence: number;
  diarization: any[];
  speaker: any[];
  words: any[];
  textEdited: string;
}

interface Speaker {
  label: string;
  name: string;
  edited: boolean;
}
