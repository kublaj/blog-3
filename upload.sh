#!/bin/bash

set -e
../sculpin/bin/sculpin generate -e prod
for i in $(find output_prod -name '*.html'); do gzip -kf $i; done
for i in $(find output_prod -name '*.css'); do gzip -kf $i; done
for i in $(find output_prod -name '*.js'); do gzip -kf $i; done
for i in $(find output_prod -name '*.xml'); do gzip -kf $i; done
rsync --delete -avz output_prod/ blog.opsbears.com@obs-zyl-smallwebs01.opsbears.com:htdocs/
