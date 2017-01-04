#!/bin/sh

sudo pm2 -l ./logs/access.log -o ./logs/out.log -e ./logs/error.log start ./bin/www