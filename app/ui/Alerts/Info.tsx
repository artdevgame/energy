import { InformationCircleIcon } from '@heroicons/react/24/outline';

import type { PropsWithChildren } from "react";

export const Info = ({ children }: PropsWithChildren) => (
  <div className="rounded-md bg-blue-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <InformationCircleIcon
          className="h-5 w-5 text-blue-400"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-blue-700">{children}</p>
      </div>
    </div>
  </div>
);
