import { contextBridge, ipcRenderer } from 'electron';

const flywheelAPI = {
  chat: {
    send: (message: string, history: any[]) =>
      ipcRenderer.invoke('chat:send', message, history),
  },
  scanner: {
    scan: (queries: string[]) =>
      ipcRenderer.invoke('scanner:scan', queries),
    getReports: () =>
      ipcRenderer.invoke('scanner:getReports'),
    getLatestReport: () =>
      ipcRenderer.invoke('scanner:getLatestReport'),
  },
  content: {
    generate: (params: any) =>
      ipcRenderer.invoke('content:generate', params),
    list: () =>
      ipcRenderer.invoke('content:list'),
    save: (item: any) =>
      ipcRenderer.invoke('content:save', item),
    update: (id: string, data: any) =>
      ipcRenderer.invoke('content:update', id, data),
    delete: (id: string) =>
      ipcRenderer.invoke('content:delete', id),
    publish: (id: string, platform: string) =>
      ipcRenderer.invoke('content:publish', id, platform),
  },
  schedule: {
    get: () => ipcRenderer.invoke('schedule:get'),
    set: (config: any) => ipcRenderer.invoke('schedule:set', config),
    pause: () => ipcRenderer.invoke('schedule:pause'),
    resume: () => ipcRenderer.invoke('schedule:resume'),
    runOnce: () => ipcRenderer.invoke('schedule:runOnce'),
  },
  memory: {
    getBrand: () => ipcRenderer.invoke('memory:getBrand'),
    updateBrand: (data: any) => ipcRenderer.invoke('memory:updateBrand', data),
    getPreferences: () => ipcRenderer.invoke('memory:getPreferences'),
    updatePreferences: (data: any) => ipcRenderer.invoke('memory:updatePreferences', data),
    getContext: () => ipcRenderer.invoke('memory:getContext'),
    updateContext: (data: any) => ipcRenderer.invoke('memory:updateContext', data),
    getLearnings: () => ipcRenderer.invoke('memory:getLearnings'),
    getSummary: () => ipcRenderer.invoke('memory:getSummary'),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (data: any) => ipcRenderer.invoke('settings:update', data),
  },
};

contextBridge.exposeInMainWorld('flywheel', flywheelAPI);
