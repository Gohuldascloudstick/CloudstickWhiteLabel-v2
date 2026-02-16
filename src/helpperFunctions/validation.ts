export const validateIPAddress = (ip) => {
  // Regex for IPv4 address validation (simple but effective for common cases)
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // You might also want to include IPv6 validation if needed
  return ipv4Regex.test(ip);
};



export const calculateInstallationProgress = (logs: string[]): number => {
  const milestones = [
    'Checking if system is hosted on VULTR...',
    'Configuring WP-CLI...',
    'Starting repository configuration...',
    'Starting CloudStick package installation...',
    'Starting phpMyAdmin sign-on configuration...',
    'Starting Pure-FTPd configuration with TLS support...',
    'Waiting for dpkg lock...',
    '=== Starting and enabling PHP-FPM services based on OS version ===',
    '=== Installing and configuring CSF Firewall ===',
    'Installing CloudStick agent...',
    'CloudStick installation is completed... Happy Computing..!',
  ];

  let completedIndex = -1;

  for (let i = 0; i < milestones.length; i++) {
    if (logs.some(log => log.includes(milestones[i]))) {
      completedIndex = i;
    }
  }

  const percentage = Math.round(((completedIndex + 1) / milestones.length) * 100);
  return percentage;
};


export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateDomain = (domain: string): boolean => {
  // Matches domains like example.com, sub.example.org, my-site.io
  const regex =
    /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
  return regex.test(domain);
};

export const validateWebsiteName = (name: string): boolean => {
  const regex = /^[a-z][a-z0-9-]{2,62}$/;
  return regex.test(name);
}


export const validateSSHKey = (key: string): string | null => {
  const trimmed = key.trim();
  if (!trimmed) return "Public key is required";
  if (!/^(ssh-(rsa|ed25519|dss)|ecdsa-sha2-)/.test(trimmed))
    return "Public key must start with a valid type (ssh-rsa, ssh-ed25519, etc.)";
  const parts = trimmed.split(" ");
  if (parts.length < 2)
    return "Invalid format — SSH key must contain type and key data";
  const keyData = parts[1];
  if (!/^[A-Za-z0-9+/=]+$/.test(keyData))
    return "Key data must be Base64-encoded";
  if (keyData.length < 50)
    return "Public key seems too short";
  if (trimmed.includes("\n"))
    return "Public key must be a single line";
  return null;
};
