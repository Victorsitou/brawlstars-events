export interface Slot {
    id: number;
    name: string;
    emoji: string;
    hash: string;
    listAlone: boolean;
    hideable: boolean;
    hideForSlot?: number;
    background?: string;
}

export interface Environment {
    id: number;
    name: string;
    hash: string;
    path: string;
    version: number;
    imageUrl: string;
}

export interface GameMode {
    id?: number;
    name: string;
    hash: string;
    version: number;
    color: string;
    bgColor: string;
    link: string;
    imageUrl: string;
}

export interface GameModeAPI {
    scId: number;
    name: string;
    hash: string;
    scHash: string;
    disabled: boolean;
    color: string;
    bgColor: string;
    version: number;
    title: string;
    tutorial: string;
    description: string;
    shortDescription: string;
    sort1: number;
    sort2: number;
    link: string;
    imageUrl: string;
    imageUrl2: string;
    lastActive: number | null;
    TID: string;
  }

export interface Stat {
    brawler: number;
    winRate: number;
    useRate: number;
}

export interface EventMap {
    id: number;
    new: boolean;
    disabled: boolean;
    name: string;
    hash: string;
    version: number;
    link: string;
    imageUrl: string;
    credit?: string;
    environment: Environment;
    gameMode: GameMode;
    lastActive: number;
    dataUpdated: number;
    stats: Stat[];
    teamStats: (null)[]; // TBD
}

export interface Event {
    slot: Slot;
    predicted: boolean;
    startTime: string;
    endTime: string;
    reward: number;
    map: EventMap;
    modifier?: string;
}

export interface Events {
    active: Event[];
    upcoming: Event[];
}