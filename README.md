## play-lottery

This minimalistic command line tool helps you playing lottery: it **generates** random lottery numbers for you, and **checks** your numbers against latest lotto results.<br/>
<br/>
A typical use-case is that you buy a lottery this week, and you completely forget to check whether you won or lost it next week - by adding *play-lottery*'s *check.sh* to .bashrc, you can get your results every time you log in.<br/>

# Usage 
```
$ npm install 
$ ./generate.sh
Numbers: 65, 47, 77, 67, 46
Do you accept these numbers? If you choose [Y], numbers will be saved, and you will be able to 
check them against actual results
Accept? [Y/n]

```

... now you can use these numbers to play lottery.

Checking latest lotto results from www.szerencsejatek.hu (hungarian lottery)

![Checking](https://raw.githubusercontent.com/akos-sereg/play-lottery/master/doc/screenshot.png "Screenshot")

Insert this line into your .bashrc

```
# Use "--weekly-check-only" switch if you want check.sh to run only once a week
~/play-lottery/check.sh --weekly-check-only
```