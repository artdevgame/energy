import { useConfig } from '~/hooks/useConfig';

export const ExportConfigButton = () => {
  const config = useConfig();

  return (
    <a
      className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      download="energy.json"
      href={`data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(config)
      )}`}
    >
      Export Settings
    </a>
  );
};
