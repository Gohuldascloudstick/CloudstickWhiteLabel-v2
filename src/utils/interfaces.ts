export interface email {
  email: string;
  quota_mb: number;
  used_mb: number;
  available_mb: number;
  quota_display: string;
  used_display: string;
  available_display: string;
  status: string;
  domain: string;
}
export interface Emailconfig {
  name: string;
  ttl: number;
  value?: string;
  ip?: string;
  server?: string;
  priority?: number;
}

export interface SystemUser {
  id: number;
  created_at: string;
  name: string;
  sudo_permission: boolean;
  server_id: number;
  server_uuid: string;
  password?: string;
}

export interface Database {
  id: number;
  created_at: string;
  db_name: string;
  server_id: number;
  db_collation: string;
  is_backup_enabled: boolean;
  is_app_database: boolean;
  website_id: number;
}
export interface Appdatabse {
  id: number;
  created_at: string;
  db_name: string;
  server_id: number;
  db_collation: string;
  is_backup_enabled: boolean;
  is_app_database: boolean;
  website_id: number;
  backup_period: string;
  backup_retention_period: string;
  success_backup_email: boolean;
  failed_backup_email: boolean;
  server: null;
  user_id: number;
}

export interface AppDbUser {
  id: number;
  created_at: number;
  db_user_name: string;
  is_app_dbuser: boolean;
  website_id: number;
  server_id: number;
  privileges: string[];
}
export interface UserInDb {
  db_user_id: number;
  db_user_name: string;
  privileges: string[];
}
export interface dbAssingedUser {
  database_id: number;
  database_name: string;
  users: UserInDb[];
}
export interface Dbuser {
  id: number;
  db_user_name: string;
  server_id: number;
  created_at: number;
}


export interface Website {
  id: number;
  server_id: number;
  server_uuid: string;

  system_user_name: string;
  system_user_password: string;
  system_user_id: number;

  created_at: string;
  updated_at: string;
  name: string;
  domains: string[];
  stack_type: string;
  public_path: string;
  source_path: string;
  status: string;
  email: string;
  website_type: string;
  no_of_subdomains: number;
  is_roundcube_installed: boolean;


  is_backup_enabled: boolean;
  backup_period?: string;
  backup_retention_period?: string;
  success_backup_email?: boolean;
  failed_backup_email?: boolean;
  is_full_backup?: boolean;
  exclude_files?: string | null;

  is_ssl_installed: boolean;
  is_ssl_try_attempt?: boolean;
  ssl_created_at?: string;
  ssl_expired_at?: string;
  ssl_provider?: string;
  ssl_authorisation?: string;
  ssl_third_party?: string;
  ssl_third_party_account?: number;
  ssl_certificate?: string;
  ssl_private_key?: string;
  ssl_cipher_suite?: string;
  ssl_tls_protocol?: string;
  ssl_access_method?: string;
  ssl_renewed_at?: string;
  ssl_brotli_enabled?: boolean;
  ssl_acme_account_key?: string;
  ssl_acme_registration?: string;


  is_database_used: boolean;
  port: number;
  php_version: number;


  cj_protection: boolean;
  xss_protection: boolean;
  ms_protection: boolean;
  permissions_policy: boolean;
  content_security_policy: boolean;
  referrer_policy: boolean;
  cross_origin_opener_policy: boolean;

  system_user: SystemUser | null;
}
export interface WebisteDetails {
  id: number;
  server_id: number;
  server_uuid?: string;
  php_version?: string;
  php_process_manager?: string;
  php_max_children?: number;
  php_max_requests?: number;
  php_start_servers?: number;
  php_min_spare_servers?: number;
  php_max_spare_servers?: number;
  php_open_base_dir?: string;
  php_timezone?: string;
  php_disable_functions?: string;
  php_max_execution_time?: number;
  php_max_input_time?: number;
  php_max_input_vars?: number;
  php_memory_limit?: number;
  php_post_max_size?: number;
  php_upload_max_filesize?: number;
  php_session_max_lifetime?: number;
  php_allow_url_fopen?: boolean;
  php_short_open_tag?: boolean;
  add_php_open_base_dir?: string;
  php_display_error?: string;
  port?: number;
  website: Website;
  database: Database;
  db_user: Dbuser;

  template_id?: 2;
}
export interface Subdomain {
  id: number;
  server_id: number;
  website_id: number;
  website_type: string;
  name: string;
  domains: string[];
  public_path: string;
  source_path: string;
  status: string;
  php_version: number;
  stack_type: string;
  port: number;
  system_user: SystemUser;
  is_backup_enabled: boolean;
}
export interface FileManagerItem {
  path: string;
  name: string;
  is_dir: boolean;
  last_modified: string;
  permission: string;
  size: number; // files have size, some folders too

  // If it's a folder, it may contain children
  children?: FileManagerItem[];

  // If it's a file, it may have content
  content?: string;
}
export interface SystemUser {
  id: number;
  created_at: string;
  name: string;
  sudo_permission: boolean;
  server_id: number;
  server_uuid: string;
  password?: string;
}
export interface CronJob {
  id: number;
  server_id: number;
  user_name: string;
  label: string;
  binary: string;
  path: string;
  schedule: string;
  is_app_cron: boolean;
  website_id?: number;
}

