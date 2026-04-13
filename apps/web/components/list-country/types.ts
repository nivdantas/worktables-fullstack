export interface Country {
  id: string;
  name: string;
  capital: string | null;
  region: string | null;
  subregion: string | null;
  population: number | null;
  area: number | null;
  currency: string | null;
  currencyName: string | null;
}

export interface MondayColumn {
  id: string;
  title: string;
}

export interface MondayColumnValue {
  id: string;
  text: string | null;
}

export interface MondayItem {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
}

export interface MondayBoard {
  columns: MondayColumn[];
  items_page: {
    items: MondayItem[];
  };
}

export interface MondayBoardsQueryData {
  boards?: MondayBoard[];
}

export interface MondayApiResponse {
  data?: MondayBoardsQueryData;
}
