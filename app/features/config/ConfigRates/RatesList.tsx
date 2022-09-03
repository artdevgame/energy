import type { ConfigRates } from "~/hooks/useConfig";
import { useRatesConfig } from '~/hooks/useConfig';
import { sortObjectByKeys } from '~/libs/objectUtils';
import { Button } from '~/ui/Button';

export const RatesList = () => {
  const { rates, setRates } = useRatesConfig();

  const handleRemove = (date: string) => {
    delete rates[date];
    setRates(rates);
  };

  if (!rates) {
    return null;
  }

  const sortedRates = sortObjectByKeys(rates, true) as ConfigRates;

  return (
    <ul className="-my-5 divide-y divide-gray-200">
      {Object.entries(sortedRates).map(([date, rate]) => (
        <li key={date} className="py-4">
          <div className="flex items-start space-x-4">
            <span className="text-sm text-gray-500">{date}</span>
            <div className="min-w-0 flex grow flex-col gap-4 md:gap-20 md:flex-row">
              <div>
                <p className="text-sm font-medium text-gray-900">Electricity</p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal">Standing Charge:</span>{" "}
                  {rate.electric.standingCharge}p/day
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal">Unit Rate:</span>{" "}
                  {rate.electric.unitRate}p/kWh
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Gas</p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal">Standing Charge:</span>{" "}
                  {rate.gas.standingCharge}p/day
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-normal">Unit Rate:</span>{" "}
                  {rate.gas.unitRate}p/kWh
                </p>
              </div>
            </div>
            <div>
              <Button
                onClick={() => handleRemove(date)}
                type="button"
                variant="outline"
              >
                Remove
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