interface NullableBool {
  Bool: boolean;
  Valid: boolean;
}
export interface User {
  id: number;
  name: string;
  email: string;
  email_uuid: string;
  email_verified: boolean;
  profile_picture: string;
  two_factor_auth: boolean;
  is_admin: boolean;
  is_support_staff: boolean;
  role: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  company_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  country_code: string;
  gst_number: string;
  timezone: string;
  google_auth_id: string;
  plan_id: number;
  plan_start_date: string; // ISO timestamp
  plan_end_date: string; // ISO timestamp
  is_fst_trial_mail_sent: boolean;
  is_scd_trial_mail_sent: boolean;
  is_trail_extended: boolean;
  api_key: string;
  api_secret: string;
  referal_code: string;
  otp: string;
  is_deleted: boolean;
  is_disabled: boolean;
  cloudstick_plan: {
    plan_id: number;
    name: string;
    description: string;
    monthly_price: number;
    yearly_price: number;
    backup_storage_value: number;
    backup_storage_unit: string;
  };
}
interface sharedServer {
  Bool: boolean;
  Valid: boolean;
}

export interface RamInfo {
  total: number;
  available: number;
  used: number;
  usedPercent: number;
  free?: number;
  active?: number;
  inactive?: number;
  buffers?: number;
  cached?: number;
  commitlimit?: number;
  committedas?: number;
  dirty?: number;
  highfree?: number;
  hightotal?: number;
  hugepagesfree?: number;
  hugepagesize?: number;
  hugepagestotal?: number;
  laundry?: number;
  lowfree?: number;
  lowtotal?: number;
  mapped?: number;
  pagetables?: number;
  shared?: number;
  slab?: number;
  sreclaimable?: number;
  sunreclaim?: number;
  swapcached?: number;
  swapfree?: number;
  swaptotal?: number;
  vmallocchunk?: number;
  vmalloctotal?: number;
  vmallocused?: number;
  wired?: number;
  writeback?: number;
  writebacktmp?: number;
}
export interface ServerDetails {
  number_of_database: number;
  number_of_websites: number;
  servers: Server;
  websites_last_updated_at: String;
}
export interface IntegrationCredential {
  id: number;
  label: string;
  service: string;
  username: string;
  secret_key: string;
  user_id: string;
  created_at: string; // ISO timestamp string
  updated_at: string;
}
export interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
  locked: boolean;
  created_on: string;
  modified_on: string;
  zone_id: string;
  zone_name: string;
  priority?: number;
  data: {
    value?: string;
    priority?: number;
    target?: string;
    certificate?: string;
    matching_type?: number;
    selector?: number;
    usage?: number;
    port?: number;
    weight?: number;
    algorithm?: number;
    type?: number;
    fingerprint?: string;
    flags?: number;
    tag?: string;
    key_tag?: number;
    protocol?: number;
    public_key?: string;
    digest?: string;
    digest_type?: number;
  };
}
export interface CloudflareAccount {
  id: string;
  name: string;
}
export interface Zone {
  id: string;
  name: string;
  account: CloudflareAccount;
  status: string;
  type: string;
  paused: boolean;
  vanity_name_servers: string[];
}
export interface Provider {
  id: number;
  label: string;
  secret_key: string;
  service: string;
  username: string;
  user_id: string; // If numeric in future, change to number
  created_at: string;
  updated_at: string;
}
export interface HddInfo {
  path: string;
  fstype: string;
  total: number;
  free: number;
  used: number;
  usedPercent?: number;
  inodesFree?: number;
  inodesTotal?: number;
  inodesUsed?: number;
  inodesUsedPercent?: number;
}
export interface ServerStats {
  CPUs: number;
  agent_version: string;
  cpu_model: string;
  cpu_usage: number;
  distro: string;
  ftp_usage: Record<string, string>; // e.g. { Unable: "0" }
  hd_usage: Record<string, string>; // user/directory → size
  hdd: HddInfo;
  kernel_version: string;
  load_average_1: number;
  load_average_5: number;
  load_average_15: number;
  ram: RamInfo;
  server_uuid: string;
  tstamp: string;
  uptime: string;
  used_disc_space: number;
  total_disc_space: number;
  free_disc_space: number;
  last_reboot: string;
  mysql_active_connections: number;
  mysql_max_connections: number;
}
export interface Server {
  id: number;
  uuid: string;
  created_at: string; // ISO timestamp
  name: string;
  user_id: number;
  provider: string;
  ip4: string;
  ip6: string;
  country: string;
  region: string;
  os_version: string;
  timezone: string;
  php_cli_version: number;
  remote_mysql_access: NullableBool;
  quota_enabled: NullableBool;
  no_of_reboots: number;
  host_name: string;
  by_cloudstick: boolean;
  InstallationType: string;
  user: User;
  is_shared_server: sharedServer;
  is_ssl_installed: boolean;
  is_ssl_try_attempt: boolean;
  ssl_created_at: string;
  ssl_expired_at: string;
  ssl_provider: string;
  ssl_authorisation: string;
  ssl_third_party: string;
  ssl_third_party_account: number;
  ssl_certificate: string;
  ssl_private_key: string;
  ssl_cipher_suite: string;
  ssl_tls_protocol: string;
  ssl_access_method: string;
  ssl_renewed_at: string;
  ssl_brotli_enabled: boolean;
  ssl_acme_account_key: string;
  ssl_acme_registration: string;
}