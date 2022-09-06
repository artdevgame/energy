import type { FormEvent } from "react";
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useConfig } from '~/hooks/useConfig';
import { Menu } from '~/ui/Menu';

import { CloudArrowUpIcon, FolderArrowDownIcon } from '@heroicons/react/20/solid';

import type { Config } from "~/hooks/useConfig";
export const ConfigMenu = () => {
  const { setConfig, ...config } = useConfig();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileRead = async (ev: ProgressEvent<FileReader>) => {
    try {
      const contents = ev.target?.result;

      if (!contents) return;

      const importedConfig = JSON.parse(String(contents)) as Config;

      await setConfig(importedConfig);

      toast.success("Settings imported");
    } catch (err) {
      console.error((err as Error).message);
      toast.error("Unable to import settings");
    }
  };

  const handleFileSelect = () => {
    formRef.current?.reset();
    fileRef.current?.click();
  };

  const handleFileChanged = (ev: FormEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsText(file, "utf-8");
  };

  return (
    <form ref={formRef}>
      <input
        type="file"
        accept=".json"
        name="config"
        className="hidden"
        ref={fileRef}
        onChange={handleFileChanged}
      />
      <Menu>
        <a
          download="energy.json"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(config)
          )}`}
        >
          <FolderArrowDownIcon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />{" "}
          Export Settings
        </a>

        <button type="button" onClick={handleFileSelect} className="w-full">
          <CloudArrowUpIcon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />{" "}
          Import Settings
        </button>
      </Menu>
    </form>
  );
};
