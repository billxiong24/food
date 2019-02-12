#!/bin/bash
export PGPASSWORD="cOgride4ci"
psql -U postgres -h vcm-8440.vm.duke.edu -f ./foodtest.sql
