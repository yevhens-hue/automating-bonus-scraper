export interface OddsOutcome {
  label: string;
  best_odd: number;
  brand_id: number;
  brand_name: string;
  affiliate_url: string;
}

export interface OddsMarket {
  type: string;
  outcomes: OddsOutcome[];
}

export interface OddsEvent {
  id: string;
  sport: string;
  tournament: string;
  team_home: string;
  team_away: string;
  team_home_logo?: string;
  team_away_logo?: string;
  start_time: string;
  is_live?: boolean;
  markets: OddsMarket[];
}

export interface OddsData {
  updated_at: string;
  events: OddsEvent[];
}
