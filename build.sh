#!/bin/bash

# Check if an input file was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <markdown-file> [--localize]"
    exit 1
fi

# Get the input file
input_file="$1"
shift  # Remove the first argument

# Create output directory based on input filename (without extension)
output_dir="${input_file%.*}"

# Run Marp to convert markdown to HTML
marp --theme "$HOME/Dropbox/slides/contents/themes/main.css" \
     "$input_file" \
     --engine "$HOME/Dropbox/slides/src/engine.js" \
     --bespoke.progress \
     --html \
     -o "$output_dir/index.html"

# Check if localization is requested
while [ "$#" -gt 0 ]; do
    case "$1" in
        --localize)
            echo "Running localization script..."
            python3 "$(dirname "$0")/localize.py" "$output_dir/index.html"
            # Move the processed file to replace the original
            mv "processed_index.html" "$output_dir/index.html"
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift
done
