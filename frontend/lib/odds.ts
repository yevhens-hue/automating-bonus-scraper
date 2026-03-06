export interface OddsOutcome {
  label: string;
  best_odd: number;
  brand_id: string;
  brand_name: string;
  affiliate_url: string;
}

export interface BookmakerOdd {
  brand_id: string;
  brand_name: string;
  affiliate_url: string;
  odds: {
    [label: string]: number; // e.g. "1": 2.50, "X": 3.10, "2": 2.80
  };
  implied_probability?: number;
}

export interface OddsMarket {
  type: string;
  outcomes: OddsOutcome[]; // The best ones to highlight
  bookmakers: BookmakerOdd[]; // All tracked bookmakers for comparison
}

export interface OddsEvent {
  id: string;
  slug: string; // Unique URL slug
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
