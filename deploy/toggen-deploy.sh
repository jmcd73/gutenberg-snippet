#! /bin/bash
#
# Deploy script
#
# Deploy the plugin to your git repo, tag it and push it to the WordPress plugin
# repository via SVN, all in one go.
#
# Original script thanks to
# https://github.com/GaryJones/wordpress-plugin-git-flow-svn-deploy.

echo
echo "WordPress Deployment for Plugin Name ('plugin-name')"
echo
echo "Let's collect some information first."
echo
echo "Default values are in brackets - just hit enter to accept them."
echo

# Set up some default values. Feel free to change these in your own script
CURRENTDIR=$(pwd)
PLUGINSLUG="snippets-block"
default_svnpath="/tmp/$PLUGINSLUG"
default_plugindir="$CURRENTDIR"
default_mainfile="index.php"
MAINFILE="index.php"
SVNPATH="/tmp/$PLUGINSLUG"
ZIP="/tmp/toggen-snippets-block.zip"

# Get wporg username

echo "2 - Your local plugin root directory."
printf "($default_plugindir): "
read -e input
input="${input%/}"                       # Strip trailing slash
PLUGINDIR="${input:-$default_plugindir}" # Populate with default if empty
echo

echo "Here is all the data we have collected:"
echo
echo "Slug: $PLUGINSLUG"
echo "Temp checkout path: $SVNPATH"
echo "Remote SVN repo: $SVNURL"
echo "SVN username: $SVNUSER"
echo "Plugin directory: $PLUGINDIR"
echo "Main file: $MAINFILE"
echo

echo "OK to proceed?"
echo "y - proceed"
echo "n - abort"
echo "g - deploy to GitHub only"
read -e input
PROCEED="${input:-y}"
echo

# Allow user cancellation
if [ "$PROCEED" != "y" || "$PROCEED" != "g" ]; then
	echo "Aborting..."
	exit 1
fi

# cleanup
rm -rf $SVNPATH
rm -f $ZIP

# git config
GITPATH="$PLUGINDIR/" # this file should be in the base of your git repository

# Let's begin...
echo ".........................................."
echo
echo "Preparing to deploy WordPress plugin"
echo
echo ".........................................."
echo

# Check version in readme.txt is the same as plugin file after translating both to unix line breaks to work around grep's failure to identify mac line breaks
PLUGINVERSION=$(grep "Version:" $GITPATH/$MAINFILE | awk -F' ' '{print $NF}' | tr -d '\r')
echo "$MAINFILE version: $PLUGINVERSION"
READMEVERSION=$(grep "^Stable tag:" $GITPATH/readme.txt | awk -F' ' '{print $NF}' | tr -d '\r')
echo "readme.txt version: $READMEVERSION"

mkdir $SVNPATH

# copy needed root files
ROOTFILES="$MAINFILE
CHANGELOG.md
LICENSE
readme.txt
README.md"

for i in $ROOTFILES; do
	echo Copy $i
	sleep 1;

	cp $i $SVNPATH/

done

# Copying npm modules
mkdir -p $SVNPATH/node_modules
cp -rv $GITPATH/node_modules/highlightjs $SVNPATH/node_modules/

# Make the directory if it doesn't already exist
mkdir -p $SVNPATH/assets/

# Move wp-org files into /assets
cp -rv $GITPATH/assets $SVNPATH/
cp -rv $GITPATH/includes $SVNPATH/
cp -rv $GITPATH/languages $SVNPATH/

cd /tmp
zip -r $ZIP snippets-block
echo "Complete!"
