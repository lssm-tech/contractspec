export interface PanelLayoutAdapter {
  restoreLayout(persistKey: string): Promise<number[] | null>;
  saveLayout(persistKey: string, sizes: number[]): Promise<void>;
}
