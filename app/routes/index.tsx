import type { ActionFunction } from "@remix-run/node";
import { useEffect } from 'react';
import { ConfigAnnotationsForm } from '~/features/config/ConfigAnnotations';
import { ConfigDirectDebitsForm } from '~/features/config/ConfigDirectDebits';
import { ConfigMenu } from '~/features/config/ConfigMenu';
import { ConfigOctopusForm } from '~/features/config/ConfigOctopus';
import { useOctopusData } from '~/features/config/ConfigOctopus/octopusContext';
import { ConfigRatesForm } from '~/features/config/ConfigRates';
import { UsageChart } from '~/features/UsageChart';
import { configOctopusSchema, useOctopusConfig } from '~/hooks/useConfig';
import { makeRequest } from '~/services/octopus-energy/client';
import { Info } from '~/ui/Alerts/Info';
import { Divider } from '~/ui/Divider';

import type { ConfigOctopus } from "~/hooks/useConfig";
import type { OctopusResponse } from "~/services/octopus-energy/types";
import type { Dispatch as OctopusDataDispatcher } from "~/features/config/ConfigOctopus/octopusContext";
export default function Index() {
  const { octopus } = useOctopusConfig();
  const { dispatch } = useOctopusData();

  useEffect(() => {
    queryOctopus(octopus, dispatch);
  }, [dispatch, octopus]);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-16">
        <h1 className="text-2xl font-semibold">💡 Home Energy Use</h1>
        <ConfigMenu />
      </div>
      <section className="mt-8 mb-16">
        <UsageChart />
      </section>
      <section className="mb-16">
        <Info>
          Octopus calculates usage differently to how they present the numbers
          via the API. The API will report on monthly figures between the first
          and last day of each month, whereas bills can overlap months by a
          number of days (depending on when your contract started). Keep this in
          mind if you're using this app and wondering why there's not a 1:1
          alignment of numbers.
        </Info>
      </section>
      <div className="max-w-screen-lg">
        <section>
          <ConfigAnnotationsForm />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section>
          <ConfigDirectDebitsForm />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section>
          <ConfigRatesForm />
        </section>
        <section className="my-16">
          <Divider />
        </section>
        <section className="mb-16">
          <ConfigOctopusForm />
        </section>
        <Info>
          Settings are saved to your browsers <strong>localstorage</strong>. No
          information is kept on the servers hosting this site. To avoid data
          loss, you can export and import settings from the menu at the top.
        </Info>
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return Object.fromEntries(formData);
};

async function queryOctopus(
  config: ConfigOctopus,
  dispatch: OctopusDataDispatcher
) {
  try {
    const octopus = await configOctopusSchema.validate(config);

    console.log("🐙 config updated", config);

    const queryParams = new URLSearchParams({
      group_by: "month",
      order_by: "period",
    }).toString();

    const [electric, gas] = await Promise.all([
      makeRequest<OctopusResponse>(
        `/v1/electricity-meter-points/${octopus.electric.mpan}/meters/${octopus.electric.serial}/consumption/?${queryParams}`,
        { apiKey: octopus.apiKey }
      ),
      makeRequest<OctopusResponse>(
        `/v1/gas-meter-points/${octopus.gas.mprn}/meters/${octopus.gas.serial}/consumption/?${queryParams}`,
        { apiKey: octopus.apiKey }
      ),
    ]);

    dispatch({ type: "setElectricResults", results: electric.results });
    dispatch({ type: "setGasResults", results: gas.results });
  } catch (err) {}
}
