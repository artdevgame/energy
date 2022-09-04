# 💡 - Energy

Monitoring energy use and cost at home.

## 🤔 - Why?

With an incoming energy crisis getting embedded in the UK, I thought it was worth setting up a way to monitor my usage via the Octopus Energy API.

I like the dashboard Octopus provide, but the information is a little fragmented - for example, if I want to see usage by month, the maximum I can see is the past 12 before I have to configure a date filter. If I want to see how much energy cost, I have to work my way through bills.

## ❕ - Caveats

I think the way Octopus calculates usage is slightly different to how they present the numbers via the API. Mostly that dates slip slightly. The API will report on monthly figures between the 1st day and last of each month, whereas on the Octopus dashboard the bills can overlap months by a number of days.

Keep this in mind if you're using this repo and wondering why there's not a 1:1 alignment of numbers.

## ▶️ - Run

Spin up the dashboard with `npm run dev`
