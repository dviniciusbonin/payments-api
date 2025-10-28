global.File = class {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor() {
    this.name = '';
    this.size = 0;
    this.type = '';
    this.lastModified = Date.now();
  }
} as any;

global.Blob = class {
  size: number;
  type: string;

  constructor() {
    this.size = 0;
    this.type = '';
  }
} as any;

jest.setTimeout(60000);
