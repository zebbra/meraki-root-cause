#!/bin/bash
set -e

echo "$@"

if [ "$1" = 'frontend' ] || [ "$1" = 'backend' ]; then
  cd $1; shift
  echo "$@"
  exec /usr/local/bin/yarn "$@"
fi

exec "$@"
