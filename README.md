# 💡 - Energy

Monitoring energy use and cost at home.

## 🤔 - Why?

With an incoming energy crisis getting embedded in the UK, I thought it was worth setting up a way to monitor my usage via the Octopus Energy API.

I like the dashboard Octopus provide, but the information is a little fragmented - for example, if I want to see usage by month, the maximum I can see is the past 12 before I have to configure a date filter. If I want to see how much energy cost, I have to work my way through bills.

## ❕ - Caveats

I think the way Octopus calculates usage is slightly different to how they present the numbers via the API. Mostly that dates slip slightly. The API will report on monthly figures between the 1st day and last of each month, whereas on the Octopus dashboard the bills can overlap months by a number of days.

Keep this in mind if you're using this repo and wondering why there's not a 1:1 alignment of numbers.

## 🔧 - Configuration

There's some manual bits you'd need to customise to make it work for you.

### Add environmental vars

| Key             | Note                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| OCTOPUS_API_KEY | A base64 encoded version of your [API key](https://octopus.energy/dashboard/developer/)                            |
| ELECTRIC_MPAN   | Electricity meter-point MPAN, available from the [dev dashboard](https://octopus.energy/dashboard/developer/)      |
| ELECTRIC_SERIAL | Electricity meter's serial number, available from the [dev dashboard](https://octopus.energy/dashboard/developer/) |
| GAS_MPRN        | Gas meter-point MRPN, available from the [dev dashboard](https://octopus.energy/dashboard/developer/)              |
| GAS_SERIAL      | Gas meter's serial number, available from the [dev dashboard](https://octopus.energy/dashboard/developer/)         |

### Create a history of rates you've used

Update [./app/services/octopus-energy/rates.json](./app/services/octopus-energy/rates.json) with the rates you've used previously. This is a little tedious and involves going back through your bills to get the figures. I don't think there's a way to automate this via the Octopus API.

### Create a history of direct-debit charges you've used

Like the history of rates, this is a little tedious as it doesn't appear to be able to be automated.

Update [./app/services/octopus-energy/direct-debits.json](./app/services/octopus-energy/rates.json) with the figures you've used previously.

## ▶️ - Run

Spin up the dashboard with `npm run dev`
