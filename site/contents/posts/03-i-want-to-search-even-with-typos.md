---
title: I Want to Search Even with Typos!
author: producer
date: 2025-03-03T00:00:00+09:00
principalTag:
    - techarticle
associatedTags:
    - staticseek
---
## Measure Before Optimizing

In our previous work, we achieved fast searching using inverted indexes for all languages representable in Unicode. That's great. Done.

...Or at least I would have been done if I hadn't noticed something concerning in the benchmarks. Let me repost the benchmarks. The search execution count is 1,719 times.

Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives
------ | ------------- | ---- | --------- | ----------- | ------- | --------------- | --------------
Linear search - English | 24ms | 3,745kbyte | 1,322kbyte | 4,391ms
English word (2) | 290ms | 3,170kbyte | 500kbyte | 4.9ms | 53,481 | 0 | 5,483

For linear search, 4,391ms for 1,719 searches. Dividing, we get approximately 2.5ms per search.

This is sufficiently fast. Even if used on the UI thread, it won't freeze and users won't notice any delay. For English, the gzipped index is small so there's an advantage, but for Japanese, this advantage is less significant.

Therefore, there seems to be no reason to use an inverted index. Linear search is sufficient! 

## Fuzzy Search, What I Wanted to Implement from the Beginning

There's a search feature I wanted to implement from the beginning (truly, I'm serious): fuzzy search. I decided to implement it because it seems technically interesting.

However, I can't help but wonder if it lacks practical utility and is just a feature for specifications' sake. Even after implementing and releasing fuzzy search, I'm still uncertain whether it's truly useful as the default search scheme. It seems to increase false positives, which can be frustrating. To avoid excessive false positives, I set it to only allow one character errors, but I question whether people really make one-character typos that often. It's complicated.

In any case, it's technically interesting, so I'll document it here.

While there are several definitions of fuzzy search, in this article I'll define it as enabling the search of misspelled words. For instance, I sometimes confuse 'r' and 'l' and input them incorrectly. It would be nice to be able to search for such errors as well.

### Defining the Degree of Fuzziness

Before implementing fuzzy search, we need to understand whether "fuzziness" can be expressed numerically. Since we're going to handle the concept of fuzziness in our program, we need to translate it into a concept that can be represented by specific numerical values.

Intuitively, the number of misspelled characters seems to be the most reasonable concept. For example, "Hello" and "Hallo" differ by one character. Similarly, "Hello" and "Helo" also differ by one character. The more characters are incorrect, the fuzzier the word can be considered.

Let's define the concept of "how many characters are misspelled" in a way that can be handled by programs. In this article, I define fuzziness as "the [edit distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between two words and its magnitude." Edit distance is a type of [distance](https://en.wikipedia.org/wiki/Metric_space) where applying one character edit (insertion, deletion, or substitution) to a word is defined as a distance of 1, and it's defined as the number of times such character edits are repeated. This is just one definition, and other definitions of fuzziness are acceptable, but I'll follow this definition as there are many long-established algorithms for it.

With this definition of edit distance, fuzzy search can be achieved by "checking if there is a string in the search target with an edit distance of n or less." Specifically, this can be done through the following operations:

1. Tentatively determine "a string T0 that might have an edit distance of n or less." Initially, this is the string from the beginning of the search target.
2. Calculate the actual edit distance between string T0 and the search string.
3. If the actual edit distance is indeed n or less, conclude "it exists" and terminate.
4. If not, advance the starting position by one character to define T1, and calculate the edit distance between T1 and the search string.
5. Repeat steps 2-3 until Tm (m=end of line), and if nothing corresponding to "it exists" is found, conclude "it doesn't exist."

This is fundamentally the same as a simple linear search algorithm. The only difference is the use of edit distance in steps 2 and 3.

### Method to Calculate Edit Distance Between Two Strings

From the above explanation, we understand that if we can calculate the edit distance between two strings, we can perform fuzzy search. Next, I'll explain the algorithm to actually calculate edit distance.

To calculate the edit distance between two words, there's an algorithm using [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming) to [calculate edit distance](https://en.wikipedia.org/wiki/Levenshtein_distance#Algorithm). A simplified explanation is that we start by calculating distances between short words and then easily determine distances between words that are one character longer by recursively applying the method. The edit distance from an empty string (length 0) to any word is equal to the length of that word, so the initial state is also easily determined.

We create a table with the search string on the horizontal axis and the search target on the vertical axis. Each cell in this table represents the distance between the words from the origin to the corresponding vertical and horizontal axes. We first enter the initial state in this table and then fill in the distances according to the rules. It's like solving a Sudoku puzzle, making inferences like "based on the values here and there, the edit distance here must be this." For more details, please refer to the Wikipedia explanation mentioned earlier. It's truly a brilliant algorithm and worth checking out.

### A More Efficient Algorithm

The search algorithm described above is obviously computationally expensive. In particular, it seems inefficient to reinitialize the table and restart the search every time we advance the search target one character (T0, T1, etc.). In fact, by modifying an existing string search algorithm, there's an algorithm that can determine if there exists a string with an edit distance of n or less without reinitializing the intermediate table.

