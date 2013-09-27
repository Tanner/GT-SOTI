#!/bin/python

import argparse
import json
import re
import os.path

parser = argparse.ArgumentParser(description='Process a institute address transcript.')
parser.add_argument('file', nargs=1, help='The transcript file to process.')

args = parser.parse_args()
filename = args.file[0]

file = open(filename, 'r')

json_data = {}

# Get the basic data
result = re.search('(\d{2})_(\d{2})_(\d{4})_(\w+)_(\w+).txt', filename)

date = {
  "month": result.group(1),
  "day": result.group(2),
  "year": result.group(3)
};
first_name = result.group(4)
last_name = result.group(5)

json_data["metadata"] = {
  "date": date,
  "first name": first_name,
  "last name": last_name
}

word_frequencies = dict()
word_locations = dict()

words_count = 0
line_word_count = []

line_number = -1

for line_index, line in enumerate(file):
  # If this is a empty line, skip it
  if len(line.rstrip()) == 0:
    continue

  line_number += 1

  # Do analysis
  words = line.split()

  single_line_word_count = 0

  for word_index, word in enumerate(words):
    # Remove all non-alphanumeric characters
    word = re.sub(r'\W+', '', word)

    single_line_word_count += 1

    if len(word) == 0:
      continue;

    # Add to our data
    if word in word_frequencies:
      word_frequencies[word] += 1
    else:
      word_frequencies[word] = 1

    if word not in word_locations:
      word_locations[word] = []

    word_locations[word].append({
      "line": line_number,
      "word": word_index,
    })

  line_word_count.append(single_line_word_count)

  words_count += single_line_word_count

json_data["metadata"]["word count"] = words_count
json_data["metadata"]["line word counts"] = line_word_count

json_data["frequencies"] = word_frequencies
json_data["locations"] = word_locations

with open(os.path.splitext(filename)[0] + ".json", "w") as output:
  json.dump(json_data, output, sort_keys=True, indent=4, separators=(',', ': '))