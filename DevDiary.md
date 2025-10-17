# Dev Diary

## 10/6/25

We'll use the wayback machine api to fetch stuff (https://archive.org/help/wayback_api.php)

*I love youuu Mai <3*



Defined data fetching capabilities using the wayback machine request server... turns out we cant just get stuff by year.
We must instead provide a URL before we can filter by year. We decided instead to decide on ~5 important years in the history of the web
and curate a list of urls to fetch entries from and display for every given year.

Still deciding on the visual language...


## 10/8/25

Early Javascript audio work to be done... what's the easiest way to implement a "layer" approach for our generative track?
- Fist attempt using a bare bones implementation using the **WEB audio API**. As expected, I'm running into issue making the stems loop / sync perfectly... not to worry though. I'm sure it can be easily fixed
- Also, we could try using **FMOD**...However, I'm worried we'll run into issues regarding Web Assembly.


## 10/9/25

At the "pintoresca" public library in pasadena. going to try to solve our sync issue. It'll be beneficial to solve it using the most lightweight implementation
so as to make it easily deployable... however, FMOD (which requires web assembly) might be better? given that it makes event authoring waaay easier...