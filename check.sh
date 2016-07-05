#!/bin/bash

cd "$(dirname "$0")"

IGNORE_CHECK=false
CURRENT_DATE=`date +%s`
THRESHOLD=$((24*60*60))

if [ "$1" = "--weekly-check-only" ]; then

	if [ -f 'last-check-date' ] && [ $CURRENT_DATE -lt $((`cat last-check-date`+$THRESHOLD)) ]; then
		IGNORE_CHECK=true
	fi
fi

if [ $IGNORE_CHECK = false ]; then	
	echo "Checking lottery results ..."
	echo
	echo `date +%s` > last-check-date
	node index.js --checkresults=hun-lottery-5
	echo
	node index.js --checkresults=hun-lottery-6
	echo
fi
