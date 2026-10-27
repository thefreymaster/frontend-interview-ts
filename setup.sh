#!/usr/bin/env bash
set -eo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  if ! command -v curl >/dev/null 2>&1; then
    printf 'curl is required to install nvm.\n' >&2
    exit 1
  fi

  printf 'Installing nvm v0.40.8...\n'
  mkdir -p "$NVM_DIR"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
fi

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  printf 'nvm installation failed: %s/nvm.sh was not found.\n' "$NVM_DIR" >&2
  exit 1
fi

# Load nvm explicitly; installer profile changes do not affect this process.
. "$NVM_DIR/nvm.sh" --no-use
nvm install
nvm use
nvm alias default 24

case "$(node --version)" in
  v24.*) ;;
  *)
    printf 'Setup requires Node 24, but a different version is active.\n' >&2
    exit 1
    ;;
esac

npm ci --include=dev

printf '\nSetup complete with Node %s.\n' "$(node --version)"
printf 'Open a new terminal, or run: . "%s/nvm.sh" && nvm use 24\n' "$NVM_DIR"
