---
title: I Want a Full-Text Search Engine!
author: producer
date: 2025-03-01T00:00:00+09:00
tag:
    - techarticle
    - staticseek
---

In this article, I will explain the reasons and methods that led me to create a full-text search engine. I will also explain one of the components of the search engine. The project mentioned in the title is published as a website. Please take a look. Unfortunately, the site does not yet support Japanese...
https://staticseek.lulliecat.com/

### Introduction - I Want a Full-Text Search Engine!

Are you managing a website? I started one out of necessity. Initially, I reluctantly began with WordPress, but after being influenced by technically-minded internet enthusiasts, I rebuilt my website from scratch. I found this technically engaging and continued the construction bit by bit, despite it becoming somewhat of a detour from my original purpose.

These technically-minded internet enthusiasts have high security awareness, so even with WordPress, I was using a plugin called [Simply Static](https://simplystatic.com/) to convert to HTML files before uploading to the server. After starting to build my own site, I continued operating without server-side implementation by using an SSG (Static Site Generator).

For this purpose, [Cloudflare Pages](https://www.cloudflare.com/ja-jp/developer-platform/products/pages/) is extremely convenient despite being free, and I use it extensively. When you connect a GitHub repository with Cloudflare, simply pushing an SSG project to the repository automatically triggers `npm install` and `npm run build` on the Cloudflare side without any GitHub Actions configuration, and the generated HTML files are published on Cloudflare's edge servers. Moreover, the `main` branch can be used for production while other branches can be used for testing, each published with different URLs, allowing you to verify the test site before publishing the production site. It's extraordinarily convenient... fast global access for free... with HTTPS support... perhaps this is the ideal solution for everyone...

For SSG, I use [Astro](https://astro.build/). The website I'm creating is a brand site with a blog, not an SPA (Single Page Application), so I chose Astro, which is a fast platform centered around Markdown content. Astro uses [Vite](https://ja.vite.dev/) in the background, providing an excellent environment with rapid updates and deployments. I had no prior knowledge of React or Vue, but with HTML and CSS knowledge, I could intuitively build websites. It's beginner-friendly, so please try it if you're interested.

Astro adopts the [Island Architecture](https://docs.astro.build/ja/concepts/islands/). Under this architecture, components on the website are called islands, and you can implement each island using your preferred framework such as React, Vue, or Svelte. Generally, regular HTML is sufficient, but you might want to use a React component for a specific area, or a nice Vue component for another area - this architecture allows for such a mix, which seems quite convenient.

However, I'm not using React or other similar frameworks. The reason is somewhat complex, but in Astro, when using components like React, a small amount of style and script elements are inserted into the HTML. When trying to enhance website security with [Content Security Policy (CSP)](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP), inline scripts and inline styles should be disabled. Since React inevitably expands a small amount of inline script, I decided not to adopt React components for the current site.

Incidentally, with Astro's default settings, [Shiki](https://shiki.style/) is used for syntax highlighting in Markdown. Shiki applies styles directly to the HTML tag's style attribute. With CSP specifying `style-src self`, these inline styles are disabled, causing design disruption. Therefore, I used [Prism](https://prismjs.com/) instead of Shiki and linked CSS from HTML files to comply with CSP. I also set inline stylesheets to "never." Scripts, on the other hand, seem to be separated automatically without any additional action. More details on this later...

Without React or similar frameworks, how do we implement reactive elements that only run on the client side? We use plain JavaScript. It's quite challenging... Although TypeScript is available and libraries can be imported, DOM manipulation is really difficult without JSX...

Within these constraints, I implemented virtually all reactive elements using HTML and CSS. Interestingly, this is quite feasible. By storing state in input elements like checkboxes and radio buttons, and utilizing complex CSS selectors, you can implement features like hamburger button menus, drawers, popups, and animations. I'll talk about these techniques another time...

However, there are limitations to what can be achieved. I began to feel that I had nearly exhausted what could be implemented with just HTML and CSS, and it was time to utilize JavaScript.

My site is primarily a brand site, but it also includes a blog, so aesthetically, a search box would be beneficial. Although this is a feature I rarely use when visiting other people's sites (making me question its necessity), my motivation was purely technical. Also, I thought it might be convenient to have search functionality if I list products on the website in the future.

### There Are Few Full-Text Search Engines That Support Japanese!

The introduction has become quite lengthy. Now for the main topic. Regarding the following topics, Lambda Note has published a book titled [Search Systems - Development Improvement Guide for Practitioners](https://www.lambdanote.com/products/ir-system-ebook?variant=42155477598377), which is very helpful. Those interested should consider reading it.

I looked for existing full-text search engines that don't require server-side implementation, but this was challenging. While several full-text search engines exist, they mostly support languages like English, with very few supporting Japanese.

Why are there so few full-text search engines that support Japanese? The primary reason is that word segmentation in Japanese is difficult. European languages like English separate words with spaces, making it easy to extract words from text. In contrast, Japanese, Chinese, Korean, and some other languages have punctuation marks but lack clear spaces between words. This makes mechanical word extraction impossible, requiring morphological analysis engines like [MeCab](https://taku910.github.io/mecab/). These engines need large dictionaries, making portable implementations difficult. This is the primary obstacle.

But why is word segmentation relevant to search functionality? It relates to the structure of the search index.

What algorithm would you consider when implementing full-text search? The simplest implementation is using [String.prototype.indexOf()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) in JavaScript. This is called linear search. This function (although highly optimized in actual implementations) compares strings sequentially from the beginning and returns the position of the matching string. It's a straightforward algorithm and reliably lists all existing strings, making it the most reliable algorithm.

However, this algorithm has drawbacks. As many can imagine, it has a high computational complexity, with search time proportional to text size. If the text length is N, the time complexity is probably O(N) (or possibly O(NM) where M is the keyword length for the most basic algorithm). While optimal for searching short text matches, for large text volumes such as blogs, search becomes too time-consuming. Since JavaScript in browsers primarily runs in a single thread, time-consuming searches prevent browser operation, hindering a smooth browsing experience. From a UI perspective, if operations are blocked for more than a few dozen milliseconds, users notice the sluggishness. That's the threshold.

To solve this problem, a data structure called the [inverted index](https://en.wikipedia.org/wiki/Inverted_index) was introduced. It's essentially like a book index. The key point of this algorithm is spending time upfront to create an index, enabling quick searches by simply looking up the index.

An inverted index is an array of "terms and lists of document IDs containing those terms." The word is called a "term," and the list of document IDs is called a "posting list." The inverted index is created in three steps:

1. Assign an ID to each document, segment the document, and create a list of terms
2. For each word in the document, create a tuple (term, posting list) and add this tuple to the inverted index. If the term is already registered, add the document ID to the posting list
3. Execute this for all documents

To perform a search when given a search term, look through the inverted index, find the relevant term, and return the posting list associated with that term as the result. The inverted index is typically created using a hash structure, allowing for O(1) search time independent of document size.

The critical point in this algorithm is step 1 - word segmentation is necessary. For languages like English, word segmentation is easily achieved by splitting text at spaces, making inverted indexes easy to create. In contrast, languages like Japanese present challenges due to difficult word segmentation, becoming a bottleneck when creating Japanese-compatible search engines.

For example, if we managed to create an index for Japanese using a large word segmentation dictionary, we would still need to use the same segmentation algorithm when executing a search. Using different segmentation algorithms for index creation and search execution would result in mismatched word boundaries, leading to false negatives. Therefore, for Japanese search, an implementation is needed where a program with a large word segmentation dictionary runs on the server-side, performing segmentation and inverted index lookups based on client requests, then returning results to the client. Completing everything on the client-side is challenging.

Incidentally, in English and similar languages, word normalization is performed to increase hit rates, known as stemming. Other techniques include removing common meaningless words (stop words) like "a" and "the."

### If It Doesn't Exist, I'll Create It! N-gram Inverted Index!

Since I couldn't find a full-text search engine supporting Japanese, I decided to create one, but I had an algorithmic approach in mind. If inferring word boundaries is impractical, we can mechanically divide text into segments of 2 characters, 3 characters, etc. This approach is called [character n-gram](https://en.wikipedia.org/wiki/N-gram). It seems to be a standard technique when word segmentation is not possible. Despite being a standard technique, European users are satisfied with space-based word segmentation, so there are very few full-text search engines using n-grams. I searched extensively... that's unfortunate...

#### How to Create a Bigram Inverted Index

I'll explain the actual steps for creating a character n-gram inverted index and using it for searches. The creation of the inverted index is identical to the procedure I explained earlier, just using character n-grams for word segmentation. However, there's one important point when creating n-grams. For example, when dividing text using 2-grams (bigrams, dividing text into 2-character units), we create bigrams by sliding a 2-character window one character at a time.

This might be confusing, so let me provide an example. For instance, with the text:

```
"東京都渋谷区"
```

To create a bigram inverted index, we would generate:

```
["東京", "京都", "都渋", "渋谷", "谷区"]
```

Thus, we create a term list with characters overlapping by one.

Why do we do this? Because without overlap, false negatives (where a search string actually exists in the text but doesn't appear in search results) would occur.

If we created a bigram inverted index without character overlap, the term list would look like this:

```
["東京", "都渋", "谷区"]
```

Now, does the search string "渋谷" exist in the original text? Yes, it does. However, since "渋谷" doesn't exist in the term list, the search would incorrectly indicate "this text doesn't contain '渋谷'." This is the cause of false negatives. When terms are created with one-character overlap, "渋谷" is extracted as a term, enabling correct searching. For this reason, terms are extracted from text using a sliding window approach, eliminating false negatives.

Let me briefly digress. Does "京都" exist in the above text? Yes, it does. But is this the desired result? Probably not. For someone searching for "京都" (Kyoto), having text about "東京都" (Tokyo) appear in results likely doesn't align with their intent. With perfect word segmentation, the term list would probably look like this:

```
["東京", "都", "渋谷", "区"]
```

This would be a false positive from the perspective of the search intent (unwanted texts appearing in search results). This false positive also occurs with linear search, and in the current environment without word segmentation, there's no simple solution. Therefore, we accept these false positives.

#### How to Search Using a Bigram Inverted Index

Searching involves simply converting the search string into bigrams and looking them up in the bigram inverted index. Here, based on the basic method, character overlap isn't necessary. For example, if the search string is also "東京都渋谷区", it would be divided into these terms:

```
["東京", "都渋", "谷区"]
```

All of these are included in the bigram inverted index we created. Then, we find document IDs containing all these terms, and the search is complete. Specifically, we take the [intersection](https://en.wikipedia.org/wiki/Intersection_(set_theory)) of the posting lists linked to each term.

Incidentally, with bigram inverted indices, if the search string length is odd, the last character is duplicated. To search for "東京都", we use ["東京", "京都"]. For other n-gram lengths, if the search string length isn't a multiple of n, the last part is similarly duplicated.

#### When the Search String Length is Shorter Than the Character N-gram's N

Let's discuss a detailed point. How do we search for a single character like "都" using a character bigram index? The character bigram index doesn't contain single-character terms, making it impossible to search if the index is implemented as a hash. This would result in false negatives. To enable searching, one of the following approaches must be taken:

1. Add all m-grams (m < n) to the inverted index
2. Search for the first character of all index terms and extract matching posting lists

Using approach 1, the index implementation can remain a hash. The trade-off is a significantly larger index size. This seems somewhat excessive just to handle the corner case of single-character search strings.

Approach 2 essentially becomes a full search, which initially seems inefficient. However, I realized that by pre-sorting the index by terms and implementing a slightly modified binary search, a relatively lightweight implementation is possible. For details on the modified binary search, [please review the source code](https://github.com/osawa-naotaka/staticseek/blob/ae6e1488fb626ae1371163c9d7936f8535e4a3a5/src/util/algorithm.ts#L9-L47) (skipping detailed explanation).

I decided to evaluate both approaches by confirming the actual increase in size and search time.

Incidentally, for even finer details, with approach 2, searching for "区" isn't possible because no term exists with "区" at the beginning. Therefore, I decided to additionally include m-grams smaller than n for the end of the text:

```
["東京", "京都", "都渋", "渋谷", "谷区", "区"]
```

#### Persistent False Positives

The algorithms discussed so far have largely eliminated false negatives. However, false positives still occur due to the index structure. This structure identifies whether individual terms belong to a document but doesn't indicate whether terms appear consecutively. For instance, when searching for "東京都", if "東京" and "京都" exist in distant positions, that document would still match. This frequently occurs when n-gram divisions coincidentally form words with different meanings. This is an unavoidable structural false positive with the current index.

However, it's apparent that as n in n-gram increases, this problem decreases because longer n-grams provide more information about connected characters. I decided to verify with actual data how large n needs to be for false positives to become acceptable.

I also considered an additional method to reduce false positives. Generate search terms with character overlap, just like when creating the inverted index. For example, when searching for "東京都渋谷区" with 3-grams (trigrams), the conventional method would check for the existence of these two terms in the index:

```
["東京都", "渋谷区"]
```

In this case, information about the continuity between "東京都" and "渋谷区" is lost, leading to false positives. Instead, I decided to make search terms with character overlap and require all these terms to exist:

```
["東京都", "京都渋", "都渋谷", "渋谷区"]
```

Terms like "京都渋" or "都渋谷" rarely appear in normal text. By leveraging this, we can confirm that "東京都" and "渋谷区" appear consecutively in the text.

#### Creating Bigram Inverted Index Functions and Benchmarking

With the algorithm direction established, I needed to determine the specific value of n and evaluate whether the performance and index size would be satisfactory with either of the two algorithm proposals for cases where search string length is less than n. I began implementation.

With no suitable libraries available, I had to create from scratch, carefully implementing step by step. First, I [implemented a linear search using String.prototype.indexOf() as a reference implementation](https://github.com/osawa-naotaka/staticseek/blob/main/ref/linear.ts) and visually confirmed that the search worked correctly. Next, I implemented a character n-gram inverted index and [created a way to extract false positives and false negatives](https://github.com/osawa-naotaka/staticseek/blob/ae6e1488fb626ae1371163c9d7936f8535e4a3a5/ref/bench/benchmark_common.ts#L82-L90) by comparing its search results with those of linear search. I also created functions to [measure index size, gzipped index size, index creation time, and search time](https://github.com/osawa-naotaka/staticseek/blob/ae6e1488fb626ae1371163c9d7936f8535e4a3a5/ref/bench/benchmark_common.ts#L59-L80). The [benchmark execution script](https://github.com/osawa-naotaka/staticseek/blob/main/ref/bench/benchmark_ngram.ts) can be executed in a browser by commenting it out in [index.html](https://github.com/osawa-naotaka/staticseek/blob/main/index.html) and running `npm run dev`.

Here are the execution results. The numbers in parentheses for each method indicate: (1) adding all m-grams (m < n) to the inverted index, and (2) using binary search on the first character of index terms to extract matching posting lists. The dataset consists of excerpts from Japanese Wikipedia articles, with a total text size of 3,020 kbytes and 1,033 search executions. "Size" in the table refers to index size, and "Search Time" is the total time for all 1,033 searches.

Method      | Creation Time | Size | Gzipped Size | Search Time | Matches | False Positives | False Negatives
----------- | ------------- | ---- | ------------ | ----------- | ------- | --------------- | --------------
Linear Search | 18ms | 2,988kbyte | 1,051kbyte | 224ms
2-gram(1)  | 600ms | 6,677kbyte | 1,052kbyte | 7.3ms | 15,435 | 6,396 | 2
3-gram(1) |1150ms | 16,888kbyte | 2,563kbyte | 3.8ms | 15,435 | 182 | 2
4-gram(1)|1400ms | 30,309kbyte | 4,228kbyte | 3ms | 15,435 | 9 | 2 
2-gram(2) | 370ms | 6,067kbyte | 900kbyte | 18.3ms | 15,435 | 6,396 | 2
3-gram(2) | 610ms | 11,875kbyte | 1,997kbyte | 10.5ms | 15,435 | 182 | 2
4-gram(2)| 930ms | 16,607kbyte | 3,040kbyte | 9.2ms | 15,435 | 9 | 3

The 15,435 matches for 1,033 searches occur because one search string can match multiple locations.

Summary of findings:
1. Search performance is 10-100 times faster than linear search
2. False negatives are minimal in this dataset
3. False positives appear to saturate at 4-grams or higher
4. Binary search (2) performance is satisfactory
5. After gzip, the index size difference between (1) and (2) is less than expected
6. Index size increases proportionally or more with n

In summary, if we increase n, it should be to 4 at most. However, since index size approximately doubles with each increase in n, if we can tolerate false positives, 2-grams would be preferable. Since I'm considering full-text search on the client side, I want to minimize data transfer over the network. Therefore, I prefer option (2).

However, regarding point 3, there might be issues with my dataset selection, possibly due to a lack of longer search keyword data. So please take this with a grain of salt.

### Conclusion

I initially intended to complete this in one article, but it became too lengthy, so I decided to split it. There are several topics to cover, including fuzzy search support and WebGPU utilization. Preprocessing, query parsing, and search result scoring are also important elements, but I'm still undecided about discussing those.

Interestingly, there's something else discernible from this table at this point. It's quite significant, but I didn't notice it until I implemented the production version. What could it be? The answer will be revealed in future articles! (with a mischievous smile)
