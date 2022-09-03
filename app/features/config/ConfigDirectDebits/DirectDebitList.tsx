import type { ConfigDirectDebits } from "~/hooks/useConfig";
import { useDirectDebitConfig } from '~/hooks/useConfig';
import { sortObjectByKeys } from '~/libs/objectUtils';
import { Button } from '~/ui/Button';

export const DirectDebitList = () => {
  const { directDebits, setDirectDebits } = useDirectDebitConfig();

  const handleRemove = (date: string) => {
    delete directDebits[date];
    setDirectDebits(directDebits);
  };

  if (!directDebits) {
    return null;
  }

  const sortedDirectDebits = sortObjectByKeys(
    directDebits,
    true
  ) as ConfigDirectDebits;

  return (
    <ul className="-my-5 divide-y divide-gray-200">
      {Object.entries(sortedDirectDebits).map(([date, amount]) => (
        <li key={date} className="py-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{date}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                <>&pound;{amount}</>
              </p>
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
