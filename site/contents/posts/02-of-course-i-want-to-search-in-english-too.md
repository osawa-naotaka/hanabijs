---
title: Of Course I Want to Search in English Too!
author: producer
date: 2025-03-02T00:00:00+09:00
tag:
    - techarticle
    - staticseek
---
### Are character 2-grams ineffective in English?

I previously evaluated the character n-gram inverted index using a Japanese dataset. Since the library I'm developing aims to be language-independent, I decided to evaluate it with an English dataset as well.

The numbers in parentheses after each method indicate: (1) when all m-grams (m < n) are added to the inverted index, and (2) when binary search is used to extract matching posting lists by the first character of the index term. The dataset consists of excerpts from English Wikipedia articles, with a total text size of 3,747 kilobytes, and 1,719 search operations were performed. In the table, "Size" refers to the index size, and "Search Time" represents the total time for all 1,719 search operations.

Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives
------ | ------------- | ---- | --------- | ----------- | ------- | --------------- | --------------
Linear Search | 23ms | 3,745kbyte | 1,322kbyte | 4,316ms
2-gram(1) | 1,630ms | 849kbyte | 139kbyte | 58ms | 58,964 | 95,950 | 0
3-gram(1) | 2,677ms | 3,932kbyte | 567kbyte | 47ms | 58,964 | 38,653 | 0
4-gram(1) | 3,592ms | 9,222kbyte | 1,212kbyte | 20ms | 58,964 | 7,852 | 0
2-gram(2) | 932ms | 837kbyte | 140kbyte | 104ms | 58,964 | 95,950 | 0
3-gram(2) | 1013ms | 3,557kbyte | 523kbyte | 58ms | 58,964 | 38,653 | 0
4-gram(2) | 1052ms | 6,811kbyte | 972kbyte | 36ms | 58,964 | 7,852 | 0

As anticipated, the number of false positives is extremely high. Only 4-grams reach a usable level. The gzip-compressed index size remains within an acceptable range.

Although I haven't verified it, I believe the high rate of false positives is due to English having only 26 character types. The number of bigram combinations is limited to 26 × 26 = 676. In contrast, Japanese has approximately 70,000 kanji characters, with 2,136 commonly used kanji alone. This significant difference in possible combinations likely results in most English words falling into similar bigram categories.

This reveals that Japanese and English require different search algorithms. At the very least, the value of n in character n-grams needs to be adjusted.

Additionally, the English benchmark is an order of magnitude slower than the Japanese benchmark. The reason for this is not immediately clear. The total number of hits (matches plus false positives) is seven times higher than in Japanese, which might explain the difference.

### Adopting Different Strategies for Japanese and English

Having decided to implement different strategies based on language, I first created a function to separate and organize text by language. It [divides text by removing whitespace and special characters as delimiters](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/src/util/preprocess.ts#L24-L29), then [checks character codes to split at the boundaries between English and Japanese](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/src/util/preprocess.ts#L31-L102). In practice, languages are classified into two types: "languages where word segmentation is difficult" and "languages where words can be extracted using spaces." Text fragments are stored in separate indices based on this classification. Search queries are processed through the same function, with searches conducted separately and then intersected to produce the final results.

#### Digression: Character Segmentation at the Grapheme Level

In the aforementioned function, I use a [segmenter](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/src/util/preprocess.ts#L80) to extract individual characters from a `string`. But what exactly constitutes a single character?

Every abstract character in Unicode is associated with a number called a [code point](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-2/#G25564). Meanwhile, the `string` type in JavaScript handles character strings in units called [UTF-16 code units](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_%E6%96%87%E5%AD%97%E3%80%81unicode_%E3%82%B3%E3%83%BC%E3%83%89%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E3%80%81%E6%9B%B8%E8%A8%98%E7%B4%A0%E3%82%AF%E3%83%A9%E3%82%B9%E3%82%BF%E3%83%BC). However, the code space containing all code points exceeds the range that can be handled with 16 bits. Consequently, some characters are represented as surrogate pairs—pairs of 16-bit code units that represent a single character. To retrieve code points from a UTF-16 string, one uses [String.prototype.codePointAt()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt).

In Unicode, however, what we perceive as a "single character" can sometimes be composed of multiple code points. This is called a [grapheme cluster](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-2/#G21807). The unit we typically consider as a single character is called a [grapheme](https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/#G52443), and to divide a Unicode string at this level, one must use the aforementioned `segmenter`.

[Staticseek](https://staticseek.lulliecat.com/) treats grapheme units as individual characters, extracts the first code point of each grapheme as a representative character, and performs searches accordingly. This enables stable search capabilities across all languages.

#### Digression: Text Preprocessing

[Staticseek](https://staticseek.lulliecat.com/) performs several preprocessing operations on text. During grapheme-level character segmentation, it also removes special characters (symbols, punctuation, etc.). This can also be considered a form of preprocessing.

Essentially, various normalizations are performed to ensure search stability:

- [Unicode normalization (NFC)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- Converting uppercase to lowercase in languages like English ([String.prototype.toLocaleLowerCase()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase))
- Converting full-width Japanese characters to half-width

Although these are relatively simple measures, they contribute to search stability.

Incidentally, I have not implemented stopword removal or stemming due to the language-neutral approach (this is not merely an excuse).

### Adopting Japanese n-gram and English Word Inverted Indices

Having separated indices for English and Japanese, I decided to implement a standard word-based inverted index for English. The word inverted index is implemented as a sorted array. To support both exact matches and prefix searches, I modified the binary search algorithm for the inverted index to return ranges of arrays that match prefixes. For details on the algorithm, please refer to the implementation of the [refine() function](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/ref/algo.ts#L118-L170). Benchmarks can be run using the [same benchmark execution script as before](https://github.com/osawa-naotaka/staticseek/blob/main/ref/bench/benchmark_ngram.ts). The dataset content is identical to what was used previously.

Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives
------ | ------------- | ---- | --------- | ----------- | ------- | --------------- | --------------
Linear Search - English | 24ms | 3,745kbyte | 1,322kbyte | 4,391ms
English word (2) | 290ms | 3,170kbyte | 500kbyte | 4.9ms | 53,481 | 0 | 5,483
Linear Search - Japanese | 12ms | 2,988kbyte | 1,051kbyte | 200ms
Japanese bigram (2) | 350ms | 6,066kbyte | 910kbyte | 9.6ms | 15,125 | 5,095 | 313
Japanese trigram (2) | 560ms | 11,568kbyte | 1,964kbyte | 5.1ms | 15,125 | 125 | 313

Word-based inverted indexing makes English searches 1000 times faster than linear search. Additionally, the gzip index size is halved thanks to word-level indexing, and false positives are eliminated. However, false negatives increased. This apparent increase is actually due to the lower quality of linear search as a reference, which has the issue of matching within words. In practice, word-based inverted indices seem to provide higher search quality. Searches are also 10 times faster than character n-grams.

The increase in false positives for Japanese might be due to the removal of special characters, although I haven't confirmed this. On the positive side, search time has been reduced by half. Japanese bigrams suffer from significant false positives, while trigrams substantially reduce false positives but double the index size—a challenging trade-off.
