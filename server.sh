#!/bin/sh

export LOG=/home/kebin/log/nodejs
export APP_PATH=/home/kebin/nodeLayer/
export APP=$APP_PATH/bin/www

forever -p $APP_PATH -l $LOG/access.log -e $LOG/error.log -o $LOG/out.log  --watchDirectory $APP_PATH  -aw start $APP