interface Metadata {
  auction_item_id: string;
  auction_highest_bid: number;
  auction_highest_bidder: number;
  auction_number_of_bids: number;
  auction_ends_at: number;
  item_inspected: boolean;
  timestamp: number;
  trade_url?: string;
}

export interface DepositResponseProps {
  data: {
    deposits: TradeDataProps[];
  };
}

export interface MetadataResponseProps {
  user: User;
  socket_token: string;
  socket_signature: string;
}

interface User {
  id: number;
  steam_id: string;
  steam_id_v3: string;
  steam_name: string;
  avatar: string;
  profile_url: string;
  registration_timestamp: string;
  registration_ip: string;
  last_login: string;
  balance: number;
  total_profit: number;
  total_bet: number;
  betback_total: number;
  bet_threshold: number;
  total_trades: number;
  total_deposit: number;
  total_withdraw: number;
  withdraw_limit: number;
  csgo_playtime: number;
  last_csgo_playtime_cache: string;
  trade_url: string;
  trade_offer_token: string;
  ref_id: number;
  total_referral_bet: number;
  total_referral_commission: number;
  ref_permission: number;
  ref_earnings: number;
  total_ref_earnings: number;
  total_ref_count: number;
  total_credit: number;
  referral_code: string;
  referral_amount: number;
  muted_until: number;
  mute_reason: string;
  admin: number;
  super_mod: number;
  mod: number;
  utm_campaign: string;
  country: string;
  is_vac_banned: number;
  steam_level: number;
  last_steam_level_cache: string;
  whitelisted: number;
  total_tips_received: number;
  total_tips_sent: number;
  withdrawal_fee_owed: string;
  flags: number;
  ban?: any;
  level: number;
  xp: number;
  socket_token: string;
  user_hash: string;
  hashed_server_seed: string;
  intercom_hash: string;
  extra_security_type: string;
  total_bet_skincrash: number;
  total_bet_matchbetting: number;
  total_bet_roulette: number;
  total_bet_coinflip: number;
  total_bet_supershootout: number;
  p2p_deposits_completed: number;
  bot_withdraw_allowed: boolean;
  auction_deposits_enabled: boolean;
  verified: boolean;
  hide_verified_icon: boolean;
  unread_notifications: any[];
  email: string;
  email_verified: boolean;
  btc_deposit_address: string;
  eth_deposit_address: string;
  ltc_deposit_address: string;
  bch_deposit_address: string;
  steam_inventory_url: string;
  steam_api_key: string;
  has_crypto_deposit: boolean;
}

export interface TradeDataProps {
  items: Item[];
  metadata: Metadata;
  id: number;
  user_id: number;
  bot_id?: any;
  total_value: number;
  security_code: string;
  tradeoffer_id: string;
  trade_id: string;
  status: number;
  status_message: string;
  createdAt: Date;
  updatedAt: Date;
  botId?: any;
  status_text: string;
}

interface Item {
  id: number;
  app_id: number;
  asset_id: string;
  context_id: string;
  created_at: number;
  img: string;
  is_commodity: boolean;
  market_name: string;
  market_value: number;
  paint_index?: any;
  preview_id?: any;
  price_is_unreliable: boolean;
  raw_price: number;
  tradable: boolean;
  tradelock: boolean;
  type: string;
  wear?: any;
  custom_price: number;
}

export interface TradeStatusProps {
  type: string;
  data: TradeDataProps;
}
