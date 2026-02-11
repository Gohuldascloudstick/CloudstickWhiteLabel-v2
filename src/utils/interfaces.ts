export interface Email {
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
  referrer_policy:boolean;
  cross_origin_opener_policy:boolean;
  
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
  database:Database;
  db_user:Dbuser;
  
  template_id?: 2;
}