It's called the [bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm). The bitap algorithm was proposed as an efficient algorithm for exact match searching. It was later discovered that it could be modified for fuzzy searching.

The bitap algorithm can easily update values representing the state of character matches. The state of character matches can be represented by a simple linear state transition diagram, and moreover, there's only one path to transition forward and no path to transition to itself. Therefore, by assigning state Sn to the nth bit of a variable, the state can be easily transitioned using only 1-bit shift operations and AND, OR operations. If the m-th bit (where m is the length of the search string) becomes 1 as a result of the transition, the search ends with "it exists."

This can be extended to fuzzy search. We create separate state machines for each edit distance: E0 for exact match, E1 for edit distance 1, and so on, and update each state according to the original exact match bitap algorithm. In addition, we add transitions between edit distances: from E0 to E1, from E1 to E2, and so on. This allows for the detection of matches at any distance. Detection is the same as with exact matches; when the m-th bit of each edit distance becomes 1, a match at that distance is detected.

For more details on this algorithm, please refer to the Wikipedia link mentioned earlier. It's a very simple and elegant algorithm.

### Implementation and Evaluation of the Bitap Algorithm

To evaluate anything, I needed to create a function that can perform some kind of fuzzy search, so I [implemented bitap straightforwardly](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/ref/algo.ts#L172-L227).

To verify the correctness of the algorithm, I mostly relied on visual inspection of the search results besides minimal unit testing. Debugging was done intuitively. Even now, I've only performed cursory tests. This is certainly not good practice, but creating test data is time-consuming...

Since having no tests at all is excessive, I decided to evaluate whether fuzzy search is correctly performed by extracting keywords from the article, applying edit distance 1 modifications to them, and running the search. Here's a comparison between linear search using the extracted keywords as is and bitap search using keywords modified with edit distance 1. The dataset is the same as before, and the search time unit is [ms/query]. From now on, the search time will be displayed as time per search. Additionally, previous test benchmarks were measured using sample implementations, but from now on, measurements are taken using the actual staticseek. Therefore, query analysis and result aggregation times are also included in this benchmark. The benchmark was obtained using a [newly created benchmark script](https://github.com/osawa-naotaka/staticseek/blob/main/ref/bench/benchmark_fuzzy.ts).

| Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives |
| --- | -------- | ----- | ---------- | ------- | ---- | ----- | ----- |
| English (linear) | 314ms | 3,748kbyte | 1,324kbyte | 2.79ms |  |  |  |
| English (bitap) | 309ms | 3,748kbyte | 1,324kbyte | 81.10ms | 58964 | 17924 | 0 |
| Japanese (linear) | 137ms | 3,020bkyte | 1,053kbyte | 0.30ms |  |  |  |
| Japanese (bitap) | 135ms | 3,020kbyte | 1,053kbyte | 18.32ms | 15437 | 10062 | 0 |

We can see that fuzzy search is correctly performed for both English and Japanese, as there are 0 false negatives for keywords with edit distance 1. False positives increase considerably: by about 60% for Japanese and 30% for English. Additionally, the search time is 29 times longer for English and 61 times longer for Japanese compared to `String.prototype.indexOf()`. That's quite slow. V8 is impressive... 81ms seems too long for a process running on the UI thread. And English is an order of magnitude slower than Japanese... I wonder why...

Honestly, I'm concerned that implementing this as is might not be very useful due to the excessive increase in false positives. Moreover, the English bitap is particularly slow. Considering that it would run on environments with lower performance than our benchmark environment (I forgot to mention it's Chrome on a Core i5 13400F), we need a faster implementation.

## English: Modifying Trie Search for Fuzzy Search Support

Since there's a prospect for speeding up English fuzzy search, I'll address this first. Previously, we achieved fast exact match and prefix match searches for English using word inverted indexes. The actual data structure of the inverted index used sorted arrays. However, we found that this data structure is time-consuming for fuzzy search as is. This is because fuzzy search requires executing bitap on all terms in the sorted array. Due to code modifications, there's no script to benchmark in the current repository, my apologies.

