
export interface GameStats {
  ects: number;
  money: number;
  sanity: number;
  semester: number;
}

export interface GameOption {
  text: string;
  resultDescription: string;
  statChanges: Partial<GameStats>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  imagePrompt: string;
  options: GameOption[];
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  LOADING = 'LOADING',
  GAMEOVER = 'GAMEOVER',
  VICTORY = 'VICTORY',
  MAP = 'MAP'
}
