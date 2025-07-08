// ===== 2. TIPOS E INTERFACES =====
// src/app/shared/types/icon.types.ts
// src/app/shared/types/icon.types.ts

export type IconName = 
  | 'barge1'
  | 'cargo-ship'
  | 'co2'
  | 'eco'
  | 'glacier'
  | 'group76'
  | 'group60'
  | 'group107'
  | 'home'
  | 'kbr'
  | 'pin'
  | 'port'
  | 'tree-silhouette'
  | 'truck2'
  | 'TRUCK'
  | 'search'
  | 'user'
  | 'arrow-left'
  | 'arrow-right'
  | 'menu'
  | 'close'
  | 'heart'
  | 'star'
  | 'plus'
  | 'minus'
  | 'edit'
  | 'delete'
  | 'check'
  |'Polygon'
  |'seta'
  | 'x';


export interface IconConfig {
  name: IconName;
  size?: number;
  color?: string;
  class?: string;
}