To solve this problem, I introduced a [trie](https://en.wikipedia.org/wiki/Trie). This is a type of tree where each node represents a character in a term, starting from the first character, and adjacent characters are connected by edges. The last character of a term extends towards a leaf, but it's not necessarily a leaf node; the last character of a term can also be an intermediate node. Terms with the same first character share the same node. Terms that share multiple characters from the beginning also share nodes and edges.

The figure below is an example of a trie. "tea," "ted," and "ten" share the same nodes for "t" and "e." "in" and "inn" also share the same nodes for "i" and "n." A term is formed by concatenating the characters of the nodes on the path from the root to a given node. Therefore, each node can represent one term. By associating a posting list with this node, it can be used as an inverted index.

![](https://upload.wikimedia.org/wikipedia/commons/b/be/Trie_example.svg)

### Trie Construction and Exact Match Search

The algorithms for constructing and searching a trie are similar. Here's the algorithm for constructing a trie. It's an old implementation and not very elegant, but please also refer to a [very simple implementation example](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/ref/trie.ts#L12-L32).

1. Create a root node with no character assigned
2. Set the root node as the provisional base node
3. Extract the first character of the term
4. If there's a node for that character at the end of an edge directly extending from the base node, reassign the base node to that node
5. If there's no such node, create a new node for that character and extend an edge from the base node. Reassign the base node to the newly created node
6. If there are no remaining characters in the term, create a posting list for that node and register the document ID to which the term belongs
7. If there are remaining characters in the term, return to step 3

The algorithm for searching for an exact match term is as follows. In reality, it's more like traversing nodes than searching. [The implementation is also very simple](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/ref/trie.ts#L34-L44).

1. Set the root node as the provisional base node
2. Extract the first character of the term
3. If there's a node for that character at the end of an edge directly extending from the base node, reassign the base node to that node
4. If there's no such node, return indicating no such term in the inverted index
5. If there are no remaining characters in the term, return the posting list of that node. If the node doesn't have a corresponding posting list, return indicating no such term in the inverted index
6. If there are remaining characters in the term, return to step 3

Implementing prefix matching is also not difficult. You just need to return all the posting lists of nodes that can be reached from the node corresponding to the last character of the term towards leaves.

### Fuzzy Search with Tries

As shown, a trie can handle exact matches and prefix matches as is. To adapt a trie for fuzzy search, we need to search the trie.

In the algorithm for exact match searching described earlier, we used the remaining characters of the term as the state for search. In exact matching, since the edge to follow is uniquely determined, the search can be implemented with a very simple function.

In fuzzy search, in addition to the state of remaining characters of the term, we use the state of remaining edit distance. As long as the remaining edit distance is not 0, we generate all possible states when allowing a one-character edit, and explore all nodes corresponding to those states. The exploration is implemented very simply as a depth-first search. For details, please refer to the [implementation of the search function](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/src/method/trieindex.ts#L132-L169).

### Trie Implementation and Evaluation

Below is the benchmark with the trie added to the previously mentioned benchmarks.

| Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives |
| --- | -------- | ----- | ---------- | ------- | ---- | ----- | ----- |
| English (linear) | 314ms | 3,748kbyte | 1,324kbyte | 2.79ms |  |  |  |
| English (bitap) | 309ms | 3,748kbyte | 1,324kbyte | 81.10ms | 58964 | 17924 | 0 |
| English (Trie) | 980ms | 3,748kbyte | 505kbyte | 0.32ms | 57762 | 10295 | 1202 |

The index creation time has tripled. In exchange, the search time is 250 times faster than bitap. The index size is equivalent to when creating an index with bigram, and less than half the size compared to bitap. There's also a significant reduction in false positives compared to bitap, though it's still a concern...

While the issue of false positives remains, since the search performance itself has achieved the goal, I decided to adopt this implementation.

## How to Implement Fuzzy Search with Japanese Bigram Inverted Index?

Now, for the problematic fuzzy search using Japanese bigram inverted index. I didn't have many good ideas. For now, I enabled fuzzy search by relaxing the search condition of matching all terms after dividing into bigrams.

Let me give an example. Consider the search target string "東京都渋谷区" (Tokyo, Shibuya Ward). Its bigrams would be as follows:

```
["東京", "京都", "都渋", "渋谷", "谷区"]
```

Now, suppose the search string has one character wrong and becomes "東狂都渋谷区". This kind of mistake is unlikely, but let's consider it for now. To search for this string, we would similarly divide it into bigrams and confirm that each term exists in the inverted index.

```
["東狂", "狂都", "都渋", "渋谷", "谷区"]
```

Please compare the two sets of bigrams above. Originally, to aim for an exact match, we would need to confirm the existence of all bigram terms (5) of the search string. However, with this one-character error, only 3 bigram terms match.

Utilizing this property, I modified the search algorithm to allow the absence of `n x m` terms for n-grams when m characters are wrong. In the previous substitution example, 2 terms were absent, and for deletion and insertion, 1-2 terms are similarly absent. Please verify this.

This isn't particularly difficult, so I [implemented it as is](https://github.com/osawa-naotaka/staticseek/blob/56f3d95bd70a6c554d75bfedc01c04ed34dce8fc/src/method/ngram.ts#L42). Below is the benchmark using the same dataset as before.

| Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives |
| --- | -------- | ----- | ---------- | ------- | ---- | ----- | ----- |
| Japanese (linear) | 137ms | 3,020bkyte | 1,053kbyte | 0.30ms |  |  |  |
| Japanese (bitap) | 135ms | 3,020kbyte | 1,053kbyte | 18.32ms | 15437 | 10062 | 0 |
| Japanese (bigram) | 469ms | 3,020kbyte | 813kyte | 0.93ms | 13375 | 22148 | 2062 |

As I had imagined, false positives have exploded. They're 1.6 times the number of matches. Honestly, I question whether this is usable. The search time itself has been accelerated, achieving a 20-fold speedup compared to bitap. While I have many concerns, I'll conclude with this method for now.

## Conclusion

Fuzzy search, I still feel it might not be very useful. It introduces too much search noise. For English, since there's no IME equivalent and typos are more likely to occur, it could be beneficial for English searches. For Japanese, it's questionable.
